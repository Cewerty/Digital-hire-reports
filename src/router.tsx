import { Navigate, createBrowserRouter } from "react-router-dom";

import { AppLayout } from "@/components/layout/AppLayout";
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
          element: <Navigate to="/candidates/c-01" replace />,
        },
        {
          path: "candidates",
          children: [
            {
              index: true,
              element: <Navigate to="/candidates/c-01" replace />,
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
          element: <Navigate to="/candidates/c-01/report" replace />,
        },
        {
          path: "*",
          element: <NotFoundPage />,
        },
      ],
    },
  ]);
}
