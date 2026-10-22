import { Loader2 } from "lucide-react";

interface LoadingStateProps {
  /** Подпись под индикатором загрузки. */
  label?: string;
}

export function LoadingState({
  label = "Загрузка данных…",
}: LoadingStateProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-500 shadow-sm"
    >
      <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}
