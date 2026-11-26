import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  KeyRound,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  Sparkles,
  Send,
} from 'lucide-react';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { findUserByEmail } from '../../utils/userStorage';

const MAX_EMAIL = 100;

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
      aria-labelledby="forgot-popup-title"
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
          id="forgot-popup-title"
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

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [sentTo, setSentTo] = useState('');
  const [popup, setPopup] = useState(null);

  const handleChange = (nextVal) => {
    setEmail(nextVal);
    if (error) {
      setError(validateEmailAddress(nextVal));
    }
  };

  const handleBlur = () => {
    setError(validateEmailAddress(email));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationError = validateEmailAddress(email);
    setError(validationError);

    if (validationError) {
      setPopup({
        type: 'warning',
        title: 'Warning',
        message: validationError,
      });
      return;
    }

    const normalized = email.trim().toLowerCase();
    const account = findUserByEmail(normalized);

    if (!account) {
      const notFoundMsg = 'No account found with this email address.';
      setError(notFoundMsg);
      setPopup({
        type: 'warning',
        title: 'Warning',
        message: notFoundMsg,
      });
      return;
    }

    setSentTo(normalized);
    setPopup({
      type: 'success',
      title: 'Success',
      message: `Password reset link prepared for ${normalized}. (Frontend demo — no email was sent.)`,
    });
  };

  return (
    <div className="relative overflow-hidden min-h-[75vh] flex items-center justify-center px-4 py-12 lg:py-20">
      <PopupAlertModal popup={popup} onClose={() => setPopup(null)} />

      {/* Ambient Radial Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-28 left-1/2 -translate-x-1/2 w-[56rem] h-[24rem] rounded-full bg-gradient-to-tr from-indigo-500/15 via-violet-500/10 to-emerald-500/15 blur-3xl"
      />

      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 shadow-sm hover:-translate-y-1 hover:shadow-2xl hover:border-indigo-300 dark:hover:border-indigo-700 transition-all duration-200 space-y-6 overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-indigo-600 via-violet-600 to-emerald-500 opacity-85"
        />

        {sentTo ? (
          <div className="text-center space-y-4 py-2">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/80 dark:border-emerald-800/80 text-emerald-700 dark:text-emerald-300 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Demo Reset Confirmation</span>
            </div>

            <h1 className="text-2xl font-black text-slate-900 dark:text-white">
              Reset Link Ready
            </h1>

            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              A password recovery notice has been generated for{' '}
              <strong className="text-slate-900 dark:text-white">
                {sentTo}
              </strong>
              . Since this is a frontend-only portfolio demo, no external email was sent.
            </p>

            <div className="pt-2 space-y-2.5">
              <Link to="/login" className="block">
                <Button variant="primary" size="lg" className="w-full">
                  Back to Sign In
                </Button>
              </Link>
              <button
                type="button"
                onClick={() => {
                  setSentTo('');
                  setEmail('');
                  setError('');
                }}
                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
              >
                Try another email address
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto">
                <KeyRound className="w-6 h-6" />
              </div>
              <h1 className="text-2xl font-black text-slate-900 dark:text-white">
                Forgot Password?
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Enter your registered email address to request a password reset link.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div>
                <Input
                  label="Email Address"
                  name="email"
                  type="email"
                  maxLength={MAX_EMAIL}
                  value={email}
                  onChange={(e) => handleChange(e.target.value)}
                  onBlur={handleBlur}
                  error={error}
                  placeholder="Enter your E-Mail Address"
                />
                <div className="mt-1 flex justify-end">
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    {email.length} / {MAX_EMAIL}
                  </span>
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full shadow-md shadow-indigo-600/20 hover:shadow-lg"
              >
                <Send className="w-4 h-4" />
                Send Reset Link
              </Button>
            </form>

            <div className="text-center pt-1">
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back to Sign In
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}