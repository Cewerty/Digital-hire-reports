import { useCallback, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";

import { DocumentStateBadge } from "@/components/layout/DocumentStateBadge";
import {
  demoCandidates,
  demoCurator,
  demoReport,
  getCandidateById,
  getInterviewByCandidateId,
  getReportByCandidateId,
} from "@/data/demoData";
import type {
  Candidate,
  CandidateReport,
  CuratorProfile,
  DocumentState,
  InterviewEntry,
  PipelineStage,
} from "@/types/candidateReport";

export interface AppOutletContext {
  candidates: Candidate[];
  curator: CuratorProfile;
  reports: Record<string, CandidateReport>;
  getCandidateById: (id: string) => Candidate | undefined;
  getReportById: (candidateId: string) => CandidateReport | undefined;
  getInterviewByCandidateId: (candidateId: string) => InterviewEntry[];
  updateReport: (report: CandidateReport) => void;
}

const NAV_ITEMS = [
  { to: "/", label: "Профиль и интервью", end: true },
  { to: "/candidates", label: "Кандидаты", end: false },
] as const;

interface AppLayoutProps {
  documentState?: DocumentState;
}

export function AppLayout({ documentState = "draft" }: AppLayoutProps) {
  const [candidates, setCandidates] = useState<Candidate[]>(demoCandidates);
  const [curator, setCurator] = useState<CuratorProfile>(demoCurator);
  const [reports, setReports] = useState<Record<string, CandidateReport>>(
    () => {
      const initial: Record<string, CandidateReport> = {};
      // Отчёт для c-01
      initial[demoReport.candidateId] = demoReport;
      // Отчёт для c-02 (если есть)
      const reportC02 = getReportByCandidateId("c-02");
      if (reportC02) {
        initial[reportC02.candidateId] = reportC02;
      }
      return initial;
    },
  );

  const updateReport = useCallback((updatedReport: CandidateReport) => {
    setReports((prev) => ({
      ...prev,
      [updatedReport.candidateId]: updatedReport,
    }));

    if (updatedReport.documentState === "approved") {
      // Обновляем pipelineStage кандидата
      setCandidates((prevCandidates) =>
        prevCandidates.map((candidate) =>
          candidate.id === updatedReport.candidateId
            ? { ...candidate, pipelineStage: "approved" as PipelineStage }
            : candidate,
        ),
      );

      // Добавляем событие в ленту куратора
      setCurator((prevCurator) => ({
        ...prevCurator,
        recentEvents: [
          {
            id: `evt-${Date.now()}`,
            timestamp: "Только что",
            text: `Утверждён отчёт кандидата: ${updatedReport.candidateDisplayName}`,
            candidateId: updatedReport.candidateId,
          },
          ...prevCurator.recentEvents,
        ],
      }));
    }
  }, []);

  const contextValue: AppOutletContext = {
    candidates,
    curator,
    reports,
    getCandidateById,
    getReportById: getReportByCandidateId,
    getInterviewByCandidateId,
    updateReport,
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto w-full max-w-5xl px-4 py-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h1 className="text-lg font-semibold">
                Рабочее пространство наставника
              </h1>
              <p className="text-sm text-slate-500">
                Интерактивный прототип · Вымышленные данные
              </p>
            </div>
            <DocumentStateBadge state={documentState} />
          </div>

          <nav
            className="mt-4 flex flex-wrap gap-1"
            aria-label="Основная навигация"
          >
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `rounded-md px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2 ${
                    isActive
                      ? "bg-slate-900 text-white"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl px-4 py-6">
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <Outlet context={contextValue} />
        </div>
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto w-full max-w-5xl space-y-1 px-4 py-4 text-sm text-slate-500">
          <p>
            Прототип на вымышленных данных. Интеграция с 1С и генерация ИИ не
            подключены.
          </p>
          <p>
            Изменения сохраняются между страницами, но сбрасываются при
            перезагрузке.
          </p>
        </div>
      </footer>
    </div>
  );
}
