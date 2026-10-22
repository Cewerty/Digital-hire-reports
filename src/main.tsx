import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";

import { candidateReport } from "@/data/demoData";
import { createRouter } from "@/router";
import type { CandidateReport } from "@/types/candidateReport";
import "@/index.css";

function App() {
  const [report, setReport] = useState<CandidateReport>(candidateReport);

  const handleUpdateReport = (updatedReport: CandidateReport) => {
    setReport(updatedReport);
  };

  return <RouterProvider router={createRouter(report, handleUpdateReport)} />;
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
