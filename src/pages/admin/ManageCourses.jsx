import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Layers,
  Users,
  Star,
  Sparkles,
  PlusCircle,
  Search,
  Edit3,
  Trash2,
  Eye,
  Clock,
  GraduationCap,
  LayoutDashboard,
  X,
  CheckCircle2,
  AlertTriangle,
  Save,
  Upload,
} from 'lucide-react';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import { usePlatform } from '../../context/PlatformContext';
import FilterDropdown, {
  INSTRUCTOR_LEVEL_OPTIONS,
} from '../../components/common/FilterDropdown';

const ALLOWED_LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'All Levels'];

const DURATION_PATTERN =
  /^(?:(\d+(?:\.\d+)?)\s*(?:h|hr|hrs|hour|hours))(?:\s+(\d+)\s*(?:m|min|mins|minute|minutes))?$|^(?:(\d+)\s*(?:m|min|mins|minute|minutes))$/i;

function isValidDuration(value) {
  const trimmed = value.trim();
  const match = DURATION_PATTERN.exec(trimmed);
  if (!match) return false;

  const hours = match[1] ? Number(match[1]) : 0;
  const minsFromCombo = match[2] ? Number(match[2]) : 0;
  const minsOnly = match[3] ? Number(match[3]) : 0;
  const totalMinutes = hours * 60 + minsFromCombo + minsOnly;

  return Number.isFinite(totalMinutes) && totalMinutes > 0;
}

function QuickEditCourseModal({ course, onClose, onSaveCourse, onShowNotice }) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [level, setLevel] = useState('Beginner');
  const [duration, setDuration] = useState('');
  const [price, setPrice] = useState('0');
  const [instructorName, setInstructorName] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [thumbnailFileName, setThumbnailFileName] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!course) return;
    setTitle(course.title || '');
    setCategory(course.category || '');
    setLevel(course.level || 'Beginner');
    setDuration(course.duration || '');
    setPrice(
      typeof course.price === 'number' && !Number.isNaN(course.price)
        ? String(course.price)
        : '0'
    );
    setInstructorName(course.instructor?.name || 'Instructor');
    setThumbnail(course.thumbnail || '');
    setThumbnailFileName('');
    setDescription(course.description || '');
    setErrors({});
  }, [course]);

  useEffect(() => {
    if (!course) return;
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [course, onClose]);

  if (!course) return null;

  const isDataUrl = thumbnail.trim().startsWith('data:image/');

  const handleThumbnailFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrors((prev) => ({
        ...prev,
        thumbnail: 'Please select a valid image file (PNG, JPG, WebP, or GIF).',
      }));
      e.target.value = '';
      return;
    }

    const maxBytes = 2 * 1024 * 1024;
    if (file.size > maxBytes) {
      setErrors((prev) => ({
        ...prev,
        thumbnail:
          'Please choose an image smaller than 2 MB so it saves reliably in browser storage.',
      }));
      e.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setThumbnail(reader.result);
        setThumbnailFileName(file.name);
        if (errors.thumbnail) {
          setErrors((prev) => ({ ...prev, thumbnail: '' }));
        }
      }
    };
    reader.onerror = () => {
      setErrors((prev) => ({
        ...prev,
        thumbnail:
          'Could not read the selected image file. Please try another file.',
      }));
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const nextErrors = {};
    const trimmedTitle = title.trim();
    const trimmedCategory = category.trim();
    const trimmedDuration = duration.trim();
    const trimmedInstructor = instructorName.trim();
    const trimmedThumb = thumbnail.trim();
    const trimmedDesc = description.trim();
    const numericPrice = Number(price);

    if (!trimmedTitle) {
      nextErrors.title = 'Course title is required.';
    } else if (trimmedTitle.length < 4) {
      nextErrors.title = 'Course title must be at least 4 characters long.';
    } else if (trimmedTitle.length > 100) {
      nextErrors.title = 'Course title must be 100 characters or fewer.';
    }

    if (!trimmedCategory) {
      nextErrors.category = 'Category is required.';
    } else if (trimmedCategory.length < 2) {
      nextErrors.category = 'Category must be at least 2 characters long.';
    } else if (trimmedCategory.length > 50) {
      nextErrors.category = 'Category must be 50 characters or fewer.';
    }

    if (!level || !ALLOWED_LEVELS.includes(level)) {
      nextErrors.level = 'Please select a valid difficulty level.';
    }

    if (!trimmedDuration) {
      nextErrors.duration = 'Duration is required.';
    } else if (!isValidDuration(trimmedDuration)) {
      nextErrors.duration =
        'Enter a valid duration like "4h 30m", "2h", or "45m".';
    } else if (trimmedDuration.length > 30) {
      nextErrors.duration = 'Duration must be 30 characters or fewer.';
    }

    if (
      String(price).trim() === '' ||
      Number.isNaN(numericPrice) ||
      !Number.isFinite(numericPrice) ||
      numericPrice < 0
    ) {
      nextErrors.price = 'Enter 0 for Free or a valid positive price.';
    }

    if (!trimmedInstructor) {
      nextErrors.instructor = 'Instructor name is required.';
    } else if (trimmedInstructor.length < 2) {
      nextErrors.instructor =
        'Instructor name must be at least 2 characters long.';
    } else if (trimmedInstructor.length > 60) {
      nextErrors.instructor =
        'Instructor name must be 60 characters or fewer.';
    }

    if (trimmedThumb.length > 0) {
      if (trimmedThumb.length < 5) {
        nextErrors.thumbnail =
          'Thumbnail URL is too short. Enter at least 5 characters or leave it blank.';
      } else if (!/^(https?:\/\/|\/|data:image\/)/i.test(trimmedThumb)) {
        nextErrors.thumbnail =
          'Thumbnail URL must start with http://, https://, /, or be an uploaded image.';
      }
    }

    if (!trimmedDesc) {
      nextErrors.description = 'Course overview is required.';
    } else if (trimmedDesc.length < 15) {
      nextErrors.description =
        'Course overview must be at least 15 characters long.';
    } else if (trimmedDesc.length > 500) {
      nextErrors.description =
        'Course overview must be 500 characters or fewer.';
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    const originalPrice =
      typeof course.price === 'number' && !Number.isNaN(course.price)
        ? course.price
        : 0;
    const originalInstructor = (course.instructor?.name || 'Instructor').trim();
    const originalThumb = (course.thumbnail || '').trim();

    const hasChanges =
      trimmedTitle !== (course.title || '').trim() ||
      trimmedCategory !== (course.category || '').trim() ||
      level !== (course.level || 'Beginner') ||
      trimmedDuration !== (course.duration || '').trim() ||
      numericPrice !== originalPrice ||
      trimmedInstructor !== originalInstructor ||
      trimmedThumb !== originalThumb ||
      trimmedDesc !== (course.description || '').trim();

    if (!hasChanges) {
      onShowNotice({
        type: 'warning',
        title: 'No Changes Made',
        message:
          'You have not modified any course fields. Update a detail before saving.',
      });
      return;
    }

    onSaveCourse(course.id, {
      title: trimmedTitle,
      category: trimmedCategory,
      level,
      duration: trimmedDuration,
      price: numericPrice,
      isFree: numericPrice === 0,
      instructor: {
        ...(course.instructor || {}),
        name: trimmedInstructor,
      },
      thumbnail: trimmedThumb,
      description: trimmedDesc,
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="quick-edit-course-title"
    >
      <div
        style={{ borderRadius: '24px' }}
        className="relative overflow-visible w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-7 space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          aria-hidden="true"
          style={{
            borderTopLeftRadius: '24px',
            borderTopRightRadius: '24px',
          }}
          className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-400 pointer-events-none"
        />

        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <Edit3 className="w-5 h-5" />
            </div>
            <div>
              <h3
                id="quick-edit-course-title"
                className="text-lg sm:text-xl font-black text-slate-900 dark:text-white"
              >
                Edit Course Details
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Update metadata, level, price, instructor, thumbnail, and summary
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close edit course modal"
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <label
              htmlFor="edit-course-title"
              className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5"
            >
              Course Title <span className="text-rose-500">*</span>
            </label>
            <input
              id="edit-course-title"
              type="text"
              maxLength={100}
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errors.title) setErrors((prev) => ({ ...prev, title: '' }));
              }}
              className={`w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 transition-all ${
                errors.title
                  ? 'border-rose-500 focus:ring-rose-500/20'
                  : 'border-slate-300 dark:border-slate-700 focus:border-emerald-600 focus:ring-emerald-600/20'
              }`}
            />
            {errors.title && (
              <p className="mt-1 text-xs font-medium text-rose-600 dark:text-rose-400 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                <span>{errors.title}</span>
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div className="min-w-0">
              <label
                htmlFor="edit-course-category"
                className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5"
              >
                Category <span className="text-rose-500">*</span>
              </label>
              <input
                id="edit-course-category"
                type="text"
                maxLength={50}
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  if (errors.category)
                    setErrors((prev) => ({ ...prev, category: '' }));
                }}
                className={`w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 transition-all ${
                  errors.category
                    ? 'border-rose-500 focus:ring-rose-500/20'
                    : 'border-slate-300 dark:border-slate-700 focus:border-emerald-600 focus:ring-emerald-600/20'
                }`}
              />
              {errors.category && (
                <p className="mt-1 text-xs font-medium text-rose-600 dark:text-rose-400 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.category}</span>
                </p>
              )}
            </div>

            <div className="min-w-0">
              <span className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Difficulty Level <span className="text-rose-500">*</span>
              </span>
              <FilterDropdown
                value={level}
                onChange={(nextLevel) => {
                  setLevel(nextLevel);
                  if (errors.level) setErrors((prev) => ({ ...prev, level: '' }));
                }}
                options={INSTRUCTOR_LEVEL_OPTIONS}
                placeholder="Select Level"
                className="w-full"
              />
              {errors.level && (
                <p className="mt-1 text-xs font-medium text-rose-600 dark:text-rose-400 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.level}</span>
                </p>
              )}
            </div>

            <div className="min-w-0">
              <label
                htmlFor="edit-course-duration"
                className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5"
              >
                Duration <span className="text-rose-500">*</span>
              </label>
              <input
                id="edit-course-duration"
                type="text"
                maxLength={30}
                value={duration}
                onChange={(e) => {
                  setDuration(e.target.value);
                  if (errors.duration)
                    setErrors((prev) => ({ ...prev, duration: '' }));
                }}
                placeholder="e.g. 6h 30m"
                className={`w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 transition-all ${
                  errors.duration
                    ? 'border-rose-500 focus:ring-rose-500/20'
                    : 'border-slate-300 dark:border-slate-700 focus:border-emerald-600 focus:ring-emerald-600/20'
                }`}
              />
              {errors.duration && (
                <p className="mt-1 text-xs font-medium text-rose-600 dark:text-rose-400 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.duration}</span>
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="min-w-0">
              <label
                htmlFor="edit-course-price"
                className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5"
              >
                Price (USD) <span className="text-rose-500">*</span>
              </label>
              <input
                id="edit-course-price"
                type="number"
                min={0}
                step="0.01"
                value={price}
                onChange={(e) => {
                  setPrice(e.target.value);
                  if (errors.price) setErrors((prev) => ({ ...prev, price: '' }));
                }}
                placeholder="0 for Free"
                className={`w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 transition-all ${
                  errors.price
                    ? 'border-rose-500 focus:ring-rose-500/20'
                    : 'border-slate-300 dark:border-slate-700 focus:border-emerald-600 focus:ring-emerald-600/20'
                }`}
              />
              {errors.price && (
                <p className="mt-1 text-xs font-medium text-rose-600 dark:text-rose-400 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.price}</span>
                </p>
              )}
            </div>

            <div className="min-w-0">
              <label
                htmlFor="edit-course-instructor"
                className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5"
              >
                Instructor Name <span className="text-rose-500">*</span>
              </label>
              <input
                id="edit-course-instructor"
                type="text"
                maxLength={60}
                value={instructorName}
                onChange={(e) => {
                  setInstructorName(e.target.value);
                  if (errors.instructor)
                    setErrors((prev) => ({ ...prev, instructor: '' }));
                }}
                placeholder="Instructor name"
                className={`w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 transition-all ${
                  errors.instructor
                    ? 'border-rose-500 focus:ring-rose-500/20'
                    : 'border-slate-300 dark:border-slate-700 focus:border-emerald-600 focus:ring-emerald-600/20'
                }`}
              />
              {errors.instructor && (
                <p className="mt-1 text-xs font-medium text-rose-600 dark:text-rose-400 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.instructor}</span>
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="edit-course-thumbnail"
              className="block text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Thumbnail Image
            </label>

            <div className="flex flex-wrap items-center gap-2.5">
              <label className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-colors cursor-pointer">
                <Upload className="w-3.5 h-3.5" />
                <span>Choose from Computer</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleThumbnailFileChange}
                  className="sr-only"
                />
              </label>

              {thumbnail && (
                <button
                  type="button"
                  onClick={() => {
                    setThumbnail('');
                    setThumbnailFileName('');
                    if (errors.thumbnail)
                      setErrors((prev) => ({ ...prev, thumbnail: '' }));
                  }}
                  className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                >
                  Clear Thumbnail
                </button>
              )}

              {thumbnailFileName && (
                <span className="text-xs font-medium text-emerald-700 dark:text-emerald-300 truncate max-w-xs">
                  {thumbnailFileName}
                </span>
              )}
            </div>

            <input
              id="edit-course-thumbnail"
              type="text"
              value={isDataUrl ? '' : thumbnail}
              onChange={(e) => {
                setThumbnail(e.target.value);
                setThumbnailFileName('');
                if (errors.thumbnail)
                  setErrors((prev) => ({ ...prev, thumbnail: '' }));
              }}
              placeholder={
                isDataUrl
                  ? 'Image uploaded from computer (click Clear Thumbnail to enter a URL)'
                  : 'Or paste an image URL (https://... or /images/...)'
              }
              disabled={isDataUrl}
              className={`w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 transition-all disabled:opacity-60 ${
                errors.thumbnail
                  ? 'border-rose-500 focus:ring-rose-500/20'
                  : 'border-slate-300 dark:border-slate-700 focus:border-emerald-600 focus:ring-emerald-600/20'
              }`}
            />

            {errors.thumbnail && (
              <p className="mt-1 text-xs font-medium text-rose-600 dark:text-rose-400 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                <span>{errors.thumbnail}</span>
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="edit-course-desc"
              className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5"
            >
              Course Overview <span className="text-rose-500">*</span>
            </label>
            <textarea
              id="edit-course-desc"
              rows={3}
              maxLength={500}
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                if (errors.description)
                  setErrors((prev) => ({ ...prev, description: '' }));
              }}
              className={`w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 transition-all resize-none ${
                errors.description
                  ? 'border-rose-500 focus:ring-rose-500/20'
                  : 'border-slate-300 dark:border-slate-700 focus:border-emerald-600 focus:ring-emerald-600/20'
              }`}
            />
            <div className="mt-1 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              {errors.description ? (
                <span className="font-medium text-rose-600 dark:text-rose-400 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.description}</span>
                </span>
              ) : (
                <span>Minimum 15 characters required</span>
              )}
              <span>{description.length} / 500</span>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-1">
            <Button type="button" variant="outline" size="md" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:via-teal-500 hover:to-emerald-600 text-white font-extrabold"
            >
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

function DeleteConfirmModal({ course, onClose, onConfirmDelete }) {
  useEffect(() => {
    if (!course) return;
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [course, onClose]);

  if (!course) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-course-title"
    >
      <div
        className="relative overflow-hidden w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-7 space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500"
        />

        <div className="flex items-start gap-3">
          <div className="w-11 h-11 rounded-2xl bg-rose-50 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
            <Trash2 className="w-5 h-5" />
          </div>
          <div>
            <h3
              id="delete-course-title"
              className="text-lg font-black text-slate-900 dark:text-white"
            >
              Remove Course?
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              This action removes the course from your studio catalog
            </p>
          </div>
        </div>

        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          Are you sure you want to remove{' '}
          <strong className="font-bold text-slate-900 dark:text-white">
            {course.title}
          </strong>
          ?
        </p>

        <div className="flex items-center justify-end gap-3 pt-1">
          <Button type="button" variant="outline" size="md" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="button"
            variant="primary"
            size="md"
            className="bg-rose-600 hover:bg-rose-700 border-rose-600"
            onClick={() => {
              onConfirmDelete(course.id);
              onClose();
            }}
          >
            <Trash2 className="w-4 h-4" />
            <span>Remove Course</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

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
            className="min-w-[116px] justify-center bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:via-teal-500 hover:to-emerald-600 text-white font-bold shadow-md shadow-emerald-600/25"
          >
            OK
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function ManageCourses() {
  const platform = usePlatform();
  const {
    courses = [],
    enrolledIds = [],
    updateCourse,
    deleteCourse,
  } = platform || {};

  const [localEdits, setLocalEdits] = useState({});
  const [deletedIds, setDeletedIds] = useState([]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState('All Levels');

  const [editingCourse, setEditingCourse] = useState(null);
  const [deletingCourse, setDeletingCourse] = useState(null);
  const [notice, setNotice] = useState(null);

  const effectiveCourses = useMemo(() => {
    return courses
      .filter((c) => !deletedIds.includes(c.id))
      .map((c) => (localEdits[c.id] ? { ...c, ...localEdits[c.id] } : c));
  }, [courses, localEdits, deletedIds]);

  const categories = useMemo(() => {
    const unique = new Set(
      effectiveCourses
        .map((c) => c.category)
        .filter((cat) => typeof cat === 'string' && cat.trim().length > 0)
    );
    return ['All', ...Array.from(unique)];
  }, [effectiveCourses]);

  const filteredCourses = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return effectiveCourses.filter((course) => {
      if (selectedCategory !== 'All' && course.category !== selectedCategory) {
        return false;
      }
      if (
        selectedLevel !== 'All Levels' &&
        (course.level || 'All Levels') !== selectedLevel
      ) {
        return false;
      }
      if (!q) return true;
      return (
        (course.title || '').toLowerCase().includes(q) ||
        (course.category || '').toLowerCase().includes(q) ||
        (course.instructor?.name || '').toLowerCase().includes(q)
      );
    });
  }, [effectiveCourses, searchQuery, selectedCategory, selectedLevel]);

  const metrics = useMemo(() => {
    let modules = 0;
    let lessons = 0;
    let students = 0;
    let ratingTotal = 0;
    let ratedCount = 0;

    effectiveCourses.forEach((course) => {
      const secs = Array.isArray(course.sections) ? course.sections : [];
      modules += secs.length;
      lessons += secs.reduce(
        (sum, s) => sum + (Array.isArray(s.lessons) ? s.lessons.length : 0),
        0
      );
      const base =
        typeof course.students === 'number'
          ? course.students
          : typeof course.enrolledCount === 'number'
            ? course.enrolledCount
            : 0;
      students += base + (enrolledIds.includes(course.id) ? 1 : 0);

      if (typeof course.rating === 'number' && course.rating > 0) {
        ratingTotal += course.rating;
        ratedCount += 1;
      }
    });

    return {
      modules,
      lessons,
      students,
      avgRating: ratedCount > 0 ? (ratingTotal / ratedCount).toFixed(1) : '4.9',
    };
  }, [effectiveCourses, enrolledIds]);

  const handleSaveCourseEdit = (courseId, updates) => {
    if (typeof updateCourse === 'function') {
      updateCourse(courseId, updates);
    }
    setLocalEdits((prev) => ({
      ...prev,
      [courseId]: { ...(prev[courseId] || {}), ...updates },
    }));
    setNotice({
      type: 'success',
      title: 'Course Updated',
      message: 'Your changes to the course details have been saved.',
    });
  };

  const handleConfirmDelete = (courseId) => {
    if (typeof deleteCourse === 'function') {
      deleteCourse(courseId);
    }
    setDeletedIds((prev) =>
      prev.includes(courseId) ? prev : [...prev, courseId]
    );
    setNotice({
      type: 'success',
      title: 'Course Removed',
      message: 'The course has been removed from your studio catalog.',
    });
  };

  const KPI_CARDS = [
    {
      label: 'Managed Courses',
      value: effectiveCourses.length,
      sub: `${metrics.modules} curriculum modules`,
      icon: BookOpen,
      accent:
        'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 group-hover/kpi:bg-emerald-600 group-hover/kpi:text-white',
    },
    {
      label: 'Total Lessons',
      value: metrics.lessons,
      sub: 'Structured video & reading lessons',
      icon: Layers,
      accent:
        'bg-teal-50 dark:bg-teal-950/80 text-teal-600 dark:text-teal-400 group-hover/kpi:bg-teal-600 group-hover/kpi:text-white',
    },
    {
      label: 'Total Learners',
      value: metrics.students.toLocaleString(),
      sub: 'Enrolled across published courses',
      icon: Users,
      accent:
        'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 group-hover/kpi:bg-emerald-600 group-hover/kpi:text-white',
    },
    {
      label: 'Catalog Rating',
      value: `${metrics.avgRating} ★`,
      sub: 'Average learner feedback score',
      icon: Star,
      accent:
        'bg-amber-50 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 group-hover/kpi:bg-amber-500 group-hover/kpi:text-white',
    },
  ];

  return (
    <div className="relative overflow-hidden py-8 lg:py-12">
      <QuickEditCourseModal
        course={editingCourse}
        onClose={() => setEditingCourse(null)}
        onSaveCourse={handleSaveCourseEdit}
        onShowNotice={setNotice}
      />

      <DeleteConfirmModal
        course={deletingCourse}
        onClose={() => setDeletingCourse(null)}
        onConfirmDelete={handleConfirmDelete}
      />

      <NoticeModal notice={notice} onClose={() => setNotice(null)} />

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
                  Instructor & Admin Studio · Catalog Manager
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight break-words">
                Manage{' '}
                <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 dark:from-emerald-400 dark:via-teal-400 dark:to-emerald-300 bg-clip-text text-transparent">
                  Courses
                </span>
              </h1>

              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                Inspect curriculum structure, update course details, preview public landing pages, and launch new courses from one central catalog.
              </p>
            </div>

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
              <Link to="/admin" className="shrink-0">
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  className="whitespace-nowrap border-emerald-200 dark:border-emerald-800/80 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/60"
                >
                  <LayoutDashboard className="w-4 h-4 shrink-0" />
                  <span>Studio Overview</span>
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

        {/* Search & Filter Controls */}
        {effectiveCourses.length > 0 && (
          <div className="space-y-4 min-w-0">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 min-w-0">
              {/* Category Pills */}
              <div className="max-w-full min-w-0 flex items-center gap-2 overflow-x-auto pb-1">
                {categories.map((cat) => {
                  const isSelected = selectedCategory === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCategory(cat)}
                      className={`shrink-0 whitespace-nowrap px-3.5 py-2 rounded-2xl text-xs sm:text-sm font-bold border transition-all duration-200 cursor-pointer shadow-2xs hover:-translate-y-0.5 hover:shadow-md ${
                        isSelected
                          ? 'bg-emerald-600 border-emerald-600 text-white shadow-sm'
                          : 'bg-white dark:bg-slate-900 border-slate-200/90 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-emerald-300 dark:hover:border-emerald-700 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>

              {/* Level Filter & Search Input */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
                <FilterDropdown
                  value={selectedLevel}
                  onChange={setSelectedLevel}
                  options={INSTRUCTOR_LEVEL_OPTIONS}
                  placeholder="All Skill Levels"
                />

                <div className="group/search relative w-full sm:w-72 rounded-2xl shadow-sm hover:-translate-y-1 hover:shadow-xl focus-within:-translate-y-1 focus-within:shadow-xl transition-all duration-200">
                  <Search className="w-4 h-4 text-slate-400 group-hover/search:text-emerald-600 dark:group-hover/search:text-emerald-400 group-focus-within/search:text-emerald-600 dark:group-focus-within/search:text-emerald-400 transition-colors absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search courses or categories..."
                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 hover:border-emerald-300 dark:hover:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/25 focus:border-emerald-500 transition-all duration-200"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Course Cards Grid or Empty States */}
        {effectiveCourses.length === 0 ? (
          <div className="group/empty relative overflow-hidden bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-10 text-center space-y-4 shadow-sm hover:-translate-y-1.5 hover:shadow-2xl hover:border-emerald-300 dark:hover:border-emerald-700 transition-all duration-200">
            <div
              aria-hidden="true"
              className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-400"
            />
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 group-hover/empty:bg-emerald-600 group-hover/empty:text-white group-hover/empty:scale-105 transition-all duration-200 flex items-center justify-center mx-auto">
              <BookOpen className="w-7 h-7" />
            </div>
            <div className="space-y-1.5 max-w-md mx-auto">
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
                No Courses in Catalog
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Create your first course to organize modules, video lessons, practical projects, and quizzes.
              </p>
            </div>
            <div className="pt-1">
              <Link to="/instructor/create-course">
                <Button
                  type="button"
                  variant="primary"
                  size="md"
                  className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:via-teal-500 hover:to-emerald-600 text-white font-extrabold"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Create New Course</span>
                </Button>
              </Link>
            </div>
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="relative overflow-hidden bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-10 text-center space-y-3 shadow-sm hover:-translate-y-1.5 hover:shadow-2xl hover:border-emerald-300 dark:hover:border-emerald-700 transition-all duration-200">
            <div
              aria-hidden="true"
              className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-400"
            />
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
              No Matching Courses Found
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Try resetting your search query, category pill, or difficulty level filter.
            </p>
            <div className="pt-2">
              <Button
                type="button"
                variant="outline"
                size="md"
                onClick={() => {
                  setSelectedCategory('All');
                  setSelectedLevel('All Levels');
                  setSearchQuery('');
                }}
              >
                Reset Filters
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 min-w-0">
            {filteredCourses.map((course) => {
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
              const priceLabel =
                typeof course.price === 'number' && course.price > 0
                  ? `$${course.price.toFixed(2)}`
                  : 'Free';

              return (
                <div
                  key={course.id}
                  className="group/card relative overflow-hidden min-w-0 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-5 sm:p-6 shadow-sm hover:-translate-y-1.5 hover:shadow-2xl hover:border-emerald-300 dark:hover:border-emerald-700 transition-all duration-200 flex flex-col justify-between space-y-5"
                >
                  <div
                    aria-hidden="true"
                    className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-400 opacity-85"
                  />

                  <div className="space-y-4 min-w-0">
                    {/* Thumbnail */}
                    <div className="h-44 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 relative">
                      {course.thumbnail ? (
                        <img
                          src={course.thumbnail}
                          alt={course.title}
                          className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-emerald-600 to-teal-600 text-white">
                          <Layers className="w-10 h-10" />
                        </div>
                      )}

                      <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-950/75 text-white backdrop-blur-xs">
                        {course.level || 'All Levels'}
                      </span>

                      <span className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-emerald-600 text-white shadow-2xs">
                        {priceLabel}
                      </span>

                      {typeof course.rating === 'number' && (
                        <span className="absolute top-3 right-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-white/95 text-slate-900 backdrop-blur-xs shadow-2xs whitespace-nowrap">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400 shrink-0" />
                          {course.rating.toFixed(1)}
                        </span>
                      )}
                    </div>

                    {/* Badges & Quick Delete */}
                    <div className="flex items-center justify-between gap-2 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 min-w-0">
                        <Badge tone="emerald">
                          {course.category || 'Course'}
                        </Badge>
                        <Badge tone="emerald">Published</Badge>
                      </div>

                      <button
                        type="button"
                        onClick={() => setDeletingCourse(course)}
                        aria-label={`Remove ${course.title}`}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 dark:text-rose-400 hover:underline cursor-pointer shrink-0 whitespace-nowrap"
                      >
                        <Trash2 className="w-3.5 h-3.5 shrink-0" />
                        <span>Remove</span>
                      </button>
                    </div>

                    {/* Title, Description & Stats */}
                    <div className="space-y-2 min-w-0">
                      <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white group-hover/card:text-emerald-600 dark:group-hover/card:text-emerald-400 transition-colors line-clamp-1">
                        {course.title}
                      </h2>

                      {course.description && (
                        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                          {course.description}
                        </p>
                      )}

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400 pt-1">
                        <span className="inline-flex items-center gap-1">
                          <Layers className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                          {sections.length} modules · {lessonCount} lessons
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <GraduationCap className="w-3.5 h-3.5 text-teal-500 shrink-0" />
                          {studentCount.toLocaleString()} learners
                        </span>
                        {course.duration && (
                          <span className="inline-flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            {course.duration}
                          </span>
                        )}
                      </div>

                      {course.instructor?.name && (
                        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                          Instructor: {course.instructor.name}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Card Footer Actions */}
                  <div className="pt-3.5 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
                    <Link
                      to={`/courses/${course.id}?from=manage`}
                      className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors whitespace-nowrap"
                    >
                      <Eye className="w-4 h-4 shrink-0" />
                      <span>Preview Public Page</span>
                    </Link>

                    <Button
                      type="button"
                      variant="primary"
                      size="md"
                      onClick={() => setEditingCourse(course)}
                      className="whitespace-nowrap bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:via-teal-500 hover:to-emerald-600 text-white font-extrabold"
                    >
                      <Edit3 className="w-4 h-4 shrink-0" />
                      <span>Edit Course</span>
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
