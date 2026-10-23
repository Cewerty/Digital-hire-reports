import { Navigate, createBrowserRouter } from "react-router-dom";

import { AppLayout } from "@/components/layout/AppLayout";
import { CandidatesListPage } from "@/pages/CandidatesListPage";
import { CuratorDashboardPage } from "@/pages/CuratorDashboardPage";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { ProfilePage } from "@/pages/ProfilePage";
import { ReportPage } from "@/pages/ReportPage";
import { ReviewPage } from "@/pages/ReviewPage";

export function createRouter() {
  return createBrowserRouter([
    {
      path: "/",
      element: <AppLayout />,
      children: [
        {
          index: true,
          element: <CuratorDashboardPage />,
        },
        {
          path: "candidates",
          children: [
            {
              index: true,
              element: <CandidatesListPage />,
            },
            {
              path: ":id",
              element: <ProfilePage />,
            },
            {
              path: ":id/report",
              element: <ReportPage />,
            },
            {
              path: ":id/review",
              element: <ReviewPage />,
            },
          ],
        },
        {
          path: "report",
          element: <Navigate to="/candidates/c-01/report" replace />,
        },
        {
          path: "review",
          element: <Navigate to="/candidates/c-01/review" replace />,
        },
        {
          path: "*",
          element: <NotFoundPage />,
        },
      ],
    },
  ]);
}
