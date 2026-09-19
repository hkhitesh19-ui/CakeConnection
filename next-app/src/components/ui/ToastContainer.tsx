'use client';
import { useEffect } from 'react';
import { useUIStore } from '@/stores';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

export function ToastContainer() {
  const { toasts, removeToast } = useUIStore();

  useEffect(() => {
    toasts.forEach((toast) => {
      const timer = setTimeout(() => {
        removeToast(toast.id);
      }, toast.duration || 4000);
      return () => clearTimeout(timer);
    });
  }, [toasts, removeToast]);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-center gap-3 p-4 rounded-xl shadow-lg border pointer-events-auto bg-surface-primary
            ${toast.type === 'success' ? 'border-emerald-500/30 text-emerald-500' : ''}
            ${toast.type === 'error' ? 'border-brand-red/30 text-brand-red' : ''}
            ${toast.type === 'info' ? 'border-blue-500/30 text-blue-500' : ''}
            ${toast.type === 'warning' ? 'border-yellow-500/30 text-yellow-500' : ''}
          `}
        >
          {toast.type === 'success' && <CheckCircle className="h-5 w-5" />}
          {toast.type === 'error' && <AlertCircle className="h-5 w-5" />}
          {toast.type === 'warning' && <AlertTriangle className="h-5 w-5" />}
          {toast.type === 'info' && <Info className="h-5 w-5" />}
          
          <p className="text-sm font-medium text-text-primary pr-4">{toast.message}</p>
          
          <button
            onClick={() => removeToast(toast.id)}
            className="text-text-muted hover:text-text-primary transition-colors ml-auto"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
