import { useState, useCallback } from 'react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
}

let toastCounter = 0;

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback(
    (type: ToastType, title: string, description?: string) => {
      const id = `toast-${++toastCounter}`;
      const toast: Toast = { id, type, title, description };
      setToasts((prev) => [...prev, toast]);

      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 5000);

      return id;
    },
    [],
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const success = useCallback(
    (title: string, description?: string) => addToast('success', title, description),
    [addToast],
  );

  const error = useCallback(
    (title: string, description?: string) => addToast('error', title, description),
    [addToast],
  );

  const warning = useCallback(
    (title: string, description?: string) => addToast('warning', title, description),
    [addToast],
  );

  const info = useCallback(
    (title: string, description?: string) => addToast('info', title, description),
    [addToast],
  );

  return { toasts, addToast, removeToast, success, error, warning, info };
}
