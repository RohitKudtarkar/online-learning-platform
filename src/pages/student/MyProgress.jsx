import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  CheckCircle2,
  Award,
  FileCheck2,
  BookOpen,
  PlayCircle,
  ArrowRight,
  Sparkles,
  Compass,
  Clock,
  Layers,
  Target,
} from 'lucide-react';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import { usePlatform } from '../../context/PlatformContext';

export default function Progress() {
  const {
    courses = [],
    enrolledIds = [],
    completedLessons = {},
    quizResults = {},
    submissions = {},
    certificates = [],
    getCourseProgress,
  } = usePlatform();

  const progressItems = useMemo(() => {
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
        const completedList = Array.isArray(completedLessons[course.id])
          ? completedLessons[course.id]
          : [];
        const doneCount = completedList.length;
        const quiz = quizResults[course.id] || null;
        const submission = submissions[course.id] || null;
        const hasCert = certificates.some(
          (cert) => cert.courseId === course.id
        );

        return {
          course,
          progress,
          totalLessons,
          doneCount,
          quiz,
          submission,
          hasCert,
        };
      });
  }, [
    courses,
    enrolledIds,
    completedLessons,
    quizResults,
    submissions,
    certificates,
    getCourseProgress,
  ]);

  const totalLessonsAcrossEnrolled = progressItems.reduce(
    (sum, item) => sum + item.totalLessons,
    0
  );

  const totalCompletedLessons = progressItems.reduce(
    (sum, item) => sum + item.doneCount,
    0
  );

  const overallCompletion =
    progressItems.length > 0
      ? Math.round(
          progressItems.reduce((sum, item) => sum + item.progress, 0) /
            progressItems.length
        )
      : 0;

  const quizEntries = Object.values(quizResults).filter(
    (q) => q && typeof q.score === 'number'
  );
  const averageQuizScore =
    quizEntries.length > 0
      ? Math.round(
          quizEntries.reduce((sum, q) => sum + q.score, 0) / quizEntries.length
        )
      : null;

  const submissionsCount = Object.keys(submissions).length;

  const KPI_CARDS = [
    {
      label: 'Overall Progress',
      value: `${overallCompletion}%`,
      sub: `${progressItems.length} enrolled course${
        progressItems.length === 1 ? '' : 's'
      }`,
      icon: TrendingUp,
      accent:
        'bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 group-hover/kpi:bg-indigo-600 group-hover/kpi:text-white',
    },
    {
      label: 'Lessons Finished',
      value: `${totalCompletedLessons} / ${totalLessonsAcrossEnrolled}`,
      sub: 'Across your active syllabus',
      icon: CheckCircle2,
      accent:
        'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 group-hover/kpi:bg-emerald-600 group-hover/kpi:text-white',
    },
    {
      label: 'Average Quiz Score',
      value: averageQuizScore !== null ? `${averageQuizScore}%` : '—',
      sub:
        quizEntries.length > 0
          ? `${quizEntries.length} quiz attempt${
              quizEntries.length === 1 ? '' : 's'
            }`
          : 'No quizzes taken yet',
      icon: Target,
      accent:
        'bg-violet-50 dark:bg-violet-950/80 text-violet-600 dark:text-violet-400 group-hover/kpi:bg-violet-600 group-hover/kpi:text-white',
    },
    {
      label: 'Projects & Certificates',
      value: `${submissionsCount} · ${certificates.length}`,
      sub: 'Submitted tasks · Earned certificates',
      icon: Award,
      accent:
        'bg-amber-50 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 group-hover/kpi:bg-amber-500 group-hover/kpi:text-white',
    },
  ];

  return (
    <div className="relative overflow-hidden py-8 lg:py-12">
      {/* Ambient Radial Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[62rem] h-[24rem] rounded-full bg-gradient-to-tr from-indigo-500/15 via-violet-500/10 to-emerald-500/15 blur-3xl"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 min-w-0">
        {/* Header Hero Card */}
        <div className="group/hero relative overflow-hidden bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 shadow-sm hover:-translate-y-1.5 hover:shadow-2xl hover:border-indigo-300 dark:hover:border-indigo-700 transition-all duration-200 min-w-0">
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-indigo-600 via-violet-600 to-emerald-500"
          />

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 min-w-0">
            <div className="space-y-2.5 max-w-2xl min-w-0">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200/80 dark:border-indigo-800/80 text-indigo-700 dark:text-indigo-300 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>Personal Learning Analytics</span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight break-words">
                Track Your{' '}
                <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-emerald-600 dark:from-indigo-400 dark:via-violet-400 dark:to-emerald-400 bg-clip-text text-transparent">
                  Learning Progress
                </span>
              </h1>

              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                Monitor module completion, quiz scores, submitted assignments, and earned certificates recorded exclusively for your account.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Link to="/student/my-learning">
                <Button
                  variant="primary"
                  size="lg"
                  className="shadow-md shadow-indigo-600/20 hover:shadow-lg"
                >
                  <BookOpen className="w-4 h-4" />
                  My Learning
                </Button>
              </Link>

              <Link to="/student/certificates">
                <Button variant="outline" size="lg">
                  <Award className="w-4 h-4" />
                  Certificates ({certificates.length})
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* 4 KPI Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5 min-w-0">
          {KPI_CARDS.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.label}
                className="group/kpi relative overflow-hidden min-w-0 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-5 sm:p-6 shadow-sm hover:-translate-y-1.5 hover:shadow-2xl hover:border-indigo-300 dark:hover:border-indigo-700 transition-all duration-200 cursor-default"
              >
                <div
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-indigo-600 via-violet-600 to-emerald-500 opacity-85"
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

        {/* Course-by-Course Progress Breakdown */}
        <div className="space-y-5 min-w-0">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                Course Progress Breakdown
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Detailed lesson completion, quiz milestones, and project status per course
              </p>
            </div>
          </div>

          {progressItems.length === 0 ? (
            <div className="group/empty relative overflow-hidden bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-10 text-center space-y-4 shadow-sm hover:-translate-y-1.5 hover:shadow-2xl hover:border-indigo-300 dark:hover:border-indigo-700 transition-all duration-200">
              <div
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-indigo-600 via-violet-600 to-emerald-500"
              />
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 group-hover/empty:bg-indigo-600 group-hover/empty:text-white group-hover/empty:scale-105 transition-all duration-200 flex items-center justify-center mx-auto">
                <Layers className="w-7 h-7" />
              </div>
              <div className="space-y-1.5 max-w-md mx-auto">
                <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
                  No Course Progress Yet
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  Enroll in a course and complete lessons or quizzes to build your personal progress report.
                </p>
              </div>
              <div className="pt-1">
                <Link to="/courses">
                  <Button variant="primary" size="md">
                    <Compass className="w-4 h-4" />
                    Explore Courses
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-4 min-w-0">
              {progressItems.map(
                ({
                  course,
                  progress,
                  totalLessons,
                  doneCount,
                  quiz,
                  submission,
                  hasCert,
                }) => (
                  <div
                    key={course.id}
                    className="group/item relative overflow-hidden bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-5 sm:p-6 shadow-sm hover:-translate-y-1.5 hover:shadow-2xl hover:border-indigo-300 dark:hover:border-indigo-700 transition-all duration-200 min-w-0"
                  >
                    <div
                      aria-hidden="true"
                      className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-indigo-600 via-violet-600 to-emerald-500 opacity-85"
                    />

                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 min-w-0">
                      <div className="space-y-2.5 flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge tone="indigo">
                            {course.category || 'Course'}
                          </Badge>
                          {hasCert && (
                            <Badge tone="emerald">Certificate Earned</Badge>
                          )}
                          {quiz && (
                            <Badge tone={quiz.passed ? 'emerald' : 'slate'}>
                              Quiz: {quiz.score}%{' '}
                              {quiz.passed ? '(Passed)' : '(In Review)'}
                            </Badge>
                          )}
                          {submission && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-violet-50 dark:bg-violet-950/70 text-violet-700 dark:text-violet-300">
                              <FileCheck2 className="w-3 h-3" />
                              {submission.status || 'Submitted'}
                            </span>
                          )}
                        </div>

                        <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white group-hover/item:text-indigo-600 dark:group-hover/item:text-indigo-400 transition-colors break-words">
                          {course.title}
                        </h3>

                        <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
                          <span className="inline-flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                            {doneCount} of {totalLessons} lessons completed
                          </span>
                          {course.duration && (
                            <span className="inline-flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                              {course.duration}
                            </span>
                          )}
                          {submission?.submittedAt && (
                            <span>Submitted on {submission.submittedAt}</span>
                          )}
                        </div>
                      </div>

                      <div className="w-full lg:w-72 space-y-2.5 shrink-0">
                        <div className="flex items-center justify-between text-xs font-extrabold">
                          <span className="text-slate-600 dark:text-slate-300">
                            Completion
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

                        <div className="pt-1 flex justify-end">
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
                              <span className="relative">
                                {progress === 100
                                  ? 'Review Course'
                                  : progress > 0
                                    ? 'Continue Learning'
                                    : 'Start Course'}
                              </span>
                              <ArrowRight className="relative w-4 h-4 text-white/90 group-hover/start:translate-x-0.5 transition-transform duration-200 shrink-0" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}