const USERS_STORAGE_KEY = 'olp_registered_users';
const ACTIVE_USER_KEY = 'olp_active_user_id';
const REMEMBERED_EMAIL_KEY = 'olp_remembered_email';

export const DEFAULT_USER_ACTIVITY = {
  enrolledIds: [],
  completedLessons: {},
  notes: {},
  wishlistIds: [],
  quizResults: {},
  submissions: {},
  certificates: [],
  notifications: [],
};

export function getRegisteredUsers() {
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveRegisteredUsers(users) {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
}

export function findUserByEmail(email) {
  const normalized = (email || '').trim().toLowerCase();
  if (!normalized) return null;
  const users = getRegisteredUsers();
  return (
    users.find((u) => (u.email || '').trim().toLowerCase() === normalized) ||
    null
  );
}

export function getUserActivityKey(userId) {
  return `olp_activity_${userId || 'guest'}`;
}

export function loadUserActivity(userId) {
  if (!userId) return { ...DEFAULT_USER_ACTIVITY };
  try {
    const raw = localStorage.getItem(getUserActivityKey(userId));
    if (!raw) return { ...DEFAULT_USER_ACTIVITY };
    const parsed = JSON.parse(raw);
    return {
      enrolledIds: Array.isArray(parsed.enrolledIds) ? parsed.enrolledIds : [],
      completedLessons:
        parsed.completedLessons && typeof parsed.completedLessons === 'object'
          ? parsed.completedLessons
          : {},
      notes:
        parsed.notes && typeof parsed.notes === 'object' ? parsed.notes : {},
      wishlistIds: Array.isArray(parsed.wishlistIds) ? parsed.wishlistIds : [],
      quizResults:
        parsed.quizResults && typeof parsed.quizResults === 'object'
          ? parsed.quizResults
          : {},
      submissions:
        parsed.submissions && typeof parsed.submissions === 'object'
          ? parsed.submissions
          : {},
      certificates: Array.isArray(parsed.certificates)
        ? parsed.certificates
        : [],
      notifications: Array.isArray(parsed.notifications)
        ? parsed.notifications
        : [],
    };
  } catch {
    return { ...DEFAULT_USER_ACTIVITY };
  }
}

export function saveUserActivity(userId, activity) {
  if (!userId) return;
  localStorage.setItem(
    getUserActivityKey(userId),
    JSON.stringify({
      enrolledIds: Array.isArray(activity.enrolledIds)
        ? activity.enrolledIds
        : [],
      completedLessons: activity.completedLessons || {},
      notes: activity.notes || {},
      wishlistIds: Array.isArray(activity.wishlistIds)
        ? activity.wishlistIds
        : [],
      quizResults: activity.quizResults || {},
      submissions: activity.submissions || {},
      certificates: Array.isArray(activity.certificates)
        ? activity.certificates
        : [],
      notifications: Array.isArray(activity.notifications)
        ? activity.notifications
        : [],
    })
  );
}

export function registerNewUser({ name, email, password, role = 'student' }) {
  const normalizedEmail = email.trim().toLowerCase();
  if (findUserByEmail(normalizedEmail)) {
    return {
      ok: false,
      message:
        'This email address is already registered. Please use another email or log in.',
    };
  }

  const users = getRegisteredUsers();
  const newUser = {
    id: `user_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    name: name.trim(),
    email: normalizedEmail,
    password,
    role: role === 'admin' ? 'admin' : 'student',
    bio:
      role === 'admin'
        ? 'Course instructor creating structured learning modules.'
        : 'Learner building practical skills through structured courses.',
    goal:
      role === 'admin'
        ? 'Publish clear, practical lessons and assessments'
        : 'Complete courses and earn verified certificates',
    createdAt: new Date().toISOString(),
  };

  saveRegisteredUsers([...users, newUser]);
  saveUserActivity(newUser.id, DEFAULT_USER_ACTIVITY);

  return { ok: true, user: newUser };
}

export function resetUserPassword(email, newPassword) {
  const normalized = (email || '').trim().toLowerCase();
  if (!normalized) {
    return { ok: false, message: 'Please enter your registered email address.' };
  }

  const users = getRegisteredUsers();
  const idx = users.findIndex(
    (u) => (u.email || '').trim().toLowerCase() === normalized
  );

  if (idx === -1) {
    return {
      ok: false,
      message: 'No registered account found with this email address.',
    };
  }

  const updatedUsers = [...users];
  updatedUsers[idx] = {
    ...updatedUsers[idx],
    password: newPassword,
  };
  saveRegisteredUsers(updatedUsers);

  return { ok: true, user: updatedUsers[idx] };
}

export function setActiveSessionUser(userId) {
  if (!userId) {
    localStorage.removeItem(ACTIVE_USER_KEY);
    return;
  }
  localStorage.setItem(ACTIVE_USER_KEY, userId);
}

export function getActiveSessionUserId() {
  return localStorage.getItem(ACTIVE_USER_KEY) || null;
}

export function saveRememberedEmail(email) {
  const normalized = (email || '').trim().toLowerCase();
  if (!normalized) {
    clearRememberedEmail();
    return;
  }
  localStorage.setItem(REMEMBERED_EMAIL_KEY, normalized);
}

export function clearRememberedEmail() {
  localStorage.removeItem(REMEMBERED_EMAIL_KEY);
}

export function getRememberedEmail() {
  return localStorage.getItem(REMEMBERED_EMAIL_KEY) || '';
}