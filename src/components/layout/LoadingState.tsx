import { Loader2 } from "lucide-react";

import { CARD_SURFACE_CLASS } from "@/lib/surfaces";

interface LoadingStateProps {
  /** Подпись под индикатором загрузки. */
  label?: string;
}

export function LoadingState({
  label = "Загрузка данных…",
}: LoadingStateProps) {
  return (
    <output
      className={`flex items-center gap-3 rounded-2xl p-4 text-sm text-muted-foreground shadow-xs ${CARD_SURFACE_CLASS}`}
    >
      <Loader2
        className="h-4 w-4 animate-spin text-brand-strong"
        aria-hidden="true"
      />
      <span>{label}</span>
    </output>
  );
}
