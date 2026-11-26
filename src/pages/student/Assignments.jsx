import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  CheckCircle2,
  Clock,
  Search,
  Sparkles,
  Send,
  ExternalLink,
  BookOpen,
  Compass,
  FolderGit2,
  X,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import { usePlatform } from '../../context/PlatformContext';

const FILTER_TABS = [
  { id: 'all', label: 'All Tasks' },
  { id: 'pending', label: 'Pending' },
  { id: 'submitted', label: 'Submitted' },
];

function NoticeModal({ notice, onClose }) {
  useEffect(() => {
    if (!notice) return;
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [notice, onClose]);

  if (!notice) return null;
  const isSuccess = notice.type === 'success';

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
        <div
          className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto ${
            isSuccess
              ? 'bg-emerald-100/90 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400'
              : 'bg-amber-100/90 dark:bg-amber-950/80 text-amber-500 dark:text-amber-400'
          }`}
        >
          {isSuccess ? (
            <CheckCircle2 className="w-7 h-7" />
          ) : (
            <AlertTriangle className="w-7 h-7" />
          )}
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

function SubmissionModal({
  assignmentItem,
  onClose,
  onSubmitWork,
  onShowNotice,
}) {
  const [submissionValue, setSubmissionValue] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!assignmentItem) return;
    setSubmissionValue(assignmentItem.submission?.content || '');
    setError('');
  }, [assignmentItem]);

  useEffect(() => {
    if (!assignmentItem) return;
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [assignmentItem, onClose]);

  if (!assignmentItem) return null;

  const isUpdating = Boolean(assignmentItem.submission);
  const previousContent = (assignmentItem.submission?.content || '').trim();

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const trimmed = submissionValue.trim();

    if (!trimmed) {
      const msg =
        'Please enter a project URL, repository link, or concise summary of your work.';
      setError(msg);
      onShowNotice({
        type: 'warning',
        title: 'Submission Required',
        message: msg,
      });
      return;
    }

    if (trimmed.length < 5) {
      const msg = 'Please enter at least 5 characters for your submission.';
      setError(msg);
      onShowNotice({
        type: 'warning',
        title: 'Submission Too Short',
        message: msg,
      });
      return;
    }

    if (isUpdating && trimmed === previousContent) {
      onShowNotice({
        type: 'warning',
        title: 'No Changes Made',
        message:
          'Your submission text is unchanged. Update your link or notes before saving.',
      });
      return;
    }

    onSubmitWork(assignmentItem.courseId, trimmed, isUpdating);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="assignment-modal-title"
    >
      <div
        className="relative overflow-hidden w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-7 space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-indigo-600 via-violet-600 to-emerald-500"
        />

        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
              <FolderGit2 className="w-5 h-5" />
            </div>
            <div>
              <h3
                id="assignment-modal-title"
                className="text-lg sm:text-xl font-black text-slate-900 dark:text-white"
              >
                {isUpdating
                  ? 'Update Assignment Submission'
                  : 'Submit Assignment'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                {assignmentItem.courseTitle}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close submission modal"
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700/80 space-y-1">
          <p className="text-xs font-extrabold text-slate-900 dark:text-white">
            {assignmentItem.title}
          </p>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            {assignmentItem.brief}
          </p>
        </div>

        <form onSubmit={handleFormSubmit} className="space-y-4" noValidate>
          <div>
            <label
              htmlFor="assignment-submission-input"
              className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5"
            >
              Project Link or Submission Notes
            </label>
            <textarea
              id="assignment-submission-input"
              rows={4}
              maxLength={600}
              value={submissionValue}
              onChange={(e) => {
                setSubmissionValue(e.target.value);
                if (error) setError('');
              }}
              placeholder="Paste your live demo URL, repository link, or describe your completed deliverable..."
              className={`w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 hover:border-indigo-400 dark:hover:border-indigo-500 focus:outline-none focus:ring-2 transition-all resize-none ${
                error
                  ? 'border-rose-500 focus:ring-rose-500/20'
                  : 'border-slate-300 dark:border-slate-700 focus:border-indigo-600 focus:ring-indigo-600/20'
              }`}
            />
            <div className="mt-1 flex items-center justify-between gap-2">
              {error ? (
                <p className="text-xs font-medium text-rose-600 dark:text-rose-400 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  <span>{error}</span>
                </p>
              ) : (
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  Saved privately to your personal workspace
                </span>
              )}
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400 shrink-0">
                {submissionValue.length} / 600
              </span>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-1">
            <Button type="button" variant="outline" size="md" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="md">
              <Send className="w-4 h-4" />
              {isUpdating ? 'Save Update' : 'Submit Work'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

function buildAssignmentsFromCourses(courses, enrolledIds, submissions) {
  return courses
    .filter((course) => enrolledIds.includes(course.id))
    .map((course) => {
      const customAssignment =
        course.assignment && typeof course.assignment === 'object'
          ? course.assignment
          : null;

      return {
        id: `assign_${course.id}`,
        courseId: course.id,
        courseTitle: course.title || 'Course',
        category: course.category || 'Course',
        level: course.level || 'All Levels',
        title:
          customAssignment?.title ||
          `Practical Project: ${course.title || 'Course Deliverable'}`,
        brief:
          customAssignment?.description ||
          `Build and submit a practical project demonstrating the core concepts covered in ${
            course.title || 'this course'
          }.`,
        dueLabel: customAssignment?.dueDate || 'Self-Paced Milestone',
        submission: submissions[course.id] || null,
      };
    });
}

export default function Assignments() {
  const {
    courses = [],
    enrolledIds = [],
    submissions = {},
    submitAssignment,
  } = usePlatform();

  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [modalItem, setModalItem] = useState(null);
  const [notice, setNotice] = useState(null);

  const assignmentItems = useMemo(
    () => buildAssignmentsFromCourses(courses, enrolledIds, submissions),
    [courses, enrolledIds, submissions]
  );

  const submittedCount = assignmentItems.filter((item) =>
    Boolean(item.submission)
  ).length;
  const pendingCount = assignmentItems.length - submittedCount;

  const filteredItems = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return assignmentItems.filter((item) => {
      const isSubmitted = Boolean(item.submission);
      if (activeTab === 'submitted' && !isSubmitted) return false;
      if (activeTab === 'pending' && isSubmitted) return false;
      if (!q) return true;
      return (
        item.title.toLowerCase().includes(q) ||
        item.courseTitle.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
      );
    });
  }, [assignmentItems, activeTab, searchQuery]);

  const KPI_CARDS = [
    {
      label: 'Total Assignments',
      value: assignmentItems.length,
      sub: 'Linked to your enrolled courses',
      icon: FileText,
      accent:
        'bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 group-hover/kpi:bg-indigo-600 group-hover/kpi:text-white',
    },
    {
      label: 'Pending Tasks',
      value: pendingCount,
      sub:
        pendingCount > 0
          ? 'Ready for project submission'
          : 'All current tasks submitted',
      icon: Clock,
      accent:
        'bg-amber-50 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 group-hover/kpi:bg-amber-500 group-hover/kpi:text-white',
    },
    {
      label: 'Submitted Work',
      value: submittedCount,
      sub: 'Recorded in your personal account',
      icon: CheckCircle2,
      accent:
        'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 group-hover/kpi:bg-emerald-600 group-hover/kpi:text-white',
    },
  ];

  const handleWorkSubmit = (courseId, contentValue, isUpdating) => {
    if (typeof submitAssignment === 'function') {
      submitAssignment(courseId, contentValue);
    }
    setNotice({
      type: 'success',
      title: isUpdating ? 'Submission Updated' : 'Assignment Submitted',
      message: isUpdating
        ? 'Your updated assignment submission has been saved.'
        : 'Your assignment submission has been saved to your workspace.',
    });
  };

  return (
    <div className="relative overflow-hidden py-8 lg:py-12">
      <SubmissionModal
        assignmentItem={modalItem}
        onClose={() => setModalItem(null)}
        onSubmitWork={handleWorkSubmit}
        onShowNotice={setNotice}
      />

      <NoticeModal notice={notice} onClose={() => setNotice(null)} />

      {/* Ambient Radial Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[62rem] h-[24rem] rounded-full bg-gradient-to-tr from-indigo-500/15 via-violet-500/10 to-emerald-500/15 blur-3xl"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 min-w-0">
        {/* Hero Header Card */}
        <div className="group/hero relative overflow-hidden bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 shadow-sm hover:-translate-y-1.5 hover:shadow-2xl hover:border-indigo-300 dark:hover:border-indigo-700 transition-all duration-200 min-w-0">
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-indigo-600 via-violet-600 to-emerald-500"
          />

          <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6 min-w-0">
            <div className="space-y-2.5 flex-1 max-w-2xl xl:max-w-lg min-w-0">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200/80 dark:border-indigo-800/80 text-indigo-700 dark:text-indigo-300 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>Practical Assignments & Deliverables</span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight break-words">
                Course{' '}
                <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-emerald-600 dark:from-indigo-400 dark:via-violet-400 dark:to-emerald-400 bg-clip-text text-transparent">
                  Assignments
                </span>
              </h1>

              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                Review hands-on course projects, submit your links or notes, and keep track of your personal submissions across enrolled courses.
              </p>
            </div>

            <div className="flex flex-wrap xl:flex-nowrap items-center gap-3 shrink-0 min-w-0">
              <Link to="/student/my-learning" className="shrink-0">
                <Button
                  variant="primary"
                  size="md"
                  className="whitespace-nowrap xl:px-5 xl:py-3"
                >
                  <BookOpen className="w-4 h-4 shrink-0" />
                  <span>My Learning</span>
                </Button>
              </Link>
              <Link to="/student/courses" className="shrink-0">
                <Button
                  variant="outline"
                  size="md"
                  className="whitespace-nowrap xl:px-5 xl:py-3"
                >
                  <Compass className="w-4 h-4 shrink-0" />
                  <span>Explore Courses</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* 3 KPI Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 min-w-0">
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

                <div className="flex items-start justify-between gap-3 min-w-0">
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

        {/* Filter Tabs & Search Box */}
        {assignmentItems.length > 0 && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 min-w-0">
            <div className="max-w-full min-w-0 flex items-center p-1 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm overflow-x-auto hover:-translate-y-1 hover:shadow-xl hover:border-indigo-300 dark:hover:border-indigo-700 transition-all duration-200 self-start">
              {FILTER_TABS.map((tab) => {
                const isSelected = activeTab === tab.id;
                const count =
                  tab.id === 'all'
                    ? assignmentItems.length
                    : tab.id === 'submitted'
                      ? submittedCount
                      : pendingCount;

                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`shrink-0 whitespace-nowrap px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
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
                placeholder="Search assignments or courses..."
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 hover:border-indigo-300 dark:hover:border-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-500 transition-all duration-200"
              />
            </div>
          </div>
        )}

        {/* Assignments List / Empty States */}
        {assignmentItems.length === 0 ? (
          <div className="group/empty relative overflow-hidden bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-10 text-center space-y-4 shadow-sm hover:-translate-y-1.5 hover:shadow-2xl hover:border-indigo-300 dark:hover:border-indigo-700 transition-all duration-200">
            <div
              aria-hidden="true"
              className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-indigo-600 via-violet-600 to-emerald-500"
            />
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 group-hover/empty:bg-indigo-600 group-hover/empty:text-white group-hover/empty:scale-105 transition-all duration-200 flex items-center justify-center mx-auto">
              <FileText className="w-7 h-7" />
            </div>
            <div className="space-y-1.5 max-w-md mx-auto">
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
                No Course Assignments Yet
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Enroll in a course to view and submit practical assignments in your personal workspace.
              </p>
            </div>
            <div className="pt-1">
              <Link to="/student/courses">
                <Button variant="primary" size="md">
                  <Compass className="w-4 h-4" />
                  Explore Courses
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
              No Matching Assignments
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Try changing the status filter or clearing your search text.
            </p>
            <div className="pt-2">
              <Button
                type="button"
                variant="outline"
                size="md"
                onClick={() => {
                  setActiveTab('all');
                  setSearchQuery('');
                }}
                className="px-5 py-2.5 text-sm font-bold rounded-xl border-slate-300 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-600 hover:bg-indigo-50/70 dark:hover:bg-indigo-950/50 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200"
              >
                Reset Filters
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4 min-w-0">
            {filteredItems.map((item) => {
              const isSubmitted = Boolean(item.submission);
              const isUrl =
                typeof item.submission?.content === 'string' &&
                /^https?:\/\//i.test(item.submission.content.trim());

              return (
                <div
                  key={item.id}
                  className="group/task relative overflow-hidden bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-5 sm:p-6 shadow-sm hover:-translate-y-1.5 hover:shadow-2xl hover:border-indigo-300 dark:hover:border-indigo-700 transition-all duration-200 space-y-4 min-w-0"
                >
                  <div
                    aria-hidden="true"
                    className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-indigo-600 via-violet-600 to-emerald-500 opacity-85"
                  />

                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 min-w-0">
                    <div className="space-y-2 max-w-3xl min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge tone="indigo">{item.category}</Badge>
                        <Badge tone={isSubmitted ? 'emerald' : 'slate'}>
                          {isSubmitted ? 'Submitted' : 'Pending'}
                        </Badge>
                        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                          {item.courseTitle} · {item.dueLabel}
                        </span>
                      </div>

                      <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white group-hover/task:text-indigo-600 dark:group-hover/task:text-indigo-400 transition-colors break-words">
                        {item.title}
                      </h2>

                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                        {item.brief}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 shrink-0">
                      <Link to={`/student/player/${item.courseId}`}>
                        <Button type="button" variant="outline" size="md">
                          Open Course
                        </Button>
                      </Link>
                      <Button
                        type="button"
                        variant="primary"
                        size="md"
                        onClick={() => setModalItem(item)}
                      >
                        {isSubmitted ? (
                          <>
                            <RefreshCw className="w-4 h-4" />
                            Update Submission
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4" />
                            Submit Work
                          </>
                        )}
                      </Button>
                    </div>
                  </div>

                  {isSubmitted && (
                    <div className="p-3.5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                      <div className="min-w-0 space-y-0.5">
                        <p className="font-extrabold text-emerald-800 dark:text-emerald-300">
                          Submitted on {item.submission.submittedAt || 'Today'}
                        </p>
                        {isUrl ? (
                          <a
                            href={item.submission.content.trim()}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 font-semibold text-indigo-600 dark:text-indigo-400 hover:underline break-all"
                          >
                            <span>{item.submission.content.trim()}</span>
                            <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                          </a>
                        ) : (
                          <p className="text-slate-700 dark:text-slate-300 break-words">
                            {item.submission.content}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
