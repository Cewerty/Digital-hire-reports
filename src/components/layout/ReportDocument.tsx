import { EmptyState } from "@/components/layout/EmptyState";
import { MarkdownContent } from "@/components/layout/MarkdownContent";
import { SectionSources } from "@/components/layout/SectionSources";
import { REPORT_SECTION_DEFINITIONS } from "@/data/reportSections";
import { PLATE_SURFACE_CLASS } from "@/lib/surfaces";
import type {
  Candidate,
  CandidateReport,
  InterviewEntry,
} from "@/types/candidateReport";

interface ReportDocumentProps {
  report: CandidateReport;
  /** Профиль того же кандидата, что и отчёт (`report.candidateId`). */
  candidate?: Candidate;
  /** Материалы интервью того же кандидата, что и отчёт. */
  interviewEntries: InterviewEntry[];
}

export function ReportDocument({
  report,
  candidate,
  interviewEntries,
}: ReportDocumentProps) {
  const { metadata, sections } = report;

  // Скобки с предпочитаемым обращением показываем только если оно заполнено
  // и не дублирует имя в заголовке: иначе получается «Иван (Иван)».
  const preferredName = candidate?.preferredName.trim() ?? "";
  const preferredLabel =
    preferredName && preferredName !== report.candidateDisplayName.trim()
      ? preferredName
      : "";

  const metadataRows: Array<{ label: string; value: string }> = [
    { label: "Кому", value: metadata.recipients },
    { label: "Интервьюер", value: metadata.interviewer },
    { label: "Контакт", value: metadata.contact },
    { label: "Дата контакта", value: metadata.contactDate },
    { label: "Направление", value: metadata.direction },
    { label: "Куратор", value: metadata.curator },
    { label: "Статус кандидата", value: metadata.candidateStatus },
  ];

  return (
    <article className="space-y-8">
      <header className="space-y-4">
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-[#E3E3E3]">
          Отчёт по кандидату: {report.candidateDisplayName}
          {preferredLabel ? ` (${preferredLabel})` : ""}
        </h2>

        <dl
          className={`grid gap-3 rounded-lg p-4 sm:grid-cols-2 ${PLATE_SURFACE_CLASS}`}
        >
          {metadataRows.map((row) => (
            <div key={row.label} className="text-sm">
              <dt className="font-medium text-slate-500 dark:text-[#9B9B9B]">
                {row.label}
              </dt>
              <dd className="mt-0.5 text-slate-900 dark:text-[#E3E3E3]">
                {row.value.trim().length > 0 ? (
                  row.value
                ) : (
                  <span className="text-slate-400 dark:text-[#7A7A7A]">
                    Не указано
                  </span>
                )}
              </dd>
            </div>
          ))}
        </dl>
      </header>

      <p className="text-sm text-slate-500 dark:text-[#9B9B9B]">
        Источники разделов можно раскрыть под каждым разделом.
      </p>

      <div className="space-y-8">
        {REPORT_SECTION_DEFINITIONS.map((definition, index) => {
          // Отсутствующий раздел не скрывается молча: сохраняем нумерацию
          // и показываем честное пустое состояние, чтобы читатель заметил
          // пробел в документе.
          const section = sections.find((item) => item.id === definition.id);

          return (
            <section
              key={definition.id}
              className={`space-y-3 rounded-lg p-4 ${PLATE_SURFACE_CLASS}`}
            >
              <h3 className="text-lg font-semibold text-slate-900 dark:text-[#E3E3E3]">
                {index + 1}. {definition.title}
              </h3>
              {!section ? (
                <EmptyState
                  title="Раздел отсутствует"
                  description="Раздел не найден в сохранённом отчёте. Откройте проверку и правку, чтобы восстановить его содержание."
                />
              ) : section.markdown.trim().length > 0 ? (
                <MarkdownContent markdown={section.markdown} />
              ) : (
                <EmptyState
                  title="Раздел не заполнен"
                  description="В этом разделе пока нет содержания. Добавьте текст в режиме проверки и правки."
                />
              )}
              <SectionSources
                sourceEntryIds={section?.sourceEntryIds ?? []}
                entries={interviewEntries}
              />
            </section>
          );
        })}
      </div>
    </article>
  );
}
