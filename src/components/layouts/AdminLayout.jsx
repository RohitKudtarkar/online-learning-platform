import { useState, useEffect } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  GraduationCap,
  BarChart2,
  BookMarked,
  PlusCircle,
  Users,
  LogOut,
  Menu,
  X,
  Globe,
  LayoutDashboard,
  Sun,
  Moon,
  Mail,
  ShieldCheck,
} from 'lucide-react';
import Button from '../common/Button';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useTheme } from '../../context/ThemeContext';

function getFirstAndLastInitials(name) {
  const cleaned = (name || 'Demo Instructor').trim().replace(/\s+/g, ' ');
  if (!cleaned) return 'DI';
  const parts = cleaned.split(' ');
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  const firstInitial = parts[0].charAt(0).toUpperCase();
  const lastInitial = parts[parts.length - 1].charAt(0).toUpperCase();
  return `${firstInitial}${lastInitial}`;
}

function InstructorProfilePopup({ open, onClose, user, onSignOut }) {
  useEffect(() => {
    if (!open) return;
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [open, onClose]);

  if (!open) return null;

  const displayName = (user?.name || 'Demo Instructor')
    .trim()
    .replace(/\s+/g, ' ');
  const initials = getFirstAndLastInitials(displayName);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="instructor-profile-popup-title"
    >
      <div
        className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-7 sm:p-8 shadow-2xl text-center space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-14 h-14 rounded-2xl bg-emerald-100/90 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 font-black text-lg flex items-center justify-center mx-auto">
          {initials}
        </div>

        <div className="space-y-1.5">
          <h3
            id="instructor-profile-popup-title"
            className="text-xl font-black text-slate-900 dark:text-white"
          >
            {displayName}
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1.5">
            <Mail className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            <span>{user?.email || 'instructor@portal.edu'}</span>
          </p>
          <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 inline-flex items-center justify-center gap-1 pt-0.5">
            <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
            <span>Instructor & Admin Studio</span>
          </p>
        </div>

        <div className="space-y-2.5 pt-1">
          <Link to="/admin" onClick={onClose} className="block">
            <Button
              type="button"
              variant="outline"
              size="md"
              className="w-full justify-center border-emerald-200 dark:border-emerald-800/80 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/60"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Studio Overview</span>
            </Button>
          </Link>

          <Link to="/admin/courses/new" onClick={onClose} className="block">
            <Button
              type="button"
              variant="primary"
              size="md"
              className="w-full justify-center bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:via-teal-500 hover:to-emerald-600 text-white font-bold shadow-md shadow-emerald-600/25"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create Course</span>
            </Button>
          </Link>

          {typeof onSignOut === 'function' && (
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={() => {
                onClose();
                onSignOut();
              }}
              className="w-full justify-center text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-900/70 hover:bg-rose-50 dark:hover:bg-rose-950/40"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </Button>
          )}
        </div>

        <div className="pt-1 flex justify-center">
          <Button
            type="button"
            variant="primary"
            size="md"
            onClick={onClose}
            className="min-w-[116px] justify-center bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:via-teal-500 hover:to-emerald-600 text-white font-bold shadow-md shadow-emerald-600/25"
          >
            OK
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profilePopupOpen, setProfilePopupOpen] = useState(false);
  const { user, logout, loginAsDemo } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const toast = useToast();
  const navigate = useNavigate();

  const displayName = (user?.name || 'Demo Instructor')
    .trim()
    .replace(/\s+/g, ' ');
  const initials = getFirstAndLastInitials(displayName);

  const navItems = [
    { to: '/admin', label: 'Studio Overview', icon: BarChart2, end: true },
    { to: '/admin/courses', label: 'Manage Courses', icon: BookMarked, end: true },
    { to: '/admin/courses/new', label: 'Create Course', icon: PlusCircle },
    { to: '/admin/students', label: 'Enrolled Students', icon: Users },
  ];

  const handleLogout = () => {
    logout();
    toast.info('Signed out of Instructor Studio.');
    navigate('/');
  };

  const handleSwitchStudent = () => {
    loginAsDemo('student');
    toast.success('Switched to Student Portal.');
    navigate('/student');
  };

  const renderNav = () => (
    <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 ${isActive
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-slate-800 hover:text-emerald-700 dark:hover:text-white'
              }`
            }
          >
            <Icon className="w-4 h-4 shrink-0" />
            {item.label}
          </NavLink>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-x-hidden transition-colors duration-200">
      <InstructorProfilePopup
        open={profilePopupOpen}
        onClose={() => setProfilePopupOpen(false)}
        user={user}
        onSignOut={handleLogout}
      />

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-colors duration-200">
        <div className="h-16 px-5 flex items-center gap-2.5 border-b border-slate-100 dark:border-slate-800">
          <Link to="/" className="flex items-center gap-2.5 font-extrabold text-base">
            <span className="p-2 rounded-xl bg-emerald-600 text-white shadow-sm">
              <GraduationCap className="w-4 h-4" />
            </span>
            <span className="font-black text-base leading-tight bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 dark:from-emerald-400 dark:via-teal-400 dark:to-emerald-300 bg-clip-text text-transparent">
              Online Learning Platform
            </span>
          </Link>
        </div>

        {renderNav()}

        <div className="p-3 border-t border-slate-100 dark:border-slate-800 space-y-1.5">
          <Link
            to="/courses"
            className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <Globe className="w-4 h-4" />
            View Public Site
          </Link>
          <button
            type="button"
            onClick={handleSwitchStudent}
            className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-indigo-700 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 cursor-pointer"
          >
            <LayoutDashboard className="w-4 h-4" />
            Switch to Student
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/60 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile Drawer */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/50"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="relative w-72 max-w-[85vw] bg-white dark:bg-slate-900 h-full flex flex-col z-10 shadow-xl">
            <div className="h-16 px-5 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
              <span className="font-extrabold text-sm bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 dark:from-emerald-400 dark:via-teal-400 dark:to-emerald-300 bg-clip-text text-transparent">
                Instructor Studio
              </span>
              <button
                type="button"
                onClick={() => setSidebarOpen(false)}
                aria-label="Close studio navigation"
                className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {renderNav()}
            <div className="p-3 border-t border-slate-100 dark:border-slate-800 space-y-1">
              <button
                type="button"
                onClick={() => {
                  setSidebarOpen(false);
                  handleSwitchStudent();
                }}
                className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-indigo-700 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 cursor-pointer"
              >
                <LayoutDashboard className="w-4 h-4" />
                Switch to Student
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/60 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 h-16 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xs border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4 transition-colors duration-200">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open studio navigation"
              className="inline-flex lg:hidden items-center justify-center p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>

            <span className="w-9 h-9 rounded-2xl bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-500 text-white shadow-sm flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </span>
            <span className="text-sm sm:text-base font-black tracking-tight text-slate-900 dark:text-white">
              Instructor{' '}
              <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 dark:from-emerald-400 dark:via-teal-400 dark:to-emerald-300 bg-clip-text text-transparent">
                & Admin Studio
              </span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Toggle dark or light mode"
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-amber-300 hover:bg-emerald-50 dark:hover:bg-slate-700 hover:-translate-y-0.5 hover:shadow-sm transition-all cursor-pointer"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <button
              type="button"
              onClick={() => setProfilePopupOpen(true)}
              aria-label={`Open profile details for ${displayName}`}
              className="flex items-center gap-2.5 pl-1.5 pr-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800 hover:border-emerald-400 dark:hover:border-emerald-600 hover:shadow-sm transition-all cursor-pointer"
            >
              <span className="w-7 h-7 rounded-full bg-emerald-600 text-white text-xs font-extrabold flex items-center justify-center shrink-0">
                {initials}
              </span>
              <span className="text-xs font-semibold text-emerald-900 dark:text-emerald-200 hidden sm:inline">
                {displayName}
              </span>
            </button>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
