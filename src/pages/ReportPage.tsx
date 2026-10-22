import { DocumentStateBadge } from "@/components/layout/DocumentStateBadge";
import { EmptyState } from "@/components/layout/EmptyState";
import { LoadingState } from "@/components/layout/LoadingState";
import { ReportDocument } from "@/components/layout/ReportDocument";
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
import { interviewEntries, parseDemoViewState } from "@/data/demoData";
import type { CandidateReport } from "@/types/candidateReport";
import { ArrowLeft, ArrowRight, RotateCcw } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLoaderData, useSearchParams } from "react-router-dom";
import { toast } from "sonner";

export function ReportPage() {
  const loaderData = useLoaderData() as {
    report: CandidateReport;
    onUpdateReport: (report: CandidateReport) => void;
  };
  const [searchParams] = useSearchParams();
  const demoState = parseDemoViewState(searchParams.get("state"));
  const [report, setReport] = useState<CandidateReport>(loaderData.report);
  const [isLoading, setIsLoading] = useState(demoState === "loading");

  useEffect(() => {
    if (demoState !== "loading") {
      return;
    }

    setIsLoading(true);
    const timer = window.setTimeout(() => setIsLoading(false), 800);

    return () => window.clearTimeout(timer);
  }, [demoState]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-xl font-semibold">Отчёт</h1>
          <DocumentStateBadge state={report.documentState} />
        </div>

        <LoadingState label="Загрузка отчёта…" />
      </div>
    );
  }

  if (demoState === "empty") {
    return (
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-xl font-semibold">Отчёт</h1>
          <DocumentStateBadge state="draft" />
        </div>

        <EmptyState
          title="Отчёт ещё не сформирован"
          description="По этому кандидату нет сохранённого отчёта. Вернитесь в профиль и проверьте материалы интервью."
          action={
            <Link
              to="/"
              className="inline-flex items-center rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 transition-colors duration-200 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Вернуться в профиль
            </Link>
          }
        />
      </div>
    );
  }

  const isApproved = report.documentState === "approved";

  const handleUnapprove = () => {
    const updatedReport: CandidateReport = {
      ...report,
      documentState: "draft",
    };
    loaderData.onUpdateReport(updatedReport);
    setReport(updatedReport);
    toast.success("Документ возвращён в черновик");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-semibold">Отчёт</h1>
        <DocumentStateBadge state={report.documentState} />
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <ReportDocument report={report} interviewEntries={interviewEntries} />
      </div>

      <div className="flex flex-wrap gap-3">
        <Link
          to="/"
          className="inline-flex items-center rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 transition-colors duration-200 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Профиль
        </Link>
        <Link
          to="/review"
          className="inline-flex items-center rounded-md bg-slate-900 px-3 py-1.5 text-sm font-medium text-white transition-colors duration-200 hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2"
        >
          {isApproved
            ? "Повторная проверка и правка"
            : "Перейти к проверке"}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
        {isApproved && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="transition-colors duration-200">
                <RotateCcw className="mr-2 h-4 w-4" />
                Вернуть в черновик
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Вернуть документ в черновик?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Документ снова станет черновиком. Это действие можно будет
                  отменить, утвердив документ повторно.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Отмена</AlertDialogCancel>
                <AlertDialogAction onClick={handleUnapprove}>
                  Вернуть в черновик
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
    </div>
  );
}
