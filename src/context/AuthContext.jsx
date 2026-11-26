import { createContext, useContext, useState, useEffect } from 'react';
import {
  findUserByEmail,
  registerNewUser,
  setActiveSessionUser,
  getActiveSessionUserId,
  getRegisteredUsers,
  saveRegisteredUsers,
  DEFAULT_USER_ACTIVITY,
  saveUserActivity,
} from '../utils/userStorage';

const AuthContext = createContext(null);
const SESSION_USER_KEY = 'olp_current_session_user';

const DEMO_ACCOUNTS = {
  student: {
    id: 'demo_student_user',
    name: 'Demo Learner',
    email: 'learner.demo@example.com',
    role: 'student',
    bio: 'Exploring structured courses and tracking personal progress.',
    goal: 'Complete project modules and earn certificates',
  },
  admin: {
    id: 'demo_instructor_user',
    name: 'Demo Instructor',
    email: 'instructor.demo@example.com',
    role: 'admin',
    bio: 'Designing courses, modules, and practical assessments.',
    goal: 'Deliver clear and structured learning experiences',
  },
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const activeId = getActiveSessionUserId();
      if (!activeId) return null;
      const saved = localStorage.getItem(SESSION_USER_KEY);
      if (!saved) return null;
      const parsed = JSON.parse(saved);
      return parsed && parsed.id === activeId ? parsed : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (user && user.id) {
      localStorage.setItem(SESSION_USER_KEY, JSON.stringify(user));
      setActiveSessionUser(user.id);
    } else {
      localStorage.removeItem(SESSION_USER_KEY);
      setActiveSessionUser(null);
    }
  }, [user]);

  const login = (email, password, providedUser = null) => {
    const normalizedEmail = (email || '').trim().toLowerCase();

    if (providedUser && typeof providedUser === 'object') {
      const sessionUser = {
        id: providedUser.id,
        name: providedUser.name,
        email: providedUser.email,
        role: providedUser.role === 'admin' ? 'admin' : 'student',
        bio:
          providedUser.bio ||
          'Learner building practical skills through structured courses.',
        goal: providedUser.goal || 'Complete courses and track milestones',
      };
      setUser(sessionUser);
      setActiveSessionUser(sessionUser.id);
      return { ok: true, user: sessionUser };
    }

    const found = findUserByEmail(normalizedEmail);
    if (!found) {
      return { ok: false, message: 'No account found with this email address.' };
    }
    if (password && found.password !== password) {
      return { ok: false, message: 'Incorrect password.' };
    }

    const sessionUser = {
      id: found.id,
      name: found.name,
      email: found.email,
      role: found.role === 'admin' ? 'admin' : 'student',
      bio:
        found.bio ||
        'Learner building practical skills through structured courses.',
      goal: found.goal || 'Complete courses and track milestones',
    };
    setUser(sessionUser);
    setActiveSessionUser(sessionUser.id);
    return { ok: true, user: sessionUser };
  };

  const loginAsDemo = (role = 'student') => {
    const account =
      role === 'admin' ? DEMO_ACCOUNTS.admin : DEMO_ACCOUNTS.student;
    // Ensure demo accounts have their own isolated activity bucket initialized
    const existingKey = `olp_activity_${account.id}`;
    if (!localStorage.getItem(existingKey)) {
      saveUserActivity(account.id, {
        ...DEFAULT_USER_ACTIVITY,
        notifications: [
          {
            id: `notif-${Date.now()}`,
            title: 'Demo Workspace Ready',
            message: `You are viewing the ${
              role === 'admin' ? 'Instructor Studio' : 'Student Portal'
            } demo workspace.`,
            time: 'Just now',
            read: false,
          },
        ],
      });
    }
    setUser(account);
    setActiveSessionUser(account.id);
    return account;
  };

  const signup = ({ name, email, password, role = 'student' }) => {
    const created = registerNewUser({ name, email, password, role });
    if (!created.ok) {
      return { ok: false, message: created.message };
    }
    return { ok: true, user: created.user };
  };

  const updateProfile = (updates) => {
    setUser((prev) => {
      if (!prev) return null;
      const updated = { ...prev, ...updates };
      const users = getRegisteredUsers();
      const idx = users.findIndex((u) => u.id === prev.id);
      if (idx !== -1) {
        const nextUsers = [...users];
        nextUsers[idx] = { ...nextUsers[idx], ...updates };
        saveRegisteredUsers(nextUsers);
      }
      return updated;
    });
  };

  const logout = () => {
    setUser(null);
    setActiveSessionUser(null);
    localStorage.removeItem(SESSION_USER_KEY);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        currentUser: user,
        login,
        loginAsDemo,
        signup,
        updateProfile,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);