import React, { useCallback, useMemo, useRef, useState } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { Toaster } from "sonner";

import { candidateReport, demoCandidates } from "@/data/demoData";
import { createRouter } from "@/router";
import type {
  CandidateReport,
  PipelineStage,
} from "@/types/candidateReport";
import "@/index.css";

function App() {
  const reportRef = useRef<CandidateReport>(candidateReport);

  // Статусы воронки пока нужны только для корректного отката при возврате
  // отчёта в черновик. Полноценный реестр кандидатов появится позже.
  const [, setPipelineStages] = useState<Record<string, PipelineStage>>(() =>
    Object.fromEntries(
      demoCandidates.map((candidate) => [candidate.id, candidate.pipelineStage]),
    ),
  );

  const handleUpdateReport = useCallback((updatedReport: CandidateReport) => {
    reportRef.current = updatedReport;
  }, []);

  const handleUpdatePipelineStage = useCallback(
    (candidateId: string, stage: PipelineStage) => {
      setPipelineStages((prev) => {
        const current = prev[candidateId];
        // Возврат в черновик откатывает только ранее утверждённых
        // кандидатов: они снова попадают в очередь проверки.
        if (stage === "in_review" && current !== "approved") {
          return prev;
        }
        if (current === stage) {
          return prev;
        }
        return { ...prev, [candidateId]: stage };
      });
    },
    [],
  );

  const router = useMemo(
    () =>
      createRouter(
        () => reportRef.current,
        handleUpdateReport,
        handleUpdatePipelineStage,
      ),
    [handleUpdateReport, handleUpdatePipelineStage],
  );

  return (
    <>
      <RouterProvider router={router} />
      <Toaster position="top-right" richColors />
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
