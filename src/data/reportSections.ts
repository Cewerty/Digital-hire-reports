import type { ReportSection, ReportSectionId } from "@/types/candidateReport";

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

export const sectionTitles: Record<ReportSectionId, string> = {
  summary: "Резюме",
  description: "Описание",
  skills: "Навыки",
  motivation: "Мотивация",
  next_steps: "Следующие шаги",
  conclusions: "Выводы",
};

export const reportSections: ReportSection[] = [
  {
    id: "summary",
    markdown: `Кандидат имеет 3 года опыта в frontend-разработке. На интервью продемонстрировал уверенное понимание React и TypeScript, а также опыт работы с Node.js.`,
    sourceEntryIds: ["int-1", "int-2"],
  },
  {
    id: "description",
    markdown: `Иван проявил себя как самостоятельный разработчик. В беседе подробно описал участие в миграции легаси-проекта на современный стек и аргументированно объяснил принятые технические решения.`,
    sourceEntryIds: ["int-1", "int-8"],
  },
  {
    id: "skills",
    markdown: `Ключевые навыки:\n\n- TypeScript\n- React\n- Node.js\n- работа с REST API\n- написание модульных тестов`,
    sourceEntryIds: ["int-2"],
  },
  {
    id: "motivation",
    markdown: `Кандидата привлекает продуктовая разработка и возможность влиять на конечный результат. Проявляет интерес к развитию в сторону senior-позиции и наставничества.`,
    sourceEntryIds: ["int-3", "int-6"],
  },
  {
    id: "next_steps",
    markdown: `Рекомендуется провести техническое интервью с командой frontend-разработки. Дополнительно обсудить условия старта и план адаптации.`,
    sourceEntryIds: ["int-7"],
  },
  {
    id: "conclusions",
    markdown: `Кандидат соответствует требованиям вакансии. Рекомендуем перейти к следующему этапу отбора.`,
    sourceEntryIds: ["int-1", "int-2", "int-3", "int-8"],
  },
];
