import { useState, useMemo, useEffect } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Star,
  Clock,
  Users,
  Heart,
  CheckCircle2,
  PlayCircle,
  ArrowLeft,
  FileText,
  ChevronDown,
  ShieldCheck,
  Award,
  Sparkles,
  UserCheck,
  MessageSquarePlus,
  AlertTriangle,
  Send,
  LogIn,
  Quote,
} from 'lucide-react';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import { useAuth } from '../../context/AuthContext';
import { usePlatform } from '../../context/PlatformContext';
import { useToast } from '../../context/ToastContext';

const RATING_LABELS = {
  1: 'Needs Improvement',
  2: 'Fair Experience',
  3: 'Good & Helpful',
  4: 'Very Good Course',
  5: 'Outstanding Course',
};

function getReviewerInitials(name) {
  const withoutParens = String(name || 'Learner').replace(/\([^)]*\)/g, ' ');
  const cleaned = withoutParens.trim().replace(/\s+/g, ' ');
  if (!cleaned) return 'LR';

  const parts = cleaned.split(' ').filter(Boolean);
  if (parts.length === 1) {
    const word = parts[0].replace(/[^A-Za-z0-9]/g, '');
    return word ? word.slice(0, 2).toUpperCase() : 'LR';
  }

  const first = parts[0].replace(/[^A-Za-z0-9]/g, '').charAt(0);
  const last = parts[parts.length - 1]
    .replace(/[^A-Za-z0-9]/g, '')
    .charAt(0);
  return `${first}${last}`.toUpperCase() || 'LR';
}

function ReviewNoticeModal({ notice, onClose }) {
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
      aria-labelledby="review-notice-title"
    >
      <div
        className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-7 sm:p-8 shadow-2xl text-center space-y-5 overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          aria-hidden="true"
          className={`absolute inset-x-0 top-0 h-1.5 ${
            isSuccess
              ? 'bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-500'
              : 'bg-gradient-to-r from-red-500 via-rose-500 to-amber-500'
          }`}
        />

        <div
          className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto ${
            isSuccess
              ? 'bg-indigo-100/90 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400'
              : 'bg-red-100/90 dark:bg-red-950/80 text-red-600 dark:text-red-400'
          }`}
        >
          {isSuccess ? (
            <CheckCircle2 className="w-7 h-7" />
          ) : (
            <AlertTriangle className="w-7 h-7" />
          )}
        </div>

        <div className="space-y-2">
          <h3
            id="review-notice-title"
            className="text-xl font-black text-slate-900 dark:text-white"
          >
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
            className="min-w-[116px] justify-center"
          >
            OK
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function CourseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth() || {};
  const {
    courses,
    enrolledIds,
    enrollCourse,
    wishlistIds,
    toggleWishlist,
    getCourseProgress,
  } = usePlatform();
  const toast = useToast();

  const searchParams = new URLSearchParams(location.search);
  const fromParam = searchParams.get('from');
  const isFromAdmin = fromParam === 'admin' || fromParam === 'manage';
  const isStudentPortal = location.pathname.startsWith('/student');

  const backToCoursesPath =
    fromParam === 'manage'
      ? '/admin/courses'
      : isFromAdmin
        ? '/admin'
        : isStudentPortal
          ? '/student/courses'
          : '/courses';

  const backButtonLabel = isFromAdmin
    ? 'Back to Instructor Studio'
    : 'Back to All Courses';

  const course = useMemo(() => courses.find((c) => c.id === id), [courses, id]);
  const reviewStorageKey = `course_reviews_${course?.id || id}`;

  const [openSections, setOpenSections] = useState({ 0: true, 1: true });
  const [submittedReviews, setSubmittedReviews] = useState([]);
  const [reviewerName, setReviewerName] = useState(user?.name || '');
  const [rating, setRating] = useState(5);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [reviewNotice, setReviewNotice] = useState(null);

  useEffect(() => {
    setFieldErrors({});
    setComment('');
    setRating(5);

    if (!id) {
      setSubmittedReviews([]);
      return;
    }

    try {
      const raw =
        window.localStorage.getItem(`course_reviews_${id}`) ??
        window.localStorage.getItem(`olp_course_reviews_${id}`);
      const parsed = raw ? JSON.parse(raw) : [];
      setSubmittedReviews(Array.isArray(parsed) ? parsed : []);
    } catch (err) {
      console.error('Failed to load reviews from localStorage:', err);
      setSubmittedReviews([]);
    }
  }, [id]);

  useEffect(() => {
    setReviewerName(user?.name || '');
  }, [user]);

  if (!course) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-10 shadow-sm space-y-4">
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">
            Course Not Found
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            The course you are looking for may have been moved or removed.
          </p>
          <Link to={backToCoursesPath}>
            <Button variant="primary">
              {isFromAdmin
                ? 'Back to Instructor Studio'
                : 'Back to Explore Courses'}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const isEnrolled = enrolledIds.includes(course.id);
  const isWishlisted = wishlistIds.includes(course.id);
  const progress = getCourseProgress(course.id);

  const baseReviews = Array.isArray(course?.reviews) ? course.reviews : [];
  const allReviews = [...submittedReviews, ...baseReviews];
  const displayedReviewCount =
    (typeof course?.reviewsCount === 'number'
      ? course.reviewsCount
      : baseReviews.length) + submittedReviews.length;

  const averageRating = useMemo(() => {
    if (allReviews.length === 0) {
      return typeof course?.rating === 'number'
        ? course.rating.toFixed(1)
        : '5.0';
    }
    const sum = allReviews.reduce(
      (acc, rev) => acc + Math.max(1, Math.min(5, Number(rev?.rating) || 5)),
      0
    );
    return (sum / allReviews.length).toFixed(1);
  }, [allReviews, course?.rating]);

  const ratingBreakdown = useMemo(() => {
    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    allReviews.forEach((rev) => {
      const rounded = Math.max(
        1,
        Math.min(5, Math.round(Number(rev?.rating) || 5))
      );
      counts[rounded] += 1;
    });
    const total = allReviews.length;
    return [5, 4, 3, 2, 1].map((star) => ({
      star,
      count: counts[star],
      percent: total > 0 ? Math.round((counts[star] / total) * 100) : 0,
    }));
  }, [allReviews]);

  const totalLessons = course.sections.reduce(
    (sum, sec) => sum + sec.lessons.length,
    0
  );

  const toggleSection = (idx) => {
    setOpenSections((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const handleEnroll = () => {
    if (!user) {
      toast.info('Please log in to enroll in this course.');
      navigate('/login', { state: { from: location.pathname } });
      return;
    }

    enrollCourse(course.id);
    toast.success(
      `Enrolled in "${course.title}"! You can now write a review or start learning.`
    );
  };

  const handleWishlist = () => {
    if (!user) {
      toast.info('Please log in to save courses to your wishlist.');
      navigate('/login', { state: { from: location.pathname } });
      return;
    }

    toggleWishlist(course.id);
    toast.info(
      isWishlisted ? 'Removed from wishlist.' : 'Saved to your wishlist!'
    );
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();

    if (!user) {
      toast.info('Please log in to submit a learner review.');
      navigate('/login', { state: { from: location.pathname } });
      return;
    }

    if (!isEnrolled) {
      setReviewNotice({
        type: 'warning',
        title: 'Enrollment Required',
        message: 'Enroll in this course first before posting a learner review.',
      });
      return;
    }

    const cleanName = reviewerName.trim();
    const cleanComment = comment.trim();
    const nextErrors = {};

    if (!cleanName) {
      nextErrors.name = 'Please enter your display name.';
    } else if (cleanName.length < 2) {
      nextErrors.name = 'Name must be at least 2 characters long.';
    }

    if (!cleanComment) {
      nextErrors.comment = 'Please write a short review before submitting.';
    } else if (cleanComment.length < 10) {
      nextErrors.comment = 'Review comment must be at least 10 characters long.';
    }

    if (Object.keys(nextErrors).length > 0) {
      setFieldErrors(nextErrors);
      setReviewNotice({
        type: 'warning',
        title: 'Incomplete Review',
        message: Object.values(nextErrors)[0],
      });
      return;
    }

    const newReview = {
      id: `rev_${Date.now()}`,
      user: cleanName,
      rating,
      comment: cleanComment,
      date: new Date().toLocaleDateString('en-CA'),
      verified: true,
    };

    setFieldErrors({});
    setSubmittedReviews((prev) => {
      const updated = [newReview, ...prev];
      try {
        window.localStorage.setItem(reviewStorageKey, JSON.stringify(updated));
      } catch (err) {
        console.error('Failed to save review to localStorage:', err);
      }
      return updated;
    });
    setComment('');
    setRating(5);
    setReviewNotice({
      type: 'success',
      title: 'Review Published',
      message: 'Thank you! Your feedback is now visible to fellow learners.',
    });
  };

  const activeStar = hoveredRating || rating;

  return (
    <div className="pb-16">
      <ReviewNoticeModal
        notice={reviewNotice}
        onClose={() => setReviewNotice(null)}
      />

      {/* Top Hero Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white py-10 lg:py-14 border-b border-slate-800/90">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-20 right-10 w-96 h-96 rounded-full bg-indigo-500/15 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-24 left-1/4 w-80 h-80 rounded-full bg-violet-500/10 blur-3xl"
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            to={backToCoursesPath}
            className="group/back inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 hover:-translate-y-0.5 hover:shadow-md border border-white/10 text-xs font-bold text-indigo-200 hover:text-white mb-6 transition-all duration-150"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform duration-150 group-hover/back:-translate-x-0.5" />
            <span>{backButtonLabel}</span>
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="flex flex-wrap items-center gap-2.5">
                <Badge tone="indigo">{course.category}</Badge>
                <span className="px-2.5 py-0.5 rounded-full bg-white/10 border border-white/10 text-xs font-semibold text-slate-200">
                  {course.level}
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-400/10 border border-amber-400/25 text-xs font-bold text-amber-300">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{averageRating}</span>
                  <span className="text-amber-200/80 font-medium">
                    ({displayedReviewCount}{' '}
                    {displayedReviewCount === 1 ? 'review' : 'reviews'})
                  </span>
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-[2.65rem] font-black tracking-tight leading-[1.12] text-white">
                {course.title}
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
                {course.subtitle}
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2 text-xs sm:text-sm">
                <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 hover:-translate-y-0.5 hover:shadow-md border border-white/10 text-slate-200 transition-all duration-150">
                  <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-extrabold flex items-center justify-center">
                    {course.instructor?.name?.charAt(0) || 'I'}
                  </span>
                  <span className="text-slate-400">Created by</span>
                  <strong className="font-bold text-white">
                    {course.instructor.name}
                  </strong>
                </div>

                <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 hover:-translate-y-0.5 hover:shadow-md border border-white/10 text-slate-200 font-medium transition-all duration-150">
                  <Clock className="w-4 h-4 text-indigo-400" />
                  <span>{course.duration}</span>
                </div>

                <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 hover:-translate-y-0.5 hover:shadow-md border border-white/10 text-slate-200 font-medium transition-all duration-150">
                  <Users className="w-4 h-4 text-indigo-400" />
                  <span>
                    {(
                      typeof course?.studentsCount === 'number'
                        ? course.studentsCount
                        : typeof course?.students === 'number'
                          ? course.students
                          : 0
                    ).toLocaleString()}{' '}
                    students
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content + Sticky Enrollment Card */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Outcomes, Curriculum, Reviews */}
          <div className="lg:col-span-8 space-y-8">
            {/* What You'll Learn Card */}
            <div className="relative overflow-hidden bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 shadow-sm hover:-translate-y-1 hover:shadow-xl hover:border-indigo-300 dark:hover:border-indigo-700 transition-all duration-200 space-y-5">
              <div
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-500 opacity-85"
              />

              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                      What You'll Learn
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Practical skills and deliverables covered in this track
                    </p>
                  </div>
                </div>
                <Badge tone="indigo" className="hidden sm:inline-flex">
                  <UserCheck className="w-3.5 h-3.5 mr-1" />
                  Hands-On Outcomes
                </Badge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {(Array.isArray(course?.outcomes) && course.outcomes.length > 0
                  ? course.outcomes
                  : [
                      'Build structured, real-world project deliverables step by step',
                      'Apply practical concepts through guided lessons and assessments',
                    ]
                ).map((item, idx) => (
                  <div
                    key={`${item}-${idx}`}
                    className="p-3.5 rounded-2xl bg-slate-50/90 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-800 hover:-translate-y-0.5 hover:shadow-md hover:bg-white dark:hover:bg-slate-800 hover:border-indigo-300 dark:hover:border-indigo-600 transition-all duration-150 flex items-start gap-3"
                  >
                    <CheckCircle2 className="w-4 h-4 text-indigo-500 dark:text-indigo-400 shrink-0 mt-0.5" />
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-200 leading-relaxed">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Course Curriculum Card */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-7 shadow-sm hover:-translate-y-1 hover:shadow-xl hover:border-indigo-300 dark:hover:border-indigo-700 transition-all duration-200 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                  Course Curriculum
                </h2>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  {course.sections.length} modules • {totalLessons} lessons •{' '}
                  {course.duration}
                </span>
              </div>

              <div className="space-y-3">
                {course.sections.map((sec, idx) => {
                  const isOpen = Boolean(openSections[idx]);
                  return (
                    <div
                      key={sec.id}
                      className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-2xs hover:-translate-y-0.5 hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-700 transition-all duration-150"
                    >
                      <button
                        type="button"
                        onClick={() => toggleSection(idx)}
                        className="w-full px-4 py-3.5 bg-slate-50 dark:bg-slate-800/70 hover:bg-indigo-50/70 dark:hover:bg-slate-800 flex items-center justify-between gap-3 text-left transition-colors cursor-pointer"
                      >
                        <span className="font-bold text-sm text-slate-900 dark:text-white">
                          {sec.title}
                        </span>
                        <span className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 shrink-0">
                          {sec.lessons.length} lessons
                          <ChevronDown
                            className={`w-4 h-4 transition-transform duration-200 ${
                              isOpen
                                ? 'rotate-180 text-indigo-600 dark:text-indigo-400'
                                : ''
                            }`}
                          />
                        </span>
                      </button>

                      {isOpen && (
                        <div className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900">
                          {sec.lessons.map((lesson) => (
                            <div
                              key={lesson.id}
                              className="px-4 py-3 flex items-center justify-between gap-3 text-sm hover:-translate-y-0.5 hover:bg-indigo-50/50 dark:hover:bg-slate-800/60 transition-all duration-150"
                            >
                              <span className="flex items-center gap-2.5 text-slate-700 dark:text-slate-200 font-medium">
                                <PlayCircle className="w-4 h-4 text-indigo-500 dark:text-indigo-400 shrink-0" />
                                {lesson.title}
                              </span>
                              <span className="text-xs font-medium text-slate-500 dark:text-slate-400 shrink-0">
                                {lesson.duration}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Learner Reviews Section — Enrolled-Only Reviews with LocalStorage Persistence */}
            <section
              aria-labelledby="learner-reviews-heading"
              className="relative overflow-hidden bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 shadow-sm hover:-translate-y-1 hover:shadow-xl hover:border-indigo-300 dark:hover:border-indigo-700 transition-all duration-200 space-y-6"
            >
              {/* Top Gradient Accent Bar */}
              <div
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-500 opacity-85"
              />

              {/* Section Header */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/70 text-amber-500 dark:text-amber-400 flex items-center justify-center shrink-0">
                    <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                  </div>
                  <div>
                    <h2
                      id="learner-reviews-heading"
                      className="text-xl font-extrabold text-slate-900 dark:text-white"
                    >
                      Learner Reviews
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Verified feedback from enrolled students
                    </p>
                  </div>
                </div>

                <Badge tone="indigo">
                  {allReviews.length}{' '}
                  {allReviews.length === 1 ? 'Review' : 'Reviews'}
                </Badge>
              </div>

              {/* Rating Overview Summary Card */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center p-5 rounded-2xl bg-gradient-to-br from-slate-50 via-indigo-50/40 to-violet-50/40 dark:from-slate-800/80 dark:via-slate-800/60 dark:to-indigo-950/30 border border-slate-200/80 dark:border-slate-800">
                <div className="sm:col-span-4 flex flex-col items-center justify-center text-center sm:border-r sm:border-slate-200/80 dark:sm:border-slate-700/80 sm:pr-4">
                  <span className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">
                    {averageRating}
                  </span>
                  <div className="flex items-center gap-1 my-1.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-4 h-4 ${
                          s <= Math.round(Number(averageRating))
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-slate-300 dark:text-slate-600'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    Course Rating ({allReviews.length})
                  </span>
                </div>

                <div className="sm:col-span-8 space-y-2">
                  {ratingBreakdown.map(({ star, count, percent }) => (
                    <div key={star} className="flex items-center gap-3 text-xs">
                      <span className="inline-flex items-center gap-1 font-bold text-slate-700 dark:text-slate-300 w-10 shrink-0">
                        {star}
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      </span>
                      <div className="flex-1 h-2 rounded-full bg-slate-200/80 dark:bg-slate-700/80 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-amber-400 to-amber-500 transition-all duration-300"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                      <span className="w-8 text-right font-semibold text-slate-500 dark:text-slate-400 shrink-0">
                        {count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Review Gate: Logged-out -> Login Prompt, Unenrolled -> Enroll Prompt, Enrolled -> Form */}
              {!user ? (
                <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-50/80 via-slate-50 to-violet-50/80 dark:from-indigo-950/40 dark:via-slate-800/60 dark:to-violet-950/40 border border-indigo-200/70 dark:border-indigo-800/60 flex flex-wrap items-center justify-between gap-4">
                  <div className="space-y-0.5">
                    <p className="text-sm font-bold text-slate-900 dark:text-white">
                      Have you taken this course?
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-300">
                      Sign in and enroll in this course to rate lessons and share feedback.
                    </p>
                  </div>
                  <Link to="/login" state={{ from: location.pathname }}>
                    <Button type="button" variant="primary" size="sm">
                      <LogIn className="w-3.5 h-3.5" />
                      <span>Log In to Review</span>
                    </Button>
                  </Link>
                </div>
              ) : !isEnrolled ? (
                <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-50/80 via-slate-50 to-indigo-50/60 dark:from-amber-950/30 dark:via-slate-800/60 dark:to-indigo-950/30 border border-amber-200/80 dark:border-amber-800/60 flex flex-wrap items-center justify-between gap-4">
                  <div className="space-y-0.5">
                    <p className="text-sm font-bold text-slate-900 dark:text-white">
                      Enroll to Leave a Review
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-300">
                      Only enrolled learners can rate and review this course.
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="primary"
                    size="sm"
                    onClick={handleEnroll}
                  >
                    Enroll Now
                  </Button>
                </div>
              ) : (
                <form
                  onSubmit={handleReviewSubmit}
                  noValidate
                  className="p-5 sm:p-6 rounded-2xl bg-slate-50/90 dark:bg-slate-800/55 border border-slate-200/80 dark:border-slate-700/80 space-y-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200/70 dark:border-slate-700/70">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-950/90 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                        <MessageSquarePlus className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                          Write a Learner Review
                        </h3>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          Help other students decide if this course fits their goals
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hidden sm:inline">
                        {RATING_LABELS[activeStar]}
                      </span>
                      <div
                        className="inline-flex items-center gap-0.5 px-2.5 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-700 shadow-2xs"
                        role="group"
                        aria-label="Select star rating"
                        onMouseLeave={() => setHoveredRating(0)}
                      >
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            onMouseEnter={() => setHoveredRating(star)}
                            aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
                            className="p-1 rounded-lg hover:scale-110 transition-transform duration-150 cursor-pointer"
                          >
                            <Star
                              className={`w-4 h-4 transition-colors ${
                                star <= activeStar
                                  ? 'fill-amber-400 text-amber-400'
                                  : 'text-slate-300 dark:text-slate-600'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label
                      htmlFor="review-author-name"
                      className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300"
                    >
                      Display Name
                    </label>
                    <input
                      id="review-author-name"
                      type="text"
                      maxLength={60}
                      value={reviewerName}
                      onChange={(e) => {
                        setReviewerName(e.target.value);
                        if (fieldErrors.name) {
                          setFieldErrors((prev) => ({ ...prev, name: '' }));
                        }
                      }}
                      placeholder="Enter your name"
                      className={`w-full px-4 py-2.5 text-sm rounded-xl bg-white dark:bg-slate-900 border text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all ${
                        fieldErrors.name
                          ? 'border-red-500 focus:ring-red-500/20'
                          : 'border-slate-300 dark:border-slate-700 focus:border-indigo-500 focus:ring-indigo-500/20'
                      }`}
                    />
                    {fieldErrors.name && (
                      <p className="text-xs font-semibold text-red-600 dark:text-red-400 flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                        <span>{fieldErrors.name}</span>
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label
                        htmlFor="review-comment-input"
                        className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300"
                      >
                        Your Review
                      </label>
                      <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500">
                        {comment.length} / 350
                      </span>
                    </div>
                    <textarea
                      id="review-comment-input"
                      rows={3}
                      maxLength={350}
                      value={comment}
                      onChange={(e) => {
                        setComment(e.target.value);
                        if (fieldErrors.comment) {
                          setFieldErrors((prev) => ({ ...prev, comment: '' }));
                        }
                      }}
                      placeholder="Share what you learned, lesson pacing, or practical takeaways..."
                      className={`w-full px-4 py-3 text-sm rounded-xl bg-white dark:bg-slate-900 border text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all resize-none ${
                        fieldErrors.comment
                          ? 'border-red-500 focus:ring-red-500/20'
                          : 'border-slate-300 dark:border-slate-700 focus:border-indigo-500 focus:ring-indigo-500/20'
                      }`}
                    />
                    {fieldErrors.comment && (
                      <p className="text-xs font-semibold text-red-600 dark:text-red-400 flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                        <span>{fieldErrors.comment}</span>
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col items-stretch sm:flex-row sm:items-center sm:justify-between gap-3 pt-1">
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      Posting as{' '}
                      <strong className="font-semibold text-slate-700 dark:text-slate-200">
                        {reviewerName.trim() || user.name || 'Learner'}
                      </strong>
                    </span>
                    <Button
                      type="submit"
                      variant="primary"
                      size="md"
                      className="w-full sm:w-auto justify-center whitespace-nowrap bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-700 hover:from-indigo-500 hover:via-violet-500 hover:to-indigo-600 text-white font-bold shadow-md shadow-indigo-600/20 hover:shadow-lg hover:shadow-indigo-600/30 hover:-translate-y-0.5 transition-all duration-200"
                    >
                      <Send className="w-3.5 h-3.5 shrink-0" />
                      <span>Submit Review</span>
                    </Button>
                  </div>
                </form>
              )}

              {/* Reviews List */}
              {allReviews.length > 0 ? (
                <div className="space-y-4">
                  {allReviews.map((rev, idx) => {
                    const starCount = Math.max(
                      0,
                      Math.min(5, Math.round(Number(rev?.rating) || 0))
                    );
                    const authorName = rev?.user || 'Learner';
                    const isVerified = rev?.verified !== false;

                    return (
                      <article
                        key={rev?.id || idx}
                        className="group/rev relative p-5 rounded-2xl bg-slate-50/90 dark:bg-slate-800/60 border border-slate-200/75 dark:border-slate-800 shadow-2xs hover:-translate-y-1 hover:shadow-lg hover:bg-white dark:hover:bg-slate-800 hover:border-indigo-300 dark:hover:border-indigo-600 transition-all duration-200 space-y-3"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-600 via-violet-600 to-indigo-500 text-white text-xs font-extrabold flex items-center justify-center shrink-0 shadow-xs">
                              {getReviewerInitials(authorName)}
                            </div>
                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="font-bold text-sm text-slate-900 dark:text-white group-hover/rev:text-indigo-600 dark:group-hover/rev:text-indigo-400 transition-colors truncate">
                                  {authorName}
                                </span>
                                {isVerified && (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200/80 dark:border-emerald-800/70 text-[10px] font-bold text-emerald-700 dark:text-emerald-300">
                                    <CheckCircle2 className="w-2.5 h-2.5" />
                                    Verified Learner
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-1 mt-1">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-3.5 h-3.5 ${
                                      i < starCount
                                        ? 'fill-amber-400 text-amber-400'
                                        : 'text-slate-300 dark:text-slate-600'
                                    }`}
                                  />
                                ))}
                                <span className="ml-1.5 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                                  {starCount}.0
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-xs font-medium text-slate-400 dark:text-slate-500">
                              {rev?.date || 'Recently'}
                            </span>
                            <Quote className="w-4 h-4 text-indigo-200 dark:text-indigo-900/80 hidden sm:block" />
                          </div>
                        </div>

                        <p className="text-sm text-slate-700 dark:text-slate-300 group-hover/rev:text-slate-900 dark:group-hover/rev:text-white leading-relaxed transition-colors">
                          {rev?.comment || 'No review comment provided.'}
                        </p>
                      </article>
                    );
                  })}
                </div>
              ) : (
                <div className="p-6 rounded-2xl bg-slate-50/90 dark:bg-slate-800/60 border border-dashed border-slate-300/80 dark:border-slate-700 text-center space-y-1.5">
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-200">
                    No learner reviews yet
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Be the first enrolled learner to share your thoughts on this course.
                  </p>
                </div>
              )}
            </section>
          </div>

          {/* Right Column: Sticky Purchase / Enroll Card */}
          <div className="lg:col-span-4 lg:sticky lg:top-24">
            <div className="group/card bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 overflow-hidden shadow-md hover:-translate-y-1.5 hover:shadow-2xl hover:border-indigo-300 dark:hover:border-indigo-700 transition-all duration-300">
              <div className="group/thumb relative aspect-video bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-105 group-hover/card:-translate-y-1"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/45 via-transparent to-transparent opacity-80 group-hover/card:opacity-100 transition-opacity duration-300" />
              </div>

              <div className="p-6 space-y-5">
                <div className="flex items-baseline gap-2.5">
                  <span className="text-3xl font-black text-slate-900 dark:text-white">
                    ${course.price}
                  </span>
                  {course.originalPrice > course.price && (
                    <span className="text-sm text-slate-400 dark:text-slate-500 line-through">
                      ${course.originalPrice}
                    </span>
                  )}
                </div>

                {isEnrolled ? (
                  <div className="space-y-3">
                    <div className="p-3 rounded-xl bg-indigo-50/90 dark:bg-indigo-950/70 border border-indigo-200/80 dark:border-indigo-800/70 text-xs font-semibold text-indigo-700 dark:text-indigo-300">
                      You're enrolled • {progress}% completed
                    </div>
                    <Link to={`/student/player/${course.id}`} className="block">
                      <Button
                        type="button"
                        variant="primary"
                        size="lg"
                        className="w-full bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-700 hover:from-indigo-500 hover:via-violet-500 hover:to-indigo-600 text-white font-extrabold shadow-md shadow-indigo-600/25 hover:shadow-xl hover:shadow-indigo-600/35 hover:-translate-y-0.5 transition-all duration-200"
                      >
                        <PlayCircle className="w-4 h-4" />
                        Continue Learning
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <Button
                    variant="primary"
                    size="lg"
                    className="w-full"
                    onClick={handleEnroll}
                  >
                    Enroll Now
                  </Button>
                )}

                <Button
                  variant="outline"
                  size="md"
                  className="w-full"
                  onClick={handleWishlist}
                >
                  <Heart
                    className={`w-4 h-4 ${
                      isWishlisted
                        ? 'fill-rose-500 text-rose-500'
                        : 'text-slate-600 dark:text-slate-300'
                    }`}
                  />
                  {isWishlisted ? 'Saved in Wishlist' : 'Add to Wishlist'}
                </Button>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
                  <p className="font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                    This Course Includes:
                  </p>
                  <div className="flex items-center gap-2 hover:translate-x-1 transition-transform duration-150">
                    <PlayCircle className="w-4 h-4 text-indigo-500 dark:text-indigo-400 shrink-0" />
                    <span>{totalLessons} structured video lessons</span>
                  </div>
                  <div className="flex items-center gap-2 hover:translate-x-1 transition-transform duration-150">
                    <FileText className="w-4 h-4 text-indigo-500 dark:text-indigo-400 shrink-0" />
                    <span>Personal notes & downloadable resources</span>
                  </div>
                  <div className="flex items-center gap-2 hover:translate-x-1 transition-transform duration-150">
                    <ShieldCheck className="w-4 h-4 text-indigo-500 dark:text-indigo-400 shrink-0" />
                    <span>Practical assignment & graded quiz</span>
                  </div>
                  <div className="flex items-center gap-2 hover:translate-x-1 transition-transform duration-150">
                    <Award className="w-4 h-4 text-indigo-500 dark:text-indigo-400 shrink-0" />
                    <span>Certificate of completion</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
