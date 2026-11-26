import { useState, useRef, useEffect } from 'react';
import {
  ChevronDown,
  Check,
  SlidersHorizontal,
  Layers,
  Compass,
  Zap,
  GraduationCap,
} from 'lucide-react';

export default function FilterDropdown({
  value,
  onChange,
  options = [],
  placeholder = 'All Levels',
  className = '',
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  const selectedOption =
    options.find((opt) =>
      typeof opt === 'string' ? opt === value : opt.value === value
    ) || null;

  const displayLabel = selectedOption
    ? typeof selectedOption === 'string'
      ? selectedOption
      : selectedOption.label
    : placeholder;

  const isFiltered =
    value !== undefined &&
    value !== null &&
    value !== '' &&
    value.toLowerCase() !== 'all' &&
    value.toLowerCase() !== 'all levels';

  useEffect(() => {
    if (!isOpen) return;

    const handleOutsideClick = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleSelect = (nextValue) => {
    onChange?.(nextValue);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className={`relative min-w-0 ${className}`}>
      {/* Trigger Pill / Input */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={`group w-full min-w-0 inline-flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold border transition-all duration-200 cursor-pointer select-none ${
          isOpen
            ? 'bg-emerald-50/90 dark:bg-emerald-950/70 border-emerald-600 text-emerald-800 dark:text-emerald-200 ring-4 ring-emerald-500/15 shadow-sm'
            : isFiltered
              ? 'bg-emerald-50/70 dark:bg-emerald-950/50 border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-200 shadow-2xs hover:border-emerald-500 hover:-translate-y-0.5'
              : 'bg-white dark:bg-slate-900 border-slate-200/90 dark:border-slate-800 text-slate-700 dark:text-slate-200 shadow-2xs hover:border-emerald-400 dark:hover:border-emerald-700 hover:bg-emerald-50/40 dark:hover:bg-slate-800/80 hover:-translate-y-0.5'
        }`}
      >
        <span className="inline-flex items-center gap-2 min-w-0">
          <SlidersHorizontal
            className={`w-4 h-4 shrink-0 transition-colors ${
              isOpen || isFiltered
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'text-emerald-600/80 dark:text-emerald-400/80 group-hover:text-emerald-600'
            }`}
          />
          <span className="truncate">{displayLabel}</span>
        </span>

        <ChevronDown
          className={`w-4 h-4 shrink-0 transition-transform duration-200 ${
            isOpen
              ? 'rotate-180 text-emerald-600 dark:text-emerald-400'
              : 'text-slate-400 dark:text-slate-500 group-hover:text-emerald-600'
          }`}
        />
      </button>

      {/* Floating Menu Card */}
      {isOpen && (
        <div
          role="listbox"
          className="absolute left-0 sm:left-auto sm:right-0 mt-2.5 w-72 max-w-[calc(100vw-2rem)] origin-top rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xl shadow-slate-900/15 dark:shadow-black/50 p-2 z-50 space-y-1.5"
        >
          {options.map((opt) => {
            const optValue = typeof opt === 'string' ? opt : opt.value;
            const optLabel = typeof opt === 'string' ? opt : opt.label;
            const optDescription =
              typeof opt === 'object' ? opt.description : null;
            const OptionIcon =
              typeof opt === 'object' && opt.icon ? opt.icon : Layers;
            const isSelected = optValue === value;

            return (
              <button
                key={optValue}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => handleSelect(optValue)}
                className={`group/item w-full flex items-center justify-between gap-3 p-2.5 rounded-2xl text-left transition-all duration-150 cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-r from-emerald-600 via-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-600/25'
                    : 'text-slate-700 dark:text-slate-200 hover:bg-emerald-50/80 dark:hover:bg-slate-800/80'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                      isSelected
                        ? 'bg-white/20 text-white'
                        : 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 group-hover/item:bg-emerald-100 dark:group-hover/item:bg-emerald-900/70'
                    }`}
                  >
                    <OptionIcon className="w-4 h-4" />
                  </span>

                  <div className="min-w-0">
                    <div
                      className={`text-xs sm:text-sm font-extrabold truncate ${
                        isSelected
                          ? 'text-white'
                          : 'text-slate-900 dark:text-white'
                      }`}
                    >
                      {optLabel}
                    </div>
                    {optDescription && (
                      <div
                        className={`text-[11px] truncate ${
                          isSelected
                            ? 'text-emerald-100'
                            : 'text-slate-500 dark:text-slate-400'
                        }`}
                      >
                        {optDescription}
                      </div>
                    )}
                  </div>
                </div>

                {isSelected && (
                  <Check
                    className="w-4 h-4 text-white shrink-0 mr-1"
                    strokeWidth={2.5}
                  />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export const INSTRUCTOR_LEVEL_OPTIONS = [
  {
    value: 'All Levels',
    label: 'All Skill Levels',
    description: 'Browse every difficulty tier',
    icon: Layers,
  },
  {
    value: 'Beginner',
    label: 'Beginner Friendly',
    description: 'Start from core fundamentals',
    icon: Compass,
  },
  {
    value: 'Intermediate',
    label: 'Intermediate',
    description: 'Build production workflows',
    icon: Zap,
  },
  {
    value: 'Advanced',
    label: 'Advanced',
    description: 'Master architecture & scale',
    icon: GraduationCap,
  },
];