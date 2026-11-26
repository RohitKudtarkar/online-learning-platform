import { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  PlusCircle,
  Sparkles,
  Layers,
  BookOpen,
  Trash2,
  Plus,
  Eye,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  FolderPlus,
  FileText,
  Trophy,
  Upload,
  DollarSign,
  UserCheck,
} from 'lucide-react';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import FilterDropdown, {
  INSTRUCTOR_LEVEL_OPTIONS,
} from '../../components/common/FilterDropdown';
import { usePlatform } from '../../context/PlatformContext';

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

function createInitialSections() {
  const stamp = Date.now();
  return [
    {
      id: `sec_${stamp}_1`,
      title: 'Module 1: Foundations & Setup',
      lessons: [
        {
          id: `les_${stamp}_1`,
          title: 'Course Overview & Environment Setup',
          duration: '12m',
        },
        {
          id: `les_${stamp}_2`,
          title: 'Core Concepts & Workflow Walkthrough',
          duration: '18m',
        },
      ],
    },
  ];
}

function StatusPopupModal({ popup, onClose, onGoToCourses }) {
  useEffect(() => {
    if (!popup) return;
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [popup, onClose]);

  if (!popup) return null;

  const isSuccess = popup.type === 'success';

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-xs"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-course-popup-title"
    >
      <div
        className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-7 sm:p-8 shadow-2xl text-center space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto ${
            isSuccess
              ? 'bg-emerald-100/90 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400'
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
            id="create-course-popup-title"
            className="text-xl font-black text-slate-900 dark:text-white"
          >
            {popup.title}
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {popup.message}
          </p>
        </div>

        <div className="pt-1 flex flex-wrap items-center justify-center gap-3">
          {isSuccess && onGoToCourses ? (
            <>
              <Button type="button" variant="outline" size="md" onClick={onClose}>
                Create Another
              </Button>
              <Button
                type="button"
                variant="primary"
                size="md"
                onClick={onGoToCourses}
                className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:via-teal-500 hover:to-emerald-600 text-white font-bold shadow-md shadow-emerald-600/25"
              >
                View Manage Courses
              </Button>
            </>
          ) : (
            <Button
              type="button"
              variant="primary"
              size="md"
              onClick={onClose}
              className="min-w-[116px] justify-center bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:via-teal-500 hover:to-emerald-600 text-white font-bold shadow-md shadow-emerald-600/25"
            >
              OK
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CreateCourse() {
  const navigate = useNavigate();
  const platform = usePlatform() || {};
  const { addCourse, createCourse, saveCourse } = platform;

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [level, setLevel] = useState('');
  const [duration, setDuration] = useState('');
  const [price, setPrice] = useState('');
  const [instructorName, setInstructorName] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [thumbnailFileName, setThumbnailFileName] = useState('');
  const [description, setDescription] = useState('');

  const [sections, setSections] = useState(() => createInitialSections());
  const [assignmentTitle, setAssignmentTitle] = useState('');
  const [assignmentBrief, setAssignmentBrief] = useState('');
  const [passMark, setPassMark] = useState(70);

  const [errors, setErrors] = useState({});
  const [popup, setPopup] = useState(null);

  const totalLessons = useMemo(() => {
    return sections.reduce(
      (sum, sec) => sum + (Array.isArray(sec.lessons) ? sec.lessons.length : 0),
      0
    );
  }, [sections]);

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

  const handleAddSection = () => {
    const nextNum = sections.length + 1;
    setSections((prev) => [
      ...prev,
      {
        id: `sec_${Date.now()}_${nextNum}`,
        title: `Module ${nextNum}: Core Concepts`,
        lessons: [
          {
            id: `les_${Date.now()}_${nextNum}_1`,
            title: 'Introduction & Key Concepts',
            duration: '15m',
          },
        ],
      },
    ]);
    if (errors.sections) setErrors((prev) => ({ ...prev, sections: '' }));
  };

  const handleRemoveSection = (sectionId) => {
    if (sections.length <= 1) return;
    setSections((prev) => prev.filter((sec) => sec.id !== sectionId));
    if (errors.sections) setErrors((prev) => ({ ...prev, sections: '' }));
  };

  const handleSectionTitleChange = (sectionId, value) => {
    setSections((prev) =>
      prev.map((sec) =>
        sec.id === sectionId ? { ...sec, title: value } : sec
      )
    );
    if (errors.sections) setErrors((prev) => ({ ...prev, sections: '' }));
  };

  const handleAddLesson = (sectionId) => {
    setSections((prev) =>
      prev.map((sec) => {
        if (sec.id !== sectionId) return sec;
        const lessonNum = (sec.lessons?.length || 0) + 1;
        return {
          ...sec,
          lessons: [
            ...(sec.lessons || []),
            {
              id: `les_${Date.now()}_${lessonNum}`,
              title: `Lesson ${lessonNum}: Guided Practice`,
              duration: '10m',
            },
          ],
        };
      })
    );
    if (errors.sections) setErrors((prev) => ({ ...prev, sections: '' }));
  };

  const handleLessonChange = (sectionId, lessonId, field, value) => {
    setSections((prev) =>
      prev.map((sec) => {
        if (sec.id !== sectionId) return sec;
        return {
          ...sec,
          lessons: (sec.lessons || []).map((les) =>
            les.id === lessonId ? { ...les, [field]: value } : les
          ),
        };
      })
    );
    if (errors.sections) setErrors((prev) => ({ ...prev, sections: '' }));
  };

  const handleRemoveLesson = (sectionId, lessonId) => {
    setSections((prev) =>
      prev.map((sec) => {
        if (sec.id !== sectionId) return sec;
        if ((sec.lessons || []).length <= 1) return sec;
        return {
          ...sec,
          lessons: sec.lessons.filter((les) => les.id !== lessonId),
        };
      })
    );
    if (errors.sections) setErrors((prev) => ({ ...prev, sections: '' }));
  };

  const validateForm = () => {
    const nextErrors = {};
    const trimmedTitle = title.trim();
    const trimmedCategory = category.trim();
    const trimmedDuration = duration.trim();
    const trimmedPrice = String(price).trim();
    const trimmedInstructor = instructorName.trim();
    const trimmedDesc = description.trim();
    const trimmedThumb = thumbnail.trim();
    const trimmedAssignTitle = assignmentTitle.trim();
    const trimmedAssignBrief = assignmentBrief.trim();
    const numericPrice = Number(trimmedPrice);

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

    if (!level) {
      nextErrors.level = 'Difficulty level is required.';
    } else if (!ALLOWED_LEVELS.includes(level)) {
      nextErrors.level = 'Please select a valid difficulty level.';
    }

    if (!trimmedDuration) {
      nextErrors.duration = 'Estimated duration is required.';
    } else if (!isValidDuration(trimmedDuration)) {
      nextErrors.duration =
        'Enter a valid duration like "5h 30m", "2h", or "45m".';
    } else if (trimmedDuration.length > 30) {
      nextErrors.duration = 'Estimated duration must be 30 characters or fewer.';
    }

    if (!trimmedPrice) {
      nextErrors.price = 'Course price is required (enter 0 for Free).';
    } else if (
      Number.isNaN(numericPrice) ||
      !Number.isFinite(numericPrice) ||
      numericPrice < 0
    ) {
      nextErrors.price = 'Enter 0 for Free or a valid positive price.';
    }

    if (!trimmedInstructor) {
      nextErrors.instructorName = 'Instructor name is required.';
    } else if (trimmedInstructor.length < 2) {
      nextErrors.instructorName =
        'Instructor name must be at least 2 characters long.';
    }

    // Thumbnail is optional; only validate if a value is provided
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
      nextErrors.description = 'Course description is required.';
    } else if (trimmedDesc.length < 15) {
      nextErrors.description =
        'Course description must be at least 15 characters long.';
    } else if (trimmedDesc.length > 600) {
      nextErrors.description =
        'Course description must be 600 characters or fewer.';
    }

    if (!Array.isArray(sections) || sections.length === 0) {
      nextErrors.sections = 'Please add at least one curriculum module.';
    } else {
      for (let i = 0; i < sections.length; i += 1) {
        const sec = sections[i];
        const secTitle = (sec.title || '').trim();
        if (!secTitle) {
          nextErrors.sections = `Module ${i + 1} title is required.`;
          break;
        }
        if (secTitle.length < 2) {
          nextErrors.sections = `Module ${i + 1} title must be at least 2 characters long.`;
          break;
        }

        const lessons = Array.isArray(sec.lessons) ? sec.lessons : [];
        if (lessons.length === 0) {
          nextErrors.sections = `Module ${i + 1} must include at least one lesson.`;
          break;
        }

        for (let j = 0; j < lessons.length; j += 1) {
          const les = lessons[j];
          const lesTitle = (les.title || '').trim();
          const lesDuration = (les.duration || '').trim();

          if (!lesTitle) {
            nextErrors.sections = `Lesson ${j + 1} title in Module ${i + 1} is required.`;
            break;
          }
          if (lesTitle.length < 2) {
            nextErrors.sections = `Lesson ${j + 1} title in Module ${i + 1} must be at least 2 characters long.`;
            break;
          }
          if (!lesDuration || !isValidDuration(lesDuration)) {
            nextErrors.sections = `Lesson ${j + 1} duration in Module ${i + 1} must be a valid time like "10m" or "1h 15m".`;
            break;
          }
        }

        if (nextErrors.sections) break;
      }
    }

    if (trimmedAssignTitle.length > 0 && trimmedAssignTitle.length < 2) {
      nextErrors.assignmentTitle =
        'Assignment title must be at least 2 characters long if entered.';
    } else if (trimmedAssignTitle.length > 100) {
      nextErrors.assignmentTitle =
        'Assignment title must be 100 characters or fewer.';
    }

    if (trimmedAssignBrief.length > 0 && trimmedAssignBrief.length < 2) {
      nextErrors.assignmentBrief =
        'Assignment instructions must be at least 2 characters long if entered.';
    } else if (trimmedAssignBrief.length > 350) {
      nextErrors.assignmentBrief =
        'Assignment instructions must be 350 characters or fewer.';
    }

    const numericPassMark = Number(passMark);
    if (
      passMark === '' ||
      Number.isNaN(numericPassMark) ||
      !Number.isFinite(numericPassMark) ||
      numericPassMark < 50 ||
      numericPassMark > 100
    ) {
      nextErrors.passMark = 'Quiz pass mark must be a number between 50 and 100.';
    }

    const validSections = sections.map((sec) => ({
      ...sec,
      title: (sec.title || '').trim(),
      lessons: (sec.lessons || []).map((les) => ({
        ...les,
        title: (les.title || '').trim(),
        duration: (les.duration || '').trim(),
      })),
    }));

    return { nextErrors, validSections, numericPassMark, numericPrice };
  };

  const resetForm = () => {
    setTitle('');
    setCategory('');
    setLevel('');
    setDuration('');
    setPrice('');
    setInstructorName('');
    setThumbnail('');
    setThumbnailFileName('');
    setDescription('');
    setSections(createInitialSections());
    setAssignmentTitle('');
    setAssignmentBrief('');
    setPassMark(70);
    setErrors({});
  };

  const handlePublishCourse = (e) => {
    e.preventDefault();
    const { nextErrors, validSections, numericPassMark, numericPrice } =
      validateForm();

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      const firstMsg = Object.values(nextErrors)[0];
      setPopup({
        type: 'warning',
        title: 'Please Fill Required Fields',
        message: firstMsg,
      });
      return;
    }

    setErrors({});

    const courseId = `course_${Date.now()}`;
    const trimmedTitle = title.trim();
    const trimmedCategory = category.trim();
    const trimmedInstructor = instructorName.trim();
    const trimmedDesc = description.trim();
    const trimmedThumb = thumbnail.trim();
    const trimmedAssignTitle = assignmentTitle.trim();
    const trimmedAssignBrief = assignmentBrief.trim();

    const newCourse = {
      id: courseId,
      title: trimmedTitle,
      category: trimmedCategory,
      level,
      duration: duration.trim(),
      price: numericPrice,
      isFree: numericPrice === 0,
      thumbnail: trimmedThumb,
      description: trimmedDesc,
      rating: 5.0,
      students: 0,
      studentsCount: 0,
      outcomes: [],
      reviews: [],
      instructor: {
        name: trimmedInstructor,
        role: 'Course Instructor',
      },
      sections: validSections,
      assignment:
        trimmedAssignTitle || trimmedAssignBrief
          ? {
              title:
                trimmedAssignTitle || `Practical Project: ${trimmedTitle}`,
              description:
                trimmedAssignBrief ||
                `Complete and submit a practical project for ${trimmedTitle}.`,
              dueDate: 'Self-Paced Milestone',
            }
          : null,
      quiz: {
        passThreshold: numericPassMark,
      },
    };

    if (typeof saveCourse === 'function') {
      saveCourse(newCourse);
    } else if (typeof addCourse === 'function') {
      addCourse(newCourse);
    } else if (typeof createCourse === 'function') {
      createCourse(newCourse);
    } else {
      try {
        const storedRaw = localStorage.getItem('olp_studio_custom_courses');
        const existing = storedRaw ? JSON.parse(storedRaw) : [];
        localStorage.setItem(
          'olp_studio_custom_courses',
          JSON.stringify([
            newCourse,
            ...(Array.isArray(existing) ? existing : []),
          ])
        );
      } catch {
        // Ignore storage errors
      }
    }

    resetForm();
    setPopup({
      type: 'success',
      title: 'Course Published to Studio',
      message: `"${trimmedTitle}" has been created with ${validSections.length} module(s) and is ready in your catalog.`,
    });
  };

  const isDataUrl = thumbnail.trim().startsWith('data:image/');
  const parsedPreviewPrice = Number(price);
  const previewPriceLabel =
    String(price).trim() !== '' &&
    !Number.isNaN(parsedPreviewPrice) &&
    parsedPreviewPrice > 0
      ? `$${parsedPreviewPrice.toFixed(2)}`
      : 'Free';

  return (
    <div className="relative overflow-hidden py-8 lg:py-12">
      <StatusPopupModal
        popup={popup}
        onClose={() => setPopup(null)}
        onGoToCourses={() => {
          setPopup(null);
          navigate('/admin/courses');
        }}
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
            <div className="space-y-2.5 max-w-2xl min-w-0">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200/80 dark:border-emerald-800/80 text-emerald-700 dark:text-emerald-300 text-xs font-bold whitespace-nowrap max-w-full">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span className="truncate">
                  Instructor & Admin Studio · Course Builder
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight break-words">
                Create a New{' '}
                <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 dark:from-emerald-400 dark:via-teal-400 dark:to-emerald-300 bg-clip-text text-transparent">
                  Course
                </span>
              </h1>

              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                Configure course details, pricing, instructor name, modules, and assessments, and preview your card live.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Link to="/admin/courses">
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  className="whitespace-nowrap border-emerald-200 dark:border-emerald-800/80 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/60"
                >
                  <ArrowLeft className="w-4 h-4 shrink-0" />
                  <span>Manage Courses</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Main 12-Column Builder & Live Preview Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start min-w-0">
          {/* Left 8 Columns: Course Builder Form */}
          <form
            onSubmit={handlePublishCourse}
            noValidate
            className="lg:col-span-8 min-w-0 space-y-6"
          >
            {/* Section 1: Basic Course Details */}
            <div className="group/sec relative overflow-visible min-w-0 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-5 sm:p-8 shadow-sm hover:-translate-y-1.5 hover:shadow-2xl hover:border-emerald-300 dark:hover:border-emerald-700 transition-all duration-200 space-y-5">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 rounded-3xl overflow-hidden"
              >
                <div className="h-1 w-full bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-400 opacity-85" />
              </div>

              <div className="flex items-center gap-3 min-w-0">
                <div className="w-11 h-11 rounded-2xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 group-hover/sec:bg-emerald-600 group-hover/sec:text-white transition-all duration-200 flex items-center justify-center shrink-0">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                    Course Information
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Title, track category, difficulty level, duration, price, and instructor
                  </p>
                </div>
              </div>

              <div className="min-w-0">
                <label
                  htmlFor="course-title"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5"
                >
                  Course Title <span className="text-red-600">*</span>
                </label>
                <input
                  id="course-title"
                  type="text"
                  maxLength={100}
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    if (errors.title) setErrors((prev) => ({ ...prev, title: '' }));
                  }}
                  placeholder="Enter course title"
                  className={`w-full min-w-0 px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 hover:border-emerald-400 dark:hover:border-emerald-500 focus:outline-none focus:ring-2 transition-all ${
                    errors.title
                      ? 'border-red-500 focus:ring-red-500/20'
                      : 'border-slate-300 dark:border-slate-700 focus:border-emerald-600 focus:ring-emerald-600/20'
                  }`}
                />
                {errors.title && (
                  <p className="mt-1.5 text-xs font-semibold text-red-600 dark:text-red-400 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-red-600 dark:text-red-400" />
                    <span>{errors.title}</span>
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 min-w-0">
                <div className="min-w-0">
                  <label
                    htmlFor="course-category"
                    className="block text-sm font-medium whitespace-nowrap text-slate-700 dark:text-slate-300 mb-1.5"
                  >
                    Category <span className="text-red-600">*</span>
                  </label>
                  <input
                    id="course-category"
                    type="text"
                    maxLength={50}
                    value={category}
                    onChange={(e) => {
                      setCategory(e.target.value);
                      if (errors.category)
                        setErrors((prev) => ({ ...prev, category: '' }));
                    }}
                    placeholder="Enter category"
                    className={`w-full min-w-0 px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 hover:border-emerald-400 dark:hover:border-emerald-500 focus:outline-none focus:ring-2 transition-all ${
                      errors.category
                        ? 'border-red-500 focus:ring-red-500/20'
                        : 'border-slate-300 dark:border-slate-700 focus:border-emerald-600 focus:ring-emerald-600/20'
                    }`}
                  />
                  {errors.category && (
                    <p className="mt-1.5 text-xs font-semibold text-red-600 dark:text-red-400 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-red-600 dark:text-red-400" />
                      <span>{errors.category}</span>
                    </p>
                  )}
                </div>

                <div className="min-w-0">
                  <span className="block text-sm font-medium whitespace-nowrap text-slate-700 dark:text-slate-300 mb-1.5">
                    Difficulty Level <span className="text-red-600">*</span>
                  </span>
                  <FilterDropdown
                    value={level}
                    onChange={(nextLevel) => {
                      setLevel(nextLevel);
                      if (errors.level)
                        setErrors((prev) => ({ ...prev, level: '' }));
                    }}
                    options={INSTRUCTOR_LEVEL_OPTIONS}
                    placeholder="Select level"
                    className={`w-full min-w-0 ${
                      errors.level ? 'rounded-2xl ring-2 ring-red-500' : ''
                    }`}
                  />
                  {errors.level && (
                    <p className="mt-1.5 text-xs font-semibold text-red-600 dark:text-red-400 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-red-600 dark:text-red-400" />
                      <span>{errors.level}</span>
                    </p>
                  )}
                </div>

                <div className="sm:col-span-2 xl:col-span-1 min-w-0">
                  <label
                    htmlFor="course-duration"
                    className="block text-sm font-medium whitespace-nowrap text-slate-700 dark:text-slate-300 mb-1.5"
                  >
                    Estimated Duration <span className="text-red-600">*</span>
                  </label>
                  <input
                    id="course-duration"
                    type="text"
                    maxLength={30}
                    value={duration}
                    onChange={(e) => {
                      setDuration(e.target.value);
                      if (errors.duration)
                        setErrors((prev) => ({ ...prev, duration: '' }));
                    }}
                    placeholder="e.g. 5h 30m or 45m"
                    className={`w-full min-w-0 px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 hover:border-emerald-400 dark:hover:border-emerald-500 focus:outline-none focus:ring-2 transition-all ${
                      errors.duration
                        ? 'border-red-500 focus:ring-red-500/20'
                        : 'border-slate-300 dark:border-slate-700 focus:border-emerald-600 focus:ring-emerald-600/20'
                    }`}
                  />
                  {errors.duration && (
                    <p className="mt-1.5 text-xs font-semibold text-red-600 dark:text-red-400 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-red-600 dark:text-red-400" />
                      <span>{errors.duration}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Price & Instructor Name Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 min-w-0">
                <div className="min-w-0">
                  <label
                    htmlFor="course-price"
                    className="block text-sm font-medium whitespace-nowrap text-slate-700 dark:text-slate-300 mb-1.5"
                  >
                    Course Price (USD) <span className="text-red-600">*</span>
                  </label>
                  <div className="relative min-w-0">
                    <DollarSign className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      id="course-price"
                      type="number"
                      min={0}
                      step="0.01"
                      value={price}
                      onChange={(e) => {
                        setPrice(e.target.value);
                        if (errors.price)
                          setErrors((prev) => ({ ...prev, price: '' }));
                      }}
                      placeholder="0 for Free"
                      className={`w-full min-w-0 pl-10 pr-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 hover:border-emerald-400 dark:hover:border-emerald-500 focus:outline-none focus:ring-2 transition-all ${
                        errors.price
                          ? 'border-red-500 focus:ring-red-500/20'
                          : 'border-slate-300 dark:border-slate-700 focus:border-emerald-600 focus:ring-emerald-600/20'
                      }`}
                    />
                  </div>
                  {errors.price && (
                    <p className="mt-1.5 text-xs font-semibold text-red-600 dark:text-red-400 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-red-600 dark:text-red-400" />
                      <span>{errors.price}</span>
                    </p>
                  )}
                </div>

                <div className="min-w-0">
                  <label
                    htmlFor="course-instructor"
                    className="block text-sm font-medium whitespace-nowrap text-slate-700 dark:text-slate-300 mb-1.5"
                  >
                    Instructor Name <span className="text-red-600">*</span>
                  </label>
                  <div className="relative min-w-0">
                    <UserCheck className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      id="course-instructor"
                      type="text"
                      maxLength={60}
                      value={instructorName}
                      onChange={(e) => {
                        setInstructorName(e.target.value);
                        if (errors.instructorName)
                          setErrors((prev) => ({
                            ...prev,
                            instructorName: '',
                          }));
                      }}
                      placeholder="Enter instructor name"
                      className={`w-full min-w-0 pl-10 pr-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 hover:border-emerald-400 dark:hover:border-emerald-500 focus:outline-none focus:ring-2 transition-all ${
                        errors.instructorName
                          ? 'border-red-500 focus:ring-red-500/20'
                          : 'border-slate-300 dark:border-slate-700 focus:border-emerald-600 focus:ring-emerald-600/20'
                      }`}
                    />
                  </div>
                  {errors.instructorName && (
                    <p className="mt-1.5 text-xs font-semibold text-red-600 dark:text-red-400 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-red-600 dark:text-red-400" />
                      <span>{errors.instructorName}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Optional Thumbnail Image */}
              <div className="space-y-2 min-w-0">
                <label
                  htmlFor="course-thumbnail"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300"
                >
                  Thumbnail Image (Optional)
                </label>

                <div className="flex flex-wrap items-center gap-2.5">
                  <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold whitespace-nowrap shadow-sm transition-colors cursor-pointer">
                    <Upload className="w-4 h-4 shrink-0" />
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
                      className="px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
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
                  id="course-thumbnail"
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
                      : 'Optional: paste an image URL (https://... or /images/...)'
                  }
                  disabled={isDataUrl}
                  className={`w-full min-w-0 px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 hover:border-emerald-400 dark:hover:border-emerald-500 focus:outline-none focus:ring-2 transition-all disabled:opacity-60 ${
                    errors.thumbnail
                      ? 'border-red-500 focus:ring-red-500/20'
                      : 'border-slate-300 dark:border-slate-700 focus:border-emerald-600 focus:ring-emerald-600/20'
                  }`}
                />

                {errors.thumbnail && (
                  <p className="mt-1.5 text-xs font-semibold text-red-600 dark:text-red-400 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-red-600 dark:text-red-400" />
                    <span>{errors.thumbnail}</span>
                  </p>
                )}
              </div>

              <div className="min-w-0">
                <label
                  htmlFor="course-description"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5"
                >
                  Course Description <span className="text-red-600">*</span>
                </label>
                <textarea
                  id="course-description"
                  rows={4}
                  maxLength={600}
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value);
                    if (errors.description)
                      setErrors((prev) => ({ ...prev, description: '' }));
                  }}
                  placeholder="Describe what learners will build, key concepts covered, and expected outcomes..."
                  className={`w-full min-w-0 px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 hover:border-emerald-400 dark:hover:border-emerald-500 focus:outline-none focus:ring-2 transition-all resize-none ${
                    errors.description
                      ? 'border-red-500 focus:ring-red-500/20'
                      : 'border-slate-300 dark:border-slate-700 focus:border-emerald-600 focus:ring-emerald-600/20'
                  }`}
                />
                <div className="mt-1 flex items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
                  {errors.description ? (
                    <span className="font-semibold text-red-600 dark:text-red-400 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-red-600 dark:text-red-400" />
                      <span>{errors.description}</span>
                    </span>
                  ) : (
                    <span>Minimum 15 characters required</span>
                  )}
                  <span className="font-medium shrink-0">
                    {description.length} / 600
                  </span>
                </div>
              </div>
            </div>

            {/* Section 2: Modules & Lessons Builder */}
            <div className="group/curr relative overflow-hidden bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-4 sm:p-8 shadow-sm hover:-translate-y-1.5 hover:shadow-2xl hover:border-emerald-300 dark:hover:border-emerald-700 transition-all duration-200 space-y-5 min-w-0">
              <div
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-400 opacity-85"
              />

              <div className="flex flex-wrap items-center justify-between gap-3 min-w-0">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-11 h-11 rounded-2xl bg-teal-50 dark:bg-teal-950/80 text-teal-600 dark:text-teal-400 group-hover/curr:bg-teal-600 group-hover/curr:text-white transition-all duration-200 flex items-center justify-center shrink-0">
                    <Layers className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                      Curriculum Modules & Lessons
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {sections.length} module(s) · {totalLessons} lesson(s)
                    </p>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  onClick={handleAddSection}
                  className="shrink-0 whitespace-nowrap border-emerald-200 dark:border-emerald-800/80 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/60"
                >
                  <FolderPlus className="w-4 h-4 shrink-0" />
                  <span>Add Module</span>
                </Button>
              </div>

              {errors.sections && (
                <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800/70 text-xs font-semibold text-red-600 dark:text-red-400 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-red-600 dark:text-red-400" />
                  <span>{errors.sections}</span>
                </div>
              )}

              <div className="space-y-4 min-w-0">
                {sections.map((sec, secIdx) => (
                  <div
                    key={sec.id}
                    className="p-3.5 sm:p-5 rounded-2xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 space-y-3.5 min-w-0"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <input
                        type="text"
                        value={sec.title}
                        onChange={(e) =>
                          handleSectionTitleChange(sec.id, e.target.value)
                        }
                        placeholder={`Module ${secIdx + 1} title`}
                        className="min-w-0 flex-1 px-3 py-2 text-sm font-bold bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:border-emerald-600 focus:ring-emerald-600/20"
                      />

                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleAddLesson(sec.id)}
                        className="shrink-0 px-2.5 sm:px-3 border-emerald-200 dark:border-emerald-800/80 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/60"
                      >
                        <Plus className="w-3.5 h-3.5 shrink-0" />
                        <span className="hidden sm:inline">Lesson</span>
                      </Button>

                      {sections.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveSection(sec.id)}
                          aria-label={`Remove ${sec.title || 'module'}`}
                          className="shrink-0 p-2 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <div className="space-y-2 min-w-0">
                      {(sec.lessons || []).map((les, lesIdx) => (
                        <div
                          key={les.id}
                          className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 min-w-0"
                        >
                          <input
                            type="text"
                            value={les.title}
                            onChange={(e) =>
                              handleLessonChange(
                                sec.id,
                                les.id,
                                'title',
                                e.target.value
                              )
                            }
                            placeholder={`Lesson ${lesIdx + 1} title`}
                            className="min-w-0 flex-1 px-3 py-2 text-xs sm:text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:border-emerald-600 focus:ring-emerald-600/20"
                          />

                          <div className="flex items-center gap-2 min-w-0">
                            <input
                              type="text"
                              value={les.duration}
                              onChange={(e) =>
                                handleLessonChange(
                                  sec.id,
                                  les.id,
                                  'duration',
                                  e.target.value
                                )
                              }
                              placeholder="10m"
                              className="min-w-0 flex-1 sm:flex-initial sm:w-24 px-3 py-2 text-xs sm:text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:border-emerald-600 focus:ring-emerald-600/20"
                            />

                            {(sec.lessons || []).length > 1 && (
                              <button
                                type="button"
                                onClick={() => handleRemoveLesson(sec.id, les.id)}
                                aria-label="Remove lesson"
                                className="shrink-0 p-2 rounded-xl text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 3: Assignment & Quiz Settings + Publish CTA */}
            <div className="group/assess relative overflow-hidden bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-5 sm:p-8 shadow-sm hover:-translate-y-1.5 hover:shadow-2xl hover:border-emerald-300 dark:hover:border-emerald-700 transition-all duration-200 space-y-5 min-w-0">
              <div
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-400 opacity-85"
              />

              <div className="flex items-center gap-3 min-w-0">
                <div className="w-11 h-11 rounded-2xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 group-hover/assess:bg-emerald-600 group-hover/assess:text-white transition-all duration-200 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                    Assignment & Assessment Rules
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Optional practical project brief and quiz pass mark
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 items-start min-w-0">
                <div className="xl:col-span-7 min-w-0">
                  <label
                    htmlFor="assignment-title"
                    className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5"
                  >
                    Practical Assignment Title (Optional)
                  </label>
                  <input
                    id="assignment-title"
                    type="text"
                    maxLength={100}
                    value={assignmentTitle}
                    onChange={(e) => {
                      setAssignmentTitle(e.target.value);
                      if (errors.assignmentTitle)
                        setErrors((prev) => ({ ...prev, assignmentTitle: '' }));
                    }}
                    placeholder="Optional assignment title"
                    className={`w-full min-w-0 px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 hover:border-emerald-400 dark:hover:border-emerald-500 focus:outline-none focus:ring-2 transition-all ${
                      errors.assignmentTitle
                        ? 'border-red-500 focus:ring-red-500/20'
                        : 'border-slate-300 dark:border-slate-700 focus:border-emerald-600 focus:ring-emerald-600/20'
                    }`}
                  />
                  {errors.assignmentTitle && (
                    <p className="mt-1.5 text-xs font-semibold text-red-600 dark:text-red-400 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-red-600 dark:text-red-400" />
                      <span>{errors.assignmentTitle}</span>
                    </p>
                  )}
                </div>

                {/* Quiz Pass Mark (%) * */}
                <div className="xl:col-span-5 min-w-0">
                  <label
                    htmlFor="quiz-pass-mark"
                    className="block text-sm font-medium whitespace-nowrap text-slate-700 dark:text-slate-300 mb-1.5"
                  >
                    Quiz Pass Mark (%) <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative min-w-0">
                    <Trophy className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      id="quiz-pass-mark"
                      type="number"
                      min={50}
                      max={100}
                      value={passMark}
                      onChange={(e) => {
                        setPassMark(e.target.value);
                        if (errors.passMark)
                          setErrors((prev) => ({ ...prev, passMark: '' }));
                      }}
                      className={`w-full min-w-0 pl-10 pr-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 transition-all ${
                        errors.passMark
                          ? 'border-rose-500 focus:ring-rose-500/20'
                          : 'border-slate-300 dark:border-slate-700 focus:border-emerald-600 focus:ring-emerald-600/20'
                      }`}
                    />
                  </div>
                  {errors.passMark && (
                    <p className="mt-1 text-xs font-medium text-rose-600 dark:text-rose-400">
                      {errors.passMark}
                    </p>
                  )}
                </div>
              </div>

              <div className="min-w-0">
                <label
                  htmlFor="assignment-brief"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5"
                >
                  Assignment Instructions (Optional)
                </label>
                <textarea
                  id="assignment-brief"
                  rows={3}
                  maxLength={350}
                  value={assignmentBrief}
                  onChange={(e) => {
                    setAssignmentBrief(e.target.value);
                    if (errors.assignmentBrief)
                      setErrors((prev) => ({ ...prev, assignmentBrief: '' }));
                  }}
                  placeholder="Optional assignment instructions..."
                  className={`w-full min-w-0 px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 hover:border-emerald-400 dark:hover:border-emerald-500 focus:outline-none focus:ring-2 transition-all resize-none ${
                    errors.assignmentBrief
                      ? 'border-red-500 focus:ring-red-500/20'
                      : 'border-slate-300 dark:border-slate-700 focus:border-emerald-600 focus:ring-emerald-600/20'
                  }`}
                />
                {errors.assignmentBrief && (
                  <p className="mt-1.5 text-xs font-semibold text-red-600 dark:text-red-400 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-red-600 dark:text-red-400" />
                    <span>{errors.assignmentBrief}</span>
                  </p>
                )}
              </div>

              <div className="pt-2 flex flex-wrap items-center justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  onClick={resetForm}
                  className="whitespace-nowrap"
                >
                  Reset Form
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="whitespace-nowrap bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:via-teal-500 hover:to-emerald-600 text-white font-extrabold shadow-md shadow-emerald-600/25 hover:shadow-xl hover:shadow-emerald-600/35 hover:-translate-y-0.5 transition-all duration-200"
                >
                  <PlusCircle className="w-4 h-4 shrink-0" />
                  <span>Publish Course</span>
                </Button>
              </div>
            </div>
          </form>

          {/* Right 4 Columns: Live Course Card Preview */}
          <div className="lg:col-span-4 min-w-0 space-y-6 lg:sticky lg:top-8">
            <div className="group/preview relative overflow-hidden min-w-0 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-5 sm:p-6 shadow-sm hover:-translate-y-1.5 hover:shadow-2xl hover:border-emerald-300 dark:hover:border-emerald-700 transition-all duration-200 space-y-4">
              <div
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-400"
              />

              <div className="flex flex-wrap items-center justify-between gap-2 min-w-0">
                <div className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider whitespace-nowrap text-emerald-600 dark:text-emerald-400 shrink-0">
                  <Eye className="w-4 h-4 shrink-0" />
                  <span>Live Preview</span>
                </div>
                <Badge tone="emerald" className="whitespace-nowrap shrink-0">
                  Draft Preview
                </Badge>
              </div>

              <div className="h-44 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 relative">
                {thumbnail.trim() ? (
                  <img
                    src={thumbnail.trim()}
                    alt={title.trim() || 'Course preview'}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-700 text-white p-4 text-center">
                    <Layers className="w-9 h-9 mb-2 opacity-90" />
                    <span className="text-xs font-bold tracking-wide opacity-90">
                      Course Thumbnail Preview
                    </span>
                  </div>
                )}

                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-950/75 text-white backdrop-blur-xs">
                  {level || 'Select Level'}
                </span>

                <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-emerald-600 text-white shadow-2xs">
                  {previewPriceLabel}
                </span>
              </div>

              <div className="space-y-2 min-w-0">
                <Badge tone="emerald">{category.trim() || 'Category'}</Badge>

                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white line-clamp-2 break-words">
                  {title.trim() || 'Your Course Title Will Appear Here'}
                </h3>

                <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed">
                  {description.trim() ||
                    'Add a clear summary of your course so students know what skills and projects they will complete.'}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
                <span className="inline-flex items-center gap-1 font-semibold">
                  <Layers className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  {sections.length} modules · {totalLessons} lessons
                </span>
                {duration.trim() && (
                  <span className="inline-flex items-center gap-1 font-semibold">
                    <Clock className="w-3.5 h-3.5 text-teal-500 shrink-0" />
                    {duration.trim()}
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between gap-2 text-xs font-bold text-slate-700 dark:text-slate-200 min-w-0">
                <span className="truncate">
                  Instructor: {instructorName.trim() || 'Instructor'}
                </span>
                <span className="text-emerald-600 dark:text-emerald-400 shrink-0">
                  {previewPriceLabel}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
