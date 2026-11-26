import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  HelpCircle,
  CheckCircle2,
  XCircle,
  Award,
  Sparkles,
  BookOpen,
  Compass,
  Play,
  RotateCcw,
  X,
  Trophy,
  AlertTriangle,
  ArrowRight,
  ClipboardCheck,
} from 'lucide-react';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';
import { usePlatform } from '../../context/PlatformContext';

const PASS_THRESHOLD = 70;
const OPTION_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];

function getQuestionsForCourse(course) {
  if (
    Array.isArray(course?.quiz?.questions) &&
    course.quiz.questions.length > 0
  ) {
    return course.quiz.questions.map((q, idx) => ({
      id: q.id || `q_${course.id}_${idx}`,
      question: q.question,
      options: Array.isArray(q.options) ? q.options : [],
      correctIndex:
        typeof q.correctIndex === 'number' ? q.correctIndex : 0,
    }));
  }

  const courseTitle = course?.title || 'this course';
  const category = course?.category || 'this subject';

  return [
    {
      id: `q_${course.id}_1`,
      question: `What is the primary goal of applying structured practices in ${courseTitle}?`,
      options: [
        'Building maintainable, reliable, and user-focused solutions',
        'Skipping planning and testing to save time',
        'Relying on hard-coded values everywhere',
        'Avoiding documentation and component structure',
      ],
      correctIndex: 0,
    },
    {
      id: `q_${course.id}_2`,
      question: `When working on ${category} projects, why is consistent state and data organization important?`,
      options: [
        'It makes debugging easier and keeps behavior predictable',
        'It increases bundle size unnecessarily',
        'It prevents users from interacting with the app',
        'It disables error handling',
      ],
      correctIndex: 0,
    },
    {
      id: `q_${course.id}_3`,
      question: `Before completing a milestone in ${courseTitle}, what is the best practice?`,
      options: [
        'Leave edge cases untested',
        'Review your implementation, verify edge cases, and test user flows',
        'Delete working components without backup',
        'Ignore responsive layout behavior',
      ],
      correctIndex: 1,
    },
  ];
}

function QuizRunnerModal({
  quizItem,
  onClose,
  onCompleteQuiz,
}) {
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [validationWarning, setValidationWarning] = useState('');
  const [attemptSummary, setAttemptSummary] = useState(null);

  useEffect(() => {
    if (!quizItem) return;
    setSelectedAnswers({});
    setValidationWarning('');
    setAttemptSummary(null);
  }, [quizItem]);

  useEffect(() => {
    if (!quizItem) return;
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [quizItem, onClose]);

  if (!quizItem) return null;

  const { questions, courseId, courseTitle } = quizItem;
  const answeredCount = questions.filter(
    (q) => typeof selectedAnswers[q.id] === 'number'
  ).length;
  const completionPct =
    questions.length > 0
      ? Math.round((answeredCount / questions.length) * 100)
      : 0;

  const handleSelectOption = (questionId, optionIndex) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
    if (validationWarning) setValidationWarning('');
  };

  const handleSubmitQuiz = (e) => {
    e.preventDefault();
    const unanswered = questions.filter(
      (q) => typeof selectedAnswers[q.id] !== 'number'
    );

    if (unanswered.length > 0) {
      setValidationWarning(
        `Please answer all ${questions.length} questions before submitting (${answeredCount}/${questions.length} answered).`
      );
      return;
    }

    let correctCount = 0;
    const review = questions.map((q, idx) => {
      const chosenIndex = selectedAnswers[q.id];
      const isCorrect = chosenIndex === q.correctIndex;
      if (isCorrect) correctCount += 1;
      return {
        id: q.id,
        number: idx + 1,
        question: q.question,
        chosenIndex,
        correctIndex: q.correctIndex,
        chosenText: q.options[chosenIndex] || '',
        correctText: q.options[q.correctIndex] || '',
        isCorrect,
      };
    });

    const score = Math.round((correctCount / questions.length) * 100);
    const passed = score >= PASS_THRESHOLD;

    onCompleteQuiz(courseId, score, passed);
    setAttemptSummary({
      score,
      passed,
      correctCount,
      totalCount: questions.length,
      review,
    });
  };

  const handleRetake = () => {
    setSelectedAnswers({});
    setValidationWarning('');
    setAttemptSummary(null);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/70 backdrop-blur-xs"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="quiz-modal-title"
    >
      <div
        className="relative flex flex-col w-full max-w-2xl max-h-[90vh] bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Accent Strip */}
        <div
          aria-hidden="true"
          className="h-1.5 w-full bg-gradient-to-r from-indigo-600 via-violet-600 to-emerald-500 shrink-0"
        />

        {/* Sticky Header & Live Progress */}
        <div className="px-5 sm:px-7 py-4 sm:py-5 border-b border-slate-100 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xs shrink-0 space-y-3.5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-600/25 flex items-center justify-center shrink-0">
                <Trophy className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3
                    id="quiz-modal-title"
                    className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight"
                  >
                    Course Assessment
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200/70 dark:border-indigo-800/70">
                    Pass Mark: {PASS_THRESHOLD}%
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                  {courseTitle}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close quiz modal"
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {!attemptSummary && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="inline-flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                  <ClipboardCheck className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                  <span>
                    Answered {answeredCount} of {questions.length}
                  </span>
                </span>
                <span className="text-indigo-600 dark:text-indigo-400">
                  {completionPct}%
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-indigo-600 via-violet-600 to-emerald-500 transition-all duration-300"
                  style={{ width: `${completionPct}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Scrollable Content Body */}
        {attemptSummary ? (
          <div className="flex-1 overflow-y-auto px-5 sm:px-7 py-6 space-y-6">
            <div
              className={`rounded-3xl p-6 text-center border space-y-4 ${
                attemptSummary.passed
                  ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-200/80 dark:border-emerald-800/70'
                  : 'bg-amber-50/70 dark:bg-amber-950/25 border-amber-200/80 dark:border-amber-800/70'
              }`}
            >
              <div
                className={`w-16 h-16 rounded-2xl mx-auto flex items-center justify-center shadow-sm ${
                  attemptSummary.passed
                    ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400'
                    : 'bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400'
                }`}
              >
                {attemptSummary.passed ? (
                  <Award className="w-9 h-9" />
                ) : (
                  <RotateCcw className="w-8 h-8" />
                )}
              </div>

              <div className="space-y-1">
                <h4 className="text-2xl font-black text-slate-900 dark:text-white">
                  {attemptSummary.passed
                    ? 'Assessment Passed!'
                    : 'Keep Practicing'}
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  You scored{' '}
                  <strong className="text-slate-900 dark:text-white">
                    {attemptSummary.score}%
                  </strong>{' '}
                  ({attemptSummary.correctCount} of {attemptSummary.totalCount}{' '}
                  correct).
                </p>
              </div>

              {attemptSummary.passed && (
                <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-600/10 dark:bg-emerald-500/15 text-xs font-bold text-emerald-700 dark:text-emerald-300">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>
                    Completion certificate unlocked in your Certificates tab.
                  </span>
                </div>
              )}
            </div>

            {/* Answer Breakdown */}
            <div className="space-y-3">
              <h5 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Question Review
              </h5>
              {attemptSummary.review.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl bg-slate-50/90 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 space-y-2"
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white">
                      {item.number}. {item.question}
                    </p>
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold shrink-0 ${
                        item.isCorrect
                          ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300'
                          : 'bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300'
                      }`}
                    >
                      {item.isCorrect ? (
                        <>
                          <CheckCircle2 className="w-3 h-3" />
                          Correct
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3 h-3" />
                          Incorrect
                        </>
                      )}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    <span className="font-semibold text-slate-700 dark:text-slate-200">
                      Your answer:
                    </span>{' '}
                    {item.chosenText}
                  </p>

                  {!item.isCorrect && (
                    <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                      Correct answer: {item.correctText}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <form
            id="course-assessment-form"
            onSubmit={handleSubmitQuiz}
            className="flex-1 overflow-y-auto px-5 sm:px-7 py-5 space-y-4"
            noValidate
          >
            {questions.map((q, idx) => {
              const chosenIdx = selectedAnswers[q.id];
              const isAnswered = typeof chosenIdx === 'number';

              return (
                <div
                  key={q.id}
                  className={`p-4 sm:p-5 rounded-2xl border transition-all space-y-3.5 ${
                    isAnswered
                      ? 'bg-slate-50/90 dark:bg-slate-800/60 border-indigo-200/80 dark:border-indigo-800/70'
                      : 'bg-slate-50/60 dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-800'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2.5">
                      <span className="w-6 h-6 rounded-lg bg-indigo-600/10 dark:bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 text-xs font-black flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <p className="text-sm font-extrabold text-slate-900 dark:text-white leading-snug">
                        {q.question}
                      </p>
                    </div>

                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide shrink-0 ${
                        isAnswered
                          ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300'
                          : 'bg-slate-200/80 dark:bg-slate-700/80 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {isAnswered ? 'Answered' : 'Pending'}
                    </span>
                  </div>

                  <div className="space-y-2">
                    {q.options.map((opt, optIdx) => {
                      const isPicked = chosenIdx === optIdx;
                      const letter = OPTION_LETTERS[optIdx] || String(optIdx + 1);

                      return (
                        <button
                          key={optIdx}
                          type="button"
                          onClick={() => handleSelectOption(q.id, optIdx)}
                          className={`w-full text-left px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm font-medium transition-all duration-150 cursor-pointer flex items-center justify-between gap-3 ${
                            isPicked
                              ? 'bg-gradient-to-r from-indigo-600 to-violet-600 border-indigo-600 text-white shadow-md shadow-indigo-600/20'
                              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-indigo-400 dark:hover:border-indigo-500 hover:bg-indigo-50/40 dark:hover:bg-slate-800/90'
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <span
                              className={`w-6 h-6 rounded-lg text-xs font-extrabold flex items-center justify-center shrink-0 transition-colors ${
                                isPicked
                                  ? 'bg-white/20 text-white'
                                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                              }`}
                            >
                              {letter}
                            </span>
                            <span className="leading-snug">{opt}</span>
                          </div>

                          <span
                            className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                              isPicked
                                ? 'border-white bg-white/20'
                                : 'border-slate-300 dark:border-slate-600'
                            }`}
                          >
                            {isPicked && (
                              <span className="w-2 h-2 rounded-full bg-white" />
                            )}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            {validationWarning && (
              <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800/70 text-xs font-semibold text-amber-800 dark:text-amber-300 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{validationWarning}</span>
              </div>
            )}
          </form>
        )}

        {/* Sticky Footer */}
        <div className="px-5 sm:px-7 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/95 flex items-center justify-end gap-3 shrink-0">
          {attemptSummary ? (
            <>
              <Button
                type="button"
                variant="outline"
                size="md"
                onClick={handleRetake}
              >
                <RotateCcw className="w-4 h-4" />
                Retake Quiz
              </Button>
              <Button
                type="button"
                variant="primary"
                size="md"
                onClick={onClose}
                className="bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-700 hover:from-indigo-500 hover:via-violet-500 hover:to-indigo-600 text-white font-extrabold shadow-md shadow-indigo-600/20"
              >
                Done
              </Button>
            </>
          ) : (
            <>
              <Button
                type="button"
                variant="outline"
                size="md"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                form="course-assessment-form"
                variant="primary"
                size="md"
                className="bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-700 hover:from-indigo-500 hover:via-violet-500 hover:to-indigo-600 text-white font-extrabold shadow-md shadow-indigo-600/20"
              >
                Submit Quiz
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Quizzes() {
  const { user } = useAuth();
  const {
    courses = [],
    enrolledIds = [],
    quizResults = {},
    certificates = [],
    submitQuiz,
  } = usePlatform();

  const [activeQuiz, setActiveQuiz] = useState(null);

  const quizItems = useMemo(() => {
    return courses
      .filter((course) => enrolledIds.includes(course.id))
      .map((course) => {
        const questions = getQuestionsForCourse(course);
        const result = quizResults[course.id] || null;
        const hasCert = certificates.some(
          (cert) => cert.courseId === course.id
        );

        return {
          courseId: course.id,
          courseTitle: course.title || 'Course',
          category: course.category || 'Course',
          level: course.level || 'All Levels',
          questions,
          questionCount: questions.length,
          result,
          hasCert,
        };
      });
  }, [courses, enrolledIds, quizResults, certificates]);

  const passedCount = quizItems.filter((item) => item.result?.passed).length;

  const attemptedScores = quizItems
    .map((item) => item.result?.score)
    .filter((score) => typeof score === 'number');

  const avgScore =
    attemptedScores.length > 0
      ? Math.round(
          attemptedScores.reduce((sum, s) => sum + s, 0) /
            attemptedScores.length
        )
      : null;

  const KPI_CARDS = [
    {
      label: 'Available Quizzes',
      value: quizItems.length,
      sub: 'Across your enrolled courses',
      icon: HelpCircle,
      accent:
        'bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 group-hover/kpi:bg-indigo-600 group-hover/kpi:text-white',
    },
    {
      label: 'Passed Quizzes',
      value: passedCount,
      sub: `Requires ${PASS_THRESHOLD}% or higher`,
      icon: CheckCircle2,
      accent:
        'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 group-hover/kpi:bg-emerald-600 group-hover/kpi:text-white',
    },
    {
      label: 'Average Score',
      value: avgScore !== null ? `${avgScore}%` : '—',
      sub:
        attemptedScores.length > 0
          ? `Based on ${attemptedScores.length} attempt${
              attemptedScores.length === 1 ? '' : 's'
            }`
          : 'Take a quiz to record scores',
      icon: Trophy,
      accent:
        'bg-violet-50 dark:bg-violet-950/80 text-violet-600 dark:text-violet-400 group-hover/kpi:bg-violet-600 group-hover/kpi:text-white',
    },
  ];

  const handleCompleteQuiz = (courseId, score, passed) => {
    if (typeof submitQuiz === 'function') {
      submitQuiz(courseId, score, passed, user?.name || 'Student');
    }
  };

  return (
    <div className="relative overflow-hidden py-8 lg:py-12">
      <QuizRunnerModal
        quizItem={activeQuiz}
        onClose={() => setActiveQuiz(null)}
        onCompleteQuiz={handleCompleteQuiz}
      />

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
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200/80 dark:border-indigo-800/80 text-indigo-700 dark:text-indigo-300 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>Knowledge Checks & Assessments</span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                Course{' '}
                <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-emerald-600 dark:from-indigo-400 dark:via-violet-400 dark:to-emerald-400 bg-clip-text text-transparent">
                  Quizzes
                </span>
              </h1>

              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                Test your understanding across enrolled courses, track your scores privately, and score {PASS_THRESHOLD}% or higher to unlock completion certificates.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Link to="/student/certificates">
                <Button variant="primary" size="lg">
                  <Award className="w-4 h-4" />
                  Certificates ({certificates.length})
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

        {/* 3 KPI Cards */}
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

        {/* Quiz Cards Grid or Empty State */}
        {quizItems.length === 0 ? (
          <div className="group/empty relative overflow-hidden bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-10 text-center space-y-4 shadow-sm hover:-translate-y-1.5 hover:shadow-2xl hover:border-indigo-300 dark:hover:border-indigo-700 transition-all duration-200">
            <div
              aria-hidden="true"
              className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-indigo-600 via-violet-600 to-emerald-500"
            />
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 group-hover/empty:bg-indigo-600 group-hover/empty:text-white group-hover/empty:scale-105 transition-all duration-200 flex items-center justify-center mx-auto">
              <HelpCircle className="w-7 h-7" />
            </div>
            <div className="space-y-1.5 max-w-md mx-auto">
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
                No Quizzes Available Yet
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Enroll in a course first to unlock its assessment quiz and earn a completion certificate.
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
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {quizItems.map((item) => {
              const hasResult = Boolean(item.result);
              const isPassed = Boolean(item.result?.passed);

              return (
                <div
                  key={item.courseId}
                  className="group/quiz relative overflow-hidden bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-5 sm:p-6 shadow-sm hover:-translate-y-1.5 hover:shadow-2xl hover:border-indigo-300 dark:hover:border-indigo-700 transition-all duration-200 flex flex-col justify-between space-y-5"
                >
                  <div
                    aria-hidden="true"
                    className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-indigo-600 via-violet-600 to-emerald-500 opacity-85"
                  />

                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <Badge tone="indigo">{item.category}</Badge>

                      {hasResult ? (
                        <Badge tone={isPassed ? 'emerald' : 'slate'}>
                          {isPassed ? 'Passed' : 'Needs Retry'} ·{' '}
                          {item.result.score}%
                        </Badge>
                      ) : (
                        <Badge tone="slate">Not Attempted</Badge>
                      )}
                    </div>

                    <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white group-hover/quiz:text-indigo-600 dark:group-hover/quiz:text-indigo-400 transition-colors">
                      {item.courseTitle}
                    </h2>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
                      <span>{item.questionCount} Questions</span>
                      <span>Pass mark: {PASS_THRESHOLD}%</span>
                      {item.hasCert && (
                        <span className="inline-flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Certificate Unlocked
                        </span>
                      )}
                      {hasResult && !isPassed && (
                        <span className="inline-flex items-center gap-1 font-semibold text-amber-600 dark:text-amber-400">
                          <XCircle className="w-3.5 h-3.5" />
                          Score {PASS_THRESHOLD}%+ to pass
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
                    <Link
                      to={`/student/player/${item.courseId}`}
                      className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
                    >
                      <BookOpen className="w-4 h-4 shrink-0" />
                      <span>Review Course Content</span>
                    </Link>

                    <Button
                      type="button"
                      variant="primary"
                      size="md"
                      onClick={() => setActiveQuiz(item)}
                      className="group/quiz bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-700 hover:from-indigo-500 hover:via-violet-500 hover:to-indigo-600 text-white font-extrabold shadow-md shadow-indigo-600/20 hover:shadow-lg hover:shadow-indigo-600/30 hover:-translate-y-0.5 transition-all duration-200 shrink-0"
                    >
                      {hasResult ? (
                        <>
                          <RotateCcw className="w-4 h-4 shrink-0" />
                          <span>Retake Quiz</span>
                          <ArrowRight className="w-4 h-4 group-hover/quiz:translate-x-0.5 transition-transform duration-200 shrink-0" />
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 shrink-0" />
                          <span>Start Quiz</span>
                          <ArrowRight className="w-4 h-4 group-hover/quiz:translate-x-0.5 transition-transform duration-200 shrink-0" />
                        </>
                      )}
                    </Button>
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
