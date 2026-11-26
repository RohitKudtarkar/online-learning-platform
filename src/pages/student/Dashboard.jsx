import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  CheckCircle2,
  Award,
  FileText,
  Sparkles,
  ArrowRight,
  PlayCircle,
  Heart,
  Bell,
  Target,
  Clock,
  Layers,
  CheckCheck,
  Compass,
} from 'lucide-react';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';
import { usePlatform } from '../../context/PlatformContext';

const STUDENT_CATALOG_PATH = '/student/courses';

function EnrollNoticeModal({ notice, onClose }) {
  useEffect(() => {
    if (!notice) return;
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [notice, onClose]);

  if (!notice) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-7 sm:p-8 shadow-2xl text-center space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-14 h-14 rounded-2xl bg-indigo-100/90 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-7 h-7" />
        </div>

        <div className="space-y-2">
          <h3 className="text-xl font-black text-slate-900 dark:text-white">
            {notice.title}
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {notice.message}
          </p>
        </div>

        <div className="pt-1 flex justify-center">
          <Button
            type="button"
            variant="primary"
            size="md"
            onClick={onClose}
            className="min-w-[116px] justify-center shadow-md shadow-indigo-600/25"
          >
            OK
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function StudentDashboard() {
  const { user } = useAuth();
  const {
    courses = [],
    enrolledIds = [],
    completedLessons = {},
    notes = {},
    wishlistIds = [],
    quizResults = {},
    submissions = {},
    certificates = [],
    notifications = [],
    getCourseProgress,
    enrollCourse,
    markAllNotificationsRead,
  } = usePlatform();

  const [enrollNotice, setEnrollNotice] = useState(null);

  const enrolledCourses = courses.filter((c) => enrolledIds.includes(c.id));
  const wishlistCourses = courses.filter((c) => wishlistIds.includes(c.id));

  const totalCompletedLessons = Object.values(completedLessons).reduce(
    (sum, list) => sum + (Array.isArray(list) ? list.length : 0),
    0
  );

  const savedNotesCount = Object.values(notes).filter(
    (txt) => typeof txt === 'string' && txt.trim().length > 0
  ).length;

  const submissionsCount = Object.keys(submissions).length;
  const unreadCount = notifications.filter((n) => !n.read).length;

  const averageProgress =
    enrolledCourses.length > 0
      ? Math.round(
          enrolledCourses.reduce(
            (sum, c) => sum + (getCourseProgress ? getCourseProgress(c.id) : 0),
            0
          ) / enrolledCourses.length
        )
      : 0;

  const displayName = (user?.name || 'Learner').trim().replace(/\s+/g, ' ');

  const handleWishlistEnroll = (course) => {
    if (!course || typeof enrollCourse !== 'function') return;
    if (enrolledIds.includes(course.id)) return;
    enrollCourse(course.id);
    setEnrollNotice({
      title: 'Course Enrolled!',
      message: `${course.title} has been added to your active courses.`,
    });
  };

  const STAT_CARDS = [
    {
      label: 'Enrolled Courses',
      value: enrolledCourses.length,
      sub:
        enrolledCourses.length === 1
          ? '1 active course'
          : `${enrolledCourses.length} active courses`,
      icon: BookOpen,
      accent:
        'bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 group-hover/stat:bg-indigo-600 group-hover/stat:text-white',
    },
    {
      label: 'Lessons Completed',
      value: totalCompletedLessons,
      sub: `${averageProgress}% average completion`,
      icon: CheckCircle2,
      accent:
        'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 group-hover/stat:bg-emerald-600 group-hover/stat:text-white',
    },
    {
      label: 'Personal Notes & Tasks',
      value: savedNotesCount + submissionsCount,
      sub: `${savedNotesCount} notes · ${submissionsCount} submitted`,
      icon: FileText,
      accent:
        'bg-violet-50 dark:bg-violet-950/80 text-violet-600 dark:text-violet-400 group-hover/stat:bg-violet-600 group-hover/stat:text-white',
    },
    {
      label: 'Earned Certificates',
      value: certificates.length,
      sub:
        certificates.length > 0
          ? 'Verified & ready to view'
          : 'Pass quizzes (70%+) to unlock',
      icon: Award,
      accent:
        'bg-amber-50 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 group-hover/stat:bg-amber-500 group-hover/stat:text-white',
    },
  ];

  return (
    <div className="relative overflow-hidden py-8 lg:py-12">
      <EnrollNoticeModal
        notice={enrollNotice}
        onClose={() => setEnrollNotice(null)}
      />

      {/* Ambient Radial Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[62rem] h-[24rem] rounded-full bg-gradient-to-tr from-indigo-500/15 via-violet-500/10 to-emerald-500/15 blur-3xl"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Top Welcome Hero Card */}
        <div className="group/hero relative overflow-hidden bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 shadow-sm hover:-translate-y-1.5 hover:shadow-2xl hover:border-indigo-300 dark:hover:border-indigo-700 transition-all duration-200">
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-indigo-600 via-violet-600 to-emerald-500"
          />

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200/80 dark:border-indigo-800/80 text-indigo-700 dark:text-indigo-300 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>Personal Student Workspace</span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                Welcome back,{' '}
                <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-emerald-600 dark:from-indigo-400 dark:via-violet-400 dark:to-emerald-400 bg-clip-text text-transparent">
                  {displayName}
                </span>
              </h1>

              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                {user?.bio ||
                  'Track your active courses, review personal lesson notes, complete assignments, and earn verified certificates.'}
              </p>

              {user?.goal && (
                <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 text-xs sm:text-sm text-slate-700 dark:text-slate-200">
                  <Target className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>
                    <strong className="font-bold">Current Goal:</strong>{' '}
                    {user.goal}
                  </span>
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Link to={STUDENT_CATALOG_PATH}>
                <Button
                  variant="primary"
                  size="lg"
                  className="shadow-md shadow-indigo-600/20 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
                >
                  <Compass className="w-4 h-4" />
                  Explore Courses
                </Button>
              </Link>
              <Link to="/student/certificates">
                <Button
                  variant="outline"
                  size="lg"
                  className="hover:-translate-y-0.5 hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-700 transition-all duration-200"
                >
                  <Award className="w-4 h-4" />
                  My Certificates ({certificates.length})
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* 4 KPI Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {STAT_CARDS.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.label}
                className="group/stat relative overflow-hidden bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-5 sm:p-6 shadow-sm hover:-translate-y-1.5 hover:shadow-2xl hover:border-indigo-300 dark:hover:border-indigo-700 transition-all duration-200 cursor-default"
              >
                <div
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-indigo-600 via-violet-600 to-emerald-500 opacity-80"
                />

                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      {card.label}
                    </p>
                    <p className="text-3xl font-black text-slate-900 dark:text-white mt-2">
                      {card.value}
                    </p>
                  </div>
                  <div
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-200 group-hover/stat:scale-105 ${card.accent}`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 mt-3">
                  {card.sub}
                </p>
              </div>
            );
          })}
        </div>

        {/* Main Content Grid: Left Enrolled Courses + Right Personal Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left 8 Columns: My Enrolled Courses */}
          <div className="lg:col-span-8 space-y-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  My Active Courses
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                  Continue watching lessons and track your completion progress
                </p>
              </div>
              <Link
                to={STUDENT_CATALOG_PATH}
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:underline shrink-0"
              >
                <span>Browse Catalog</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {enrolledCourses.length === 0 ? (
              <div className="group/empty relative overflow-hidden bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-8 sm:p-10 text-center space-y-4 shadow-sm hover:-translate-y-1.5 hover:shadow-2xl hover:border-indigo-300 dark:hover:border-indigo-700 transition-all duration-200">
                <div
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-indigo-600 via-violet-600 to-emerald-500"
                />
                <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 group-hover/empty:bg-indigo-600 group-hover/empty:text-white group-hover/empty:scale-105 transition-all duration-200 flex items-center justify-center mx-auto">
                  <BookOpen className="w-7 h-7" />
                </div>
                <div className="space-y-1.5 max-w-md mx-auto">
                  <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white group-hover/empty:text-indigo-600 dark:group-hover/empty:text-indigo-400 transition-colors">
                    No Enrolled Courses Yet
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    Your workspace is clean and ready. Explore structured courses in frontend development, UI/UX design, and full-stack architecture to begin.
                  </p>
                </div>
                <div className="pt-1">
                  <Link to={STUDENT_CATALOG_PATH}>
                    <Button variant="primary" size="md">
                      <Compass className="w-4 h-4" />
                      Start Exploring Courses
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {enrolledCourses.map((course) => {
                  const progress = getCourseProgress
                    ? getCourseProgress(course.id)
                    : 0;
                  const totalLessons = Array.isArray(course.sections)
                    ? course.sections.reduce(
                        (sum, sec) =>
                          sum + (sec.lessons ? sec.lessons.length : 0),
                        0
                      )
                    : 0;
                  const doneCount = (completedLessons[course.id] || []).length;
                  const quizInfo = quizResults[course.id];
                  const hasSubmission = Boolean(submissions[course.id]);

                  return (
                    <div
                      key={course.id}
                      className="group/course relative overflow-hidden bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-5 sm:p-6 shadow-sm hover:-translate-y-1.5 hover:shadow-2xl hover:border-indigo-300 dark:hover:border-indigo-700 transition-all duration-200"
                    >
                      <div
                        aria-hidden="true"
                        className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-indigo-600 via-violet-600 to-emerald-500 opacity-85"
                      />

                      <div className="flex flex-col sm:flex-row gap-5">
                        {/* Course Thumbnail */}
                        <div className="sm:w-48 h-32 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0 relative">
                          {course.thumbnail ? (
                            <img
                              src={course.thumbnail}
                              alt={course.title}
                              className="w-full h-full object-cover group-hover/course:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-600 to-violet-600 text-white">
                              <Layers className="w-8 h-8" />
                            </div>
                          )}
                          <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-950/75 text-white backdrop-blur-xs">
                            {course.level || 'All Levels'}
                          </span>
                        </div>

                        {/* Course Details & Progress */}
                        <div className="flex-1 min-w-0 flex flex-col justify-between space-y-4">
                          <div className="space-y-1.5">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <Badge tone="indigo">
                                {course.category || 'Course'}
                              </Badge>

                              <div className="flex items-center gap-2">
                                {quizInfo?.passed && (
                                  <Badge tone="emerald">
                                    Quiz Passed ({quizInfo.score}%)
                                  </Badge>
                                )}
                                {hasSubmission && (
                                  <Badge tone="slate">Project Submitted</Badge>
                                )}
                              </div>
                            </div>

                            <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white group-hover/course:text-indigo-600 dark:group-hover/course:text-indigo-400 transition-colors line-clamp-1">
                              {course.title}
                            </h3>

                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
                              <span className="inline-flex items-center gap-1">
                                <Layers className="w-3.5 h-3.5 text-indigo-500" />
                                {doneCount} / {totalLessons} lessons completed
                              </span>
                              {course.duration && (
                                <span className="inline-flex items-center gap-1">
                                  <Clock className="w-3.5 h-3.5 text-emerald-500" />
                                  {course.duration}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Progress Bar + Action Button */}
                          <div className="space-y-2.5">
                            <div className="flex items-center justify-between text-xs font-bold">
                              <span className="text-slate-600 dark:text-slate-300">
                                Course Progress
                              </span>
                              <span
                                className={
                                  progress === 100
                                    ? 'text-emerald-600 dark:text-emerald-400'
                                    : 'text-indigo-600 dark:text-indigo-400'
                                }
                              >
                                {progress}%
                              </span>
                            </div>

                            <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all duration-500 ${
                                  progress === 100
                                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500'
                                    : 'bg-gradient-to-r from-indigo-600 via-violet-600 to-emerald-500'
                                }`}
                                style={{ width: `${progress}%` }}
                              />
                            </div>

                            <div className="pt-1 flex flex-wrap items-center justify-between gap-2">
                              <Link
                                to={`/student/courses/${course.id}`}
                                className="group/syl inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
                              >
                                <FileText className="w-4 h-4 text-indigo-500 group-hover/syl:translate-x-0.5 transition-transform duration-200 shrink-0" />
                                <span>View Syllabus & Overview</span>
                              </Link>

                              <Link
                                to={`/student/player/${course.id}`}
                                className="shrink-0"
                              >
                                <Button
                                  type="button"
                                  variant="primary"
                                  size="md"
                                  className="group/start relative overflow-hidden bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-700 hover:from-indigo-500 hover:via-violet-500 hover:to-indigo-600 text-white font-extrabold shadow-md shadow-indigo-600/25 hover:shadow-xl hover:shadow-indigo-600/35 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
                                >
                                  <span
                                    aria-hidden="true"
                                    className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-white/0 via-white/15 to-white/25 opacity-80 group-hover/start:opacity-100 transition-opacity"
                                  />
                                  <PlayCircle className="relative w-4 h-4 shrink-0" />
                                  <span className="relative">Start Course</span>
                                  <ArrowRight className="relative w-4 h-4 text-white/90 group-hover/start:translate-x-0.5 transition-transform duration-200 shrink-0" />
                                </Button>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right 4 Columns: Personal Activity & Saved Wishlist */}
          <div className="lg:col-span-4 space-y-6">
            {/* Personal Activity / Notifications Card */}
            <div className="group/activity relative overflow-hidden bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-5 sm:p-6 shadow-sm hover:-translate-y-1.5 hover:shadow-2xl hover:border-indigo-300 dark:hover:border-indigo-700 transition-all duration-200 space-y-4">
              <div
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-indigo-600 via-violet-600 to-emerald-500 opacity-85"
              />

              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 group-hover/activity:bg-indigo-600 group-hover/activity:text-white group-hover/activity:scale-105 transition-all duration-200 flex items-center justify-center">
                    <Bell className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-base font-extrabold text-slate-900 dark:text-white group-hover/activity:text-indigo-600 dark:group-hover/activity:text-indigo-400 transition-colors">
                      Recent Activity
                    </h2>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {unreadCount > 0
                        ? `${unreadCount} unread update${unreadCount > 1 ? 's' : ''}`
                        : 'All caught up'}
                    </p>
                  </div>
                </div>

                {unreadCount > 0 && markAllNotificationsRead && (
                  <button
                    type="button"
                    onClick={markAllNotificationsRead}
                    className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                    Mark read
                  </button>
                )}
              </div>

              {notifications.length === 0 ? (
                <p className="text-xs text-slate-500 dark:text-slate-400 py-4 text-center bg-slate-50 dark:bg-slate-800/60 rounded-2xl px-3">
                  Your personal activity feed will appear here as you enroll in courses, submit projects, and unlock certificates.
                </p>
              ) : (
                <div className="space-y-3 pt-2 max-h-72 overflow-y-auto px-0.5 pb-1">
                  {notifications.slice(0, 5).map((item) => (
                    <div
                      key={item.id}
                      className={`group/act p-3.5 rounded-2xl border text-xs hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 ${
                        item.read
                          ? 'bg-slate-50/70 dark:bg-slate-800/40 hover:bg-slate-100/95 dark:hover:bg-slate-800/80 border-slate-200/70 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                          : 'bg-indigo-50/70 dark:bg-indigo-950/40 hover:bg-indigo-100/90 dark:hover:bg-indigo-950/75 border-indigo-200/80 dark:border-indigo-800/70 hover:border-indigo-300 dark:hover:border-indigo-700'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-extrabold text-slate-900 dark:text-white group-hover/act:text-indigo-700 dark:group-hover/act:text-indigo-300 transition-colors">
                          {item.title}
                        </p>
                        <span className="text-[10px] text-slate-400 shrink-0">
                          {item.time}
                        </span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                        {item.message}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Saved Wishlist Card */}
            <div className="group/wishlist relative overflow-hidden bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-5 sm:p-6 shadow-sm hover:-translate-y-1.5 hover:shadow-2xl hover:border-indigo-300 dark:hover:border-indigo-700 transition-all duration-200 space-y-4">
              <div
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-indigo-600 via-violet-600 to-emerald-500 opacity-85"
              />

              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-rose-50 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 group-hover/wishlist:bg-rose-600 group-hover/wishlist:text-white group-hover/wishlist:scale-105 transition-all duration-200 flex items-center justify-center">
                    <Heart className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-base font-extrabold text-slate-900 dark:text-white group-hover/wishlist:text-indigo-600 dark:group-hover/wishlist:text-indigo-400 transition-colors">
                      Saved Wishlist
                    </h2>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {wishlistCourses.length} bookmarked course
                      {wishlistCourses.length === 1 ? '' : 's'}
                    </p>
                  </div>
                </div>
              </div>

              {wishlistCourses.length === 0 ? (
                <p className="text-xs text-slate-500 dark:text-slate-400 py-4 text-center bg-slate-50 dark:bg-slate-800/60 rounded-2xl px-3">
                  Bookmark courses while browsing the catalog to save them here for later.
                </p>
              ) : (
                <div className="space-y-3">
                  {wishlistCourses.map((course) => {
                    const isAlreadyEnrolled = enrolledIds.includes(course.id);

                    return (
                      <div
                        key={course.id}
                        className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 hover:-translate-y-0.5 hover:shadow-md transition-all duration-150 space-y-2.5"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <Link
                            to={`/student/courses/${course.id}`}
                            className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors line-clamp-2"
                          >
                            {course.title}
                          </Link>
                        </div>
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                            {course.category}
                          </span>
                          {isAlreadyEnrolled ? (
                            <Link
                              to={`/student/player/${course.id}`}
                              className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400 hover:underline"
                            >
                              Start Course →
                            </Link>
                          ) : (
                            enrollCourse && (
                              <button
                                type="button"
                                onClick={() => handleWishlistEnroll(course)}
                                className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                              >
                                Enroll Now →
                              </button>
                            )
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
