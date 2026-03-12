import { useEffect } from "react";

export type SnackbarVariant = "default" | "success" | "error";

export interface SnackbarProps {
  message: string;
  variant?: SnackbarVariant;
  open: boolean;
  onClose: () => void;
  autoHideDuration?: number;
}

const variantStyles: Record<SnackbarVariant, string> = {
  default:
    "border-slate-200 bg-white text-slate-700 shadow-sm",
  success:
    "border-emerald-200 bg-emerald-50 text-emerald-800",
  error:
    "border-red-200 bg-red-50 text-red-700",
};

export function Snackbar({
  message,
  variant = "default",
  open,
  onClose,
  autoHideDuration = 4000,
}: SnackbarProps) {
  useEffect(() => {
    if (!open || autoHideDuration <= 0) return;
    const t = setTimeout(onClose, autoHideDuration);
    return () => clearTimeout(t);
  }, [open, autoHideDuration, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed bottom-6 left-1/2 z-30 -translate-x-1/2 px-4"
      role="status"
      aria-live="polite"
    >
      <div
        className={`flex min-w-[280px] max-w-md items-center justify-between gap-4 rounded-md border px-4 py-3 text-sm ${variantStyles[variant]}`}
      >
        <span className="min-w-0 flex-1">{message}</span>
        <button
          type="button"
          onClick={onClose}
          className="flex-shrink-0 rounded p-1 opacity-70 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-slate-300"
          aria-label="Cerrar"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
