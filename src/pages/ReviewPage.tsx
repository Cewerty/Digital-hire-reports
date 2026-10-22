import { useState } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ReportMetadataForm } from "@/components/layout/ReportMetadataForm";
import { ReportSectionEditor } from "@/components/layout/ReportSectionEditor";
import { REPORT_SECTION_DEFINITIONS } from "@/data/reportSections";
import {
  validateReport,
  type ReportValidationError,
} from "@/lib/validateReport";
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

function focusField(field: string) {
  requestAnimationFrame(() => {
    const candidates = [
      `[data-field="${field}"]`,
      `[data-field="section-${field}"]`,
      `[data-field="sections.${field}"]`,
    ];
    for (const selector of candidates) {
      const container = document.querySelector(selector);
      if (!(container instanceof HTMLElement)) continue;
      const target =
        container.querySelector<HTMLElement>(
          "input, textarea, select, [contenteditable='true']",
        ) ?? container;
      target.focus();
      target.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
  });
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
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
  const [validationErrors, setValidationErrors] = useState<
    ReportValidationError[]
  >([]);

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

  const handleSave = (documentState: "draft" | "approved", message: string) => {
    const errors = validateReport(workingCopy);
    if (errors.length > 0) {
      setValidationErrors(errors);
      focusField(errors[0].field);
      return;
    }

    setValidationErrors([]);
    loaderData.onUpdateReport({
      ...workingCopy,
      documentState,
    });
    navigate("/report", { state: { message } });
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

      {validationErrors.length > 0 && (
        <div
          role="alert"
          className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
        >
          <p className="font-medium">Исправьте ошибки перед сохранением:</p>
          <ul className="mt-1 list-disc pl-5">
            {validationErrors.map((error, index) => (
              <li key={`${error.field}-${index}`}>{error.message}</li>
            ))}
          </ul>
        </div>
      )}

      <div data-field="candidateDisplayName" tabIndex={-1}>
        <ReportMetadataForm
          metadata={workingCopy.metadata}
          candidateDisplayName={workingCopy.candidateDisplayName}
          onChange={handleMetadataChange}
        />
      </div>

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
            <div
              key={definition.id}
              data-field={`section-${definition.id}`}
              tabIndex={-1}
            >
              <ReportSectionEditor
                section={section}
                title={definition.title}
                onChange={handleSectionChange}
              />
            </div>
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
          onClick={() =>
            handleSave("draft", "Черновик сохранён в текущей сессии")
          }
        >
          Сохранить черновик
        </Button>
        <AlertDialog
          open={isApproveDialogOpen}
          onOpenChange={setIsApproveDialogOpen}
        >
          <AlertDialogTrigger asChild>
            <Button type="button">Утвердить документ</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Утвердить документ?</AlertDialogTitle>
              <AlertDialogDescription>
                Документ будет помечен как утверждённый наставником. Это
                действие не изменяет статус кандидата и выводы отчёта.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Вернуться к проверке</AlertDialogCancel>
              <AlertDialogAction
                onClick={() =>
                  handleSave("approved", "Документ утверждён наставником")
                }
              >
                Утвердить документ
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
