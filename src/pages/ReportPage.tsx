import { DocumentStateBadge } from "@/components/layout/DocumentStateBadge";
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
import { interviewEntries } from "@/data/demoData";
import type { CandidateReport } from "@/types/candidateReport";
import { ArrowLeft, ArrowRight, RotateCcw } from "lucide-react";
import { useState } from "react";
import { Link, useLoaderData, useLocation, useNavigate } from "react-router-dom";

export function ReportPage() {
  const loaderData = useLoaderData() as {
    report: CandidateReport;
    onUpdateReport: (report: CandidateReport) => void;
  };
  const navigate = useNavigate();
  const [report, setReport] = useState<CandidateReport>(loaderData.report);
  const location = useLocation();
  const message = (location.state as { message?: string } | null)?.message;
  const isApproved = report.documentState === "approved";

  const handleUnapprove = () => {
    const updatedReport: CandidateReport = {
      ...report,
      documentState: "draft",
    };
    loaderData.onUpdateReport(updatedReport);
    setReport(updatedReport);
    navigate("/report", {
      replace: true,
      state: { message: "Документ возвращён в черновик" },
    });
  };

  return (
    <div className="space-y-6">
      {message && (
        <output className="animate-slide-in-from-top block rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 shadow-sm">
          {message}
        </output>
      )}

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
