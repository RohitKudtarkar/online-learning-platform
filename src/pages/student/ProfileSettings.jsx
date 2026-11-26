import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Mail,
  Target,
  MapPin,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Save,
  Pencil,
  X,
  Sun,
  Moon,
  Bell,
  ShieldCheck,
  KeyRound,
  LogOut,
  BookOpen,
  Award,
  Layers,
} from 'lucide-react';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';
import { usePlatform } from '../../context/PlatformContext';
import {
  getRegisteredUsers,
  saveRegisteredUsers,
  getActiveSessionUserId,
} from '../../utils/userStorage';

function getFirstAndLastInitials(name) {
  const cleaned = (name || 'Learner').trim().replace(/\s+/g, ' ');
  if (!cleaned) return 'L';
  const parts = cleaned.split(' ');
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }
  const firstInitial = parts[0].charAt(0).toUpperCase();
  const lastInitial = parts[parts.length - 1].charAt(0).toUpperCase();
  return `${firstInitial}${lastInitial}`;
}

function StatusPopupModal({ popup, onClose }) {
  useEffect(() => {
    if (!popup) return;
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [popup, onClose]);

  if (!popup) return null;

  const isSuccess = popup.type === 'success';

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-xs"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="profile-popup-title"
    >
      <div
        className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-7 sm:p-8 shadow-2xl text-center space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto ${
            isSuccess
              ? 'bg-emerald-100/90 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400'
              : 'bg-amber-100/90 dark:bg-amber-950/80 text-amber-500 dark:text-amber-400'
          }`}
        >
          {isSuccess ? (
            <CheckCircle2 className="w-7 h-7" />
          ) : (
            <AlertTriangle className="w-7 h-7" />
          )}
        </div>

        <div className="space-y-2">
          <h3
            id="profile-popup-title"
            className="text-xl font-black text-slate-900 dark:text-white"
          >
            {popup.title}
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {popup.message}
          </p>
        </div>

        <div className="pt-1 flex justify-center">
          <Button
            type="button"
            variant="primary"
            size="md"
            onClick={onClose}
            className="min-w-[116px] justify-center bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-700 hover:from-indigo-500 hover:via-violet-500 hover:to-indigo-600 text-white font-bold shadow-md shadow-indigo-600/25"
          >
            OK
          </Button>
        </div>
      </div>
    </div>
  );
}

function ResetPasswordModal({
  isOpen,
  userEmail,
  onClose,
  onSuccess,
  onErrorPopup,
}) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const matchedUser = useMemo(() => {
    const users = getRegisteredUsers();
    const activeId = getActiveSessionUserId();
    const normalizedEmail = (userEmail || '').trim().toLowerCase();
    return (
      users.find(
        (u) =>
          (activeId && u.id === activeId) ||
          (normalizedEmail &&
            (u.email || '').trim().toLowerCase() === normalizedEmail)
      ) || null
    );
  }, [userEmail, isOpen]);

  const requiresCurrentPassword = Boolean(matchedUser?.password);

  useEffect(() => {
    if (!isOpen) return;
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setFieldErrors({});

    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleResetSubmit = (e) => {
    e.preventDefault();
    const trimmedCurrent = currentPassword.trim();
    const trimmedPass = newPassword.trim();
    const trimmedConfirm = confirmPassword.trim();
    const nextErrors = {};

    if (requiresCurrentPassword) {
      if (!trimmedCurrent) {
        nextErrors.current = 'Please enter your current password.';
      } else if (trimmedCurrent !== matchedUser.password) {
        nextErrors.current = 'Current password is incorrect.';
      }
    }

    if (!trimmedPass) {
      nextErrors.newPass = 'Please enter a new password.';
    } else if (trimmedPass.length < 8) {
      nextErrors.newPass = 'New password must be at least 8 characters long.';
    } else if (requiresCurrentPassword && trimmedPass === matchedUser.password) {
      nextErrors.newPass =
        'New password must be different from your current password.';
    }

    if (!trimmedConfirm) {
      nextErrors.confirm = 'Please confirm your new password.';
    } else if (trimmedPass !== trimmedConfirm) {
      nextErrors.confirm =
        'New password and confirmation password do not match.';
    }

    if (Object.keys(nextErrors).length > 0) {
      setFieldErrors(nextErrors);
      if (typeof onErrorPopup === 'function') {
        onErrorPopup(Object.values(nextErrors)[0]);
      }
      return;
    }

    try {
      const users = getRegisteredUsers();
      const activeId = getActiveSessionUserId();
      const normalizedEmail = (userEmail || '').trim().toLowerCase();

      const updatedUsers = users.map((u) => {
        const matchesId = activeId && u.id === activeId;
        const matchesEmail =
          normalizedEmail &&
          (u.email || '').trim().toLowerCase() === normalizedEmail;
        if (matchesId || matchesEmail) {
          return { ...u, password: trimmedPass };
        }
        return u;
      });
      saveRegisteredUsers(updatedUsers);
    } catch {
      // Ignore storage errors
    }

    onClose();
    onSuccess(
      'Your account password has been updated. Use your new password next time you sign in.'
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="reset-password-modal-title"
    >
      <form
        onSubmit={handleResetSubmit}
        noValidate
        className="relative overflow-hidden w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-7 shadow-2xl space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-indigo-600 via-violet-600 to-emerald-500"
        />

        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3
                id="reset-password-modal-title"
                className="text-lg font-black text-slate-900 dark:text-white"
              >
                Change Password
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {userEmail || 'Update your account password'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close change password modal"
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4">
          {requiresCurrentPassword && (
            <div>
              <label
                htmlFor="current-password-input"
                className="block text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5"
              >
                Current Password <span className="text-red-600">*</span>
              </label>
              <input
                id="current-password-input"
                type="password"
                value={currentPassword}
                onChange={(e) => {
                  setCurrentPassword(e.target.value);
                  if (fieldErrors.current) {
                    setFieldErrors((prev) => ({ ...prev, current: '' }));
                  }
                }}
                placeholder="Enter your current password"
                className={`w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 ${
                  fieldErrors.current
                    ? 'border-red-500 focus:ring-red-500/20'
                    : 'border-slate-300 dark:border-slate-700 focus:border-indigo-600 focus:ring-indigo-600/20'
                }`}
              />
              {fieldErrors.current && (
                <p className="mt-1.5 text-xs font-semibold text-red-600 dark:text-red-400 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-red-600 dark:text-red-400" />
                  <span>{fieldErrors.current}</span>
                </p>
              )}
            </div>
          )}

          <div>
            <label
              htmlFor="new-password-input"
              className="block text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5"
            >
              New Password <span className="text-red-600">*</span>
            </label>
            <input
              id="new-password-input"
              type="password"
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
                if (fieldErrors.newPass) {
                  setFieldErrors((prev) => ({ ...prev, newPass: '' }));
                }
              }}
              placeholder="Enter at least 8 characters"
              className={`w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 ${
                fieldErrors.newPass
                  ? 'border-red-500 focus:ring-red-500/20'
                  : 'border-slate-300 dark:border-slate-700 focus:border-indigo-600 focus:ring-indigo-600/20'
              }`}
            />
            {fieldErrors.newPass && (
              <p className="mt-1.5 text-xs font-semibold text-red-600 dark:text-red-400 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-red-600 dark:text-red-400" />
                <span>{fieldErrors.newPass}</span>
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="confirm-password-input"
              className="block text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5"
            >
              Confirm New Password <span className="text-red-600">*</span>
            </label>
            <input
              id="confirm-password-input"
              type="password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (fieldErrors.confirm) {
                  setFieldErrors((prev) => ({ ...prev, confirm: '' }));
                }
              }}
              placeholder="Re-enter your new password"
              className={`w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 ${
                fieldErrors.confirm
                  ? 'border-red-500 focus:ring-red-500/20'
                  : 'border-slate-300 dark:border-slate-700 focus:border-indigo-600 focus:ring-indigo-600/20'
              }`}
            />
            {fieldErrors.confirm && (
              <p className="mt-1.5 text-xs font-semibold text-red-600 dark:text-red-400 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-red-600 dark:text-red-400" />
                <span>{fieldErrors.confirm}</span>
              </p>
            )}
          </div>
        </div>

        <div className="pt-1 flex items-center justify-end gap-2.5">
          <Button type="button" variant="outline" size="md" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="md">
            Update Password
          </Button>
        </div>
      </form>
    </div>
  );
}

export default function ProfileSettings() {
  const navigate = useNavigate();
  const auth = useAuth();
  const { user, logout, updateProfile } = auth || {};

  const {
    enrolledIds = [],
    completedLessons = {},
    certificates = [],
  } = usePlatform();

  const userStorageKey = useMemo(() => {
    const identifier = user?.id || user?.email || 'default';
    return `olp_profile_prefs_${identifier}`;
  }, [user?.id, user?.email]);

  const [fullName, setFullName] = useState(user?.name || '');
  const [goal, setGoal] = useState(user?.goal || '');
  const [location, setLocation] = useState(user?.location || '');
  const [bio, setBio] = useState(user?.bio || '');

  const [savedSnapshot, setSavedSnapshot] = useState({
    name: user?.name || '',
    goal: user?.goal || '',
    location: user?.location || '',
    bio: user?.bio || '',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(true);
  const [isDark, setIsDark] = useState(() =>
    typeof document !== 'undefined'
      ? document.documentElement.classList.contains('dark')
      : false
  );

  const [errors, setErrors] = useState({});
  const [popup, setPopup] = useState(null);

  useEffect(() => {
    let saved = {};
    try {
      const raw = localStorage.getItem(userStorageKey);
      if (raw) saved = JSON.parse(raw);
    } catch {
      saved = {};
    }

    const initialName = saved.name ?? user?.name ?? '';
    const initialGoal = saved.goal ?? user?.goal ?? '';
    const initialLocation = saved.location ?? user?.location ?? '';
    const initialBio = saved.bio ?? user?.bio ?? '';

    setFullName(initialName);
    setGoal(initialGoal);
    setLocation(initialLocation);
    setBio(initialBio);

    setSavedSnapshot({
      name: initialName,
      goal: initialGoal,
      location: initialLocation,
      bio: initialBio,
    });

    setIsEditing(false);
    setErrors({});
    setEmailAlerts(
      typeof saved.emailAlerts === 'boolean' ? saved.emailAlerts : true
    );
    setWeeklyDigest(
      typeof saved.weeklyDigest === 'boolean' ? saved.weeklyDigest : true
    );
  }, [userStorageKey, user?.name, user?.goal, user?.location, user?.bio]);

  const totalCompletedLessons = Object.values(completedLessons).reduce(
    (sum, list) => sum + (Array.isArray(list) ? list.length : 0),
    0
  );

  const handleToggleTheme = (mode) => {
    const nextDark = mode === 'dark';
    setIsDark(nextDark);
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark', nextDark);
    }
    try {
      localStorage.setItem('theme', nextDark ? 'dark' : 'light');
      localStorage.setItem('olp_theme', nextDark ? 'dark' : 'light');
    } catch {
      // Ignore storage errors
    }
  };

  const handleStartEditing = () => {
    setErrors({});
    setIsEditing(true);
  };

  const handleCancelEditing = () => {
    setFullName(savedSnapshot.name);
    setGoal(savedSnapshot.goal);
    setLocation(savedSnapshot.location);
    setBio(savedSnapshot.bio);
    setErrors({});
    setIsEditing(false);
  };

  const validateProfileFields = () => {
    const nextErrors = {};
    const trimmedName = fullName.trim().replace(/\s+/g, ' ');
    const trimmedGoal = goal.trim();
    const trimmedLocation = location.trim();
    const trimmedBio = bio.trim();

    if (!trimmedName) {
      nextErrors.name = 'Full name is required.';
    } else if (trimmedName.length > 60) {
      nextErrors.name = 'Full name must be 60 characters or fewer.';
    } else if (!/^[A-Za-zÀ-ÖØ-öø-ÿ\s.'-]+$/.test(trimmedName)) {
      nextErrors.name =
        'Full name can only contain letters, spaces, apostrophes, dots, and hyphens.';
    } else {
      const nameParts = trimmedName.split(' ');
      if (nameParts.length < 2) {
        nextErrors.name =
          'Please enter both your first name and last name (at least 2 characters each).';
      } else {
        const firstName = nameParts[0];
        const lastName = nameParts[nameParts.length - 1];
        if (firstName.length < 2) {
          nextErrors.name = 'First name must be at least 2 characters long.';
        } else if (lastName.length < 2) {
          nextErrors.name = 'Last name must be at least 2 characters long.';
        }
      }
    }

    if (trimmedGoal.length > 120) {
      nextErrors.goal = 'Primary learning goal must be 120 characters or fewer.';
    }

    if (trimmedLocation.length > 80) {
      nextErrors.location = 'Location must be 80 characters or fewer.';
    }

    if (trimmedBio.length > 300) {
      nextErrors.bio = 'About you / study focus must be 300 characters or fewer.';
    }

    return nextErrors;
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();

    const nextErrors = validateProfileFields();
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      const firstErrorMessage = Object.values(nextErrors)[0];
      setPopup({
        type: 'warning',
        title: 'Please Fix Form Errors',
        message: firstErrorMessage,
      });
      return;
    }

    const trimmedName = fullName.trim();
    const trimmedGoal = goal.trim();
    const trimmedLocation = location.trim();
    const trimmedBio = bio.trim();

    const hasChanges =
      trimmedName !== (savedSnapshot.name || '').trim() ||
      trimmedGoal !== (savedSnapshot.goal || '').trim() ||
      trimmedLocation !== (savedSnapshot.location || '').trim() ||
      trimmedBio !== (savedSnapshot.bio || '').trim();

    if (!hasChanges) {
      setErrors({});
      setPopup({
        type: 'warning',
        title: 'No Changes Made',
        message:
          'You have not made any changes to your personal profile details. Update a field before saving.',
      });
      return;
    }

    setErrors({});

    const nextSnapshot = {
      name: trimmedName,
      goal: trimmedGoal,
      location: trimmedLocation,
      bio: trimmedBio,
    };

    const updatedPayload = {
      ...nextSnapshot,
      emailAlerts,
      weeklyDigest,
    };

    try {
      localStorage.setItem(userStorageKey, JSON.stringify(updatedPayload));
    } catch {
      // Ignore storage errors
    }

    if (typeof updateProfile === 'function') {
      updateProfile(updatedPayload);
    }

    setFullName(trimmedName);
    setGoal(trimmedGoal);
    setLocation(trimmedLocation);
    setBio(trimmedBio);
    setSavedSnapshot(nextSnapshot);
    setIsEditing(false);

    setPopup({
      type: 'success',
      title: 'Profile Saved Successfully',
      message:
        'Your personal profile details have been validated and saved to your account.',
    });
  };

  const handleSignOut = () => {
    if (typeof logout === 'function') {
      logout();
    }
    navigate('/login');
  };

  const inputBaseClass =
    'w-full min-w-0 px-3.5 py-2.5 text-sm border rounded-xl transition-all';
  const editableInputClass =
    'bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 hover:border-indigo-400 dark:hover:border-indigo-500 focus:outline-none focus:ring-2';
  const readOnlyInputClass =
    'bg-slate-100/80 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700/80 text-slate-600 dark:text-slate-300 cursor-default';

  return (
    <div className="relative overflow-hidden py-8 lg:py-12">
      <StatusPopupModal popup={popup} onClose={() => setPopup(null)} />
      <ResetPasswordModal
        isOpen={isResetModalOpen}
        userEmail={user?.email}
        onClose={() => setIsResetModalOpen(false)}
        onErrorPopup={(msg) =>
          setPopup({
            type: 'warning',
            title: 'Password Reset Error',
            message: msg,
          })
        }
        onSuccess={(msg) =>
          setPopup({
            type: 'success',
            title: 'Password Updated',
            message: msg,
          })
        }
      />

      {/* Ambient Radial Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[62rem] h-[24rem] rounded-full bg-gradient-to-tr from-indigo-500/15 via-violet-500/10 to-emerald-500/15 blur-3xl"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 min-w-0">
        {/* Hero Profile Banner */}
        <div className="group/hero relative overflow-hidden bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 shadow-sm hover:-translate-y-1.5 hover:shadow-2xl hover:border-indigo-300 dark:hover:border-indigo-700 transition-all duration-200 min-w-0">
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-indigo-600 via-violet-600 to-emerald-500"
          />

          <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center gap-5 min-w-0">
              {/* First + Last Letter Monogram Logo */}
              <div className="group/avatar relative w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-600 via-violet-600 to-emerald-500 p-[2px] shadow-lg shadow-indigo-600/20 hover:shadow-xl hover:shadow-indigo-600/30 hover:-translate-y-0.5 transition-all duration-200 shrink-0">
                <div className="w-full h-full rounded-[22px] bg-gradient-to-br from-indigo-600 via-violet-600 to-indigo-700 dark:from-indigo-500 dark:via-violet-600 dark:to-slate-900 flex flex-col items-center justify-center relative overflow-hidden">
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-white/0 via-white/15 to-white/25"
                  />
                  <span className="relative text-2xl font-black tracking-wider text-white select-none">
                    {getFirstAndLastInitials(savedSnapshot.name || user?.name)}
                  </span>
                </div>
              </div>

              <div className="space-y-2 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200/80 dark:border-indigo-800/80 text-indigo-700 dark:text-indigo-300 text-xs font-bold">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                    <span>Student Account</span>
                  </div>
                  <Badge tone="emerald">Active Learner</Badge>
                </div>

                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight break-words">
                  {savedSnapshot.name || user?.name || 'Student Profile'}
                </h1>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                  <span className="inline-flex items-center gap-1.5 break-all">
                    <Mail className="w-4 h-4 text-indigo-500 shrink-0" />
                    <span>{user?.email || 'student@portal.edu'}</span>
                  </span>
                  {savedSnapshot.location && (
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>{savedSnapshot.location}</span>
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* 3 Elevated Quick Stat Cards */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4 w-full xl:w-auto min-w-0 shrink-0">
              <div className="group/mini relative overflow-hidden min-w-0 px-2.5 sm:px-4 py-3 sm:py-3.5 rounded-2xl bg-slate-50/90 dark:bg-slate-800/70 border border-slate-200/90 dark:border-slate-700/80 shadow-xs hover:-translate-y-1.5 hover:shadow-xl hover:border-indigo-300 dark:hover:border-indigo-600 transition-all duration-200 text-center">
                <div
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-indigo-600 to-violet-600"
                />
                <div className="w-7 h-7 rounded-xl bg-indigo-100/90 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 group-hover/mini:bg-indigo-600 group-hover/mini:text-white transition-colors flex items-center justify-center mx-auto mb-1.5">
                  <BookOpen className="w-3.5 h-3.5" />
                </div>
                <p className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white leading-none">
                  {enrolledIds.length}
                </p>
                <p className="text-[11px] sm:text-xs font-bold text-slate-500 dark:text-slate-400 mt-1.5 truncate">
                  Courses
                </p>
              </div>

              <div className="group/mini relative overflow-hidden min-w-0 px-2.5 sm:px-4 py-3 sm:py-3.5 rounded-2xl bg-slate-50/90 dark:bg-slate-800/70 border border-slate-200/90 dark:border-slate-700/80 shadow-xs hover:-translate-y-1.5 hover:shadow-xl hover:border-emerald-300 dark:hover:border-emerald-600 transition-all duration-200 text-center">
                <div
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-emerald-500 to-teal-500"
                />
                <div className="w-7 h-7 rounded-xl bg-emerald-100/90 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 group-hover/mini:bg-emerald-600 group-hover/mini:text-white transition-colors flex items-center justify-center mx-auto mb-1.5">
                  <Layers className="w-3.5 h-3.5" />
                </div>
                <p className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white leading-none">
                  {totalCompletedLessons}
                </p>
                <p className="text-[11px] sm:text-xs font-bold text-slate-500 dark:text-slate-400 mt-1.5 truncate">
                  Lessons
                </p>
              </div>

              <div className="group/mini relative overflow-hidden min-w-0 px-2.5 sm:px-4 py-3 sm:py-3.5 rounded-2xl bg-slate-50/90 dark:bg-slate-800/70 border border-slate-200/90 dark:border-slate-700/80 shadow-xs hover:-translate-y-1.5 hover:shadow-xl hover:border-amber-300 dark:hover:border-amber-600 transition-all duration-200 text-center">
                <div
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-amber-500 to-orange-500"
                />
                <div className="w-7 h-7 rounded-xl bg-amber-100/90 dark:bg-amber-950 text-amber-600 dark:text-amber-400 group-hover/mini:bg-amber-500 group-hover/mini:text-white transition-colors flex items-center justify-center mx-auto mb-1.5">
                  <Award className="w-3.5 h-3.5" />
                </div>
                <p className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white leading-none">
                  {certificates.length}
                </p>
                <p className="text-[11px] sm:text-xs font-bold text-slate-500 dark:text-slate-400 mt-1.5 truncate">
                  Certificates
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main 2-Column Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 sm:gap-8 items-start min-w-0">
          {/* Left 7 Columns: Personal Details Form */}
          <form
            onSubmit={handleSaveProfile}
            noValidate
            className="xl:col-span-7 min-w-0 group/form relative overflow-hidden bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-5 sm:p-8 shadow-sm hover:-translate-y-1.5 hover:shadow-2xl hover:border-indigo-300 dark:hover:border-indigo-700 transition-all duration-200 space-y-6"
          >
            <div
              aria-hidden="true"
              className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-indigo-600 via-violet-600 to-emerald-500 opacity-85"
            />

            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-11 h-11 rounded-2xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 group-hover/form:bg-indigo-600 group-hover/form:text-white transition-all duration-200 flex items-center justify-center shrink-0">
                  <User className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                    Personal Profile Details
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {isEditing
                      ? 'Edit your details below and click Save Profile Changes'
                      : 'View your personal profile details or click Edit Profile to make changes'}
                  </p>
                </div>
              </div>

              <Badge tone={isEditing ? 'indigo' : 'slate'}>
                {isEditing ? 'Editing Mode' : 'Read-Only'}
              </Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 min-w-0">
              {/* Full Name */}
              <div className="min-w-0">
                <label
                  htmlFor="profile-name"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5"
                >
                  Full Name {isEditing && <span className="text-rose-500">*</span>}
                </label>
                <input
                  id="profile-name"
                  type="text"
                  maxLength={60}
                  readOnly={!isEditing}
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value);
                    if (errors.name) setErrors((prev) => ({ ...prev, name: '' }));
                  }}
                  placeholder="Enter your full name"
                  className={`${inputBaseClass} ${
                    !isEditing
                      ? readOnlyInputClass
                      : `${editableInputClass} ${
                          errors.name
                            ? 'border-rose-500 focus:ring-rose-500/20'
                            : 'border-slate-300 dark:border-slate-700 focus:border-indigo-600 focus:ring-indigo-600/20'
                        }`
                  }`}
                />
                {errors.name && (
                  <p className="mt-1 text-xs font-medium text-rose-600 dark:text-rose-400 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.name}</span>
                  </p>
                )}
              </div>

              {/* Email (Always Read-only) */}
              <div className="min-w-0">
                <label
                  htmlFor="profile-email"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5"
                >
                  Account Email
                </label>
                <input
                  id="profile-email"
                  type="email"
                  value={user?.email || ''}
                  readOnly
                  className="w-full min-w-0 px-3.5 py-2.5 text-sm bg-slate-100/80 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 rounded-xl text-slate-500 dark:text-slate-400 cursor-not-allowed"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 min-w-0">
              {/* Learning Goal */}
              <div className="min-w-0">
                <label
                  htmlFor="profile-goal"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5"
                >
                  Primary Learning Goal
                </label>
                <div className="relative min-w-0">
                  <Target className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    id="profile-goal"
                    type="text"
                    maxLength={120}
                    readOnly={!isEditing}
                    value={goal}
                    onChange={(e) => {
                      setGoal(e.target.value);
                      if (errors.goal) setErrors((prev) => ({ ...prev, goal: '' }));
                    }}
                    placeholder="e.g. Master React & UI/UX Design"
                    className={`pl-10 ${inputBaseClass} ${
                      !isEditing
                        ? readOnlyInputClass
                        : `${editableInputClass} ${
                            errors.goal
                              ? 'border-rose-500 focus:ring-rose-500/20'
                              : 'border-slate-300 dark:border-slate-700 focus:border-indigo-600 focus:ring-indigo-600/20'
                          }`
                    }`}
                  />
                </div>
                {errors.goal && (
                  <p className="mt-1 text-xs font-medium text-rose-600 dark:text-rose-400 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.goal}</span>
                  </p>
                )}
              </div>

              {/* Location */}
              <div className="min-w-0">
                <label
                  htmlFor="profile-location"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5"
                >
                  Location
                </label>
                <div className="relative min-w-0">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    id="profile-location"
                    type="text"
                    maxLength={80}
                    readOnly={!isEditing}
                    value={location}
                    onChange={(e) => {
                      setLocation(e.target.value);
                      if (errors.location)
                        setErrors((prev) => ({ ...prev, location: '' }));
                    }}
                    placeholder="e.g. Mumbai, India"
                    className={`pl-10 ${inputBaseClass} ${
                      !isEditing
                        ? readOnlyInputClass
                        : `${editableInputClass} ${
                            errors.location
                              ? 'border-rose-500 focus:ring-rose-500/20'
                              : 'border-slate-300 dark:border-slate-700 focus:border-indigo-600 focus:ring-indigo-600/20'
                          }`
                    }`}
                  />
                </div>
                {errors.location && (
                  <p className="mt-1 text-xs font-medium text-rose-600 dark:text-rose-400 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.location}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Bio */}
            <div className="min-w-0">
              <label
                htmlFor="profile-bio"
                className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5"
              >
                About You / Study Focus
              </label>
              <textarea
                id="profile-bio"
                rows={4}
                maxLength={300}
                readOnly={!isEditing}
                value={bio}
                onChange={(e) => {
                  setBio(e.target.value);
                  if (errors.bio) setErrors((prev) => ({ ...prev, bio: '' }));
                }}
                placeholder="Write a brief note about your skills, projects, or current learning focus..."
                className={`px-3.5 py-2.5 text-sm border rounded-xl w-full min-w-0 transition-all resize-none ${
                  !isEditing
                    ? readOnlyInputClass
                    : `${editableInputClass} ${
                        errors.bio
                          ? 'border-rose-500 focus:ring-rose-500/20'
                          : 'border-slate-300 dark:border-slate-700 focus:border-indigo-600 focus:ring-indigo-600/20'
                      }`
                }`}
              />
              {errors.bio && (
                <p className="mt-1 text-xs font-medium text-rose-600 dark:text-rose-400 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.bio}</span>
                </p>
              )}
              <div className="mt-1 flex items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
                <span>Shown on your student dashboard header</span>
                <span className="font-medium shrink-0">{bio.length} / 300</span>
              </div>
            </div>

            {/* Footer Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center justify-end gap-3">
              {!isEditing ? (
                <Button
                  type="button"
                  variant="primary"
                  size="md"
                  onClick={handleStartEditing}
                  className="whitespace-nowrap"
                >
                  <Pencil className="w-4 h-4 shrink-0" />
                  <span>Edit Profile</span>
                </Button>
              ) : (
                <>
                  <Button
                    type="button"
                    variant="outline"
                    size="md"
                    onClick={handleCancelEditing}
                    className="whitespace-nowrap"
                  >
                    <X className="w-4 h-4 shrink-0" />
                    <span>Cancel</span>
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    className="whitespace-nowrap"
                  >
                    <Save className="w-4 h-4 shrink-0" />
                    <span>Save Profile Changes</span>
                  </Button>
                </>
              )}
            </div>
          </form>

          {/* Right 5 Columns: Preferences & Security */}
          <div className="xl:col-span-5 min-w-0 space-y-6">
            {/* Appearance & Notification Preferences */}
            <div className="group/prefs relative overflow-hidden min-w-0 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-5 sm:p-6 shadow-sm hover:-translate-y-1.5 hover:shadow-2xl hover:border-indigo-300 dark:hover:border-indigo-700 transition-all duration-200 space-y-5">
              <div
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-indigo-600 via-violet-600 to-emerald-500 opacity-85"
              />

              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-2xl bg-violet-50 dark:bg-violet-950/80 text-violet-600 dark:text-violet-400 group-hover/prefs:bg-violet-600 group-hover/prefs:text-white transition-all duration-200 flex items-center justify-center shrink-0">
                  <Bell className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                    Workspace Preferences
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Appearance theme and study alert controls
                  </p>
                </div>
              </div>

              {/* Theme Selector */}
              <div className="space-y-2 min-w-0">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Interface Theme
                </p>
                <div className="grid grid-cols-2 gap-2.5 min-w-0">
                  <button
                    type="button"
                    onClick={() => handleToggleTheme('light')}
                    className={`min-w-0 px-2.5 sm:px-3.5 py-2.5 rounded-2xl border text-xs sm:text-sm font-bold whitespace-nowrap flex items-center justify-center gap-1.5 sm:gap-2 transition-all cursor-pointer ${
                      !isDark
                        ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm'
                        : 'bg-slate-50 dark:bg-slate-800/70 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-indigo-400'
                    }`}
                  >
                    <Sun className="w-4 h-4 shrink-0" />
                    <span>Light Mode</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleToggleTheme('dark')}
                    className={`min-w-0 px-2.5 sm:px-3.5 py-2.5 rounded-2xl border text-xs sm:text-sm font-bold whitespace-nowrap flex items-center justify-center gap-1.5 sm:gap-2 transition-all cursor-pointer ${
                      isDark
                        ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm'
                        : 'bg-slate-50 dark:bg-slate-800/70 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-indigo-400'
                    }`}
                  >
                    <Moon className="w-4 h-4 shrink-0" />
                    <span>Dark Mode</span>
                  </button>
                </div>
              </div>

              {/* Toggle Switches */}
              <div className="space-y-3 pt-1 min-w-0">
                <label className="flex items-center justify-between gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 cursor-pointer min-w-0">
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                      Course & Quiz Alerts
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Notify when certificates or milestones unlock
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={emailAlerts}
                    onChange={(e) => setEmailAlerts(e.target.checked)}
                    className="w-4 h-4 shrink-0 rounded accent-indigo-600 cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 cursor-pointer min-w-0">
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                      Weekly Progress Summary
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Track completed lessons and pending assignments
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={weeklyDigest}
                    onChange={(e) => setWeeklyDigest(e.target.checked)}
                    className="w-4 h-4 shrink-0 rounded accent-indigo-600 cursor-pointer"
                  />
                </label>
              </div>
            </div>

            {/* Security & Account Actions Card */}
            <div className="group/security relative overflow-hidden min-w-0 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-5 sm:p-6 shadow-sm hover:-translate-y-1.5 hover:shadow-2xl hover:border-indigo-300 dark:hover:border-indigo-700 transition-all duration-200 space-y-4">
              <div
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-indigo-600 via-violet-600 to-emerald-500 opacity-85"
              />

              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 group-hover/security:bg-emerald-600 group-hover/security:text-white transition-all duration-200 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                    Account & Security
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Password recovery and session management
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-2.5 pt-1 min-w-0">
                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  onClick={() => setIsResetModalOpen(true)}
                  className="w-full justify-center whitespace-nowrap"
                >
                  <KeyRound className="w-4 h-4 shrink-0" />
                  <span>Reset Password</span>
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  onClick={handleSignOut}
                  className="w-full justify-center whitespace-nowrap text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-900/70 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                >
                  <LogOut className="w-4 h-4 shrink-0" />
                  <span>Sign Out</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
