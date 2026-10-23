import {
  CheckCircle2,
  CircleDashed,
  Clock,
  FileCheck,
  type LucideIcon,
  XCircle,
} from "lucide-react";
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
  uninterviewed: "border-border bg-background text-muted-foreground",
  in_review:
    "border-brand-strong bg-brand-soft/40 text-brand-foreground dark:border-brand-strong/50 dark:bg-amber-950/40 dark:text-brand",
  reviewed:
    "border-sky-200 bg-sky-100 text-sky-900 dark:border-sky-800/50 dark:bg-sky-950/40 dark:text-sky-300",
  approved:
    "border-emerald-200 bg-emerald-100 text-emerald-900 dark:border-emerald-800/50 dark:bg-emerald-950/40 dark:text-emerald-300",
  rejected:
    "border-red-200 bg-red-50 text-red-800 dark:border-red-800/50 dark:bg-red-950/40 dark:text-red-300",
};

const STAGE_ICONS: Record<PipelineStage, LucideIcon> = {
  uninterviewed: CircleDashed,
  in_review: Clock,
  reviewed: FileCheck,
  approved: CheckCircle2,
  rejected: XCircle,
};

function StageBadge({ stage }: { stage: PipelineStage }) {
  const Icon = STAGE_ICONS[stage];

  return (
    <span
      className={`mt-3 inline-flex items-center gap-1.5 rounded-full border px-3 py-0.5 text-xs font-medium transition-colors ${
        STAGE_CLASSES[stage]
      }`}
    >
      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
      {STAGE_LABELS[stage]}
    </span>
  );
}

export function CandidatesListPage() {
  const { candidates } = useOutletContext<AppOutletContext>();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
          Кандидаты · {candidates.length}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
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
                className="block h-full rounded-2xl border border-transparent bg-muted p-5 transition-colors hover:border-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-strong focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <p className="text-sm font-semibold text-foreground">
                  {candidate.fullName}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Группа: {candidate.group}
                </p>
                <p className="text-sm text-muted-foreground">
                  Направление: {candidate.specialty}
                </p>
                <StageBadge stage={candidate.pipelineStage} />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
