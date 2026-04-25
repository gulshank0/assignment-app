import React, { useEffect, useState, useCallback } from "react";
import { CheckCircle, XCircle, Info, X } from "lucide-react";

type ToastType = "success" | "error" | "info";

interface ToastData {
  id: number;
  message: string;
  type: ToastType;
  exiting?: boolean;
}

let toastId = 0;
let addToastFn: ((message: string, type: ToastType) => void) | null = null;

/**
 * Show a toast notification from anywhere in the app.
 */
export function toast(message: string, type: ToastType = "info") {
  addToastFn?.(message, type);
}

const iconMap: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />,
  error: <XCircle className="h-4 w-4 text-red-400 shrink-0" />,
  info: <Info className="h-4 w-4 text-blue-400 shrink-0" />,
};

const borderMap: Record<ToastType, string> = {
  success: "border-emerald-500/20",
  error: "border-red-500/20",
  info: "border-blue-500/20",
};

export default function ToastContainer() {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const addToast = useCallback((message: string, type: ToastType) => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, message, type }]);

    // Auto-dismiss after 3 seconds
    setTimeout(() => {
      setToasts((prev) =>
        prev.map((t) => (t.id === id ? { ...t, exiting: true } : t)),
      );
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 300);
    }, 3000);
  }, []);

  useEffect(() => {
    addToastFn = addToast;
    return () => {
      addToastFn = null;
    };
  }, [addToast]);

  const dismiss = (id: number) => {
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, exiting: true } : t)),
    );
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 300);
  };

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2 max-w-sm">
      {toasts.map((t) => (
        <div
          key={t.id}
          role="alert"
          style={{
            animation: t.exiting
              ? "toast-exit 0.3s ease-in forwards"
              : "toast-enter 0.3s ease-out",
          }}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-900/95 backdrop-blur-md border ${borderMap[t.type]} shadow-2xl text-sm text-slate-200`}
        >
          {iconMap[t.type]}
          <span className="flex-1">{t.message}</span>
          <button
            onClick={() => dismiss(t.id)}
            className="p-0.5 rounded text-slate-500 hover:text-slate-300 transition-colors"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}
