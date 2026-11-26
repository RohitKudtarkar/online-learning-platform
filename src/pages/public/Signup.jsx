import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  UserPlus,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  GraduationCap,
  ShieldCheck,
  Lock,
  Layers,
  Award,
  ArrowRight,
} from 'lucide-react';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';
import { findUserByEmail, registerNewUser } from '../../utils/userStorage';

const MAX_NAME = 50;
const MAX_EMAIL = 100;
const MIN_PASSWORD = 8;

function validateFullName(val) {
  const trimmed = val.trim();
  if (!trimmed) return 'Please enter your full name.';
  if (!/^[a-zA-Z\s'-]+$/.test(trimmed)) {
    return 'Full name can only contain letters, spaces, hyphens, or apostrophes.';
  }
  const parts = trimmed.split(/\s+/).filter(Boolean);
  if (parts.length < 2) {
    return 'Please enter both your first name and last name.';
  }
  if (parts[0].length < 2 || parts[parts.length - 1].length < 2) {
    return 'First name and last name must each be at least 2 characters.';
  }
  return '';
}

function validateEmailAddress(val) {
  const trimmed = val.trim();
  if (!trimmed) return 'Please enter your email address.';
  if (trimmed.includes('..') || trimmed.startsWith('.') || trimmed.endsWith('.')) {
    return 'Please enter a valid email address.';
  }
  const standardEmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!standardEmailRegex.test(trimmed)) {
    return 'Please enter a valid email address.';
  }
  if (findUserByEmail(trimmed.toLowerCase())) {
    return 'This email address is already registered. Please use another email or log in.';
  }
  return '';
}

function validatePassword(val) {
  if (!val) return 'Please enter a password.';
  if (val.length < MIN_PASSWORD) {
    return `Password must be at least ${MIN_PASSWORD} characters long.`;
  }
  return '';
}

function validateConfirmPassword(confirmVal, passwordVal) {
  if (!confirmVal) return 'Please confirm your password.';
  if (confirmVal !== passwordVal) return 'Passwords do not match.';
  return '';
}

function PopupAlertModal({ popup, onClose }) {
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/55 backdrop-blur-xs"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="signup-popup-title"
    >
      <div
        className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-7 text-center space-y-4 transition-all duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className={`w-12 h-12 rounded-2xl mx-auto flex items-center justify-center ${
            isSuccess
              ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400'
              : 'bg-amber-100 dark:bg-amber-950/80 text-amber-500 dark:text-amber-400'
          }`}
        >
          {isSuccess ? (
            <CheckCircle2 className="w-7 h-7" />
          ) : (
            <AlertTriangle className="w-7 h-7" />
          )}
        </div>

        <h3
          id="signup-popup-title"
          className="text-xl font-extrabold text-slate-900 dark:text-white"
        >
          {popup.title}
        </h3>

        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          {popup.message}
        </p>

        <div className="pt-1 flex justify-center">
          <Button
            type="button"
            variant="primary"
            size="md"
            onClick={onClose}
            className="min-w-[6.5rem]"
          >
            OK
          </Button>
        </div>
      </div>
    </div>
  );
}

const WORKSPACE_HIGHLIGHTS = [
  {
    icon: Lock,
    title: 'Private Individual Workspace',
    desc: 'Your enrollments, notes, assignment submissions, and quiz scores stay scoped exclusively to your account.',
    accent:
      'bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 group-hover/item:bg-indigo-600 group-hover/item:text-white',
  },
  {
    icon: Layers,
    title: 'Structured Progress Tracking',
    desc: 'Pick up right where you left off across modules, personal lesson notes, and practical tasks.',
    accent:
      'bg-violet-50 dark:bg-violet-950/80 text-violet-600 dark:text-violet-400 group-hover/item:bg-violet-600 group-hover/item:text-white',
  },
  {
    icon: Award,
    title: 'Verified Completion Certificates',
    desc: 'Score 70% or higher on course assessments to unlock your personalized completion certificate.',
    accent:
      'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 group-hover/item:bg-emerald-600 group-hover/item:text-white',
  },
];

export default function Signup() {
  const auth = useAuth();

  const [values, setValues] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student',
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [popup, setPopup] = useState(null);

  const runFieldValidation = (field, nextValues = values) => {
    if (field === 'name') return validateFullName(nextValues.name);
    if (field === 'email') return validateEmailAddress(nextValues.email);
    if (field === 'password') return validatePassword(nextValues.password);
    if (field === 'confirmPassword') {
      return validateConfirmPassword(
        nextValues.confirmPassword,
        nextValues.password
      );
    }
    return '';
  };

  const handleFieldChange = (field, nextVal) => {
    const updated = { ...values, [field]: nextVal };
    setValues(updated);

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: runFieldValidation(field, updated),
      }));
    }
    if (field === 'password' && errors.confirmPassword) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: validateConfirmPassword(
          updated.confirmPassword,
          updated.password
        ),
      }));
    }
  };

  const handleBlur = (field) => {
    const fieldError = runFieldValidation(field, values);
    setErrors((prev) => ({ ...prev, [field]: fieldError }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const nextErrors = {
      name: validateFullName(values.name),
      email: validateEmailAddress(values.email),
      password: validatePassword(values.password),
      confirmPassword: validateConfirmPassword(
        values.confirmPassword,
        values.password
      ),
    };

    setErrors(nextErrors);

    const hasError = Object.values(nextErrors).some(Boolean);
    if (hasError) {
      setPopup({
        type: 'warning',
        title: 'Warning',
        message: nextErrors.email
          ? nextErrors.email
          : 'Please correct the highlighted fields before creating your account.',
      });
      return;
    }

    const normalizedEmail = values.email.trim().toLowerCase();

    // Persist user in localStorage ("olp_registered_users") and initialize isolated activity storage ("olp_activity_<id>")
    const created = registerNewUser({
      name: values.name.trim(),
      email: normalizedEmail,
      password: values.password,
      role: values.role,
    });

    if (!created.ok) {
      setErrors((prev) => ({ ...prev, email: created.message }));
      setPopup({
        type: 'warning',
        title: 'Warning',
        message: created.message,
      });
      return;
    }

    // Ensure session stays logged out on the Sign Up page
    if (auth && typeof auth.logout === 'function') {
      auth.logout();
    }

    setValues({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'student',
    });
    setErrors({});
    setShowPassword(false);
    setShowConfirmPassword(false);

    setPopup({
      type: 'success',
      title: 'Success',
      message:
        'Account created successfully! You can now log in using your email and password.',
    });
  };

  return (
    <div className="relative overflow-hidden py-12 lg:py-20">
      <PopupAlertModal popup={popup} onClose={() => setPopup(null)} />

      {/* Ambient Radial Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-28 left-1/2 -translate-x-1/2 w-[60rem] h-[26rem] rounded-full bg-gradient-to-tr from-indigo-500/15 via-violet-500/10 to-emerald-500/15 blur-3xl"
      />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Left Column: Value Proposition & Individual Workspace Guarantees */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200/80 dark:border-indigo-800/80 text-indigo-700 dark:text-indigo-300 text-xs sm:text-sm font-bold shadow-2xs">
                <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>Personal Learning Account</span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.15]">
                Create Your{' '}
                <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-emerald-600 dark:from-indigo-400 dark:via-violet-400 dark:to-emerald-400 bg-clip-text text-transparent">
                  Individual Workspace
                </span>
              </h1>

              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                Start fresh with your own isolated profile. Every enrolled course, saved lesson note, assignment, and certificate belongs strictly to your account.
              </p>
            </div>

            <div className="space-y-4">
              {WORKSPACE_HIGHLIGHTS.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className="group/item relative overflow-hidden bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-5 shadow-sm hover:-translate-y-1.5 hover:shadow-2xl hover:border-indigo-300 dark:hover:border-indigo-700 transition-all duration-200 flex items-start gap-4 cursor-default"
                  >
                    <div
                      aria-hidden="true"
                      className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-indigo-600 via-violet-600 to-emerald-500 opacity-85"
                    />
                    <div
                      className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-200 group-hover/item:scale-105 ${item.accent}`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white group-hover/item:text-indigo-600 dark:group-hover/item:text-indigo-400 transition-colors">
                        {item.title}
                      </h2>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Registration Form Card */}
          <div className="lg:col-span-7 relative overflow-hidden bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 lg:p-9 shadow-sm hover:-translate-y-1 hover:shadow-2xl hover:border-indigo-300 dark:hover:border-indigo-700 transition-all duration-200">
            <div
              aria-hidden="true"
              className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-indigo-600 via-violet-600 to-emerald-500 opacity-85"
            />

            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              <div className="space-y-1">
                <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                  Sign Up
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                  Choose your portal role and complete your details below.
                </p>
              </div>

              {/* Role Selector Cards */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Select Portal Role
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => handleFieldChange('role', 'student')}
                    className={`group/role p-3.5 rounded-2xl border text-left transition-all duration-150 cursor-pointer flex items-center gap-3 ${
                      values.role === 'student'
                        ? 'bg-indigo-50/90 dark:bg-indigo-950/60 border-indigo-600 dark:border-indigo-500 ring-2 ring-indigo-500/20 shadow-md -translate-y-0.5'
                        : 'bg-slate-50 dark:bg-slate-800/70 border-slate-200 dark:border-slate-700 hover:-translate-y-0.5 hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-600'
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                        values.role === 'student'
                          ? 'bg-indigo-600 text-white'
                          : 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400'
                      }`}
                    >
                      <GraduationCap className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-extrabold text-slate-900 dark:text-white">
                        Student Portal
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                        Enroll, learn & earn certificates
                      </p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleFieldChange('role', 'admin')}
                    className={`group/role p-3.5 rounded-2xl border text-left transition-all duration-150 cursor-pointer flex items-center gap-3 ${
                      values.role === 'admin'
                        ? 'bg-emerald-50/90 dark:bg-emerald-950/60 border-emerald-600 dark:border-emerald-500 ring-2 ring-emerald-500/20 shadow-md -translate-y-0.5'
                        : 'bg-slate-50 dark:bg-slate-800/70 border-slate-200 dark:border-slate-700 hover:-translate-y-0.5 hover:shadow-md hover:border-emerald-300 dark:hover:border-emerald-600'
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                        values.role === 'admin'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400'
                      }`}
                    >
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-extrabold text-slate-900 dark:text-white">
                        Instructor Studio
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                        Publish courses & track analytics
                      </p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Full Name & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Input
                    label="Full Name"
                    name="name"
                    maxLength={MAX_NAME}
                    value={values.name}
                    onChange={(e) => handleFieldChange('name', e.target.value)}
                    onBlur={() => handleBlur('name')}
                    error={errors.name}
                    placeholder="Enter your Full Name"
                  />
                  <div className="mt-1 flex justify-end">
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                      {values.name.length} / {MAX_NAME}
                    </span>
                  </div>
                </div>

                <div>
                  <Input
                    label="Email Address"
                    name="email"
                    type="email"
                    maxLength={MAX_EMAIL}
                    value={values.email}
                    onChange={(e) => handleFieldChange('email', e.target.value)}
                    onBlur={() => handleBlur('email')}
                    error={errors.email}
                    placeholder="Enter your E-Mail Address"
                  />
                  <div className="mt-1 flex justify-end">
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                      {values.email.length} / {MAX_EMAIL}
                    </span>
                  </div>
                </div>
              </div>

              {/* Password & Confirm Password */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="signup-password"
                    className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="signup-password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      value={values.password}
                      onChange={(e) =>
                        handleFieldChange('password', e.target.value)
                      }
                      onBlur={() => handleBlur('password')}
                      placeholder="Minimum 8 characters"
                      className={`w-full px-3.5 py-2.5 pr-10 text-sm bg-slate-50 dark:bg-slate-800 border rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 hover:border-indigo-400 dark:hover:border-indigo-500 focus:outline-none focus:ring-2 transition-all ${
                        errors.password
                          ? 'border-rose-500 focus:ring-rose-500/20'
                          : 'border-slate-300 dark:border-slate-700 focus:border-indigo-600 focus:ring-indigo-600/20'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      aria-label={
                        showPassword ? 'Hide password' : 'Show password'
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  <div className="mt-1.5 flex items-center justify-between gap-2">
                    {errors.password ? (
                      <p className="text-xs font-medium text-rose-600 dark:text-rose-400">
                        {errors.password}
                      </p>
                    ) : (
                      <span
                        className={`text-xs font-medium ${
                          values.password.length >= MIN_PASSWORD
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : 'text-slate-500 dark:text-slate-400'
                        }`}
                      >
                        {values.password.length >= MIN_PASSWORD
                          ? '8+ characters met'
                          : 'At least 8 characters'}
                      </span>
                    )}
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 shrink-0">
                      {values.password.length} / {MIN_PASSWORD}+
                    </span>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="signup-confirm-password"
                    className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5"
                  >
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      id="signup-confirm-password"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={values.confirmPassword}
                      onChange={(e) =>
                        handleFieldChange('confirmPassword', e.target.value)
                      }
                      onBlur={() => handleBlur('confirmPassword')}
                      placeholder="Re-enter your password"
                      className={`w-full px-3.5 py-2.5 pr-10 text-sm bg-slate-50 dark:bg-slate-800 border rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 hover:border-indigo-400 dark:hover:border-indigo-500 focus:outline-none focus:ring-2 transition-all ${
                        errors.confirmPassword
                          ? 'border-rose-500 focus:ring-rose-500/20'
                          : 'border-slate-300 dark:border-slate-700 focus:border-indigo-600 focus:ring-indigo-600/20'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      aria-label={
                        showConfirmPassword
                          ? 'Hide confirm password'
                          : 'Show confirm password'
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-1.5 text-xs font-medium text-rose-600 dark:text-rose-400">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full shadow-md shadow-indigo-600/20 hover:shadow-lg"
              >
                <UserPlus className="w-4 h-4" />
                Create Account
                <ArrowRight className="w-4 h-4" />
              </Button>

              <p className="text-center text-xs sm:text-sm text-slate-600 dark:text-slate-400 pt-1">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  Log in here
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}