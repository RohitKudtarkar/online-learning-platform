import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Users,
  Layers,
  Award,
  Sparkles,
  PlusCircle,
  Settings2,
  ArrowRight,
  Star,
  Clock,
  TrendingUp,
  FileCheck2,
  BarChart3,
  Eye,
  GraduationCap,
  Bell,
} from 'lucide-react';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';
import { usePlatform } from '../../context/PlatformContext';

export default function InstructorDashboard() {
  const { user } = useAuth();
  const {
    courses = [],
    enrolledIds = [],
    submissions = {},
    certificates = [],
    notifications = [],
  } = usePlatform();

  const displayName = (user?.name || 'Instructor').trim().replace(/\s+/g, ' ');

  const studioMetrics = useMemo(() => {
    let totalLessons = 0;
    let totalModules = 0;
    let totalCatalogStudents = 0;
    let ratingSum = 0;
    let ratedCount = 0;

    const categoryMap = {};

    courses.forEach((course) => {
      const sections = Array.isArray(course.sections) ? course.sections : [];
      totalModules += sections.length;

      const courseLessons = sections.reduce(
        (sum, sec) => sum + (Array.isArray(sec.lessons) ? sec.lessons.length : 0),
        0
      );
      totalLessons += courseLessons;

      const baseStudents =
        typeof course.students === 'number'
          ? course.students
          : typeof course.enrolledCount === 'number'
            ? course.enrolledCount
            : 0;
      const liveBonus = enrolledIds.includes(course.id) ? 1 : 0;
      totalCatalogStudents += baseStudents + liveBonus;

      if (typeof course.rating === 'number' && course.rating > 0) {
        ratingSum += course.rating;
        ratedCount += 1;
      }

      const cat = course.category || 'General';
      categoryMap[cat] = (categoryMap[cat] || 0) + 1;
    });

    const averageRating =
      ratedCount > 0 ? (ratingSum / ratedCount).toFixed(1) : '4.9';

    const categoryBreakdown = Object.entries(categoryMap)
      .map(([name, count]) => ({
        name,
        count,
        percent:
          courses.length > 0 ? Math.round((count / courses.length) * 100) : 0,
      }))
      .sort((a, b) => b.count - a.count);

    return {
      totalModules,
      totalLessons,
      totalCatalogStudents,
      averageRating,
      categoryBreakdown,
    };
  }, [courses, enrolledIds]);

  const submissionsCount = Object.keys(submissions).length;

  const KPI_CARDS = [
    {
      label: 'Published Courses',
      value: courses.length,
      sub: `${studioMetrics.totalModules} structured modules`,
      icon: BookOpen,
      accent:
        'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 group-hover/kpi:bg-emerald-600 group-hover/kpi:text-white',
    },
    {
      label: 'Curriculum Lessons',
      value: studioMetrics.totalLessons,
      sub:
        courses.length > 0
          ? `Avg ${Math.max(
              1,
              Math.round(studioMetrics.totalLessons / courses.length)
            )} lessons per course`
          : 'Create your first course',
      icon: Layers,
      accent:
        'bg-teal-50 dark:bg-teal-950/80 text-teal-600 dark:text-teal-400 group-hover/kpi:bg-teal-600 group-hover/kpi:text-white',
    },
    {
      label: 'Active Enrollments',
      value: studioMetrics.totalCatalogStudents.toLocaleString(),
      sub: `${studioMetrics.averageRating} ★ average course rating`,
      icon: Users,
      accent:
        'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 group-hover/kpi:bg-emerald-600 group-hover/kpi:text-white',
    },
    {
      label: 'Submissions & Certs',
      value: submissionsCount + certificates.length,
      sub: `${submissionsCount} submissions · ${certificates.length} issued`,
      icon: Award,
      accent:
        'bg-amber-50 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 group-hover/kpi:bg-amber-500 group-hover/kpi:text-white',
    },
  ];

  const QUICK_ACTIONS = [
    {
      title: 'Create New Course',
      desc: 'Build modules, lessons, and assessments',
      to: '/admin/courses/new',
      icon: PlusCircle,
      tone: 'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 group-hover/qa:bg-emerald-600 group-hover/qa:text-white',
    },
    {
      title: 'Manage Curriculum',
      desc: 'Edit lessons, pricing, and course status',
      to: '/admin/courses',
      icon: Settings2,
      tone: 'bg-teal-50 dark:bg-teal-950/80 text-teal-600 dark:text-teal-400 group-hover/qa:bg-teal-600 group-hover/qa:text-white',
    },
    {
      title: 'Review Submissions',
      desc: 'Inspect learner projects and deliverables',
      to: '/admin/students',
      icon: FileCheck2,
      tone: 'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 group-hover/qa:bg-emerald-600 group-hover/qa:text-white',
    },
    {
      title: 'Studio Analytics',
      desc: 'Track completion rates and engagement',
      href: '#catalog-distribution',
      icon: BarChart3,
      tone: 'bg-amber-50 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 group-hover/qa:bg-amber-500 group-hover/qa:text-white',
    },
  ];

  return (
    <div className="relative overflow-hidden py-8 lg:py-12">
      {/* Ambient Radial Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[62rem] h-[24rem] rounded-full bg-gradient-to-tr from-emerald-500/15 via-teal-500/10 to-emerald-400/15 blur-3xl"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 min-w-0">
        {/* Top Studio Hero Banner */}
        <div className="group/hero relative overflow-hidden bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 shadow-sm hover:-translate-y-1.5 hover:shadow-2xl hover:border-emerald-300 dark:hover:border-emerald-700 transition-all duration-200 min-w-0">
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-400"
          />

          <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6 min-w-0">
            <div className="space-y-3 flex-1 max-w-2xl xl:max-w-lg min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200/80 dark:border-emerald-800/80 text-emerald-700 dark:text-emerald-300 text-xs font-bold">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Instructor & Admin Studio</span>
                </div>
                <Badge tone="emerald">Studio Active</Badge>
              </div>

              <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight break-words">
                Welcome back,{' '}
                <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 dark:from-emerald-400 dark:via-teal-400 dark:to-emerald-300 bg-clip-text text-transparent">
                  {displayName}
                </span>
              </h1>

              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                Manage your published curriculum, monitor learner enrollments, review project submissions, and publish new courses from one central workspace.
              </p>
            </div>

            {/* Top Hero Buttons */}
            <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0 min-w-0">
              <Link to="/admin/courses/new" className="shrink-0">
                <Button
                  type="button"
                  variant="primary"
                  size="lg"
                  className="whitespace-nowrap bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:via-teal-500 hover:to-emerald-600 text-white font-extrabold shadow-md shadow-emerald-600/25 hover:shadow-xl hover:shadow-emerald-600/35 hover:-translate-y-0.5 transition-all duration-200"
                >
                  <PlusCircle className="w-4 h-4 shrink-0" />
                  <span>Create New Course</span>
                </Button>
              </Link>
              <Link to="/admin/courses" className="shrink-0">
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  className="whitespace-nowrap border-emerald-200 dark:border-emerald-800/80 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/60"
                >
                  <Settings2 className="w-4 h-4 shrink-0" />
                  <span>Manage Courses ({courses.length})</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* 4 KPI Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5 min-w-0">
          {KPI_CARDS.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.label}
                className="group/kpi relative overflow-hidden min-w-0 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-5 sm:p-6 shadow-sm hover:-translate-y-1.5 hover:shadow-2xl hover:border-emerald-300 dark:hover:border-emerald-700 transition-all duration-200 cursor-default"
              >
                <div
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-400 opacity-85"
                />

                <div className="flex items-start justify-between gap-2.5 min-w-0">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 break-words">
                      {card.label}
                    </p>
                    <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-2 whitespace-nowrap">
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

        {/* Main 12-Column Studio Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start min-w-0">
          {/* Left 8 Columns: Published Courses Overview */}
          <div className="lg:col-span-8 min-w-0 space-y-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  Catalog & Curriculum Overview
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                  Performance, module depth, and enrollment status across your courses
                </p>
              </div>
              <Link
                to="/admin/courses"
                className="group/all inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-emerald-600 dark:text-emerald-400 hover:underline shrink-0"
              >
                <span>View All Courses</span>
                <ArrowRight className="w-4 h-4 group-hover/all:translate-x-0.5 transition-transform duration-200" />
              </Link>
            </div>

            {courses.length === 0 ? (
              <div className="group/empty relative overflow-hidden bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-8 sm:p-10 text-center space-y-4 shadow-sm hover:-translate-y-1.5 hover:shadow-2xl hover:border-emerald-300 dark:hover:border-emerald-700 transition-all duration-200">
                <div
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-400"
                />
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 group-hover/empty:bg-emerald-600 group-hover/empty:text-white group-hover/empty:scale-105 transition-all duration-200 flex items-center justify-center mx-auto">
                  <BookOpen className="w-7 h-7" />
                </div>
                <div className="space-y-1.5 max-w-md mx-auto">
                  <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
                    No Courses Published Yet
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    Launch your first course with structured modules, video lessons, practical assignments, and quizzes.
                  </p>
                </div>
                <div className="pt-1">
                  <Link to="/admin/courses/new">
                    <Button
                      type="button"
                      variant="primary"
                      size="md"
                      className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:via-teal-500 hover:to-emerald-600 text-white font-extrabold"
                    >
                      <PlusCircle className="w-4 h-4" />
                      <span>Create First Course</span>
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-4 min-w-0">
                {courses.slice(0, 5).map((course) => {
                  const sections = Array.isArray(course.sections)
                    ? course.sections
                    : [];
                  const lessonCount = sections.reduce(
                    (sum, sec) =>
                      sum + (Array.isArray(sec.lessons) ? sec.lessons.length : 0),
                    0
                  );
                  const studentCount =
                    (typeof course.students === 'number'
                      ? course.students
                      : typeof course.enrolledCount === 'number'
                        ? course.enrolledCount
                        : 0) + (enrolledIds.includes(course.id) ? 1 : 0);

                  return (
                    <div
                      key={course.id}
                      className="group/course relative overflow-hidden bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-5 sm:p-6 shadow-sm hover:-translate-y-1.5 hover:shadow-2xl hover:border-emerald-300 dark:hover:border-emerald-700 transition-all duration-200 min-w-0"
                    >
                      <div
                        aria-hidden="true"
                        className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-400 opacity-85"
                      />

                      <div className="flex flex-col sm:flex-row gap-5 min-w-0">
                        {/* Course Thumbnail */}
                        <div className="sm:w-44 h-32 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0 relative">
                          {course.thumbnail ? (
                            <img
                              src={course.thumbnail}
                              alt={course.title}
                              className="w-full h-full object-cover group-hover/course:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-emerald-600 to-teal-600 text-white">
                              <Layers className="w-8 h-8" />
                            </div>
                          )}
                          <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-950/75 text-white backdrop-blur-xs">
                            {course.level || 'All Levels'}
                          </span>
                        </div>

                        {/* Course Metadata & Studio Controls */}
                        <div className="flex-1 min-w-0 flex flex-col justify-between space-y-4">
                          <div className="space-y-1.5">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <div className="flex flex-wrap items-center gap-2">
                                <Badge tone="emerald">
                                  {course.category || 'Course'}
                                </Badge>
                                <Badge tone="emerald">Published</Badge>
                              </div>

                              {typeof course.rating === 'number' && (
                                <span className="inline-flex items-center gap-1 text-xs font-extrabold text-amber-600 dark:text-amber-400">
                                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                                  {course.rating.toFixed(1)}
                                </span>
                              )}
                            </div>

                            <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white group-hover/course:text-emerald-600 dark:group-hover/course:text-emerald-400 transition-colors line-clamp-1">
                              {course.title}
                            </h3>

                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
                              <span className="inline-flex items-center gap-1">
                                <Layers className="w-3.5 h-3.5 text-emerald-500" />
                                {sections.length} modules · {lessonCount} lessons
                              </span>
                              <span className="inline-flex items-center gap-1">
                                <GraduationCap className="w-3.5 h-3.5 text-teal-500" />
                                {studentCount.toLocaleString()} learners
                              </span>
                              {course.duration && (
                                <span className="inline-flex items-center gap-1">
                                  <Clock className="w-3.5 h-3.5 text-emerald-600" />
                                  {course.duration}
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
                            <Link
                              to={`/courses/${course.id}?from=admin`}
                              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
                            >
                              <Eye className="w-4 h-4" />
                              <span>Preview Public Page</span>
                            </Link>

                            {/* Course Card Footer Button */}
                            <Link to="/admin/courses">
                              <Button
                                type="button"
                                variant="primary"
                                size="md"
                                className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:via-teal-500 hover:to-emerald-600 text-white font-extrabold"
                              >
                                <Settings2 className="w-4 h-4" />
                                <span>Manage Course</span>
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right 4 Columns: Quick Studio Actions, Category Mix & Activity */}
          <div className="lg:col-span-4 min-w-0 space-y-6">
            {/* Quick Studio Shortcuts */}
            <div className="group/actions relative overflow-hidden bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-5 sm:p-6 shadow-sm hover:-translate-y-1.5 hover:shadow-2xl hover:border-emerald-300 dark:hover:border-emerald-700 transition-all duration-200 space-y-4">
              <div
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-400 opacity-85"
              />

              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                    Quick Studio Actions
                  </h2>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Jump directly to authoring & admin tools
                  </p>
                </div>
              </div>

              <div className="space-y-2.5">
                {QUICK_ACTIONS.map((item) => {
                  const Icon = item.icon;
                  const content = (
                    <>
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors ${item.tone}`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white group-hover/qa:text-emerald-600 dark:group-hover/qa:text-emerald-400 transition-colors">
                          {item.title}
                        </p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                          {item.desc}
                        </p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400 group-hover/qa:text-emerald-600 dark:group-hover/qa:text-emerald-400 group-hover/qa:translate-x-0.5 transition-all shrink-0" />
                    </>
                  );

                  if (item.href) {
                    return (
                      <button
                        key={item.title}
                        type="button"
                        onClick={() => {
                          document
                            .getElementById('catalog-distribution')
                            ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }}
                        className="w-full text-left group/qa flex items-center gap-3 p-3 rounded-2xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 hover:-translate-y-0.5 hover:shadow-md hover:border-emerald-300 dark:hover:border-emerald-700 transition-all duration-150 cursor-pointer"
                      >
                        {content}
                      </button>
                    );
                  }

                  return (
                    <Link
                      key={item.title}
                      to={item.to}
                      className="group/qa flex items-center gap-3 p-3 rounded-2xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 hover:-translate-y-0.5 hover:shadow-md hover:border-emerald-300 dark:hover:border-emerald-700 transition-all duration-150"
                    >
                      {content}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Catalog Category Mix */}
            <div
              id="catalog-distribution"
              className="group/mix relative overflow-hidden bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-5 sm:p-6 shadow-sm hover:-translate-y-1.5 hover:shadow-2xl hover:border-emerald-300 dark:hover:border-emerald-700 transition-all duration-200 space-y-4"
            >
              <div
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-400 opacity-85"
              />

              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <BarChart3 className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                    Catalog Distribution
                  </h2>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Courses grouped by subject track
                  </p>
                </div>
              </div>

              {studioMetrics.categoryBreakdown.length === 0 ? (
                <p className="text-xs text-slate-500 dark:text-slate-400 py-4 text-center bg-slate-50 dark:bg-slate-800/60 rounded-2xl px-3">
                  Publish courses to view category distribution across your catalog.
                </p>
              ) : (
                <div className="space-y-3">
                  {studioMetrics.categoryBreakdown.map((cat) => (
                    <div key={cat.name} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className="text-slate-700 dark:text-slate-200 truncate">
                          {cat.name}
                        </span>
                        <span className="text-emerald-600 dark:text-emerald-400 shrink-0">
                          {cat.count} ({cat.percent}%)
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-400 transition-all duration-500"
                          style={{ width: `${cat.percent}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent Platform Activity */}
            <div className="group/feed relative overflow-hidden bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-5 sm:p-6 shadow-sm hover:-translate-y-1.5 hover:shadow-2xl hover:border-emerald-300 dark:hover:border-emerald-700 transition-all duration-200 space-y-4">
              <div
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-400 opacity-85"
              />

              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-teal-50 dark:bg-teal-950/80 text-teal-600 dark:text-teal-400 flex items-center justify-center">
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                    Recent Studio Activity
                  </h2>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Latest learner and course events
                  </p>
                </div>
              </div>

              {notifications.length === 0 ? (
                <p className="text-xs text-slate-500 dark:text-slate-400 py-4 text-center bg-slate-50 dark:bg-slate-800/60 rounded-2xl px-3">
                  No recent learner activity logged yet. Enrollments, submissions, and certificates appear here automatically.
                </p>
              ) : (
                <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
                  {notifications.slice(0, 4).map((item) => (
                    <div
                      key={item.id}
                      className="group/act relative z-10 p-3 rounded-2xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-800 hover:bg-emerald-50/80 dark:hover:bg-emerald-950/40 hover:border-emerald-300 dark:hover:border-emerald-700/80 hover:shadow-xs transition-all duration-150 text-xs"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-extrabold text-slate-900 dark:text-white group-hover/act:text-emerald-700 dark:group-hover/act:text-emerald-300 transition-colors">
                          {item.title}
                        </p>
                        <span className="text-[10px] text-slate-400 group-hover/act:text-emerald-600 dark:group-hover/act:text-emerald-400 transition-colors shrink-0">
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
          </div>
        </div>
      </div>
    </div>
  );
}
