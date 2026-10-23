import {
  CheckCircle2,
  CircleDashed,
  Clock,
  FileCheck,
  type LucideIcon,
  XCircle,
} from "lucide-react";
import { useState } from "react";
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

// Активная таблетка фильтра использует ту же палитру, что и бейдж этапа
// на карточке кандидата: цвет фильтра совпадает с цветом статуса.
const FILTER_ACTIVE_CLASSES: Record<StageFilter, string> = {
  all: "border-brand-strong bg-brand text-brand-foreground",
  uninterviewed:
    "border-slate-300 bg-slate-100 text-slate-900 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100",
  in_review: STAGE_CLASSES.in_review,
  reviewed: STAGE_CLASSES.reviewed,
  approved: STAGE_CLASSES.approved,
  rejected: STAGE_CLASSES.rejected,
};

const STAGE_ICONS: Record<PipelineStage, LucideIcon> = {
  uninterviewed: CircleDashed,
  in_review: Clock,
  reviewed: FileCheck,
  approved: CheckCircle2,
  rejected: XCircle,
};

type StageFilter = PipelineStage | "all";

const FILTER_OPTIONS: ReadonlyArray<{ value: StageFilter; label: string }> = [
  { value: "all", label: "Все" },
  { value: "uninterviewed", label: "Не опрошен" },
  { value: "in_review", label: "На рассмотрении" },
  { value: "reviewed", label: "Рассмотрен" },
  { value: "approved", label: "Подтверждён" },
  { value: "rejected", label: "Отклонён" },
];

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
  const [stageFilter, setStageFilter] = useState<StageFilter>("all");

  const filteredCandidates =
    stageFilter === "all"
      ? candidates
      : candidates.filter(
          (candidate) => candidate.pipelineStage === stageFilter,
        );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
          Кандидаты · {filteredCandidates.length}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Реестр вертикального среза. Откройте карточку, чтобы посмотреть
          профиль, материалы интервью и отчёт.
        </p>
      </div>

      <fieldset className="min-w-0">
        <legend className="sr-only">Фильтр по этапу отбора</legend>
        <div className="flex flex-wrap gap-2">
          {FILTER_OPTIONS.map((option) => {
            const isActive = stageFilter === option.value;

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => setStageFilter(option.value)}
                aria-pressed={isActive}
                className={`rounded-full border px-3 py-1 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-strong focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                  isActive
                    ? FILTER_ACTIVE_CLASSES[option.value]
                    : "border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </fieldset>

      {candidates.length === 0 ? (
        <EmptyState
          title="Кандидатов пока нет"
          description="В реестре нет ни одной записи. Новые кандидаты появятся после импорта из 1С."
          action={
            <Link
              to="/"
              className="inline-flex items-center rounded-md border border-border px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-strong focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              На главную
            </Link>
          }
        />
      ) : filteredCandidates.length === 0 ? (
        <EmptyState
          title="Нет кандидатов с этим этапом"
          description="Измените фильтр или сбросьте его, чтобы увидеть весь реестр."
          action={
            <button
              type="button"
              onClick={() => setStageFilter("all")}
              className="inline-flex items-center rounded-md border border-border px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-strong focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              Сбросить фильтр
            </button>
          }
        />
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {filteredCandidates.map((candidate) => (
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
