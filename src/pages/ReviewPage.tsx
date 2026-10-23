import { ReportMetadataForm } from "@/components/layout/ReportMetadataForm";
import { ReportSectionEditor } from "@/components/layout/ReportSectionEditor";
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
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { REPORT_SECTION_DEFINITIONS } from "@/data/reportSections";
import {
  type ReportValidationError,
  validateReport,
} from "@/lib/validateReport";
import type { CandidateReport } from "@/types/candidateReport";
import { AlertCircle, Check, Save, X } from "lucide-react";
import { useState } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
import { toast } from "sonner";

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
    const selectors = [
      `[data-field="${field}"]`,
      `[data-field="section-${field}"]`,
    ];
    for (const selector of selectors) {
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
  const [workingCopyCandidateId, setWorkingCopyCandidateId] = useState(
    loaderData.report.candidateId,
  );

  // Маршрут `/candidates/:id/review` переиспользуется при смене кандидата,
  // поэтому несохранённый черновик сбрасывается на данные нового отчёта.
  if (workingCopyCandidateId !== loaderData.report.candidateId) {
    setWorkingCopyCandidateId(loaderData.report.candidateId);
    setWorkingCopy(createWorkingCopy(loaderData.report));
  }
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
  const [validationErrors, setValidationErrors] = useState<
    ReportValidationError[]
  >([]);

  const errorForField = (field: ReportValidationError["field"]) =>
    validationErrors.find((error) => error.field === field)?.message;

  const completedSections = workingCopy.sections.filter(
    (section) => section.markdown.trim().length > 0,
  ).length;
  const totalSections = REPORT_SECTION_DEFINITIONS.length;
  const progressValue = (completedSections / totalSections) * 100;

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
    toast.success(message);
    navigate("/report", { replace: true });
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

      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-slate-700">
            Заполнено разделов: {completedSections} из {totalSections}
          </span>
          <span className="text-slate-500">{Math.round(progressValue)}%</span>
        </div>
        <Progress value={progressValue} className="mt-3" />
      </div>

      {validationErrors.length > 0 && (
        <div
          role="alert"
          className="animate-slide-in-from-top rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 shadow-sm"
        >
          <p className="flex items-center gap-2 font-medium">
            <AlertCircle className="h-4 w-4" />
            Исправьте ошибки перед сохранением:
          </p>
          <ul className="mt-1 list-disc pl-5">
            {validationErrors.map((error, index) => (
              <li key={`${error.field}-${index}`}>{error.message}</li>
            ))}
          </ul>
        </div>
      )}

      <div
        data-field="candidateDisplayName"
        tabIndex={-1}
        className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
      >
        <ReportMetadataForm
          metadata={workingCopy.metadata}
          candidateDisplayName={workingCopy.candidateDisplayName}
          onChange={handleMetadataChange}
          errors={validationErrors}
        />
      </div>

      <p className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600 shadow-sm">
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
              className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
            >
              <ReportSectionEditor
                section={section}
                title={definition.title}
                onChange={handleSectionChange}
                error={errorForField(definition.id)}
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
          className="transition-colors duration-200"
        >
          <X className="mr-2 h-4 w-4" />
          Отменить
        </Button>
        <Button
          type="button"
          onClick={() =>
            handleSave("draft", "Черновик сохранён в текущей сессии")
          }
          className="transition-colors duration-200"
        >
          <Save className="mr-2 h-4 w-4" />
          Сохранить черновик
        </Button>
        <AlertDialog
          open={isApproveDialogOpen}
          onOpenChange={setIsApproveDialogOpen}
        >
          <AlertDialogTrigger asChild>
            <Button type="button" className="transition-colors duration-200">
              <Check className="mr-2 h-4 w-4" />
              Утвердить документ
            </Button>
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
