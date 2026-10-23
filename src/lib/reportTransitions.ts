import { createEventId } from "@/lib/createEventId";
import type {
  Candidate,
  CandidateReport,
  CuratorEvent,
  CuratorProfile,
  PipelineStage,
} from "@/types/candidateReport";

/**
 * Чистые переходы состояния при сохранении отчёта.
 *
 * Логика вынесена из `AppLayout.updateReport`, чтобы её можно было покрыть
 * юнит-тестами без DOM и React (docs/decisions.md §13). `AppLayout` остаётся
 * тонкой обёрткой: синхронно обновляет зеркала и вызывает `setState`.
 */

export interface ReportUpdateState {
  reports: Record<string, CandidateReport>;
  candidates: Candidate[];
  curator: CuratorProfile;
}

export interface ReportUpdateDeps {
  createEventId: () => string;
  now: () => Date;
}

const defaultDeps: ReportUpdateDeps = {
  createEventId,
  now: () => new Date(),
};

export type ReportTransition = "approved" | "reverted" | "none";

/**
 * Определяет переход по паре «предыдущий отчёт → обновлённый отчёт».
 * Повторное утверждение уже утверждённого документа переходом не считается.
 */
export function getReportTransition(
  previous: CandidateReport | undefined,
  updated: CandidateReport,
): ReportTransition {
  if (
    updated.documentState === "approved" &&
    previous?.documentState !== "approved"
  ) {
    return "approved";
  }

  if (
    updated.documentState === "draft" &&
    previous?.documentState === "approved"
  ) {
    return "reverted";
  }

  return "none";
}

const FINAL_STAGES: ReadonlySet<PipelineStage> = new Set<PipelineStage>([
  "approved",
  "rejected",
]);

/**
 * Переводит этап кандидата по переходу отчёта.
 *
 * - утверждение: `uninterviewed` / `in_review` / `reviewed` → `reviewed`;
 *   финальные `approved` / `rejected` не меняются;
 * - возврат в черновик: `reviewed` → `in_review`; остальные не меняются.
 *
 * Если этап не меняется, возвращается тот же объект — это позволяет
 * `AppLayout` не вызывать лишний `setState`.
 */
export function applyPipelineStageTransition(
  candidate: Candidate,
  transition: ReportTransition,
): Candidate {
  if (transition === "approved") {
    if (FINAL_STAGES.has(candidate.pipelineStage)) {
      return candidate;
    }
    return { ...candidate, pipelineStage: "reviewed" };
  }

  if (transition === "reverted") {
    if (candidate.pipelineStage !== "reviewed") {
      return candidate;
    }
    return { ...candidate, pipelineStage: "in_review" };
  }

  return candidate;
}

/** Формирует событие ленты куратора; `null`, если перехода нет. */
export function buildCuratorEvent(
  updatedReport: CandidateReport,
  transition: ReportTransition,
  deps: ReportUpdateDeps = defaultDeps,
): CuratorEvent | null {
  if (transition === "none") {
    return null;
  }

  return {
    id: deps.createEventId(),
    timestamp: deps.now().toISOString(),
    text:
      transition === "approved"
        ? `Утверждён отчёт кандидата: ${updatedReport.candidateDisplayName}`
        : `Документ возвращён в черновик: ${updatedReport.candidateDisplayName}`,
    candidateId: updatedReport.candidateId,
  };
}

/**
 * Применяет сохранение отчёта к состоянию прототипа.
 *
 * Функция чистая: исходное состояние не мутируется. Если переход этапа не
 * требуется, `candidates` и `curator` возвращаются теми же ссылками.
 */
export function applyReportUpdate(
  state: ReportUpdateState,
  updatedReport: CandidateReport,
  deps: ReportUpdateDeps = defaultDeps,
): ReportUpdateState {
  const previousReport = state.reports[updatedReport.candidateId];
  const transition = getReportTransition(previousReport, updatedReport);

  const reports: Record<string, CandidateReport> = {
    ...state.reports,
    [updatedReport.candidateId]: updatedReport,
  };

  if (transition === "none") {
    return { ...state, reports };
  }

  const candidates = state.candidates.map((candidate) =>
    candidate.id === updatedReport.candidateId
      ? applyPipelineStageTransition(candidate, transition)
      : candidate,
  );

  const event = buildCuratorEvent(updatedReport, transition, deps);
  const curator = event
    ? {
        ...state.curator,
        recentEvents: [event, ...state.curator.recentEvents],
      }
    : state.curator;

  return { reports, candidates, curator };
}
