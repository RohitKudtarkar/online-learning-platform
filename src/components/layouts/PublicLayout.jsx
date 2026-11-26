import { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  GraduationCap,
  Menu,
  X,
  ArrowRight,
  Sparkles,
  Sun,
  Moon,
  ShieldCheck,
  Compass,
  Layers,
  Award,
} from 'lucide-react';
import Button from '../common/Button';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useTheme } from '../../context/ThemeContext';

export default function PublicLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [clickedNav, setClickedNav] = useState('');
  const { loginAsDemo } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const toast = useToast();
  const navigate = useNavigate();

  const navLinks = [
    { to: '/', label: 'Home', end: true },
    { to: '/courses', label: 'Explore Courses' },
    { to: '/how-it-works', label: 'How It Works' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
  ];

  const handleNavClick = (path) => {
    setClickedNav(path);
    setMobileMenuOpen(false);
  };

  const handleQuickDemo = (role) => {
    const account = loginAsDemo(role);
    toast.success(
      `Switched to ${role === 'admin' ? 'Instructor/Admin' : 'Student'} demo (${account.name})`
    );
    navigate(role === 'admin' ? '/admin' : '/student');
  };

  const getNavLinkStyle = (path, isActive) =>
    `px-2.5 xl:px-3.5 py-2 rounded-xl text-xs xl:text-sm font-semibold whitespace-nowrap shrink-0 transition-all duration-150 hover:-translate-y-0.5 ${
      isActive
        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
        : clickedNav === path
          ? 'bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300'
          : 'text-slate-600 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-white'
    }`;

  const getLoginLinkStyle = (isActive) =>
    `px-3 xl:px-3.5 py-2 rounded-xl text-xs xl:text-sm font-semibold whitespace-nowrap shrink-0 border transition-all duration-150 hover:-translate-y-0.5 hover:shadow-sm ${
      isActive
        ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-600/20'
        : 'bg-white dark:bg-slate-800/70 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-indigo-300 dark:hover:border-indigo-600 hover:bg-indigo-50/70 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-white'
    }`;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-x-hidden transition-colors duration-200">
      {/* Top Demo Switcher Bar */}
      <div className="bg-slate-900 text-slate-200 text-xs py-2 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1.5 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            Interactive Platform — Switch experiences anytime:
          </span>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => handleQuickDemo('student')}
              className="px-2.5 py-1 rounded-md bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 hover:shadow-md text-white font-semibold whitespace-nowrap transition-all duration-150 hover:-translate-y-0.5 cursor-pointer"
            >
              Student Portal
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('admin')}
              className="px-2.5 py-1 rounded-md bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 hover:shadow-md text-white font-semibold whitespace-nowrap transition-all duration-150 hover:-translate-y-0.5 cursor-pointer"
            >
              Instructor Studio
            </button>
          </div>
        </div>
      </div>

      {/* Main Sticky Navbar */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xs border-b border-slate-200 dark:border-slate-800 shadow-2xs transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2 xl:gap-4">
          {/* Brand Logo & Title */}
          <Link
            to="/"
            onClick={() => handleNavClick('/')}
            className="group flex items-center gap-2.5 xl:gap-3 shrink-0 transition-transform duration-150 hover:-translate-y-0.5"
          >
            <span className="p-2 xl:p-2.5 rounded-2xl bg-gradient-to-br from-indigo-600 via-violet-600 to-indigo-700 text-white shadow-md shadow-indigo-600/25 group-hover:shadow-lg group-hover:shadow-indigo-600/35 transition-all shrink-0">
              <GraduationCap className="w-5 h-5" />
            </span>
            <div className="flex flex-col leading-none">
              <span className="text-sm sm:text-base xl:text-lg font-black tracking-tight whitespace-nowrap bg-gradient-to-r from-indigo-600 via-violet-600 to-emerald-600 dark:from-indigo-400 dark:via-violet-400 dark:to-emerald-400 bg-clip-text text-transparent">
                Online Learning Platform
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest whitespace-nowrap text-slate-400 dark:text-slate-500 mt-0.5">
                Learn • Build • Certify
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5 shrink-0">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                onClick={() => handleNavClick(link.to)}
                className={({ isActive }) => getNavLinkStyle(link.to, isActive)}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Desktop Theme & Auth Actions */}
          <div className="hidden lg:flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Toggle dark or light mode"
              className="p-2 xl:p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-amber-300 hover:bg-indigo-50 dark:hover:bg-slate-700 active:bg-indigo-100 hover:shadow-md hover:-translate-y-0.5 shrink-0 transition-all duration-150 cursor-pointer"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <NavLink
              to="/login"
              onClick={() => handleNavClick('/login')}
              className={({ isActive }) => getLoginLinkStyle(isActive)}
            >
              Log In
            </NavLink>

            <Link
              to="/signup"
              className="group/cta relative inline-flex items-center justify-center gap-1.5 px-3 xl:px-3.5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-700 hover:from-indigo-500 hover:via-violet-500 hover:to-indigo-600 text-white text-xs xl:text-sm font-bold whitespace-nowrap shadow-sm shadow-indigo-600/20 hover:shadow-md hover:shadow-indigo-600/30 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-150 shrink-0 overflow-hidden"
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-white/0 via-white/15 to-white/25 opacity-80 group-hover/cta:opacity-100 transition-opacity"
              />
              <Sparkles className="relative w-3.5 h-3.5 text-indigo-100 shrink-0" />
              <span className="relative">Get Started</span>
              <ArrowRight className="relative w-3.5 h-3.5 text-white/90 group-hover/cta:translate-x-0.5 transition-transform duration-150 shrink-0" />
            </Link>
          </div>

          {/* Mobile / Tablet Theme + Hamburger */}
          <div className="flex lg:hidden items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Toggle dark or light mode"
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-amber-300 cursor-pointer"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="p-2 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 active:bg-slate-200 cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 pt-3 pb-5 space-y-3">
            <div className="flex flex-col space-y-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.end}
                  onClick={() => handleNavClick(link.to)}
                  className={({ isActive }) =>
                    `px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                      isActive
                        ? 'bg-indigo-600 text-white'
                        : 'text-slate-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-slate-800 active:bg-indigo-100'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </div>
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2">
              <NavLink
                to="/login"
                onClick={() => handleNavClick('/login')}
                className={({ isActive }) =>
                  `px-3.5 py-2.5 rounded-xl text-sm font-semibold text-center transition-colors ${
                    isActive
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-slate-800 active:bg-indigo-100 border border-slate-200 dark:border-slate-700'
                  }`
                }
              >
                Log In
              </NavLink>
              <Link to="/signup" onClick={() => handleNavClick('/signup')}>
                <Button variant="primary" className="w-full">
                  Get Started Free
                </Button>
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="relative overflow-hidden bg-white dark:bg-slate-900 border-t border-slate-200/90 dark:border-slate-800 mt-16 transition-colors duration-200">
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-500 opacity-90"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-24 left-1/2 -translate-x-1/2 w-[54rem] h-[16rem] rounded-full bg-gradient-to-tr from-indigo-500/10 via-violet-500/10 to-indigo-400/10 blur-3xl"
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 items-start">
            {/* Brand Column */}
            <div className="lg:col-span-4 space-y-4">
              <Link
                to="/"
                className="group inline-flex items-center gap-3 transition-transform duration-150 hover:-translate-y-0.5"
              >
                <span className="p-2.5 rounded-2xl bg-gradient-to-br from-indigo-600 via-violet-600 to-indigo-700 text-white shadow-md shadow-indigo-600/25 group-hover:shadow-lg transition-all">
                  <GraduationCap className="w-5 h-5" />
                </span>
                <div className="flex flex-col leading-none">
                  <span className="text-base sm:text-lg font-black tracking-tight bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-700 dark:from-indigo-400 dark:via-violet-400 dark:to-indigo-300 bg-clip-text text-transparent">
                    Online Learning Platform
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mt-1">
                    Learn • Build • Certify
                  </span>
                </div>
              </Link>

              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-sm">
                Project-driven online learning platform built for modern developers, designers, and builders.
              </p>

              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200/70 dark:border-indigo-800/70 text-[11px] font-bold text-indigo-700 dark:text-indigo-300">
                  <Layers className="w-3.5 h-3.5" />
                  <span>Structured Tracks</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-50 dark:bg-violet-950/70 border border-violet-200/70 dark:border-violet-800/70 text-[11px] font-bold text-violet-700 dark:text-violet-300">
                  <Award className="w-3.5 h-3.5" />
                  <span>Verified Certificates</span>
                </span>
              </div>
            </div>

            {/* Platform Links */}
            <div className="lg:col-span-2 space-y-3.5">
              <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <span className="w-1.5 h-4 rounded-full bg-gradient-to-b from-indigo-600 to-violet-600" />
                <span>Platform</span>
              </h4>
              <ul className="space-y-2.5 text-sm text-slate-600 dark:text-slate-400">
                <li>
                  <Link
                    to="/courses"
                    className="group/link inline-flex items-center gap-1.5 font-medium hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400/70 group-hover/link:bg-indigo-600 dark:group-hover/link:bg-indigo-400 transition-colors" />
                    <span className="group-hover/link:translate-x-0.5 transition-transform duration-150">
                      Explore Courses
                    </span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/how-it-works"
                    className="group/link inline-flex items-center gap-1.5 font-medium hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400/70 group-hover/link:bg-indigo-600 dark:group-hover/link:bg-indigo-400 transition-colors" />
                    <span className="group-hover/link:translate-x-0.5 transition-transform duration-150">
                      How It Works
                    </span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/about"
                    className="group/link inline-flex items-center gap-1.5 font-medium hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400/70 group-hover/link:bg-indigo-600 dark:group-hover/link:bg-indigo-400 transition-colors" />
                    <span className="group-hover/link:translate-x-0.5 transition-transform duration-150">
                      Our Mission
                    </span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contact"
                    className="group/link inline-flex items-center gap-1.5 font-medium hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400/70 group-hover/link:bg-indigo-600 dark:group-hover/link:bg-indigo-400 transition-colors" />
                    <span className="group-hover/link:translate-x-0.5 transition-transform duration-150">
                      Contact & Support
                    </span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Portals Links */}
            <div className="lg:col-span-2 space-y-3.5">
              <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <span className="w-1.5 h-4 rounded-full bg-gradient-to-b from-violet-600 to-indigo-600" />
                <span>Portals</span>
              </h4>
              <ul className="space-y-2.5 text-sm text-slate-600 dark:text-slate-400">
                <li>
                  <Link
                    to="/login"
                    className="group/link inline-flex items-center gap-1.5 font-medium hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-violet-400/70 group-hover/link:bg-indigo-600 dark:group-hover/link:bg-indigo-400 transition-colors" />
                    <span className="group-hover/link:translate-x-0.5 transition-transform duration-150">
                      Student Sign In
                    </span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/signup"
                    className="group/link inline-flex items-center gap-1.5 font-medium hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-violet-400/70 group-hover/link:bg-indigo-600 dark:group-hover/link:bg-indigo-400 transition-colors" />
                    <span className="group-hover/link:translate-x-0.5 transition-transform duration-150">
                      Create Free Account
                    </span>
                  </Link>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => handleQuickDemo('admin')}
                    className="group/link inline-flex items-center gap-1.5 font-medium hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer text-left"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-violet-400/70 group-hover/link:bg-indigo-600 dark:group-hover/link:bg-indigo-400 transition-colors" />
                    <span className="group-hover/link:translate-x-0.5 transition-transform duration-150">
                      Instructor Studio Demo
                    </span>
                  </button>
                </li>
              </ul>
            </div>

            {/* Learning Guarantee Card */}
            <div className="lg:col-span-4">
              <div className="group/guar relative overflow-hidden rounded-2xl bg-slate-50/90 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 p-5 shadow-2xs hover:-translate-y-1 hover:shadow-xl hover:bg-white dark:hover:bg-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all duration-200 space-y-2.5">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-indigo-100/90 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 group-hover/guar:bg-indigo-600 group-hover/guar:text-white transition-colors flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
                    Learning Guarantee
                  </h4>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  Every course includes hands-on projects, interactive quizzes, downloadable resources, and verified completion certificates.
                </p>
                <Link
                  to="/courses"
                  className="inline-flex items-center gap-1.5 text-xs font-extrabold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 pt-0.5"
                >
                  <Compass className="w-3.5 h-3.5" />
                  <span>Browse All Tracks</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover/guar:translate-x-0.5 transition-transform duration-150" />
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-10 pt-6 border-t border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
            <p>© {new Date().getFullYear()} Online Learning Platform. All rights reserved.</p>
            <div className="flex items-center gap-5">
              <Link
                to="/about"
                className="font-medium hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                to="/about"
                className="font-medium hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}