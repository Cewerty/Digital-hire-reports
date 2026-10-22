import { createBrowserRouter } from "react-router-dom";

import { AppLayout } from "@/components/layout/AppLayout";

export const router = createBrowserRouter([
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
      },
      {
        path: "review",
        lazy: () =>
          import("@/pages/ReviewPage").then((m) => ({
            Component: m.ReviewPage,
          })),
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
