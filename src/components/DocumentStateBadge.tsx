import type { DocumentState } from "@/types/candidateReport";

interface DocumentStateBadgeProps {
  state: DocumentState;
}

export function DocumentStateBadge({ state }: DocumentStateBadgeProps) {
  const isApproved = state === "approved";

  return (
    <span
      className={
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium " +
        (isApproved
          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
          : "border-amber-200 bg-amber-50 text-amber-700")
      }
    >
      {isApproved ? "Документ утверждён" : "Черновик документа"}
    </span>
  );
}
