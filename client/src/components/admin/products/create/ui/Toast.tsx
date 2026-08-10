'use client';

import { createContext, useCallback, useContext, useState } from 'react';
import * as Toast from '@radix-ui/react-toast';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';
import { cn } from '@/lib/cn';

type ToastType = 'success' | 'error';

interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type: ToastType;
}

interface ToastContextValue {
  toast: (title: string, description?: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const toast = useCallback(
    (title: string, description?: string, type: ToastType = 'success') => {
      const id = `toast-${Date.now()}`;
      setToasts((prev) => [...prev, { id, title, description, type }]);
    },
    []
  );

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      <Toast.Provider swipeDirection="right" duration={4000}>
        {children}
        {toasts.map((t) => (
          <Toast.Root
            key={t.id}
            onOpenChange={(open) => !open && removeToast(t.id)}
            className={cn(
              'fixed bottom-4 right-4 z-[100] flex items-start gap-3 w-full max-w-sm bg-white border rounded-2xl shadow-lg p-4',
              'data-[state=open]:animate-in fade-in-0 slide-in-from-right duration-300',
              t.type === 'success' ? 'border-emerald-200' : 'border-red-200'
            )}
          >
            {t.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            )}
            <div className="flex-1 min-w-0">
              <Toast.Title className="text-sm font-semibold text-stone-900">
                {t.title}
              </Toast.Title>
              {t.description && (
                <Toast.Description className="text-xs text-stone-500 mt-0.5">
                  {t.description}
                </Toast.Description>
              )}
            </div>
            <Toast.Close className="text-stone-400 hover:text-stone-600">
              <X className="w-4 h-4" />
            </Toast.Close>
          </Toast.Root>
        ))}
        <Toast.Viewport className="fixed bottom-0 right-0 flex flex-col gap-2 p-4 outline-none z-[100]" />
      </Toast.Provider>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
