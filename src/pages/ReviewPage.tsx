import { useState } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { ReportMetadataForm } from "@/components/layout/ReportMetadataForm";
import { ReportSectionEditor } from "@/components/layout/ReportSectionEditor";
import { REPORT_SECTION_DEFINITIONS } from "@/data/reportSections";
import type { CandidateReport } from "@/types/candidateReport";

function createWorkingCopy(report: CandidateReport): CandidateReport {
  return {
    ...report,
    metadata: { ...report.metadata },
    sections: report.sections.map((section) => ({
      ...section,
      sourceEntryIds: [...section.sourceEntryIds],
    })),
  };
}

export function ReviewPage() {
  const loaderData = useLoaderData() as {
    report: CandidateReport;
    onUpdateReport: (report: CandidateReport) => void;
  };
  const navigate = useNavigate();

  const [workingCopy, setWorkingCopy] = useState<CandidateReport>(() =>
    createWorkingCopy(loaderData.report),
  );

  const handleMetadataChange = (
    metadata: CandidateReport["metadata"],
    candidateDisplayName: string,
  ) => {
    setWorkingCopy((prev) => ({
      ...prev,
      metadata,
      candidateDisplayName,
    }));
  };

  const handleSectionChange = (
    updatedSection: CandidateReport["sections"][number],
  ) => {
    setWorkingCopy((prev) => ({
      ...prev,
      sections: prev.sections.map((section) =>
        section.id === updatedSection.id ? updatedSection : section,
      ),
    }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Проверка и правка</h2>
        <p className="mt-1 text-sm text-slate-500">
          Рабочая копия для: {workingCopy.candidateDisplayName}. Изменения не
          влияют на сохранённый документ до сохранения.
        </p>
      </div>

      <ReportMetadataForm
        metadata={workingCopy.metadata}
        candidateDisplayName={workingCopy.candidateDisplayName}
        onChange={handleMetadataChange}
      />

      <p className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">
        Поддерживается Markdown: <strong>жирный</strong>, <em>курсив</em>,
        списки, цитаты и ссылки. Заголовки разделов добавляются автоматически.
      </p>

      <div className="space-y-6">
        {REPORT_SECTION_DEFINITIONS.map((definition) => {
          const section = workingCopy.sections.find(
            (item) => item.id === definition.id,
          );
          if (!section) return null;
          return (
            <ReportSectionEditor
              key={definition.id}
              section={section}
              title={definition.title}
              onChange={handleSectionChange}
            />
          );
        })}
      </div>

      <div className="flex flex-wrap gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate("/report")}
        >
          Отменить
        </Button>
        <Button
          type="button"
          onClick={() => {
            loaderData.onUpdateReport({
              ...workingCopy,
              documentState: "draft",
            });
            navigate("/report", {
              state: { message: "Черновик сохранён в текущей сессии" },
            });
          }}
        >
          Сохранить черновик
        </Button>
      </div>
    </div>
  );
}
