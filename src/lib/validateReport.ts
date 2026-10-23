import { REPORT_SECTION_DEFINITIONS } from "@/data/reportSections";
import type { CandidateReport, ReportSectionId } from "@/types/candidateReport";

export type ReportValidationError = {
  field: "candidateDisplayName" | "direction" | "contactDate" | ReportSectionId;
  message: string;
};

const ISO_DATE_ONLY_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;

/**
 * Проверяет дату `contactDate`. Пустая строка считается корректной
 * (поле опциональное). Для формата `YYYY-MM-DD` (как у `<input type="date">`)
 * выполняется строгая проверка календарной валидности: `new Date` в V8
 * нормализует `2025-02-31` в `2025-03-03`, поэтому сравниваем компоненты
 * `UTC`-даты с исходными значениями.
 */
function isValidContactDate(value: string): boolean {
  const trimmed = value.trim();
  if (!trimmed) {
    return true;
  }

  const match = ISO_DATE_ONLY_PATTERN.exec(trimmed);
  if (match) {
    const year = Number(match[1]);
    const month = Number(match[2]);
    const day = Number(match[3]);
    const date = new Date(Date.UTC(year, month - 1, day));

    return (
      date.getUTCFullYear() === year &&
      date.getUTCMonth() === month - 1 &&
      date.getUTCDate() === day
    );
  }

  return !Number.isNaN(new Date(trimmed).getTime());
}

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

  if (!isValidContactDate(report.metadata.contactDate)) {
    errors.push({
      field: "contactDate",
      message: "Дата контакта должна быть корректной",
    });
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
