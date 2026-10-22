import { DocumentStateBadge } from "@/components/layout/DocumentStateBadge";
import { ReportDocument } from "@/components/layout/ReportDocument";
import { interviewEntries } from "@/data/demoData";
import type { CandidateReport } from "@/types/candidateReport";
import { Link, useLoaderData, useLocation } from "react-router-dom";

export function ReportPage() {
  const { report } = useLoaderData() as { report: CandidateReport };
  const location = useLocation();
  const message = (location.state as { message?: string } | null)?.message;
  const isApproved = report.documentState === "approved";

  return (
    <div className="space-y-6">
      {message && (
        <output className="block rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          {message}
        </output>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-semibold">Отчёт</h1>
        <DocumentStateBadge state={report.documentState} />
      </div>

      <ReportDocument report={report} interviewEntries={interviewEntries} />

      <div className="flex flex-wrap gap-3">
        <Link
          to="/"
          className="inline-flex items-center rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2"
        >
          ← Профиль
        </Link>
        <Link
          to="/review"
          className="inline-flex items-center rounded-md bg-slate-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2"
        >
          {isApproved
            ? "Повторная проверка и правка →"
            : "Перейти к проверке →"}
        </Link>
      </div>
    </div>
  );
}
