import { Link, useLocation } from 'react-router-dom';
import {
  Star,
  Clock,
  Users,
  Heart,
  CheckCircle2,
  ArrowRight,
  BookOpen,
  Layers,
} from 'lucide-react';
import Button from './Button';
import { useAuth } from '../../context/AuthContext';
import { usePlatform } from '../../context/PlatformContext';
import { useToast } from '../../context/ToastContext';

export default function CourseCard({ course }) {
  const location = useLocation();
  const { user } = useAuth() || {};
  const { enrolledIds = [], wishlistIds = [], toggleWishlist } =
    usePlatform() || {};
  const toast = useToast();

  if (!course) return null;

  const isEnrolled = enrolledIds.includes(course.id);
  const isWishlisted = wishlistIds.includes(course.id);
  const isStudentRoute = location.pathname.startsWith('/student');
  const isAdminRoute = location.pathname.startsWith('/admin');
  const detailsPath = isStudentRoute
    ? `/student/courses/${course.id}`
    : isAdminRoute
      ? `/courses/${course.id}?from=admin`
      : `/courses/${course.id}`;
  const playerPath = `/student/player/${course.id}`;
  const continueTarget = user
    ? playerPath
    : { pathname: '/login', state: { from: playerPath } };

  const totalLessons = Array.isArray(course.sections)
    ? course.sections.reduce(
        (sum, s) => sum + (Array.isArray(s.lessons) ? s.lessons.length : 0),
        0
      )
    : 0;

  const studentsCount =
    typeof course.studentsCount === 'number'
      ? course.studentsCount
      : typeof course.students === 'number'
        ? course.students
        : 0;

  const ratingValue =
    typeof course.rating === 'number' ? course.rating : 5.0;

  const reviewsCount =
    typeof course.reviewsCount === 'number'
      ? course.reviewsCount
      : Array.isArray(course.reviews)
        ? course.reviews.length
        : 0;

  const price = typeof course.price === 'number' ? course.price : 0;
  const originalPrice =
    typeof course.originalPrice === 'number' ? course.originalPrice : 0;

  const discountPercent =
    originalPrice > price && originalPrice > 0
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : 0;

  const hasThumbnail =
    typeof course.thumbnail === 'string' && course.thumbnail.trim().length > 0;

  const summaryText = course.subtitle || course.description || '';

  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (typeof toggleWishlist === 'function') {
      toggleWishlist(course.id);
    }
    toast?.info?.(
      isWishlisted ? 'Removed from your wishlist.' : 'Saved to your wishlist!'
    );
  };

  return (
    <div className="group relative min-w-0 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 overflow-hidden shadow-sm hover:-translate-y-1.5 hover:shadow-2xl hover:border-indigo-300 dark:hover:border-indigo-700 transition-all duration-300 flex flex-col">
      {/* Thumbnail Header */}
      <div className="relative aspect-video bg-slate-100 dark:bg-slate-800 overflow-hidden">
        <Link to={detailsPath} className="block w-full h-full">
          {hasThumbnail ? (
            <img
              src={course.thumbnail.trim()}
              alt={course.title || 'Course thumbnail'}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-indigo-600 via-violet-600 to-emerald-600 text-white p-4">
              <Layers className="w-10 h-10 opacity-90" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/15 to-transparent" />
        </Link>

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-12 flex items-center gap-1.5 min-w-0">
          <span className="max-w-[6.5rem] sm:max-w-[7.5rem] px-2 py-1 rounded-lg bg-slate-900/80 backdrop-blur-xs text-white text-[11px] font-bold tracking-wide truncate">
            {course.category || 'Course'}
          </span>
          <span className="px-2 py-1 rounded-lg bg-white/90 dark:bg-slate-900/90 backdrop-blur-xs text-slate-800 dark:text-slate-200 text-[11px] font-bold whitespace-nowrap shrink-0">
            {course.level || 'All Levels'}
          </span>
        </div>

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={handleWishlistClick}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/95 dark:bg-slate-900/90 hover:bg-white dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 shadow-md hover:scale-105 transition-all duration-150 cursor-pointer shrink-0"
        >
          <Heart
            className={`w-4 h-4 ${
              isWishlisted
                ? 'fill-rose-500 text-rose-500'
                : 'text-slate-600 dark:text-slate-300'
            }`}
          />
        </button>

        {/* Bottom Image Overlay: Rating & Instructor */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2 min-w-0">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/95 truncate min-w-0">
            <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[10px] font-extrabold flex items-center justify-center shrink-0">
              {course.instructor?.name?.charAt(0) || 'I'}
            </span>
            <span className="truncate">
              {course.instructor?.name || 'Instructor'}
            </span>
          </span>

          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-900/85 backdrop-blur-xs text-xs font-extrabold text-amber-400 whitespace-nowrap shrink-0">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 shrink-0" />
            {ratingValue}
            <span className="font-normal text-slate-300">
              ({reviewsCount})
            </span>
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col min-w-0">
        <Link to={detailsPath} className="block min-w-0">
          <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors leading-snug line-clamp-2">
            {course.title}
          </h3>
        </Link>

        <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-2 flex-1">
          {summaryText}
        </p>

        {/* Course Stats Pill Bar */}
        <div className="mt-4 py-2 px-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-x-2 gap-y-1 text-[11px] font-semibold text-slate-600 dark:text-slate-300 min-w-0">
          <span className="inline-flex items-center gap-1 whitespace-nowrap">
            <Clock className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
            {course.duration || 'Self-paced'}
          </span>
          {totalLessons > 0 && (
            <span className="inline-flex items-center gap-1 whitespace-nowrap">
              <BookOpen className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400 shrink-0" />
              {totalLessons} lessons
            </span>
          )}
          <span className="inline-flex items-center gap-1 whitespace-nowrap">
            <Users className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            {studentsCount.toLocaleString()}
          </span>
        </div>

        {/* Price & Prominent CTA Footer */}
        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col items-stretch gap-3 min-w-0">
          <div className="flex items-baseline justify-between gap-2">
            <div className="flex items-baseline gap-2">
              <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                {price > 0 ? `$${price}` : 'Free'}
              </span>
              {originalPrice > price && (
                <span className="text-xs font-medium text-slate-400 dark:text-slate-500 line-through">
                  ${originalPrice}
                </span>
              )}
            </div>
            {discountPercent > 0 && (
              <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 whitespace-nowrap">
                Save {discountPercent}%
              </span>
            )}
          </div>

          {isEnrolled ? (
            <Link to={continueTarget} className="w-full block">
              <Button
                variant="secondary"
                size="md"
                className="group/btn w-full justify-center whitespace-nowrap bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 active:from-emerald-700 active:to-teal-700 shadow-md shadow-emerald-600/25 hover:shadow-lg hover:shadow-emerald-600/35 px-4"
              >
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Continue</span>
                <ArrowRight className="w-4 h-4 shrink-0 transition-transform duration-150 group-hover/btn:translate-x-0.5" />
              </Button>
            </Link>
          ) : (
            <Link to={detailsPath} className="w-full block">
              <Button
                variant="primary"
                size="md"
                className="group/btn w-full justify-center whitespace-nowrap bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 hover:from-indigo-500 hover:via-violet-500 hover:to-indigo-500 active:from-indigo-700 active:to-violet-700 shadow-md shadow-indigo-600/25 hover:shadow-lg hover:shadow-indigo-600/35 px-4"
              >
                <span>View Course</span>
                <ArrowRight className="w-4 h-4 shrink-0 transition-transform duration-150 group-hover/btn:translate-x-0.5" />
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
