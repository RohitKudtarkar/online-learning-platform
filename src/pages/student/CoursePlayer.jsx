import { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  CheckCircle2,
  Circle,
  FileText,
  Download,
  HelpCircle,
  FileCheck2,
  ArrowLeft,
  ArrowRight,
  Save,
  Sparkles,
  PlayCircle,
  Clock,
  Layers,
  AlertTriangle,
  Star,
} from 'lucide-react';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import { usePlatform } from '../../context/PlatformContext';

function CenterPopupModal({ notice, onClose }) {
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
              ? 'bg-indigo-100/90 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400'
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
            className="min-w-[116px] justify-center bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-700 hover:from-indigo-500 hover:via-violet-500 hover:to-indigo-600 text-white font-extrabold shadow-md shadow-indigo-600/25"
          >
            OK
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function CoursePlayer() {
  const { courseId } = useParams();
  const {
    courses,
    completedLessons,
    toggleLessonComplete,
    notes,
    saveNote,
    getCourseProgress,
  } = usePlatform();

  const course = useMemo(
    () => courses.find((c) => c.id === courseId),
    [courses, courseId]
  );

  const lessonEntries = useMemo(() => {
    if (!course || !Array.isArray(course.sections)) return [];
    return course.sections.flatMap((section, sIdx) =>
      (section.lessons || []).map((lesson, lIdx) => ({
        ...lesson,
        moduleNumber: sIdx + 1,
        moduleTitle: section.title || `Module ${sIdx + 1}`,
        lessonNumber: lIdx + 1,
      }))
    );
  }, [course]);

  const [activeLessonId, setActiveLessonId] = useState(
    lessonEntries[0]?.id || ''
  );
  const [activeTab, setActiveTab] = useState('overview');
  const [noteDraft, setNoteDraft] = useState('');
  const [noteError, setNoteError] = useState('');
  const [videoError, setVideoError] = useState(false);
  const [centerPopup, setCenterPopup] = useState(null);

  useEffect(() => {
    if (
      lessonEntries.length > 0 &&
      !lessonEntries.some((l) => l.id === activeLessonId)
    ) {
      setActiveLessonId(lessonEntries[0].id);
    }
  }, [lessonEntries, activeLessonId]);

  const activeIndex = useMemo(() => {
    if (lessonEntries.length === 0) return -1;
    const idx = lessonEntries.findIndex((l) => l.id === activeLessonId);
    return idx >= 0 ? idx : 0;
  }, [lessonEntries, activeLessonId]);

  const activeLesson =
    activeIndex >= 0 ? lessonEntries[activeIndex] : undefined;

  useEffect(() => {
    if (activeLesson) {
      setNoteDraft(notes[activeLesson.id] || '');
      setNoteError('');
      setVideoError(false);
    }
  }, [activeLesson, notes]);

  if (!course) {
    return (
      <div className="relative overflow-hidden py-10 lg:py-14">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <div className="group/empty relative overflow-hidden bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-10 text-center space-y-4 shadow-sm hover:-translate-y-1.5 hover:shadow-2xl hover:border-indigo-300 dark:hover:border-indigo-700 transition-all duration-200">
            <div
              aria-hidden="true"
              className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-indigo-600 via-violet-600 to-emerald-500"
            />
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              Course Not Found
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              The course you are looking for may have been moved or removed.
            </p>
            <div className="pt-1">
              <Link to="/student/my-learning">
                <Button
                  variant="primary"
                  className="bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-700 hover:from-indigo-500 hover:via-violet-500 hover:to-indigo-600 text-white font-extrabold shadow-md shadow-indigo-600/20"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to My Learning
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const completedList = completedLessons[course.id] || [];
  const isCurrentCompleted = activeLesson
    ? completedList.includes(activeLesson.id)
    : false;
  const progress = getCourseProgress ? getCourseProgress(course.id) : 0;

  const prevLesson =
    activeIndex > 0 ? lessonEntries[activeIndex - 1] : null;
  const nextLesson =
    activeIndex >= 0 && activeIndex < lessonEntries.length - 1
      ? lessonEntries[activeIndex + 1]
      : null;

  const hasPlayableVideo = Boolean(activeLesson?.videoUrl) && !videoError;
  const hasSavedNote = Boolean(
    activeLesson &&
      typeof notes[activeLesson.id] === 'string' &&
      notes[activeLesson.id].trim().length > 0
  );

  const handleToggleComplete = () => {
    if (!activeLesson) return;
    toggleLessonComplete(course.id, activeLesson.id);
  };

  const handleSaveNote = (e) => {
    e.preventDefault();
    if (!activeLesson) return;

    const trimmed = noteDraft.trim();
    if (!trimmed) {
      const msg = 'Please enter your lesson notes before saving.';
      setNoteError(msg);
      setCenterPopup({
        type: 'warning',
        title: 'Notes Required',
        message: msg,
      });
      return;
    }

    setNoteError('');
    saveNote(activeLesson.id, noteDraft);
    setCenterPopup({
      type: 'success',
      title: hasSavedNote ? 'Lesson Notes Updated' : 'Lesson Notes Saved',
      message: hasSavedNote
        ? `Your updated notes for "${activeLesson.title}" have been saved.`
        : `Your personal notes for "${activeLesson.title}" have been saved.`,
    });
  };

  const handleDownloadResource = (file) => {
    setCenterPopup({
      type: 'success',
      title: 'Resource Ready',
      message: `${file} has been prepared for download.`,
    });
  };

  return (
    <div className="relative overflow-hidden py-8 lg:py-12">
      <CenterPopupModal
        notice={centerPopup}
        onClose={() => setCenterPopup(null)}
      />

      {/* Ambient Radial Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[62rem] h-[24rem] rounded-full bg-gradient-to-tr from-indigo-500/15 via-violet-500/10 to-emerald-500/15 blur-3xl"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 min-w-0">
        {/* Top Hero Header & Progress Card */}
        <div className="group/hero relative overflow-hidden bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 shadow-sm hover:-translate-y-1.5 hover:shadow-2xl hover:border-indigo-300 dark:hover:border-indigo-700 transition-all duration-200">
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-indigo-600 via-violet-600 to-emerald-500"
          />

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2.5 max-w-3xl">
              <div className="flex flex-wrap items-center gap-2.5">
                <Link
                  to="/student/my-learning"
                  className="group/back inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200/80 dark:border-indigo-800/80 text-indigo-700 dark:text-indigo-300 text-xs font-bold hover:bg-indigo-100 dark:hover:bg-indigo-900/80 transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5 transition-transform duration-150 group-hover/back:-translate-x-0.5" />
                  <span>Back to My Learning</span>
                </Link>

                <Link
                  to={`/student/courses/${course.id}`}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-50/90 dark:bg-amber-950/60 border border-amber-200/80 dark:border-amber-800/70 text-amber-800 dark:text-amber-300 text-xs font-bold hover:bg-amber-100 dark:hover:bg-amber-900/70 transition-colors"
                >
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>Course Details & Reviews</span>
                </Link>

                {course.category && (
                  <Badge tone="indigo">{course.category}</Badge>
                )}

                {course.level && (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    {course.level}
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                {course.title}
              </h1>

              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 flex flex-wrap items-center gap-x-4 gap-y-1">
                <span className="inline-flex items-center gap-1 font-semibold">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                  Interactive Lesson Workspace
                </span>
                <span className="inline-flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" />
                  {completedList.length} of {lessonEntries.length} lessons completed
                </span>
              </p>
            </div>

            {/* Course Progress Box with Hover, Lift & Shadow */}
            <div className="group/prog w-full lg:w-72 p-4 rounded-2xl bg-slate-50/90 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700/80 shadow-xs hover:-translate-y-1 hover:shadow-lg hover:bg-white dark:hover:bg-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all duration-200 shrink-0 space-y-2">
              <div className="flex items-center justify-between text-xs font-extrabold">
                <span className="text-slate-700 dark:text-slate-200 group-hover/prog:text-indigo-600 dark:group-hover/prog:text-indigo-400 transition-colors">
                  Your Course Progress
                </span>
                <span className="text-indigo-600 dark:text-indigo-400">
                  {progress}%
                </span>
              </div>
              <div className="h-2.5 rounded-full bg-slate-200/80 dark:bg-slate-700 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-600 via-violet-600 to-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Complete lessons to advance your track
              </p>
            </div>
          </div>
        </div>

        {/* Main Split Layout: Lesson Stage + Tabs (Left) | Curriculum Sidebar (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start min-w-0">
          <div className="lg:col-span-8 min-w-0 space-y-6">
            {/* Lesson Stage Card */}
            <div className="group/stage relative overflow-hidden bg-slate-950 rounded-3xl border border-slate-800/90 shadow-md hover:-translate-y-1 hover:shadow-2xl hover:border-indigo-500/50 transition-all duration-200">
              {hasPlayableVideo ? (
                <div className="aspect-video w-full">
                  <video
                    key={activeLesson.videoUrl}
                    controls
                    poster={course.thumbnail || undefined}
                    onError={() => setVideoError(true)}
                    className="w-full h-full object-contain bg-slate-950"
                    src={activeLesson.videoUrl}
                  />
                </div>
              ) : (
                <div className="relative min-h-[16.5rem] sm:min-h-[21rem] sm:aspect-video w-full flex items-center justify-center p-4 sm:p-10 overflow-hidden">
                  {course.thumbnail ? (
                    <img
                      src={course.thumbnail}
                      alt={activeLesson?.title || course.title}
                      className="absolute inset-0 w-full h-full object-cover opacity-25 scale-105"
                    />
                  ) : null}
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-br from-slate-950/90 via-indigo-950/85 to-slate-950/95"
                  />

                  <div className="relative z-10 w-full max-w-lg text-center space-y-3 sm:space-y-4">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-600/35 flex items-center justify-center mx-auto">
                      <PlayCircle className="w-6 h-6 sm:w-7 sm:h-7" />
                    </div>

                    {activeLesson ? (
                      <>
                        <div className="inline-flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-[11px] sm:text-xs font-bold text-indigo-200">
                          <span>
                            Module {activeLesson.moduleNumber} · Lesson{' '}
                            {activeLesson.lessonNumber}
                          </span>
                          {activeLesson.duration && (
                            <>
                              <span>•</span>
                              <span className="inline-flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {activeLesson.duration}
                              </span>
                            </>
                          )}
                        </div>

                        <h2 className="text-lg sm:text-2xl font-black text-white leading-snug break-words">
                          {activeLesson.title}
                        </h2>

                        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed line-clamp-3">
                          {activeLesson.summary ||
                            'Follow along with the lesson guide below, take personal notes, and mark this lesson complete when ready.'}
                        </p>

                        <div className="pt-1 flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
                          <Button
                            type="button"
                            variant="primary"
                            size="md"
                            onClick={handleToggleComplete}
                            className="bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-700 hover:from-indigo-500 hover:via-violet-500 hover:to-indigo-600 text-white font-extrabold shadow-lg shadow-indigo-600/30 hover:-translate-y-0.5 transition-all duration-200"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            {isCurrentCompleted
                              ? 'Completed ✓'
                              : 'Complete Lesson'}
                          </Button>

                          {nextLesson && (
                            <Button
                              type="button"
                              variant="outline"
                              size="md"
                              onClick={() => setActiveLessonId(nextLesson.id)}
                              className="bg-white/10 hover:bg-white/15 text-white border-white/20 hover:border-indigo-400"
                            >
                              <span>Next Lesson</span>
                              <ArrowRight className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </>
                    ) : (
                      <p className="text-sm text-slate-300">
                        No lessons available in this course yet.
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Active Lesson Details, Tabs & Actions Card */}
            {activeLesson && (
              <div className="group/details relative overflow-hidden bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-5 sm:p-7 shadow-sm hover:-translate-y-1 hover:shadow-xl hover:border-indigo-300 dark:hover:border-indigo-700 transition-all duration-200 space-y-5 min-w-0">
                <div
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-indigo-600 via-violet-600 to-emerald-500 opacity-85"
                />

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100 dark:border-slate-800 min-w-0">
                  <div className="space-y-1.5 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge tone="indigo">Now Playing</Badge>
                      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                        Module {activeLesson.moduleNumber}:{' '}
                        {activeLesson.moduleTitle}
                        {activeLesson.duration
                          ? ` · ${activeLesson.duration}`
                          : ''}
                      </span>
                    </div>

                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white break-words">
                      {activeLesson.title}
                    </h2>
                  </div>

                  <div className="max-w-full min-w-0 flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 shrink-0">
                    {prevLesson && (
                      <Button
                        type="button"
                        variant="outline"
                        size="md"
                        onClick={() => setActiveLessonId(prevLesson.id)}
                        className="shrink-0 whitespace-nowrap hover:-translate-y-0.5 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all duration-150"
                      >
                        <ArrowLeft className="w-4 h-4 shrink-0" />
                        <span>Previous</span>
                      </Button>
                    )}

                    <Button
                      type="button"
                      variant="primary"
                      size="md"
                      onClick={handleToggleComplete}
                      className="shrink-0 whitespace-nowrap bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-700 hover:from-indigo-500 hover:via-violet-500 hover:to-indigo-600 text-white font-extrabold shadow-md shadow-indigo-600/20 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
                    >
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>
                        {isCurrentCompleted
                          ? 'Completed ✓'
                          : 'Mark as Complete'}
                      </span>
                    </Button>

                    {nextLesson && (
                      <Button
                        type="button"
                        variant="outline"
                        size="md"
                        onClick={() => setActiveLessonId(nextLesson.id)}
                        className="shrink-0 whitespace-nowrap hover:-translate-y-0.5 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all duration-150"
                      >
                        <span>Next</span>
                        <ArrowRight className="w-4 h-4 shrink-0" />
                      </Button>
                    )}
                  </div>
                </div>

                {/* Tabs: Overview | Notes | Resources with Horizontal Scroll */}
                <div className="max-w-full min-w-0 flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100/90 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700/80 shadow-xs overflow-x-auto hover:-translate-y-1 hover:shadow-xl hover:border-indigo-300 dark:hover:border-indigo-700 transition-all duration-200 self-start">
                  {[
                    { id: 'overview', label: 'Lesson Overview' },
                    { id: 'notes', label: 'Personal Notes' },
                    {
                      id: 'resources',
                      label: `Resources (${activeLesson.resources?.length || 0})`,
                    },
                  ].map((tab) => {
                    const isSelected = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveTab(tab.id)}
                        className={`shrink-0 whitespace-nowrap px-3 py-2 sm:px-3.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-150 cursor-pointer hover:-translate-y-0.5 ${
                          isSelected
                            ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-600/25'
                            : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/80 dark:hover:bg-slate-800 hover:shadow-xs'
                        }`}
                      >
                        {tab.label}
                      </button>
                    );
                  })}
                </div>

                {/* Tab Content */}
                {activeTab === 'overview' && (
                  <div className="space-y-4">
                    <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/90 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-800">
                      <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                        {activeLesson.summary ||
                          'No summary written for this lesson yet.'}
                      </p>
                    </div>

                    <div className="pt-1 flex flex-col items-start gap-2.5">
                      <Link to="/student/quizzes">
                        <Button
                          variant="outline"
                          size="md"
                          className="hover:-translate-y-0.5 hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-700 transition-all duration-150"
                        >
                          <HelpCircle className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                          <span>Take Course Quiz</span>
                        </Button>
                      </Link>
                      <Link to="/student/assignments">
                        <Button
                          variant="outline"
                          size="md"
                          className="hover:-translate-y-0.5 hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-700 transition-all duration-150"
                        >
                          <FileCheck2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                          <span>Submit Project Assignment</span>
                        </Button>
                      </Link>
                    </div>
                  </div>
                )}

                {activeTab === 'notes' && (
                  <form onSubmit={handleSaveNote} className="space-y-3.5" noValidate>
                    <div className="flex items-center justify-between gap-2">
                      <label
                        htmlFor="lesson-notes"
                        className="block text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200"
                      >
                        Your private notes for "{activeLesson.title}"
                      </label>
                      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 shrink-0">
                        {noteDraft.length} chars
                      </span>
                    </div>

                    <textarea
                      id="lesson-notes"
                      rows={5}
                      value={noteDraft}
                      onChange={(e) => {
                        setNoteDraft(e.target.value);
                        if (noteError) setNoteError('');
                      }}
                      placeholder="Write key takeaways, code snippets, or timestamps here..."
                      className={`w-full p-3.5 text-sm bg-slate-50 dark:bg-slate-800 border rounded-2xl text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 hover:border-indigo-400 dark:hover:border-indigo-500 focus:outline-none focus:ring-2 transition-all resize-none ${
                        noteError
                          ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20'
                          : 'border-slate-300 dark:border-slate-700 focus:border-indigo-600 focus:ring-indigo-600/20'
                      }`}
                    />

                    <div className="flex items-center justify-between gap-3">
                      {noteError ? (
                        <p className="text-xs font-semibold text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                          <span>{noteError}</span>
                        </p>
                      ) : (
                        <span className="text-xs text-slate-400">
                          {hasSavedNote
                            ? 'Saved — edit anytime and click Update Notes'
                            : 'Unlimited length · Saved privately to your account'}
                        </span>
                      )}

                      <Button
                        type="submit"
                        variant="primary"
                        size="md"
                        className="shrink-0 bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-700 hover:from-indigo-500 hover:via-violet-500 hover:to-indigo-600 text-white font-extrabold shadow-md shadow-indigo-600/20 hover:-translate-y-0.5 transition-all duration-200"
                      >
                        <Save className="w-4 h-4" />
                        <span>{hasSavedNote ? 'Update Notes' : 'Save Notes'}</span>
                      </Button>
                    </div>
                  </form>
                )}

                {activeTab === 'resources' && (
                  <div className="space-y-2.5">
                    {activeLesson.resources &&
                    activeLesson.resources.length > 0 ? (
                      activeLesson.resources.map((file) => (
                        <div
                          key={file}
                          className="flex items-center justify-between gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700/80 hover:-translate-y-0.5 hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-700 transition-all duration-150"
                        >
                          <span className="flex items-center gap-2.5 text-sm font-semibold text-slate-800 dark:text-slate-200 min-w-0 truncate">
                            <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                              <FileText className="w-4 h-4" />
                            </div>
                            <span className="truncate">{file}</span>
                          </span>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleDownloadResource(file)}
                            className="shrink-0 hover:border-indigo-300 dark:hover:border-indigo-700"
                          >
                            <Download className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                            <span>Download</span>
                          </Button>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-slate-500 dark:text-slate-400 py-4 text-center bg-slate-50 dark:bg-slate-800/60 rounded-2xl">
                        No downloadable files attached to this lesson.
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Column: Sticky Curriculum Checklist */}
          <div className="lg:col-span-4 min-w-0 lg:sticky lg:top-24 group/curriculum relative overflow-hidden bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm hover:-translate-y-1 hover:shadow-xl hover:border-indigo-300 dark:hover:border-indigo-700 transition-all duration-200">
            <div
              aria-hidden="true"
              className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-indigo-600 via-violet-600 to-emerald-500 opacity-85"
            />

            <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                  <Layers className="w-4 h-4" />
                </div>
                <h3 className="font-extrabold text-slate-900 dark:text-white text-sm">
                  Course Content
                </h3>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300">
                {completedList.length}/{lessonEntries.length} done
              </span>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-[620px] overflow-y-auto">
              {course.sections.map((section, sIdx) => (
                <div key={section.id} className="p-4 space-y-2">
                  <p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Module {sIdx + 1}: {section.title}
                  </p>
                  <div className="space-y-1.5">
                    {(section.lessons || []).map((lesson, lIdx) => {
                      const isActive = activeLesson?.id === lesson.id;
                      const done = completedList.includes(lesson.id);
                      return (
                        <button
                          key={lesson.id}
                          type="button"
                          onClick={() => setActiveLessonId(lesson.id)}
                          className={`w-full text-left p-3 rounded-2xl flex items-start gap-2.5 transition-all duration-150 cursor-pointer ${
                            isActive
                              ? 'bg-indigo-50/90 dark:bg-indigo-950/75 border border-indigo-200/90 dark:border-indigo-800 text-indigo-950 dark:text-indigo-100 shadow-2xs'
                              : 'border border-transparent hover:bg-slate-50 dark:hover:bg-slate-800/70 hover:translate-x-0.5 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          {done ? (
                            <CheckCircle2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                          ) : (
                            <Circle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-xs sm:text-sm font-bold leading-snug">
                              {lIdx + 1}. {lesson.title}
                            </p>
                            {lesson.duration && (
                              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                                {lesson.duration}
                              </p>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
