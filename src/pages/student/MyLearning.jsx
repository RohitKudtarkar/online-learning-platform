import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Search,
  PlayCircle,
  ArrowRight,
  CheckCircle2,
  Clock,
  Layers,
  Sparkles,
  Compass,
  Award,
  FileCheck2,
} from 'lucide-react';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import { usePlatform } from '../../context/PlatformContext';

const FILTER_TABS = [
  { id: 'all', label: 'All Courses' },
  { id: 'in-progress', label: 'In Progress' },
  { id: 'completed', label: 'Completed' },
];

export default function MyLearning() {
  const {
    courses = [],
    enrolledIds = [],
    completedLessons = {},
    quizResults = {},
    submissions = {},
    getCourseProgress,
  } = usePlatform();

  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const enrolledCourseItems = useMemo(() => {
    return courses
      .filter((course) => enrolledIds.includes(course.id))
      .map((course) => {
        const progress = getCourseProgress ? getCourseProgress(course.id) : 0;
        const totalLessons = Array.isArray(course.sections)
          ? course.sections.reduce(
              (sum, sec) => sum + (sec.lessons ? sec.lessons.length : 0),
              0
            )
          : 0;
        const doneCount = (completedLessons[course.id] || []).length;
        const isCompleted =
          progress === 100 || (totalLessons > 0 && doneCount >= totalLessons);

        return {
          course,
          progress,
          totalLessons,
          doneCount,
          isCompleted,
          quizInfo: quizResults[course.id],
          hasSubmission: Boolean(submissions[course.id]),
        };
      });
  }, [
    courses,
    enrolledIds,
    completedLessons,
    quizResults,
    submissions,
    getCourseProgress,
  ]);

  const filteredItems = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return enrolledCourseItems.filter(({ course, progress, isCompleted }) => {
      if (activeTab === 'completed' && !isCompleted) return false;
      if (activeTab === 'in-progress' && (isCompleted || progress === 0)) {
        return false;
      }
      if (!q) return true;
      const titleMatch = (course.title || '').toLowerCase().includes(q);
      const categoryMatch = (course.category || '').toLowerCase().includes(q);
      return titleMatch || categoryMatch;
    });
  }, [enrolledCourseItems, activeTab, searchQuery]);

  const completedCount = enrolledCourseItems.filter(
    (item) => item.isCompleted
  ).length;
  const inProgressCount = enrolledCourseItems.filter(
    (item) => !item.isCompleted && item.progress > 0
  ).length;

  return (
    <div className="relative overflow-hidden py-8 lg:py-12">
      {/* Ambient Radial Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[62rem] h-[24rem] rounded-full bg-gradient-to-tr from-indigo-500/15 via-violet-500/10 to-emerald-500/15 blur-3xl"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 min-w-0">
        {/* Header Banner */}
        <div className="group/banner relative overflow-hidden bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 shadow-sm hover:-translate-y-1.5 hover:shadow-2xl hover:border-indigo-300 dark:hover:border-indigo-700 transition-all duration-200 min-w-0">
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-indigo-600 via-violet-600 to-emerald-500"
          />

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 min-w-0">
            <div className="space-y-2.5 flex-1 max-w-2xl xl:max-w-lg min-w-0">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200/80 dark:border-indigo-800/80 text-indigo-700 dark:text-indigo-300 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>My Learning Library</span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight break-words">
                Your Enrolled{' '}
                <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-emerald-600 dark:from-indigo-400 dark:via-violet-400 dark:to-emerald-400 bg-clip-text text-transparent">
                  Courses
                </span>
              </h1>

              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                Pick up active lessons, review completed modules, and track assessments across every course in your personal account.
              </p>
            </div>

            <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0 min-w-0">
              <div className="inline-flex items-center whitespace-nowrap px-4 py-2.5 sm:px-5 sm:py-3 rounded-2xl bg-slate-50/90 dark:bg-slate-800/70 border border-slate-200/90 dark:border-slate-700/80 text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200 shadow-2xs shrink-0">
                {enrolledCourseItems.length} Enrolled · {inProgressCount} Active · {completedCount} Completed
              </div>
              <Link to="/student/courses" className="shrink-0">
                <Button
                  variant="primary"
                  size="lg"
                  className="whitespace-nowrap shadow-md shadow-indigo-600/20 hover:shadow-lg"
                >
                  <Compass className="w-4 h-4 shrink-0" />
                  <span>Explore Catalog</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Filter Tabs & Search Bar */}
        {enrolledCourseItems.length > 0 && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 min-w-0">
            <div className="max-w-full min-w-0 flex items-center gap-1 p-1 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm overflow-x-auto hover:-translate-y-1 hover:shadow-xl hover:border-indigo-300 dark:hover:border-indigo-700 transition-all duration-200 self-start">
              {FILTER_TABS.map((tab) => {
                const isSelected = activeTab === tab.id;
                const count =
                  tab.id === 'all'
                    ? enrolledCourseItems.length
                    : tab.id === 'completed'
                      ? completedCount
                      : inProgressCount;

                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`shrink-0 whitespace-nowrap px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-1.5 sm:gap-2 ${
                      isSelected
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <span>{tab.label}</span>
                    <span
                      className={`px-1.5 py-0.5 rounded-md text-[11px] ${
                        isSelected
                          ? 'bg-white/20 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="group/search relative w-full sm:w-72 rounded-2xl shadow-sm hover:-translate-y-1 hover:shadow-xl focus-within:-translate-y-1 focus-within:shadow-xl transition-all duration-200">
              <Search className="w-4 h-4 text-slate-400 group-hover/search:text-indigo-600 dark:group-hover/search:text-indigo-400 group-focus-within/search:text-indigo-600 dark:group-focus-within/search:text-indigo-400 transition-colors absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search enrolled courses..."
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 hover:border-indigo-300 dark:hover:border-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-500 transition-all duration-200"
              />
            </div>
          </div>
        )}

        {/* Course Cards Grid */}
        {enrolledCourseItems.length === 0 ? (
          <div className="group/empty relative overflow-hidden bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-10 text-center space-y-4 shadow-sm hover:-translate-y-1.5 hover:shadow-2xl hover:border-indigo-300 dark:hover:border-indigo-700 transition-all duration-200">
            <div
              aria-hidden="true"
              className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-indigo-600 via-violet-600 to-emerald-500"
            />
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 group-hover/empty:bg-indigo-600 group-hover/empty:text-white group-hover/empty:scale-105 transition-all duration-200 flex items-center justify-center mx-auto">
              <BookOpen className="w-7 h-7" />
            </div>
            <div className="space-y-1.5 max-w-md mx-auto">
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                Your Learning Library Is Empty
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Enroll in any course from the catalog to start tracking lesson completion, taking notes, and earning certificates.
              </p>
            </div>
            <div className="pt-1">
              <Link to="/student/courses">
                <Button variant="primary" size="md">
                  <Compass className="w-4 h-4" />
                  Browse Courses
                </Button>
              </Link>
            </div>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="relative overflow-hidden bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-10 text-center space-y-3 shadow-sm hover:-translate-y-1.5 hover:shadow-2xl hover:border-indigo-300 dark:hover:border-indigo-700 transition-all duration-200">
            <div
              aria-hidden="true"
              className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-indigo-600 via-violet-600 to-emerald-500"
            />
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
              No Matching Courses Found
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Try clearing your search or switching to another filter tab.
            </p>
            <div className="pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setActiveTab('all');
                  setSearchQuery('');
                }}
              >
                Reset Filters
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredItems.map(
              ({
                course,
                progress,
                totalLessons,
                doneCount,
                isCompleted,
                quizInfo,
                hasSubmission,
              }) => (
                <div
                  key={course.id}
                  className="group/card relative overflow-hidden bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-5 sm:p-6 shadow-sm hover:-translate-y-1.5 hover:shadow-2xl hover:border-indigo-300 dark:hover:border-indigo-700 transition-all duration-200 flex flex-col justify-between space-y-5"
                >
                  <div
                    aria-hidden="true"
                    className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-indigo-600 via-violet-600 to-emerald-500 opacity-85"
                  />

                  <div className="space-y-4">
                    {/* Thumbnail */}
                    <div className="h-44 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 relative">
                      {course.thumbnail ? (
                        <img
                          src={course.thumbnail}
                          alt={course.title}
                          className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-600 to-violet-600 text-white">
                          <Layers className="w-10 h-10" />
                        </div>
                      )}

                      <div className="absolute top-3 left-3 flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-950/75 text-white backdrop-blur-xs">
                          {course.level || 'All Levels'}
                        </span>
                      </div>

                      <div className="absolute top-3 right-3">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[11px] font-extrabold backdrop-blur-xs ${
                            isCompleted
                              ? 'bg-emerald-600/90 text-white'
                              : progress > 0
                                ? 'bg-indigo-600/90 text-white'
                                : 'bg-white/90 text-slate-800'
                          }`}
                        >
                          {isCompleted
                            ? 'Completed'
                            : progress > 0
                              ? 'In Progress'
                              : 'Not Started'}
                        </span>
                      </div>
                    </div>

                    {/* Category & Status Badges */}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <Badge tone="indigo">{course.category || 'Course'}</Badge>
                      <div className="flex flex-wrap items-center gap-1.5">
                        {quizInfo?.passed && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300">
                            <Award className="w-3 h-3" />
                            Quiz {quizInfo.score}%
                          </span>
                        )}
                        {hasSubmission && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-violet-50 dark:bg-violet-950/70 text-violet-700 dark:text-violet-300">
                            <FileCheck2 className="w-3 h-3" />
                            Submitted
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Title & Meta */}
                    <div className="space-y-2">
                      <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white group-hover/card:text-indigo-600 dark:group-hover/card:text-indigo-400 transition-colors line-clamp-1">
                        {course.title}
                      </h2>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
                        <span className="inline-flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                          {doneCount} / {totalLessons} lessons done
                        </span>
                        {course.duration && (
                          <span className="inline-flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-indigo-500" />
                            {course.duration}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Progress & Footer Actions */}
                  <div className="space-y-4 pt-1">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className="text-slate-600 dark:text-slate-300">
                          Completion
                        </span>
                        <span
                          className={
                            isCompleted
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
                            isCompleted
                              ? 'bg-gradient-to-r from-emerald-500 to-teal-500'
                              : 'bg-gradient-to-r from-indigo-600 via-violet-600 to-emerald-500'
                          }`}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>

                    <div className="pt-1 flex flex-wrap items-center justify-between gap-2">
                      <Link
                        to={`/student/courses/${course.id}`}
                        className="group/syl inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
                      >
                        <Layers className="w-4 h-4 text-indigo-500 group-hover/syl:translate-x-0.5 transition-transform duration-200 shrink-0" />
                        <span>Course Overview</span>
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
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}


