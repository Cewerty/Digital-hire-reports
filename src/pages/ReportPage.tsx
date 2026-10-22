import { Link } from "react-router-dom";
import { DocumentStateBadge } from "@/components/layout/DocumentStateBadge";
import { ReportDocument } from "@/components/layout/ReportDocument";
import { candidateReport, interviewEntries } from "@/data/demoData";

export function ReportPage() {
  const report = candidateReport;
  const isApproved = report.documentState === "approved";

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-semibold">Отчёт</h1>
        <DocumentStateBadge state={report.documentState} />
      </div>

      <ReportDocument report={report} interviewEntries={interviewEntries} />

      <div className="flex flex-wrap gap-3">
        <Link
          to="/"
          className="inline-flex items-center rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100"
        >
          ← Профиль
        </Link>
        <Link
          to="/review"
          className="inline-flex items-center rounded-md bg-slate-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-800"
        >
          {isApproved ? "Повторная проверка и правка →" : "Перейти к проверке →"}
        </Link>
      </div>
    </div>
  );
}
