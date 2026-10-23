import { Loader2 } from "lucide-react";

interface LoadingStateProps {
  /** Подпись под индикатором загрузки. */
  label?: string;
}

export function LoadingState({
  label = "Загрузка данных…",
}: LoadingStateProps) {
  return (
    <output
      aria-live="polite"
      className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 text-sm text-slate-500 shadow-sm dark:border-[#2E2E2E] dark:bg-[#252525] dark:text-[#9B9B9B]"
    >
      <Loader2
        className="h-4 w-4 animate-spin text-[#E5BA41] dark:text-[#F2CA52]"
        aria-hidden="true"
      />
      <span>{label}</span>
    </output>
  );
}
