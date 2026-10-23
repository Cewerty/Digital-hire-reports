import type { DocumentState } from "@/types/candidateReport";

interface DocumentStateBadgeProps {
  state: DocumentState;
}

export function DocumentStateBadge({ state }: DocumentStateBadgeProps) {
  const isApproved = state === "approved";

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-0.5 text-xs font-medium transition-colors duration-150 ${
        isApproved
          ? "border-emerald-200 bg-emerald-100 text-emerald-900 dark:border-emerald-800/50 dark:bg-emerald-950/40 dark:text-emerald-300"
          : "border-brand-strong bg-brand-soft/40 text-brand-foreground dark:border-brand-strong/50 dark:bg-amber-950/40 dark:text-brand"
      }`}
    >
      {isApproved ? "Документ утверждён наставником" : "Черновик документа"}
    </span>
  );
}
