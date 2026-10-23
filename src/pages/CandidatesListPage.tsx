import { Link, useOutletContext } from "react-router-dom";

import type { AppOutletContext } from "@/components/layout/AppLayout";
import { EmptyState } from "@/components/layout/EmptyState";
import type { PipelineStage } from "@/types/candidateReport";

const STAGE_LABELS: Record<PipelineStage, string> = {
  uninterviewed: "Не опрошен",
  in_review: "На рассмотрении",
  reviewed: "Рассмотрен",
  approved: "Подтверждён",
  rejected: "Отклонён",
};

const STAGE_CLASSES: Record<PipelineStage, string> = {
  uninterviewed: "border-slate-200 bg-white text-slate-600",
  in_review: "border-[#E5BA41] bg-[#F5D061]/40 text-[#1E2028]",
  reviewed: "border-sky-200 bg-sky-100 text-sky-900",
  approved: "border-emerald-200 bg-emerald-100 text-emerald-900",
  rejected: "border-red-200 bg-red-50 text-red-800",
};

export function CandidatesListPage() {
  const { candidates } = useOutletContext<AppOutletContext>();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
          Кандидаты · {candidates.length}
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Реестр вертикального среза. Откройте карточку, чтобы посмотреть
          профиль, материалы интервью и отчёт.
        </p>
      </div>

      {candidates.length === 0 ? (
        <EmptyState
          title="Кандидатов пока нет"
          description="В реестре нет ни одной записи."
        />
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {candidates.map((candidate) => (
            <li key={candidate.id}>
              <Link
                to={`/candidates/${candidate.id}`}
                className="block h-full rounded-2xl border border-transparent bg-[#F4F5F7] p-5 transition-colors hover:border-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E5BA41] focus-visible:ring-offset-2"
              >
                <p className="text-sm font-semibold text-slate-900">
                  {candidate.fullName}
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  {candidate.group} · {candidate.specialty}
                </p>
                <span
                  className={`mt-3 inline-flex items-center rounded-full border px-3 py-0.5 text-xs font-medium transition-colors ${
                    STAGE_CLASSES[candidate.pipelineStage]
                  }`}
                >
                  {STAGE_LABELS[candidate.pipelineStage]}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
