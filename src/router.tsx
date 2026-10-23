import { createBrowserRouter, useLoaderData } from "react-router-dom";

import { AppLayout } from "@/components/layout/AppLayout";
import { ReviewPage } from "@/pages/ReviewPage";
import type { CandidateReport, PipelineStage } from "@/types/candidateReport";

interface ReviewLoaderData {
  report: CandidateReport;
  onUpdateReport: (report: CandidateReport) => void;
}

/**
 * Обёртка над `ReviewPage` с `key={candidateId}`: при смене кандидата
 * редактор пересоздаётся вместе со всем локальным состоянием, и
 * несохранённый черновик отбрасывается без ручной синхронизации.
 */
function ReviewRoute() {
  const { report, onUpdateReport } = useLoaderData() as ReviewLoaderData;
  return (
    <ReviewPage
      key={report.candidateId}
      report={report}
      onUpdateReport={onUpdateReport}
    />
  );
}

export function createRouter(
  getReport: () => CandidateReport,
  onUpdateReport: (report: CandidateReport) => void,
  onUpdatePipelineStage?: (candidateId: string, stage: PipelineStage) => void,
) {
  const persistReport = (report: CandidateReport) => {
    onUpdateReport(report);

    // Черновик возвращает ранее утверждённого кандидата в очередь проверки,
    // утверждение переводит его в "approved". Переход из "approved" в
    // "in_review" допустим только для утверждённых — это проверяет
    // обработчик на стороне вызывающей стороны.
    if (report.documentState === "draft") {
      onUpdatePipelineStage?.(report.candidateId, "in_review");
    } else {
      onUpdatePipelineStage?.(report.candidateId, "approved");
    }
  };

  return createBrowserRouter([
    {
      path: "/",
      element: <AppLayout />,
      children: [
        {
          index: true,
          lazy: () =>
            import("@/pages/ProfilePage").then((m) => ({
              Component: m.ProfilePage,
            })),
        },
        {
          path: "report",
          lazy: () =>
            import("@/pages/ReportPage").then((m) => ({
              Component: m.ReportPage,
            })),
          loader: () => ({
            report: getReport(),
            onUpdateReport: persistReport,
          }),
        },
        {
          path: "review",
          element: <ReviewRoute />,
          loader: () => ({
            report: getReport(),
            onUpdateReport: persistReport,
          }),
        },
        {
          path: "*",
          lazy: () =>
            import("@/pages/NotFoundPage").then((m) => ({
              Component: m.NotFoundPage,
            })),
        },
      ],
    },
  ]);
}
