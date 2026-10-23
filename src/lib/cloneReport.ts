import type { CandidateReport } from "@/types/candidateReport";

/**
 * Глубокая копия отчёта: вложенные объекты и массивы не делятся ссылкой
 * с исходным состоянием. Используется и для рабочей копии редактора,
 * и для точечных изменений сохранённого документа.
 */
export function cloneReport(report: CandidateReport): CandidateReport {
  return {
    ...report,
    metadata: { ...report.metadata },
    sections: report.sections.map((section) => ({
      ...section,
      sourceEntryIds: [...section.sourceEntryIds],
    })),
  };
}
