import { REPORT_SECTION_DEFINITIONS } from "@/data/reportSections";
import type { CandidateReport, ReportSectionId } from "@/types/candidateReport";

export type ReportValidationError = {
  field: "candidateDisplayName" | "direction" | "contactDate" | ReportSectionId;
  message: string;
};

export function validateReport(
  report: CandidateReport,
): ReportValidationError[] {
  const errors: ReportValidationError[] = [];

  if (!report.candidateDisplayName.trim()) {
    errors.push({
      field: "candidateDisplayName",
      message: "Имя в документе обязательно",
    });
  }

  if (!report.metadata.direction.trim()) {
    errors.push({
      field: "direction",
      message: "Направление обязательно",
    });
  }

  if (report.metadata.contactDate.trim()) {
    const date = new Date(report.metadata.contactDate);
    if (Number.isNaN(date.getTime())) {
      errors.push({
        field: "contactDate",
        message: "Дата контакта должна быть корректной",
      });
    }
  }

  for (const definition of REPORT_SECTION_DEFINITIONS) {
    const section = report.sections.find((s) => s.id === definition.id);
    if (!section || !section.markdown.trim()) {
      errors.push({
        field: definition.id,
        message: `Раздел «${definition.title}» обязателен`,
      });
    }
  }

  return errors;
}
