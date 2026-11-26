import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Sparkles,
  Search,
  LayoutDashboard,
  BookOpen,
  Award,
  TrendingUp,
  Mail,
  CheckCircle2,
  Eye,
  X,
  GraduationCap,
} from 'lucide-react';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import FilterDropdown from '../../components/common/FilterDropdown';
import { useAuth } from '../../context/AuthContext';
import { usePlatform } from '../../context/PlatformContext';

function getFirstAndLastInitials(name) {
  const withoutParens = String(name || 'Learner').replace(/\([^)]*\)/g, ' ');
  const cleaned = withoutParens.trim().replace(/\s+/g, ' ');
  if (!cleaned) return 'ST';

  const parts = cleaned.split(' ').filter(Boolean);
  if (parts.length === 1) {
    const word = parts[0].replace(/[^A-Za-z0-9]/g, '');
    if (!word) return 'ST';
    return word.slice(0, 2).toUpperCase();
  }

  const firstChar = parts[0].replace(/[^A-Za-z0-9]/g, '').charAt(0);
  const lastChar = parts[parts.length - 1]
    .replace(/[^A-Za-z0-9]/g, '')
    .charAt(0);

  const initials = `${firstChar}${lastChar}`.toUpperCase();
  return initials || 'ST';
}

function getUserLookupMap() {
  const map = new Map();
  if (typeof window === 'undefined' || !window.localStorage) return map;

  try {
    for (let i = 0; i < localStorage.length; i += 1) {
      const key = localStorage.key(i);
      if (!key) continue;
      const raw = localStorage.getItem(key);
      if (!raw) continue;
      const parsed = JSON.parse(raw);

      const candidates = Array.isArray(parsed)
        ? parsed
        : parsed && Array.isArray(parsed.users)
          ? parsed.users
          : parsed && typeof parsed === 'object'
            ? [parsed.user, parsed].filter(Boolean)
            : [];

      candidates.forEach((item) => {
        if (item && typeof item === 'object' && item.id) {
          map.set(String(item.id), {
            name: item.name || item.fullName || null,
            email: item.email || null,
          });
        }
      });
    }
  } catch {
    // Ignore malformed localStorage entries
  }

  return map;
}

function collectStudentActivityEntries(currentUser, liveActivity) {
  const entriesByUserId = new Map();

  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      for (let i = 0; i < localStorage.length; i += 1) {
        const key = localStorage.key(i);
        if (!key || !key.startsWith('olp_activity_')) continue;

        const userId = key.replace('olp_activity_', '');
        if (!userId) continue;

        const raw = localStorage.getItem(key);
        if (!raw) continue;

        const parsed = JSON.parse(raw);
        if (!parsed || typeof parsed !== 'object') continue;

        entriesByUserId.set(userId, {
          userId,
          enrolledIds: Array.isArray(parsed.enrolledIds)
            ? parsed.enrolledIds
            : [],
          completedLessons:
            parsed.completedLessons && typeof parsed.completedLessons === 'object'
              ? parsed.completedLessons
              : {},
          quizResults:
            parsed.quizResults && typeof parsed.quizResults === 'object'
              ? parsed.quizResults
              : {},
          submissions:
            parsed.submissions && typeof parsed.submissions === 'object'
              ? parsed.submissions
              : {},
          certificates: Array.isArray(parsed.certificates)
            ? parsed.certificates
            : [],
        });
      }
    } catch {
      // Ignore storage read errors
    }
  }

  if (currentUser?.id && liveActivity) {
    entriesByUserId.set(String(currentUser.id), {
      userId: String(currentUser.id),
      enrolledIds: Array.isArray(liveActivity.enrolledIds)
        ? liveActivity.enrolledIds
        : [],
      completedLessons:
        liveActivity.completedLessons &&
        typeof liveActivity.completedLessons === 'object'
          ? liveActivity.completedLessons
          : {},
      quizResults:
        liveActivity.quizResults && typeof liveActivity.quizResults === 'object'
          ? liveActivity.quizResults
          : {},
      submissions:
        liveActivity.submissions && typeof liveActivity.submissions === 'object'
          ? liveActivity.submissions
          : {},
      certificates: Array.isArray(liveActivity.certificates)
        ? liveActivity.certificates
        : [],
    });
  }

  return Array.from(entriesByUserId.values());
}

function StudentDetailModal({ student, onClose }) {
  useEffect(() => {
    if (!student) return;
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [student, onClose]);

  if (!student) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="student-detail-title"
    >
      <div
        className="relative overflow-hidden w-full max-w-xl max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-7 space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-400"
        />

        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-500 text-white font-black text-base flex items-center justify-center shrink-0">
              {getFirstAndLastInitials(student.name)}
            </div>
            <div className="min-w-0">
              <h3
                id="student-detail-title"
                className="text-lg sm:text-xl font-black text-slate-900 dark:text-white break-words"
              >
                {student.name}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 break-all">
                {student.email}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close student details"
            className="shrink-0 p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700/80 min-w-0">
            <p className="text-lg font-black text-slate-900 dark:text-white">
              {student.courses.length}
            </p>
            <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 truncate">
              Enrolled
            </p>
          </div>
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700/80 min-w-0">
            <p className="text-lg font-black text-emerald-600 dark:text-emerald-400">
              {student.avgProgress}%
            </p>
            <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 truncate">
              Avg Progress
            </p>
          </div>
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700/80 min-w-0">
            <p className="text-lg font-black text-teal-600 dark:text-teal-400">
              {student.certificatesCount}
            </p>
            <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 truncate">
              Certificates
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-xs font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Enrolled Courses Breakdown
          </p>
          {student.courses.map((item) => (
            <div
              key={item.courseId}
              className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 space-y-2"
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-extrabold text-slate-900 dark:text-white truncate">
                  {item.courseTitle}
                </p>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 shrink-0">
                  {item.progress}%
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-400"
                  style={{ width: `${item.progress}%` }}
                />
              </div>
              <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400">
                <span>
                  Lessons: {item.doneCount}/{item.totalLessons}
                </span>
                {item.quizInfo && <span>Quiz: {item.quizInfo.score}%</span>}
                {item.hasSubmission && <span>Assignment: Submitted</span>}
                {item.hasCertificate && (
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                    Certificate Issued
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end pt-1">
          <Button
            type="button"
            variant="primary"
            size="md"
            onClick={onClose}
            className="w-full sm:w-auto justify-center bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:via-teal-500 hover:to-emerald-600 text-white font-extrabold"
          >
            <span>Close</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function EnrolledStudents() {
  const { user } = useAuth() || {};
  const {
    courses = [],
    enrolledIds = [],
    completedLessons = {},
    quizResults = {},
    submissions = {},
    certificates = [],
  } = usePlatform() || {};

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourseId, setSelectedCourseId] = useState('all');
  const [activeStudent, setActiveStudent] = useState(null);

  const studentRoster = useMemo(() => {
    const userLookup = getUserLookupMap();
    const activityEntries = collectStudentActivityEntries(user, {
      enrolledIds,
      completedLessons,
      quizResults,
      submissions,
      certificates,
    });

    const roster = [];

    activityEntries.forEach((entry) => {
      const uniqueEnrolledIds = Array.from(new Set(entry.enrolledIds || []));
      const enrolledCourses = courses.filter((c) =>
        uniqueEnrolledIds.includes(c.id)
      );
      if (enrolledCourses.length === 0) return;

      const isCurrentUser =
        user?.id && String(user.id) === String(entry.userId);
      const lookup = userLookup.get(String(entry.userId)) || {};
      const certName =
        Array.isArray(entry.certificates) && entry.certificates[0]?.studentName;

      const studentName =
        (isCurrentUser && user?.name) ||
        lookup.name ||
        certName ||
        `Learner (${String(entry.userId).slice(0, 6)})`;

      const studentEmail =
        (isCurrentUser && user?.email) ||
        lookup.email ||
        `${String(entry.userId).toLowerCase().replace(/[^a-z0-9]/g, '') || 'learner'}@portal.edu`;

      const courseDetails = enrolledCourses.map((course) => {
        const allLessons = Array.isArray(course.sections)
          ? course.sections.flatMap((sec) =>
              Array.isArray(sec.lessons) ? sec.lessons : []
            )
          : [];
        const doneIds = Array.isArray(entry.completedLessons?.[course.id])
          ? entry.completedLessons[course.id]
          : [];
        const totalLessons = allLessons.length;
        const doneCount = allLessons.filter((les) =>
          doneIds.includes(les.id)
        ).length;
        const progress =
          totalLessons > 0 ? Math.round((doneCount / totalLessons) * 100) : 0;

        return {
          courseId: course.id,
          courseTitle: course.title || 'Course',
          category: course.category || 'Course',
          totalLessons,
          doneCount,
          progress,
          quizInfo: entry.quizResults?.[course.id] || null,
          hasSubmission: Boolean(entry.submissions?.[course.id]),
          hasCertificate: Array.isArray(entry.certificates)
            ? entry.certificates.some((cert) => cert.courseId === course.id)
            : false,
        };
      });

      const avgProgress =
        courseDetails.length > 0
          ? Math.round(
              courseDetails.reduce((sum, c) => sum + c.progress, 0) /
                courseDetails.length
            )
          : 0;

      roster.push({
        id: entry.userId,
        name: studentName,
        email: studentEmail,
        courses: courseDetails,
        avgProgress,
        certificatesCount: Array.isArray(entry.certificates)
          ? entry.certificates.length
          : 0,
        status: 'Active',
      });
    });

    return roster;
  }, [
    courses,
    user,
    enrolledIds,
    completedLessons,
    quizResults,
    submissions,
    certificates,
  ]);

  const enrolledCourseOptions = useMemo(() => {
    const enrolledIdSet = new Set();
    studentRoster.forEach((student) => {
      student.courses.forEach((c) => enrolledIdSet.add(c.courseId));
    });
    return courses.filter((c) => enrolledIdSet.has(c.id));
  }, [courses, studentRoster]);

  const courseDropdownOptions = useMemo(() => {
    return [
      {
        value: 'all',
        label: `All Enrolled Courses (${enrolledCourseOptions.length})`,
        description: 'View learners across every course',
        icon: BookOpen,
      },
      ...enrolledCourseOptions.map((c) => ({
        value: c.id,
        label: c.title,
        description: c.category || 'Enrolled course',
        icon: GraduationCap,
      })),
    ];
  }, [enrolledCourseOptions]);

  const filteredStudents = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return studentRoster
      .map((student) => {
        const matchingCourses =
          selectedCourseId === 'all'
            ? student.courses
            : student.courses.filter((c) => c.courseId === selectedCourseId);
        return {
          ...student,
          visibleCourses: matchingCourses,
        };
      })
      .filter((student) => {
        if (student.visibleCourses.length === 0) return false;
        if (!q) return true;
        const nameMatch = student.name.toLowerCase().includes(q);
        const emailMatch = student.email.toLowerCase().includes(q);
        const courseMatch = student.visibleCourses.some((c) =>
          c.courseTitle.toLowerCase().includes(q)
        );
        return nameMatch || emailMatch || courseMatch;
      });
  }, [studentRoster, searchQuery, selectedCourseId]);

  const totalEnrollmentsCount = useMemo(() => {
    return studentRoster.reduce((sum, s) => sum + s.courses.length, 0);
  }, [studentRoster]);

  const averageCompletion = useMemo(() => {
    if (studentRoster.length === 0) return 0;
    const total = studentRoster.reduce((sum, s) => sum + s.avgProgress, 0);
    return Math.round(total / studentRoster.length);
  }, [studentRoster]);

  const totalCertificatesCount = useMemo(() => {
    return studentRoster.reduce((sum, s) => sum + s.certificatesCount, 0);
  }, [studentRoster]);

  const KPI_CARDS = [
    {
      label: 'Enrolled Students',
      value: studentRoster.length,
      sub: 'Active learners in workspace',
      icon: Users,
      accent:
        'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 group-hover/kpi:bg-emerald-600 group-hover/kpi:text-white',
    },
    {
      label: 'Course Enrollments',
      value: totalEnrollmentsCount,
      sub: 'Total active course seats',
      icon: BookOpen,
      accent:
        'bg-teal-50 dark:bg-teal-950/80 text-teal-600 dark:text-teal-400 group-hover/kpi:bg-teal-600 group-hover/kpi:text-white',
    },
    {
      label: 'Avg Completion',
      value: `${averageCompletion}%`,
      sub: 'Across enrolled course progress',
      icon: TrendingUp,
      accent:
        'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 group-hover/kpi:bg-emerald-600 group-hover/kpi:text-white',
    },
    {
      label: 'Certificates Issued',
      value: totalCertificatesCount,
      sub: 'Verified completion credentials',
      icon: Award,
      accent:
        'bg-amber-50 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 group-hover/kpi:bg-amber-500 group-hover/kpi:text-white',
    },
  ];

  return (
    <div className="relative overflow-hidden py-8 lg:py-12">
      <StudentDetailModal
        student={activeStudent}
        onClose={() => setActiveStudent(null)}
      />

      {/* Ambient Radial Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[62rem] h-[24rem] rounded-full bg-gradient-to-tr from-emerald-500/15 via-teal-500/10 to-emerald-400/15 blur-3xl"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 min-w-0">
        {/* Studio Hero Header */}
        <div className="group/hero relative overflow-hidden bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 shadow-sm hover:-translate-y-1.5 hover:shadow-2xl hover:border-emerald-300 dark:hover:border-emerald-700 transition-all duration-200 min-w-0">
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-400"
          />

          <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6 min-w-0">
            <div className="space-y-2.5 flex-1 max-w-2xl xl:max-w-lg min-w-0">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200/80 dark:border-emerald-800/80 text-emerald-700 dark:text-emerald-300 text-xs font-bold whitespace-nowrap max-w-full">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span className="truncate">
                  Instructor & Admin Studio · Learner Roster
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight break-words">
                Enrolled{' '}
                <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 dark:from-emerald-400 dark:via-teal-400 dark:to-emerald-300 bg-clip-text text-transparent">
                  Students
                </span>
              </h1>

              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                Monitor enrolled learners, inspect course-by-course progress bars, check quiz scores and assignment status, and review earned certificates.
              </p>
            </div>

            <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0 min-w-0">
              <Link to="/admin" className="shrink-0">
                <Button
                  type="button"
                  variant="primary"
                  size="lg"
                  className="whitespace-nowrap bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:via-teal-500 hover:to-emerald-600 text-white font-extrabold shadow-md shadow-emerald-600/25 hover:shadow-xl hover:shadow-emerald-600/35 hover:-translate-y-0.5 transition-all duration-200"
                >
                  <LayoutDashboard className="w-4 h-4 shrink-0" />
                  <span>Studio Overview</span>
                </Button>
              </Link>
              <Link to="/admin/courses" className="shrink-0">
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  className="whitespace-nowrap border-emerald-200 dark:border-emerald-800/80 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/60"
                >
                  <BookOpen className="w-4 h-4 shrink-0" />
                  <span>Manage Courses</span>
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

        {/* Search & Course Filter Bar */}
        {studentRoster.length > 0 && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 min-w-0">
            <div className="w-full sm:w-64 lg:w-72 min-w-0">
              <FilterDropdown
                value={selectedCourseId}
                onChange={setSelectedCourseId}
                options={courseDropdownOptions}
                placeholder={`All Enrolled Courses (${enrolledCourseOptions.length})`}
                className="w-full max-w-full"
              />
            </div>

            <div className="group/search relative w-full sm:w-64 lg:w-72 min-w-0 rounded-2xl shadow-sm hover:-translate-y-1 hover:shadow-xl focus-within:-translate-y-1 focus-within:shadow-xl transition-all duration-200">
              <Search className="w-4 h-4 text-slate-400 group-hover/search:text-emerald-600 dark:group-hover/search:text-emerald-400 group-focus-within/search:text-emerald-600 dark:group-focus-within/search:text-emerald-400 transition-colors absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search student or course..."
                className="w-full min-w-0 pl-10 pr-4 py-2.5 text-sm bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 hover:border-emerald-300 dark:hover:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/25 focus:border-emerald-500 transition-all duration-200"
              />
            </div>
          </div>
        )}

        {/* Roster List or Empty States */}
        {studentRoster.length === 0 ? (
          <div className="group/empty relative overflow-hidden bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-10 text-center space-y-4 shadow-sm hover:-translate-y-1.5 hover:shadow-2xl hover:border-emerald-300 dark:hover:border-emerald-700 transition-all duration-200">
            <div
              aria-hidden="true"
              className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-400"
            />
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 group-hover/empty:bg-emerald-600 group-hover/empty:text-white group-hover/empty:scale-105 transition-all duration-200 flex items-center justify-center mx-auto">
              <GraduationCap className="w-7 h-7" />
            </div>
            <div className="space-y-1.5 max-w-md mx-auto">
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
                No Enrolled Students Yet
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Once learners enroll in courses, their progress, quiz scores, submissions, and certificates will appear here.
              </p>
            </div>
            <div className="pt-1">
              <Link to="/admin/courses">
                <Button
                  type="button"
                  variant="primary"
                  size="md"
                  className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:via-teal-500 hover:to-emerald-600 text-white font-extrabold"
                >
                  <span>Browse Catalog</span>
                </Button>
              </Link>
            </div>
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="relative overflow-hidden bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-10 text-center space-y-3 shadow-sm hover:-translate-y-1.5 hover:shadow-2xl hover:border-emerald-300 dark:hover:border-emerald-700 transition-all duration-200">
            <div
              aria-hidden="true"
              className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-400"
            />
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
              No Matching Learners
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Try clearing your search filter or selecting all enrolled courses.
            </p>
            <div className="pt-2">
              <Button
                type="button"
                variant="outline"
                size="md"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCourseId('all');
                }}
              >
                Reset Filters
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-5 min-w-0">
            {filteredStudents.map((student) => (
              <div
                key={student.id}
                className="group/student relative overflow-hidden bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-5 sm:p-7 shadow-sm hover:-translate-y-1.5 hover:shadow-2xl hover:border-emerald-300 dark:hover:border-emerald-700 transition-all duration-200 space-y-5 min-w-0"
              >
                <div
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-400 opacity-85"
                />

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 min-w-0">
                  <div className="flex items-start sm:items-center gap-3.5 sm:gap-4 min-w-0">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-500 text-white font-black text-base sm:text-lg flex items-center justify-center shadow-md shrink-0">
                      {getFirstAndLastInitials(student.name)}
                    </div>
                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white group-hover/student:text-emerald-600 dark:group-hover/student:text-emerald-400 transition-colors break-words">
                          {student.name}
                        </h2>
                        <Badge tone="emerald">{student.status}</Badge>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 flex items-start gap-1.5 min-w-0">
                        <Mail className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span className="break-all leading-snug">
                          {student.email}
                        </span>
                      </p>
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="primary"
                    size="md"
                    onClick={() => setActiveStudent(student)}
                    className="w-full md:w-auto justify-center shrink-0 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:via-teal-500 hover:to-emerald-600 text-white font-extrabold"
                  >
                    <Eye className="w-4 h-4" />
                    <span>Inspect Progress</span>
                  </Button>
                </div>

                {/* Course Progress Chips */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                  {student.visibleCourses.map((c) => (
                    <div
                      key={c.courseId}
                      className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-800 space-y-2 min-w-0"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white truncate">
                          {c.courseTitle}
                        </p>
                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 shrink-0">
                          {c.progress}%
                        </span>
                      </div>

                      <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-400 transition-all duration-500"
                          style={{ width: `${c.progress}%` }}
                        />
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                        <span>
                          {c.doneCount}/{c.totalLessons} lessons done
                        </span>
                        {c.hasCertificate && (
                          <span className="inline-flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400">
                            <CheckCircle2 className="w-3 h-3" />
                            Certificate
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
