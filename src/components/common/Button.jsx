import { useState } from 'react';

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  type = 'button',
  disabled = false,
  onClick,
  ...props
}) {
  const [clicked, setClicked] = useState(false);

  const variants = {
    primary:
      'bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 hover:shadow-lg text-white shadow-sm focus-visible:ring-indigo-500',
    secondary:
      'bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 hover:shadow-lg text-white shadow-sm focus-visible:ring-emerald-500',
    outline:
      'bg-white dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-slate-700 active:bg-indigo-100 dark:active:bg-slate-600 hover:shadow-md hover:border-indigo-400 text-slate-800 dark:text-slate-100 border border-slate-300 dark:border-slate-600 focus-visible:ring-indigo-500',
    ghost:
      'bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 active:bg-slate-200 dark:active:bg-slate-700 text-slate-700 dark:text-slate-200 focus-visible:ring-slate-400',
    danger:
      'bg-rose-600 hover:bg-rose-700 active:bg-rose-800 hover:shadow-lg text-white shadow-sm focus-visible:ring-rose-500',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs rounded-lg gap-1.5',
    md: 'px-4 py-2.5 text-sm rounded-xl gap-2',
    lg: 'px-6 py-3 text-base rounded-xl gap-2',
  };

  const handleClick = (e) => {
    setClicked(true);
    setTimeout(() => setClicked(false), 350);
    if (onClick) onClick(e);
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={handleClick}
      className={`inline-flex items-center justify-center font-semibold transition-all duration-150 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 cursor-pointer ${
        clicked ? 'ring-2 ring-indigo-400/60' : ''
      } ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}