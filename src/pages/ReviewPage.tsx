import { useState } from "react";
import { Link, useLoaderData } from "react-router-dom";

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

  const [workingCopy] = useState<CandidateReport>(() =>
    createWorkingCopy(loaderData.report),
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Проверка и правка</h2>
        <p className="mt-1 text-sm text-slate-500">
          Рабочая копия для: {workingCopy.candidateDisplayName}. Изменения не
          влияют на сохранённый документ до сохранения.
        </p>
      </div>

      <Link
        to="/report"
        className="inline-flex items-center rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100"
      >
        ← К отчёту
      </Link>
    </div>
  );
}
