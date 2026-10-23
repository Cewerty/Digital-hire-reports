import type { ReportSectionId } from "@/types/candidateReport";

export const REPORT_SECTION_DEFINITIONS: ReadonlyArray<{
  id: ReportSectionId;
  title: string;
}> = [
  { id: "summary", title: "Краткое резюме" },
  { id: "description", title: "Описание кандидата" },
  { id: "skills", title: "Навыки и компетенции" },
  { id: "motivation", title: "Мотивация" },
  { id: "next_steps", title: "Дальнейшие шаги" },
  { id: "conclusions", title: "Выводы и вердикт" },
];

export const sectionTitles: Record<ReportSectionId, string> =
  Object.fromEntries(
    REPORT_SECTION_DEFINITIONS.map(({ id, title }) => [id, title]),
  ) as Record<ReportSectionId, string>;
