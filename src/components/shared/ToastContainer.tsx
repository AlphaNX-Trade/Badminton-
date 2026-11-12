import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, Info, X, AlertTriangle } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-md w-full pointer-events-none">
      {toasts.map((toast) => {
        const iconMap = {
          success: <CheckCircle2 className="w-5 h-5 text-[#C7F464] shrink-0" />,
          error: <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />,
          warning: <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />,
          info: <Info className="w-5 h-5 text-sky-400 shrink-0" />,
        };

        const borderMap = {
          success: 'border-[#C7F464]/30',
          error: 'border-rose-500/30',
          warning: 'border-amber-500/30',
          info: 'border-sky-500/30',
        };

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl bg-[#111519] border ${borderMap[toast.type]} shadow-2xl backdrop-blur-md transition-all duration-300 animate-in fade-in slide-in-from-bottom-4`}
          >
            {iconMap[toast.type]}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[#F4F5F3] leading-tight">{toast.title}</p>
              {toast.message && (
                <p className="text-xs text-[#9BA3A8] mt-1 leading-relaxed">{toast.message}</p>
              )}
            </div>
            <button
              onClick={() => dismissToast(toast.id)}
              className="text-[#9BA3A8] hover:text-[#F4F5F3] transition-colors p-1"
              aria-label="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
