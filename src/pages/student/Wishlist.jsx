import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Heart,
  Sparkles,
  Search,
  Compass,
  BookOpen,
  Trash2,
  Clock,
  Layers,
  GraduationCap,
  Info,
  PlayCircle,
  ArrowRight,
} from 'lucide-react';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import { usePlatform } from '../../context/PlatformContext';

export default function Wishlist() {
  const {
    courses = [],
    wishlistIds = [],
    enrolledIds = [],
    toggleWishlist,
    enrollCourse,
  } = usePlatform();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const savedCourses = useMemo(() => {
    return courses.filter((course) => wishlistIds.includes(course.id));
  }, [courses, wishlistIds]);

  const categories = useMemo(() => {
    const unique = new Set(
      savedCourses
        .map((course) => course.category)
        .filter((cat) => typeof cat === 'string' && cat.trim().length > 0)
    );
    return ['All', ...Array.from(unique)];
  }, [savedCourses]);

  const filteredCourses = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return savedCourses.filter((course) => {
      if (selectedCategory !== 'All' && course.category !== selectedCategory) {
        return false;
      }
      if (!q) return true;
      const titleMatch = (course.title || '').toLowerCase().includes(q);
      const categoryMatch = (course.category || '').toLowerCase().includes(q);
      const instructorMatch = (course.instructor?.name || '')
        .toLowerCase()
        .includes(q);
      return titleMatch || categoryMatch || instructorMatch;
    });
  }, [savedCourses, searchQuery, selectedCategory]);

  const enrolledFromWishlistCount = savedCourses.filter((course) =>
    enrolledIds.includes(course.id)
  ).length;

  const KPI_CARDS = [
    {
      label: 'Saved Courses',
      value: savedCourses.length,
      sub: 'Bookmarked in your personal account',
      icon: Heart,
      accent:
        'bg-rose-50 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 group-hover/kpi:bg-rose-600 group-hover/kpi:text-white',
    },
    {
      label: 'Enrolled From List',
      value: enrolledFromWishlistCount,
      sub: 'Ready in your learning library',
      icon: GraduationCap,
      accent:
        'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 group-hover/kpi:bg-emerald-600 group-hover/kpi:text-white',
    },
    {
      label: 'Topics Saved',
      value: Math.max(categories.length - 1, 0),
      sub: 'Distinct course categories',
      icon: Layers,
      accent:
        'bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 group-hover/kpi:bg-indigo-600 group-hover/kpi:text-white',
    },
  ];

  const getTotalLessons = (course) => {
    if (!Array.isArray(course?.sections)) return 0;
    return course.sections.reduce(
      (sum, sec) => sum + (Array.isArray(sec.lessons) ? sec.lessons.length : 0),
      0
    );
  };

  return (
    <div className="relative overflow-hidden py-8 lg:py-12">
      {/* Ambient Radial Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[62rem] h-[24rem] rounded-full bg-gradient-to-tr from-indigo-500/15 via-violet-500/10 to-emerald-500/15 blur-3xl"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Hero Header Card */}
        <div className="group/hero relative overflow-hidden bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 shadow-sm hover:-translate-y-1.5 hover:shadow-2xl hover:border-indigo-300 dark:hover:border-indigo-700 transition-all duration-200">
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-indigo-600 via-violet-600 to-emerald-500"
          />

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-2.5 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-rose-50 dark:bg-rose-950/70 border border-rose-200/80 dark:border-rose-800/70 text-rose-700 dark:text-rose-300 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                <span>Saved Course Bookmarks</span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                Your Personal{' '}
                <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-emerald-600 dark:from-indigo-400 dark:via-violet-400 dark:to-emerald-400 bg-clip-text text-transparent">
                  Wishlist
                </span>
              </h1>

              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                Keep track of courses you plan to take next, compare topics, and enroll whenever you are ready to start learning.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Link to="/student/courses">
                <Button variant="primary" size="lg">
                  <Compass className="w-4 h-4" />
                  Explore Catalog
                </Button>
              </Link>
              <Link to="/student/my-learning">
                <Button variant="outline" size="lg">
                  <BookOpen className="w-4 h-4" />
                  My Learning
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* 3 KPI Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
          {KPI_CARDS.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.label}
                className="group/kpi relative overflow-hidden bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-5 sm:p-6 shadow-sm hover:-translate-y-1.5 hover:shadow-2xl hover:border-indigo-300 dark:hover:border-indigo-700 transition-all duration-200 cursor-default"
              >
                <div
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-indigo-600 via-violet-600 to-emerald-500 opacity-85"
                />

                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      {card.label}
                    </p>
                    <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-2">
                      {card.value}
                    </p>
                  </div>
                  <div
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-200 group-hover/kpi:scale-105 ${card.accent}`}
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

        {/* Search & Category Filter Row */}
        {savedCourses.length > 0 && (
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              {categories.map((cat) => {
                const isSelected = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3.5 py-2 rounded-2xl text-xs sm:text-sm font-bold border transition-all duration-200 cursor-pointer shadow-2xs hover:-translate-y-0.5 hover:shadow-md ${isSelected
                        ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm'
                        : 'bg-white dark:bg-slate-900 border-slate-200/90 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-indigo-300 dark:hover:border-indigo-700 hover:text-slate-900 dark:hover:text-white'
                      }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            <div className="group/search relative w-full lg:w-80 rounded-2xl shadow-sm hover:-translate-y-1 hover:shadow-xl focus-within:-translate-y-1 focus-within:shadow-xl transition-all duration-200">
              <Search className="w-4 h-4 text-slate-400 group-hover/search:text-indigo-600 dark:group-hover/search:text-indigo-400 group-focus-within/search:text-indigo-600 dark:group-focus-within/search:text-indigo-400 transition-colors absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search saved courses..."
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 hover:border-indigo-300 dark:hover:border-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-500 transition-all duration-200"
              />
            </div>
          </div>
        )}

        {/* Saved Courses Grid or Empty States */}
        {savedCourses.length === 0 ? (
          <div className="group/empty relative overflow-hidden bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-10 text-center space-y-4 shadow-sm hover:-translate-y-1.5 hover:shadow-2xl hover:border-indigo-300 dark:hover:border-indigo-700 transition-all duration-200">
            <div
              aria-hidden="true"
              className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-indigo-600 via-violet-600 to-emerald-500"
            />
            <div className="w-14 h-14 rounded-2xl bg-rose-50 dark:bg-rose-950/70 text-rose-600 dark:text-rose-400 group-hover/empty:bg-rose-600 group-hover/empty:text-white group-hover/empty:scale-105 transition-all duration-200 flex items-center justify-center mx-auto">
              <Heart className="w-7 h-7" />
            </div>
            <div className="space-y-1.5 max-w-md mx-auto">
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
                Your Wishlist Is Empty
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Click the wishlist icon on any course in the catalog to save it here for quick enrollment later.
              </p>
            </div>
            <div className="pt-1">
              <Link to="/courses">
                <Button variant="primary" size="md">
                  <Compass className="w-4 h-4" />
                  Browse Courses
                </Button>
              </Link>
            </div>
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="relative overflow-hidden bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-10 text-center space-y-3 shadow-sm hover:-translate-y-1.5 hover:shadow-2xl hover:border-indigo-300 dark:hover:border-indigo-700 transition-all duration-200">
            <div
              aria-hidden="true"
              className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-indigo-600 via-violet-600 to-emerald-500"
            />
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
              No Matching Saved Courses
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Try another category tab or clear your search query.
            </p>
            <div className="pt-2">
              <Button
                type="button"
                variant="outline"
                size="md"
                onClick={() => {
                  setSelectedCategory('All');
                  setSearchQuery('');
                }}
              >
                Reset Filters
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredCourses.map((course) => {
              const isEnrolled = enrolledIds.includes(course.id);
              const lessonCount = getTotalLessons(course);

              return (
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

                      <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-950/75 text-white backdrop-blur-xs">
                        {course.level || 'All Levels'}
                      </span>

                      {isEnrolled && (
                        <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-emerald-600/90 text-white backdrop-blur-xs">
                          Enrolled
                        </span>
                      )}
                    </div>

                    {/* Category & Remove */}
                    <div className="flex items-center justify-between gap-2">
                      <Badge tone="indigo">{course.category || 'Course'}</Badge>

                      {typeof toggleWishlist === 'function' && (
                        <button
                          type="button"
                          onClick={() => toggleWishlist(course.id)}
                          aria-label={`Remove ${course.title} from wishlist`}
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 dark:text-rose-400 hover:underline cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Remove</span>
                        </button>
                      )}
                    </div>

                    {/* Title & Meta */}
                    <div className="space-y-2">
                      <Link
                        to={`/courses/${course.id}`}
                        className="block text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white group-hover/card:text-indigo-600 dark:group-hover/card:text-indigo-400 transition-colors line-clamp-1"
                      >
                        {course.title}
                      </Link>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
                        <span className="inline-flex items-center gap-1">
                          <Layers className="w-3.5 h-3.5 text-indigo-500" />
                          {lessonCount} lessons
                        </span>
                        {course.duration && (
                          <span className="inline-flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-emerald-500" />
                            {course.duration}
                          </span>
                        )}
                        {course.instructor?.name && (
                          <span>By {course.instructor.name}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="pt-3.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
                    <Link
                      to={`/student/courses/${course.id}`}
                      className="group/syl inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
                    >
                      <Info className="w-4 h-4 text-indigo-500 group-hover/syl:translate-x-0.5 transition-transform duration-200 shrink-0" />
                      <span>Course Details</span>
                    </Link>

                    {isEnrolled ? (
                      <Link to={`/student/player/${course.id}`} className="shrink-0">
                        <Button
                          type="button"
                          variant="primary"
                          size="md"
                          className="group/go relative overflow-hidden bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-700 hover:from-indigo-500 hover:via-violet-500 hover:to-indigo-600 text-white font-extrabold shadow-md shadow-indigo-600/25 hover:shadow-xl hover:shadow-indigo-600/35 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
                        >
                          <PlayCircle className="w-4 h-4 shrink-0" />
                          <span>Go to Course</span>
                          <ArrowRight className="w-4 h-4 text-white/90 group-hover/go:translate-x-0.5 transition-transform duration-200 shrink-0" />
                        </Button>
                      </Link>
                    ) : (
                      <Button
                        type="button"
                        variant="primary"
                        size="md"
                        onClick={() => {
                          if (typeof enrollCourse === 'function') {
                            enrollCourse(course.id);
                          }
                        }}
                      >
                        <GraduationCap className="w-4 h-4" />
                        Enroll Now
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}