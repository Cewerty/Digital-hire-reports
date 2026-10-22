import type { ReportSectionId } from "@/types/candidateReport";

export const REPORT_SECTION_DEFINITIONS: ReadonlyArray<{
  id: ReportSectionId;
  title: string;
}> = [
  { id: "summary", title: "Резюме" },
  { id: "description", title: "Описание" },
  { id: "skills", title: "Навыки" },
  { id: "motivation", title: "Мотивация" },
  { id: "next_steps", title: "Следующие шаги" },
  { id: "conclusions", title: "Выводы" },
];

export const sectionTitles: Record<ReportSectionId, string> = Object.fromEntries(
  REPORT_SECTION_DEFINITIONS.map(({ id, title }) => [id, title]),
) as Record<ReportSectionId, string>;
