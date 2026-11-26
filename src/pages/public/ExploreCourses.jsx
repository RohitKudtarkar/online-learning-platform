import { useState, useMemo, useRef, useEffect } from 'react';
import {
  Search,
  RotateCcw,
  Sparkles,
  SlidersHorizontal,
  ArrowUpDown,
  BookOpen,
  Layers,
  Award,
  X,
  ChevronDown,
  Check,
  Flame,
  Star,
  TrendingUp,
  TrendingDown,
  GraduationCap,
  Compass,
  Zap,
} from 'lucide-react';
import CourseCard from '../../components/common/CourseCard';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import { usePlatform } from '../../context/PlatformContext';

const LEVEL_OPTIONS = [
  {
    value: 'All',
    label: 'All Skill Levels',
    desc: 'Browse every difficulty tier',
    icon: Layers,
  },
  {
    value: 'Beginner',
    label: 'Beginner Friendly',
    desc: 'Start from core fundamentals',
    icon: Compass,
  },
  {
    value: 'Intermediate',
    label: 'Intermediate',
    desc: 'Build production workflows',
    icon: Zap,
  },
  {
    value: 'All Levels',
    label: 'All Levels',
    desc: 'Structured for any background',
    icon: GraduationCap,
  },
];

const SORT_OPTIONS = [
  {
    value: 'popular',
    label: 'Most Popular',
    desc: 'Highest student enrollment',
    icon: Flame,
  },
  {
    value: 'rating',
    label: 'Highest Rated',
    desc: 'Top learner review scores',
    icon: Star,
  },
  {
    value: 'price-low',
    label: 'Price: Low to High',
    desc: 'Most budget-friendly first',
    icon: TrendingUp,
  },
  {
    value: 'price-high',
    label: 'Price: High to Low',
    desc: 'Comprehensive tracks first',
    icon: TrendingDown,
  },
];

function FilterDropdown({
  label,
  value,
  options,
  onChange,
  TriggerIcon,
  accentColor = 'indigo',
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  const selectedOption =
    options.find((opt) => opt.value === value) || options[0];

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const iconTone =
    accentColor === 'emerald'
      ? 'text-emerald-600 dark:text-emerald-400'
      : 'text-indigo-600 dark:text-indigo-400';

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={label}
        className={`w-full flex items-center justify-between gap-2.5 px-3.5 py-2.5 text-sm font-semibold rounded-xl border transition-all duration-150 cursor-pointer ${
          open
            ? 'bg-white dark:bg-slate-800 border-indigo-500 ring-2 ring-indigo-500/20 shadow-md text-slate-900 dark:text-white'
            : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 hover:-translate-y-0.5 hover:shadow-md hover:bg-white dark:hover:bg-slate-800/90 hover:border-indigo-400 dark:hover:border-indigo-500'
        }`}
      >
        <span className="flex items-center gap-2.5 min-w-0">
          <TriggerIcon className={`w-4 h-4 shrink-0 ${iconTone}`} />
          <span className="truncate">{selectedOption.label}</span>
        </span>
        <ChevronDown
          className={`w-4 h-4 shrink-0 text-slate-400 transition-transform duration-200 ${
            open ? 'rotate-180 text-indigo-600 dark:text-indigo-400' : ''
          }`}
        />
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute right-0 left-0 sm:left-auto sm:min-w-[16.5rem] mt-2 z-30 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xl p-1.5 space-y-1"
        >
          {options.map((opt) => {
            const ItemIcon = opt.icon;
            const isSelected = opt.value === value;
            return (
              <button
                key={opt.value}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-150 cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-slate-800 hover:translate-x-0.5'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      isSelected
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400'
                    }`}
                  >
                    <ItemIcon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-bold truncate">
                      {opt.label}
                    </p>
                    <p
                      className={`text-[11px] truncate ${
                        isSelected
                          ? 'text-indigo-100'
                          : 'text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      {opt.desc}
                    </p>
                  </div>
                </div>
                {isSelected && <Check className="w-4 h-4 shrink-0 text-white" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function ExploreCourses() {
  const { courses, categories } = usePlatform();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState('All');
  const [sortBy, setSortBy] = useState('popular');

  const publishedCourses = useMemo(
    () => courses.filter((c) => c.status !== 'Draft'),
    [courses]
  );

  const categoryCounts = useMemo(() => {
    const counts = { All: publishedCourses.length };
    categories.forEach((cat) => {
      counts[cat] = publishedCourses.filter((c) => c.category === cat).length;
    });
    return counts;
  }, [publishedCourses, categories]);

  const filteredCourses = useMemo(() => {
    const q = search.trim().toLowerCase();
    const list = publishedCourses.filter((c) => {
      const matchesSearch =
        !q ||
        c.title.toLowerCase().includes(q) ||
        c.subtitle.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q) ||
        c.instructor?.name?.toLowerCase().includes(q);
      const matchesCategory =
        selectedCategory === 'All' || c.category === selectedCategory;
      const matchesLevel = selectedLevel === 'All' || c.level === selectedLevel;
      return matchesSearch && matchesCategory && matchesLevel;
    });

    if (sortBy === 'price-low') return [...list].sort((a, b) => a.price - b.price);
    if (sortBy === 'price-high') return [...list].sort((a, b) => b.price - a.price);
    if (sortBy === 'rating') return [...list].sort((a, b) => b.rating - a.rating);
    return [...list].sort((a, b) => b.studentsCount - a.studentsCount);
  }, [publishedCourses, search, selectedCategory, selectedLevel, sortBy]);

  const hasActiveFilters =
    search.trim() !== '' || selectedCategory !== 'All' || selectedLevel !== 'All';

  const resetFilters = () => {
    setSearch('');
    setSelectedCategory('All');
    setSelectedLevel('All');
    setSortBy('popular');
  };

  const statCards = [
    {
      value: publishedCourses.length,
      label: 'Courses',
      icon: BookOpen,
      iconBadge:
        'bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 group-hover/stat:bg-indigo-600 group-hover/stat:text-white',
    },
    {
      value: categories.length,
      label: 'Tracks',
      icon: Layers,
      iconBadge:
        'bg-violet-50 dark:bg-violet-950/80 text-violet-600 dark:text-violet-400 group-hover/stat:bg-violet-600 group-hover/stat:text-white',
    },
    {
      value: '100%',
      label: 'Certified',
      icon: Award,
      iconBadge:
        'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 group-hover/stat:bg-emerald-600 group-hover/stat:text-white',
    },
  ];

  return (
    <div className="relative overflow-hidden py-10 lg:py-14">
      {/* Subtle Ambient Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[56rem] h-[22rem] rounded-full bg-gradient-to-tr from-indigo-500/12 via-violet-500/10 to-emerald-500/12 blur-3xl"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Hero Header Banner */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 lg:p-10 shadow-sm hover:shadow-lg transition-all duration-200 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200/80 dark:border-indigo-800/80 text-indigo-700 dark:text-indigo-300 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>Course Catalog • Self-Paced & Project-Driven</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
              Explore{' '}
              <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-emerald-600 dark:from-indigo-400 dark:via-violet-400 dark:to-emerald-400 bg-clip-text text-transparent">
                Courses
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              Search by topic, filter by category or skill level, and enroll anytime to unlock structured lessons, quizzes, and certificates.
            </p>
          </div>

          {/* Interactive Catalog Stat Cards */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4 shrink-0">
            {statCards.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.label}
                  className="group/stat p-4 sm:p-5 rounded-2xl bg-slate-50/90 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700/80 shadow-xs hover:-translate-y-1.5 hover:shadow-xl hover:bg-white dark:hover:bg-slate-800 hover:border-indigo-300 dark:hover:border-indigo-600 transition-all duration-200 text-center cursor-default"
                >
                  <div
                    className={`w-9 h-9 rounded-xl ${item.iconBadge} flex items-center justify-center mx-auto mb-2 transition-all duration-200 group-hover/stat:-translate-y-1 group-hover/stat:scale-110 group-hover/stat:shadow-md`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <p className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                    {item.value}
                  </p>
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
                    {item.label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Search, Custom Dropdowns & Category Bar */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-sm hover:shadow-md transition-all space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5">
            {/* Search Input */}
            <div className="md:col-span-6 group/search relative rounded-xl transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md focus-within:-translate-y-0.5 focus-within:shadow-md">
              <Search className="w-4 h-4 text-slate-400 group-hover/search:text-indigo-600 dark:group-hover/search:text-indigo-400 group-focus-within/search:text-indigo-600 dark:group-focus-within/search:text-indigo-400 transition-colors absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search courses, skills, or topics..."
                className="w-full pl-10 pr-9 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 hover:border-indigo-400 dark:hover:border-indigo-500 hover:bg-white dark:hover:bg-slate-800/90 focus:outline-none focus:border-indigo-600 focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-indigo-600/20 transition-all duration-150"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  aria-label="Clear search"
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Custom Skill Level Dropdown */}
            <div className="md:col-span-3">
              <FilterDropdown
                label="Filter by skill level"
                value={selectedLevel}
                options={LEVEL_OPTIONS}
                onChange={setSelectedLevel}
                TriggerIcon={SlidersHorizontal}
                accentColor="indigo"
              />
            </div>

            {/* Custom Sort Dropdown */}
            <div className="md:col-span-3">
              <FilterDropdown
                label="Sort courses"
                value={sortBy}
                options={SORT_OPTIONS}
                onChange={setSortBy}
                TriggerIcon={ArrowUpDown}
                accentColor="emerald"
              />
            </div>
          </div>

          {/* Interactive Category Pills & Result Count */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {['All', ...categories].map((cat) => {
                const isActive = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-150 hover:-translate-y-0.5 cursor-pointer ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-slate-700 hover:text-indigo-600 dark:hover:text-white'
                    }`}
                  >
                    <span>{cat}</span>
                    <span
                      className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-slate-200/80 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {categoryCounts[cat] ?? 0}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-3 shrink-0">
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="inline-flex items-center gap-1 text-xs font-bold text-rose-600 dark:text-rose-400 hover:underline cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Clear Filters
                </button>
              )}
              <Badge tone="slate">
                Showing {filteredCourses.length}{' '}
                {filteredCourses.length === 1 ? 'course' : 'courses'}
              </Badge>
            </div>
          </div>
        </div>

        {/* Courses Grid or Empty State */}
        {filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-12 text-center shadow-sm space-y-3">
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
              No matching courses found
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto">
              Try clearing your search term or resetting the category and skill level filters to browse all available courses.
            </p>
            <div className="pt-2">
              <Button variant="primary" size="sm" onClick={resetFilters}>
                <RotateCcw className="w-4 h-4" />
                Reset All Filters
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
