import { Loader2 } from "lucide-react";

import { CARD_SURFACE_CLASS } from "@/lib/surfaces";

interface LoadingStateProps {
  /** Подпись под индикатором загрузки. */
  label?: string;
}

export function LoadingState({
  label = "Загрузка данных…",
}: LoadingStateProps) {
  // `CARD_SURFACE_CLASS` = `bg-card` = `#F4F5F7` / `#252525` (§2), а
  // `text-muted-foreground` = `#64748B` / `#9B9B9B` — ровно значения спеки.
  // shadcn-токены здесь не «формально мимо», а эквивалент hex из §2.
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
