import { EmptyState } from "@/components/layout/EmptyState";
import { MarkdownContent } from "@/components/layout/MarkdownContent";
import { SectionSources } from "@/components/layout/SectionSources";
import { candidate } from "@/data/demoData";
import { REPORT_SECTION_DEFINITIONS } from "@/data/reportSections";
import type { CandidateReport, InterviewEntry } from "@/types/candidateReport";

interface ReportDocumentProps {
  report: CandidateReport;
  interviewEntries: InterviewEntry[];
}

export function ReportDocument({
  report,
  interviewEntries,
}: ReportDocumentProps) {
  const { metadata, sections } = report;

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
        <h2 className="text-2xl font-semibold text-slate-900">
          Отчёт по кандидату: {report.candidateDisplayName} (
          {candidate.preferredName})
        </h2>

        <dl className="grid gap-3 sm:grid-cols-2">
          {metadataRows.map((row) => (
            <div key={row.label} className="text-sm">
              <dt className="font-medium text-slate-500">{row.label}</dt>
              <dd className="mt-0.5 text-slate-900">
                {row.value.trim().length > 0 ? (
                  row.value
                ) : (
                  <span className="text-slate-400">Не указано</span>
                )}
              </dd>
            </div>
          ))}
        </dl>
      </header>

      <p className="text-sm text-slate-500">
        Источники разделов можно раскрыть под каждым разделом.
      </p>

      <div className="space-y-8">
        {REPORT_SECTION_DEFINITIONS.map((definition, index) => {
          const section = sections.find((item) => item.id === definition.id);
          if (!section) {
            return null;
          }

          return (
            <section key={definition.id} className="space-y-3">
              <h3 className="text-lg font-semibold text-slate-900">
                {index + 1}. {definition.title}
              </h3>
              {section.markdown.trim().length > 0 ? (
                <MarkdownContent markdown={section.markdown} />
              ) : (
                <EmptyState
                  title="Раздел не заполнен"
                  description="В этом разделе пока нет содержания. Добавьте текст в режиме проверки и правки."
                />
              )}
              <SectionSources
                sourceEntryIds={section.sourceEntryIds}
                entries={interviewEntries}
              />
            </section>
          );
        })}
      </div>
    </article>
  );
}
