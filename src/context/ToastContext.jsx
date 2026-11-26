import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((message, type = 'success', duration = 4000) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    if (duration > 0) {
      setTimeout(() => removeToast(id), duration);
    }
  }, [removeToast]);

  const activeToast = toasts[toasts.length - 1] || null;

  useEffect(() => {
    if (!activeToast) return;
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        removeToast(activeToast.id);
      }
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [activeToast, removeToast]);

  const toast = {
    success: (msg) => addToast(msg, 'success'),
    error: (msg) => addToast(msg, 'error'),
    info: (msg) => addToast(msg, 'info'),
  };

  const modalConfig = activeToast
    ? {
        success: {
          title: 'Success',
          icon: <CheckCircle2 className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />,
          badgeBg: 'bg-emerald-100/90 dark:bg-emerald-950/80',
          btnBg:
            'bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:via-teal-500 hover:to-emerald-600 shadow-emerald-600/25',
        },
        error: {
          title: 'Error',
          icon: <AlertCircle className="w-7 h-7 text-rose-600 dark:text-rose-400" />,
          badgeBg: 'bg-rose-100/90 dark:bg-rose-950/80',
          btnBg:
            'bg-gradient-to-r from-rose-600 via-red-600 to-rose-700 hover:from-rose-500 hover:via-red-500 hover:to-rose-600 shadow-rose-600/25',
        },
        info: {
          title: 'Notice',
          icon: <Info className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />,
          badgeBg: 'bg-indigo-100/90 dark:bg-indigo-950/80',
          btnBg:
            'bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-700 hover:from-indigo-500 hover:via-violet-500 hover:to-indigo-600 shadow-indigo-600/25',
        },
      }[activeToast.type] || {
        title: 'Notice',
        icon: <Info className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />,
        badgeBg: 'bg-indigo-100/90 dark:bg-indigo-950/80',
        btnBg:
          'bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-700 hover:from-indigo-500 hover:via-violet-500 hover:to-indigo-600 shadow-indigo-600/25',
      }
    : null;

  return (
    <ToastContext.Provider value={toast}>
      {children}
      {activeToast && modalConfig && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs"
          onClick={() => removeToast(activeToast.id)}
          role="dialog"
          aria-modal="true"
          aria-live="assertive"
        >
          <div
            className="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-7 sm:p-8 shadow-2xl text-center space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => removeToast(activeToast.id)}
              className="absolute top-4 right-4 p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Close notification"
            >
              <X className="w-4 h-4" />
            </button>

            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto ${modalConfig.badgeBg}`}
            >
              {modalConfig.icon}
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-black text-slate-900 dark:text-white">
                {modalConfig.title}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {activeToast.message}
              </p>
            </div>

            <div className="pt-1 flex justify-center">
              <button
                type="button"
                onClick={() => removeToast(activeToast.id)}
                className={`min-w-[116px] px-5 py-2.5 rounded-xl text-sm font-extrabold text-white shadow-md hover:-translate-y-0.5 transition-all cursor-pointer ${modalConfig.btnBg}`}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
