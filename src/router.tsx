import { createBrowserRouter } from "react-router-dom";

import { AppLayout } from "@/components/layout/AppLayout";
import type { CandidateReport } from "@/types/candidateReport";

export function createRouter(
  report: CandidateReport,
  onUpdateReport: (report: CandidateReport) => void,
) {
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
          loader: () => ({ report }),
        },
        {
          path: "review",
          lazy: () =>
            import("@/pages/ReviewPage").then((m) => ({
              Component: m.ReviewPage,
            })),
          loader: () => ({ report, onUpdateReport }),
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
