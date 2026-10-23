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
      className="flex items-center gap-3 rounded-2xl border border-border bg-background p-4 text-sm text-muted-foreground shadow-sm"
    >
      <Loader2
        className="h-4 w-4 animate-spin text-brand-strong"
        aria-hidden="true"
      />
      <span>{label}</span>
    </output>
  );
}
