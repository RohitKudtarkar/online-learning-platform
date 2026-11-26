import { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  HelpCircle,
  Send,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ChevronDown,
  Check,
  ShieldCheck,
  BookOpen,
} from 'lucide-react';
import Badge from '../../components/common/Badge';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

const MAX_NAME = 50;
const MAX_EMAIL = 100;
const MAX_MESSAGE = 1000;

const SUPPORT_CARDS = [
  {
    icon: BookOpen,
    title: 'Course & Lesson Support',
    detail: 'Structured modules, video lessons & notes',
    sub: 'Guidance on navigating course content, saved notes, and progress tracking',
    badge: 'Learning',
    iconStyle:
      'bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 group-hover/card:bg-indigo-600 group-hover/card:text-white',
  },
  {
    icon: MessageSquare,
    title: 'Instructor Studio',
    detail: 'Course authoring & curriculum workflows',
    sub: 'Questions about creating courses, modules, assignments, and categories',
    badge: 'Studio',
    iconStyle:
      'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 group-hover/card:bg-emerald-600 group-hover/card:text-white',
  },
  {
    icon: HelpCircle,
    title: 'Quizzes & Certificates',
    detail: 'Assessments, assignments & credentials',
    sub: 'Help with quiz attempts, passing thresholds, and printable certificates',
    badge: 'Credentials',
    iconStyle:
      'bg-violet-50 dark:bg-violet-950/80 text-violet-600 dark:text-violet-400 group-hover/card:bg-violet-600 group-hover/card:text-white',
  },
];

const TOPIC_OPTIONS = [
  {
    value: 'Course Support',
    label: 'Course Support',
    desc: 'Lessons, video playback, or assignments',
    icon: BookOpen,
  },
  {
    value: 'Certificate Verification',
    label: 'Certificate Verification',
    desc: 'Quiz scores, credentials, or PDF export',
    icon: ShieldCheck,
  },
  {
    value: 'Become an Instructor',
    label: 'Become an Instructor',
    desc: 'Publish structured courses & modules',
    icon: MessageSquare,
  },
  {
    value: 'General Question',
    label: 'General Question',
    desc: 'Platform features, accounts, or feedback',
    icon: HelpCircle,
  },
];

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
  return '';
}

function validateSubject(val) {
  if (!val || !val.trim()) {
    return 'Please choose a subject.';
  }
  return '';
}

function validateMessageText(val) {
  const trimmed = val.trim();
  if (!trimmed) return 'Please enter your message.';
  if (trimmed.length < 10) return 'Message must be at least 10 characters.';
  if (val.length > MAX_MESSAGE) {
    return `Message cannot exceed ${MAX_MESSAGE} characters.`;
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
      aria-labelledby="popup-modal-title"
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
          id="popup-modal-title"
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

function SubjectDropdown({ value, onChange, error, onBlur }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const selected = TOPIC_OPTIONS.find((opt) => opt.value === value);
  const SelectedIcon = selected ? selected.icon : BookOpen;

  useEffect(() => {
    const handleOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    const handleEsc = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', handleOutside);
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('mousedown', handleOutside);
      document.removeEventListener('keydown', handleEsc);
    };
  }, []);

  return (
    <div ref={ref} className="relative">
      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
        Subject
      </label>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        onBlur={onBlur}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`w-full flex items-center justify-between gap-3 px-3.5 py-2.5 text-sm font-semibold rounded-xl border transition-all duration-150 cursor-pointer ${
          error
            ? 'bg-slate-50 dark:bg-slate-800 border-rose-500 ring-2 ring-rose-500/20 text-slate-900 dark:text-white'
            : open
            ? 'bg-white dark:bg-slate-800 border-indigo-500 ring-2 ring-indigo-500/20 shadow-md text-slate-900 dark:text-white'
            : 'bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-100 hover:-translate-y-0.5 hover:shadow-md hover:border-indigo-400 dark:hover:border-indigo-500'
        }`}
      >
        <span className="flex items-center gap-2.5 min-w-0">
          {selected ? (
            <>
              <SelectedIcon className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
              <span className="truncate">{selected.label}</span>
            </>
          ) : (
            <span className="truncate text-slate-400 dark:text-slate-500 font-normal">
              Choose a subject...
            </span>
          )}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
            open ? 'rotate-180 text-indigo-600 dark:text-indigo-400' : ''
          }`}
        />
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute left-0 right-0 mt-2 z-30 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xl p-1.5 space-y-1"
        >
          {TOPIC_OPTIONS.map((opt) => {
            const ItemIcon = opt.icon;
            const isSelected = opt.value === value;
            return (
              <button
                key={opt.value}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-150 cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-slate-800 hover:translate-x-0.5'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      isSelected
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400'
                    }`}
                  >
                    <ItemIcon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-bold truncate">
                      {opt.label}
                    </p>
                    <p
                      className={`text-[11px] truncate ${
                        isSelected
                          ? 'text-indigo-100'
                          : 'text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      {opt.desc}
                    </p>
                  </div>
                </div>
                {isSelected && <Check className="w-4 h-4 shrink-0 text-white" />}
              </button>
            );
          })}
        </div>
      )}

      {error && (
        <p className="mt-1.5 text-xs font-medium text-rose-600 dark:text-rose-400">
          {error}
        </p>
      )}
    </div>
  );
}

export default function Contact() {
  const [values, setValues] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [errors, setErrors] = useState({});
  const [popup, setPopup] = useState(null);

  const runFieldValidation = (field, nextValues = values) => {
    if (field === 'name') return validateFullName(nextValues.name);
    if (field === 'email') return validateEmailAddress(nextValues.email);
    if (field === 'subject') return validateSubject(nextValues.subject);
    if (field === 'message') return validateMessageText(nextValues.message);
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

  const handleSubmit = (e) => {
    e.preventDefault();
    const nextErrors = {
      name: validateFullName(values.name),
      email: validateEmailAddress(values.email),
      subject: validateSubject(values.subject),
      message: validateMessageText(values.message),
    };

    setErrors(nextErrors);

    const hasError = Object.values(nextErrors).some(Boolean);
    if (hasError) {
      setPopup({
        type: 'warning',
        title: 'Warning',
        message: 'Please correct the highlighted fields before submitting.',
      });
      return;
    }

    setPopup({
      type: 'success',
      title: 'Success',
      message: 'Demo submission successful. No message was sent.',
    });

    setValues({
      name: '',
      email: '',
      subject: '',
      message: '',
    });
    setErrors({});
  };

  return (
    <div className="relative overflow-hidden py-12 lg:py-20">
      <PopupAlertModal popup={popup} onClose={() => setPopup(null)} />

      {/* Subtle Ambient Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-28 left-1/2 -translate-x-1/2 w-[58rem] h-[24rem] rounded-full bg-gradient-to-tr from-indigo-500/15 via-violet-500/10 to-emerald-500/15 blur-3xl"
      />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Hero Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200/80 dark:border-indigo-800/80 text-indigo-700 dark:text-indigo-300 text-xs sm:text-sm font-bold shadow-2xs">
            <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>Interactive Feedback & Support</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
            Share Questions or{' '}
            <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-emerald-600 dark:from-indigo-400 dark:via-violet-400 dark:to-emerald-400 bg-clip-text text-transparent">
              Platform Feedback
            </span>
          </h1>

          <p className="text-sm sm:text-base lg:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            Explore how learners and instructors reach out for course support, curriculum questions, or certificate help inside the platform.
          </p>
        </div>

        {/* Main Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Support Topics Cards */}
          <div className="lg:col-span-5 space-y-4">
            {SUPPORT_CARDS.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="group/card relative overflow-hidden bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-5 sm:p-6 shadow-sm hover:-translate-y-1.5 hover:shadow-2xl hover:border-indigo-300 dark:hover:border-indigo-700 transition-all duration-200 flex items-start gap-4 cursor-default"
                >
                  <div
                    aria-hidden="true"
                    className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-indigo-600 via-violet-600 to-emerald-500 opacity-85"
                  />

                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-200 group-hover/card:scale-105 ${item.iconStyle}`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h2 className="font-extrabold text-slate-900 dark:text-white group-hover/card:text-indigo-600 dark:group-hover/card:text-indigo-400 transition-colors">
                        {item.title}
                      </h2>
                      <Badge tone="slate">{item.badge}</Badge>
                    </div>
                    <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400 mt-1">
                      {item.detail}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                      {item.sub}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Form Card with Validation & Live Character Counters */}
          <div className="lg:col-span-7 relative overflow-hidden bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 shadow-sm hover:-translate-y-1 hover:shadow-2xl hover:border-indigo-300 dark:hover:border-indigo-700 transition-all duration-200">
            <div
              aria-hidden="true"
              className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-indigo-600 via-violet-600 to-emerald-500 opacity-85"
            />

            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              <div className="space-y-1">
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                  Send a Demo Message
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  All fields are validated before submission.
                </p>
              </div>

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

              <SubjectDropdown
                value={values.subject}
                onChange={(nextSubject) =>
                  handleFieldChange('subject', nextSubject)
                }
                error={errors.subject}
                onBlur={() => handleBlur('subject')}
              />

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  rows={4}
                  maxLength={MAX_MESSAGE}
                  value={values.message}
                  onChange={(e) => handleFieldChange('message', e.target.value)}
                  onBlur={() => handleBlur('message')}
                  placeholder="Write your message here..."
                  className={`w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 hover:border-indigo-400 dark:hover:border-indigo-500 focus:outline-none focus:ring-2 transition-all ${
                    errors.message
                      ? 'border-rose-500 focus:ring-rose-500/20'
                      : 'border-slate-300 dark:border-slate-700 focus:border-indigo-600 focus:ring-indigo-600/20'
                  }`}
                />
                <div className="mt-1.5 flex items-start justify-between gap-2">
                  {errors.message ? (
                    <p className="text-xs font-medium text-rose-600 dark:text-rose-400">
                      {errors.message}
                    </p>
                  ) : (
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      Minimum 10 characters required
                    </span>
                  )}
                  <span
                    className={`text-xs font-semibold shrink-0 ${
                      values.message.length >= MAX_MESSAGE
                        ? 'text-rose-600 dark:text-rose-400'
                        : 'text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {values.message.length} / {MAX_MESSAGE}
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
                Send Message
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}