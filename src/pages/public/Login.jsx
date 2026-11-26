import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  LogIn,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Lock,
  Layers,
  Award,
  ArrowRight,
  GraduationCap,
  ShieldCheck,
  Check,
} from 'lucide-react';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';
import {
  findUserByEmail,
  getRememberedEmail,
  saveRememberedEmail,
  clearRememberedEmail,
  setActiveSessionUser,
  loadUserActivity,
} from '../../utils/userStorage';

const MAX_EMAIL = 100;
const MIN_PASSWORD = 8;

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
  return '';
}

function validatePassword(val) {
  if (!val) return 'Please enter your password.';
  if (val.length < MIN_PASSWORD) {
    return `Password must be at least ${MIN_PASSWORD} characters long.`;
  }
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
      aria-labelledby="login-popup-title"
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
          id="login-popup-title"
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

const LOGIN_HIGHLIGHTS = [
  {
    icon: Lock,
    title: 'Isolated Personal Activity',
    desc: 'Every account loads its own saved enrollments, notes, assignments, and quiz history.',
    accent:
      'bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 group-hover/item:bg-indigo-600 group-hover/item:text-white',
  },
  {
    icon: Layers,
    title: 'Resume Right Where You Left Off',
    desc: 'Pick up active video lessons, review lesson-linked notes, and submit pending projects.',
    accent:
      'bg-violet-50 dark:bg-violet-950/80 text-violet-600 dark:text-violet-400 group-hover/item:bg-violet-600 group-hover/item:text-white',
  },
  {
    icon: Award,
    title: 'Instant Certificate Access',
    desc: 'View, verify, and print your earned completion certificates anytime from your portal.',
    accent:
      'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 group-hover/item:bg-emerald-600 group-hover/item:text-white',
  },
];

export default function Login() {
  const navigate = useNavigate();
  const auth = useAuth();

  const initialRememberedEmail = getRememberedEmail();

  const [values, setValues] = useState({
    email: initialRememberedEmail,
    password: '',
  });
  const [rememberMe, setRememberMe] = useState(Boolean(initialRememberedEmail));
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [popup, setPopup] = useState(null);
  const [redirectTarget, setRedirectTarget] = useState(null);

  const runFieldValidation = (field, nextValues = values) => {
    if (field === 'email') return validateEmailAddress(nextValues.email);
    if (field === 'password') return validatePassword(nextValues.password);
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
  };

  const handleBlur = (field) => {
    const fieldError = runFieldValidation(field, values);
    setErrors((prev) => ({ ...prev, [field]: fieldError }));
  };

  const handleRememberMeToggle = (checked) => {
    setRememberMe(checked);
    if (!checked) {
      clearRememberedEmail();
    } else if (values.email.trim()) {
      saveRememberedEmail(values.email);
    }
  };

  const handlePopupClose = () => {
    const target = redirectTarget;
    setPopup(null);
    if (target) {
      setRedirectTarget(null);
      navigate(target);
    }
  };

  const activateUserSession = (userObj) => {
    setActiveSessionUser(userObj.id);
    loadUserActivity(userObj.id);
    if (auth && typeof auth.login === 'function') {
      auth.login(userObj.email, userObj.password, userObj);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const nextErrors = {
      email: validateEmailAddress(values.email),
      password: validatePassword(values.password),
    };

    setErrors(nextErrors);

    if (nextErrors.email || nextErrors.password) {
      setPopup({
        type: 'warning',
        title: 'Warning',
        message: 'Please correct the highlighted fields before logging in.',
      });
      return;
    }

    const normalizedEmail = values.email.trim().toLowerCase();
    const storedUser = findUserByEmail(normalizedEmail);

    if (storedUser) {
      if (storedUser.password !== values.password) {
        setErrors((prev) => ({
          ...prev,
          password: 'Incorrect password for this account.',
        }));
        setPopup({
          type: 'warning',
          title: 'Warning',
          message: 'Incorrect password. Please try again.',
        });
        return;
      }

      if (rememberMe) {
        saveRememberedEmail(normalizedEmail);
      } else {
        clearRememberedEmail();
      }

      activateUserSession(storedUser);

      const target = storedUser.role === 'admin' ? '/admin' : '/student';
      setRedirectTarget(target);
      setPopup({
        type: 'success',
        title: 'Success',
        message: `Welcome back, ${storedUser.name}! Your personal workspace is ready.`,
      });
      return;
    }

    if (auth && typeof auth.login === 'function') {
      const result = auth.login(normalizedEmail, values.password);
      if (result && result.ok) {
        if (rememberMe) {
          saveRememberedEmail(normalizedEmail);
        } else {
          clearRememberedEmail();
        }
        if (result.user?.id) {
          setActiveSessionUser(result.user.id);
          loadUserActivity(result.user.id);
        }
        const role = result.user?.role || 'student';
        setRedirectTarget(role === 'admin' ? '/admin' : '/student');
        setPopup({
          type: 'success',
          title: 'Success',
          message: `Welcome back${
            result.user?.name ? `, ${result.user.name}` : ''
          }! Your workspace is ready.`,
        });
        return;
      }
    }

    if (auth && typeof auth.logout === 'function') {
      auth.logout();
    }
    setActiveSessionUser(null);

    setErrors((prev) => ({
      ...prev,
      email: 'No account found with this email address.',
    }));
    setPopup({
      type: 'warning',
      title: 'Warning',
      message:
        'No account found with this email address. Please sign up first or use a quick demo portal below.',
    });
  };

  const handleQuickDemo = (role) => {
    const demoUser = {
      id: role === 'admin' ? 'demo_instructor' : 'demo_student',
      name: role === 'admin' ? 'Demo Instructor' : 'Demo Student',
      email:
        role === 'admin'
          ? 'instructor.demo@example.com'
          : 'student.demo@example.com',
      role,
    };

    if (rememberMe && values.email.trim()) {
      saveRememberedEmail(values.email);
    } else if (!rememberMe) {
      clearRememberedEmail();
    }

    setActiveSessionUser(demoUser.id);
    loadUserActivity(demoUser.id);

    if (auth && typeof auth.loginAsDemo === 'function') {
      auth.loginAsDemo(role);
    }

    const target = role === 'admin' ? '/admin' : '/student';
    setRedirectTarget(target);
    setPopup({
      type: 'success',
      title: 'Success',
      message: `Entered ${
        role === 'admin' ? 'Instructor Studio' : 'Student Portal'
      } demo workspace.`,
    });
  };

  return (
    <div className="relative overflow-hidden py-12 lg:py-20">
      <PopupAlertModal popup={popup} onClose={handlePopupClose} />

      {/* Ambient Radial Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-28 left-1/2 -translate-x-1/2 w-[60rem] h-[26rem] rounded-full bg-gradient-to-tr from-indigo-500/15 via-violet-500/10 to-emerald-500/15 blur-3xl"
      />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Left Column: Welcome Back & Highlights */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200/80 dark:border-indigo-800/80 text-indigo-700 dark:text-indigo-300 text-xs sm:text-sm font-bold shadow-2xs">
                <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>Welcome Back</span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.15]">
                Access Your{' '}
                <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-emerald-600 dark:from-indigo-400 dark:via-violet-400 dark:to-emerald-400 bg-clip-text text-transparent">
                  Personal Workspace
                </span>
              </h1>

              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                Log in to continue your enrolled courses, review personal lesson notes, submit assignments, and download verified certificates.
              </p>
            </div>

            <div className="space-y-4">
              {LOGIN_HIGHLIGHTS.map((item) => {
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

          {/* Right Column: Login Form Card */}
          <div className="lg:col-span-7 relative overflow-hidden bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 lg:p-9 shadow-sm hover:-translate-y-1 hover:shadow-2xl hover:border-indigo-300 dark:hover:border-indigo-700 transition-all duration-200 space-y-6">
            <div
              aria-hidden="true"
              className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-indigo-600 via-violet-600 to-emerald-500 opacity-85"
            />

            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              <div className="space-y-1">
                <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                  Log In
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                  Enter your registered email address and password to continue.
                </p>
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

              <div>
                <label
                  htmlFor="login-password"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="login-password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={values.password}
                    onChange={(e) =>
                      handleFieldChange('password', e.target.value)
                    }
                    onBlur={() => handleBlur('password')}
                    placeholder="Enter your Password"
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
                {errors.password && (
                  <p className="mt-1.5 text-xs font-medium text-rose-600 dark:text-rose-400">
                    {errors.password}
                  </p>
                )}

                {/* Remember Me & Forgot Password in One Row */}
                <div className="mt-3 flex items-center justify-between gap-3">
                  <label
                    htmlFor="remember-me"
                    className="inline-flex items-center gap-2.5 text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-300 select-none cursor-pointer"
                  >
                    <span className="relative flex items-center justify-center">
                      <input
                        id="remember-me"
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) =>
                          handleRememberMeToggle(e.target.checked)
                        }
                        className="peer sr-only"
                      />
                      <span
                        className={`w-4 h-4 rounded-md border flex items-center justify-center transition-all ${
                          rememberMe
                            ? 'bg-indigo-600 border-indigo-600 text-white shadow-2xs'
                            : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 hover:border-indigo-400'
                        }`}
                      >
                        {rememberMe && <Check className="w-3 h-3 stroke-[3]" />}
                      </span>
                    </span>
                    <span>Remember me</span>
                  </label>

                  <Link
                    to="/forgot-password"
                    className="text-xs sm:text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:underline shrink-0"
                  >
                    Forgot Password?
                  </Link>
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full shadow-md shadow-indigo-600/20 hover:shadow-lg"
              >
                <LogIn className="w-4 h-4" />
                Log In
                <ArrowRight className="w-4 h-4" />
              </Button>

              <p className="text-center text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                Don't have an account yet?{' '}
                <Link
                  to="/signup"
                  className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  Create an account
                </Link>
              </p>
            </form>

            {/* Instant Demo Portal Access */}
            <div className="pt-5 border-t border-slate-100 dark:border-slate-800 space-y-3">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 text-center">
                Or Explore Instant Demo Portals
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleQuickDemo('student')}
                  className="group/demo p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 hover:-translate-y-0.5 hover:shadow-md hover:border-indigo-400 dark:hover:border-indigo-500 transition-all duration-150 flex items-center gap-3 text-left cursor-pointer"
                >
                  <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 group-hover/demo:bg-indigo-600 group-hover/demo:text-white transition-colors flex items-center justify-center shrink-0">
                    <GraduationCap className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white truncate">
                      Student Demo
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                      Sample courses & progress
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickDemo('admin')}
                  className="group/demo p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 hover:-translate-y-0.5 hover:shadow-md hover:border-emerald-400 dark:hover:border-emerald-500 transition-all duration-150 flex items-center gap-3 text-left cursor-pointer"
                >
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 group-hover/demo:bg-emerald-600 group-hover/demo:text-white transition-colors flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white truncate">
                      Instructor Demo
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                      Course authoring & analytics
                    </p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}