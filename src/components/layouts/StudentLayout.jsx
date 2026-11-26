import { useState, useEffect, useMemo } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  GraduationCap,
  LayoutDashboard,
  BookOpen,
  BarChart3,
  FileCheck2,
  HelpCircle,
  Award,
  Heart,
  Bell,
  Settings,
  LogOut,
  Menu,
  X,
  Globe,
  ShieldCheck,
  Sun,
  Moon,
  Mail,
  Sparkles,
  Layers,
} from 'lucide-react';
import Button from '../common/Button';
import { useAuth } from '../../context/AuthContext';
import { usePlatform } from '../../context/PlatformContext';
import { useToast } from '../../context/ToastContext';
import { useTheme } from '../../context/ThemeContext';

function getFirstAndLastInitials(name) {
  const cleaned = (name || 'Learner').trim().replace(/\s+/g, ' ');
  if (!cleaned) return 'L';
  const parts = cleaned.split(' ');
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }
  return `${parts[0].charAt(0).toUpperCase()}${parts[parts.length - 1]
    .charAt(0)
    .toUpperCase()}`;
}

export default function StudentLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const auth = useAuth();
  const { user, logout, loginAsDemo } = auth || {};

  const platform = usePlatform();
  const {
    notifications = [],
    enrolledIds = [],
    completedLessons = {},
    certificates = [],
  } = platform || {};

  const { isDark, toggleTheme } = useTheme();
  const toast = useToast();
  const navigate = useNavigate();

  const profileData = useMemo(() => {
    const identifier = user?.id || user?.email || 'default';
    let saved = {};
    try {
      const raw = localStorage.getItem(`olp_profile_prefs_${identifier}`);
      if (raw) saved = JSON.parse(raw);
    } catch {
      saved = {};
    }
    return {
      name: saved.name || user?.name || 'Demo Learner',
      goal: saved.goal || user?.goal || '',
      bio: saved.bio || user?.bio || '',
    };
  }, [user, isProfileModalOpen]);

  const unreadNotificationsCount = (notifications || []).filter(
    (n) => !n.read
  ).length;

  const formattedUnreadBadge =
    unreadNotificationsCount > 99 ? '99+' : unreadNotificationsCount;

  const totalCompletedLessons = Object.values(completedLessons || {}).reduce(
    (sum, list) => sum + (Array.isArray(list) ? list.length : 0),
    0
  );

  useEffect(() => {
    if (!isProfileModalOpen) return;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setIsProfileModalOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isProfileModalOpen]);

  const navItems = [
    { to: '/student', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { to: '/student/my-learning', label: 'My Learning', icon: BookOpen },
    { to: '/student/progress', label: 'Progress', icon: BarChart3 },
    { to: '/student/assignments', label: 'Assignments', icon: FileCheck2 },
    { to: '/student/quizzes', label: 'Quizzes', icon: HelpCircle },
    { to: '/student/certificates', label: 'Certificates', icon: Award },
    { to: '/student/wishlist', label: 'Wishlist', icon: Heart },
    {
      to: '/student/notifications',
      label: 'Notifications',
      icon: Bell,
      badge: unreadNotificationsCount,
    },
    { to: '/student/profile', label: 'Profile Settings', icon: Settings },
  ];

  const handleLogout = () => {
    if (typeof logout === 'function') logout();
    toast.info('Signed out of Student Portal.');
    navigate('/');
  };

  const handleSwitchAdmin = () => {
    if (typeof loginAsDemo === 'function') loginAsDemo('admin');
    toast.success('Switched to Instructor Studio.');
    navigate('/admin');
  };

  const renderNavLinks = () => (
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
              `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-white'
              }`
            }
          >
            <span className="flex items-center gap-3">
              <Icon className="w-4 h-4 shrink-0" />
              {item.label}
            </span>
            {item.badge > 0 && (
              <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-rose-500 text-white">
                {item.badge}
              </span>
            )}
          </NavLink>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-x-hidden transition-colors duration-200">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-colors duration-200">
        <div className="h-16 px-5 flex items-center gap-2.5 border-b border-slate-100 dark:border-slate-800">
          <Link
            to="/"
            className="flex items-center gap-2.5 font-extrabold text-base"
          >
            <span className="p-2 rounded-xl bg-indigo-600 text-white shadow-sm">
              <GraduationCap className="w-4 h-4" />
            </span>
            <span className="bg-gradient-to-r from-indigo-600 to-emerald-600 dark:from-indigo-400 dark:to-emerald-400 bg-clip-text text-transparent">
              Online Learning Platform
            </span>
          </Link>
        </div>

        {renderNavLinks()}

        <div className="p-3 border-t border-slate-100 dark:border-slate-800 space-y-1.5">
          <Link
            to="/courses"
            className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <Globe className="w-4 h-4" />
            Browse Public Catalog
          </Link>
          <button
            type="button"
            onClick={handleSwitchAdmin}
            className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4" />
            Switch to Instructor
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

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/50"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="relative w-72 max-w-[85vw] bg-white dark:bg-slate-900 h-full flex flex-col z-10 shadow-xl">
            <div className="h-16 px-5 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
              <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                Student Portal
              </span>
              <button
                type="button"
                onClick={() => setSidebarOpen(false)}
                className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {renderNavLinks()}
            <div className="p-3 border-t border-slate-100 dark:border-slate-800 space-y-1">
              <button
                type="button"
                onClick={() => {
                  setSidebarOpen(false);
                  handleSwitchAdmin();
                }}
                className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4" />
                Switch to Instructor
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

      {/* Main Portal Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 h-16 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xs border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4 transition-colors duration-200">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              aria-label="Open student menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-600 via-violet-600 to-emerald-500 text-white flex items-center justify-center shadow-sm shadow-indigo-600/20 shrink-0">
                <GraduationCap className="w-4 h-4" />
              </div>
              <span className="text-sm sm:text-base font-black tracking-tight text-slate-900 dark:text-white truncate">
                Student{' '}
                <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-emerald-600 dark:from-indigo-400 dark:via-violet-400 dark:to-emerald-400 bg-clip-text text-transparent">
                  Learning Portal
                </span>
              </span>
            </div>
          </div>

          {/* Right Navbar Controls */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Toggle dark or light mode"
              className="w-10 h-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-amber-300 hover:bg-indigo-50 dark:hover:bg-slate-700 hover:-translate-y-0.5 hover:shadow-sm flex items-center justify-center transition-all cursor-pointer shrink-0"
            >
              {isDark ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </button>

            {/* Attractive Notification Bell Link with Numeric Badge */}
            <Link
              to="/student/notifications"
              aria-label={
                unreadNotificationsCount > 0
                  ? `Notifications (${unreadNotificationsCount} unread)`
                  : 'Notifications'
              }
              className="group/bell relative w-10 h-10 rounded-xl bg-slate-100/90 dark:bg-slate-800/90 hover:bg-indigo-50 dark:hover:bg-indigo-950/70 border border-slate-200/80 dark:border-slate-700/80 hover:border-indigo-300 dark:hover:border-indigo-700 text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center justify-center shadow-2xs hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 shrink-0"
            >
              <Bell className="w-4 h-4 group-hover/bell:scale-105 transition-transform duration-200" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-5 h-5 px-1 rounded-full bg-gradient-to-r from-rose-500 to-red-600 text-white text-[11px] font-black flex items-center justify-center shadow-md shadow-rose-600/30 ring-2 ring-white dark:ring-slate-900">
                  {formattedUnreadBadge}
                </span>
              )}
            </Link>

            {/* Profile Pill Button (Opens Profile Popup Modal) */}
            <button
              type="button"
              onClick={() => setIsProfileModalOpen(true)}
              aria-haspopup="dialog"
              aria-expanded={isProfileModalOpen}
              className="group/prof inline-flex items-center gap-2.5 pl-1.5 pr-3.5 py-1.5 rounded-full bg-slate-100/90 dark:bg-slate-800/90 hover:bg-white dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 hover:border-indigo-300 dark:hover:border-indigo-700 shadow-2xs hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 cursor-pointer shrink-0"
            >
              <span className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-600 via-violet-600 to-emerald-500 text-white text-xs font-black flex items-center justify-center shadow-2xs shrink-0">
                {getFirstAndLastInitials(profileData.name)}
              </span>
              <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 group-hover/prof:text-indigo-600 dark:group-hover/prof:text-indigo-400 transition-colors whitespace-nowrap">
                {profileData.name}
              </span>
            </button>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>

      {/* Profile Popup Modal */}
      {isProfileModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs"
          onClick={() => setIsProfileModalOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="navbar-profile-modal-title"
        >
          <div
            className="relative overflow-hidden w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-7 space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              aria-hidden="true"
              className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-indigo-600 via-violet-600 to-emerald-500"
            />

            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-600 via-violet-600 to-emerald-500 text-white font-black text-lg flex items-center justify-center shadow-md shrink-0">
                  {getFirstAndLastInitials(profileData.name)}
                </div>
                <div className="space-y-1 min-w-0">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 text-[11px] font-bold">
                    <Sparkles className="w-3 h-3" />
                    <span>Student Profile</span>
                  </div>
                  <h2
                    id="navbar-profile-modal-title"
                    className="text-lg sm:text-xl font-black text-slate-900 dark:text-white truncate"
                  >
                    {profileData.name}
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 truncate">
                    <Mail className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                    <span className="truncate">
                      {user?.email || 'student@portal.edu'}
                    </span>
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsProfileModalOpen(false)}
                aria-label="Close profile modal"
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* 3 Elevated Quick Stat Cards */}
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="group/stat relative overflow-hidden p-3.5 rounded-2xl bg-slate-50/90 dark:bg-slate-800/70 border border-slate-200/90 dark:border-slate-700/80 shadow-xs hover:-translate-y-1.5 hover:shadow-xl hover:border-indigo-300 dark:hover:border-indigo-600 transition-all duration-200">
                <div
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-indigo-600 to-violet-600"
                />
                <div className="w-7 h-7 rounded-xl bg-indigo-100/90 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 group-hover/stat:bg-indigo-600 group-hover/stat:text-white transition-colors flex items-center justify-center mx-auto mb-1.5">
                  <BookOpen className="w-3.5 h-3.5" />
                </div>
                <p className="text-xl font-black text-slate-900 dark:text-white leading-none">
                  {enrolledIds.length}
                </p>
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-1.5">
                  Courses
                </p>
              </div>

              <div className="group/stat relative overflow-hidden p-3.5 rounded-2xl bg-slate-50/90 dark:bg-slate-800/70 border border-slate-200/90 dark:border-slate-700/80 shadow-xs hover:-translate-y-1.5 hover:shadow-xl hover:border-emerald-300 dark:hover:border-emerald-600 transition-all duration-200">
                <div
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-emerald-500 to-teal-500"
                />
                <div className="w-7 h-7 rounded-xl bg-emerald-100/90 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 group-hover/stat:bg-emerald-600 group-hover/stat:text-white transition-colors flex items-center justify-center mx-auto mb-1.5">
                  <Layers className="w-3.5 h-3.5" />
                </div>
                <p className="text-xl font-black text-slate-900 dark:text-white leading-none">
                  {totalCompletedLessons}
                </p>
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-1.5">
                  Lessons
                </p>
              </div>

              <div className="group/stat relative overflow-hidden p-3.5 rounded-2xl bg-slate-50/90 dark:bg-slate-800/70 border border-slate-200/90 dark:border-slate-700/80 shadow-xs hover:-translate-y-1.5 hover:shadow-xl hover:border-amber-300 dark:hover:border-amber-600 transition-all duration-200">
                <div
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-amber-500 to-orange-500"
                />
                <div className="w-7 h-7 rounded-xl bg-amber-100/90 dark:bg-amber-950 text-amber-600 dark:text-amber-400 group-hover/stat:bg-amber-500 group-hover/stat:text-white transition-colors flex items-center justify-center mx-auto mb-1.5">
                  <Award className="w-3.5 h-3.5" />
                </div>
                <p className="text-xl font-black text-slate-900 dark:text-white leading-none">
                  {certificates.length}
                </p>
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-1.5">
                  Certificates
                </p>
              </div>
            </div>

            {(profileData.goal || profileData.bio) && (
              <div className="p-3.5 rounded-2xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-800 space-y-1 text-xs">
                {profileData.goal && (
                  <p className="font-bold text-slate-800 dark:text-slate-200">
                    Goal:{' '}
                    <span className="font-medium text-slate-600 dark:text-slate-300">
                      {profileData.goal}
                    </span>
                  </p>
                )}
                {profileData.bio && (
                  <p className="text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                    {profileData.bio}
                  </p>
                )}
              </div>
            )}

            {/* Modal Actions */}
            <div className="flex flex-wrap items-center justify-end gap-3 pt-1">
              <Button
                type="button"
                variant="outline"
                size="md"
                onClick={() => {
                  if (typeof logout === 'function') logout();
                  setIsProfileModalOpen(false);
                  navigate('/login');
                }}
                className="text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-900/70 hover:bg-rose-50 dark:hover:bg-rose-950/40"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </Button>

              <Button
                type="button"
                variant="primary"
                size="md"
                onClick={() => {
                  setIsProfileModalOpen(false);
                  navigate('/student/profile');
                }}
              >
                <Settings className="w-4 h-4" />
                Open Full Profile
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}