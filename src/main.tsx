import React, { useCallback, useMemo, useRef } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";

import { candidateReport } from "@/data/demoData";
import { createRouter } from "@/router";
import type { CandidateReport } from "@/types/candidateReport";
import "@/index.css";

function App() {
  const reportRef = useRef<CandidateReport>(candidateReport);

  const handleUpdateReport = useCallback((updatedReport: CandidateReport) => {
    reportRef.current = updatedReport;
  }, []);

  const router = useMemo(
    () => createRouter(() => reportRef.current, handleUpdateReport),
    [handleUpdateReport],
  );

  return <RouterProvider router={router} />;
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
