import { LayoutDashboard, PanelLeft, Users } from "lucide-react";
import { useCallback, useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";

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
  { to: "/", label: "Главная (Куратор)", icon: LayoutDashboard, end: true },
  { to: "/candidates", label: "Кандидаты", icon: Users, end: false },
] as const;

const REPORT_ROUTE_PATTERN = /^\/candidates\/([^/]+)\/(?:report|review)\/?$/;

function getReportCandidateId(pathname: string): string | undefined {
  return REPORT_ROUTE_PATTERN.exec(pathname)?.[1];
}

interface AppLayoutProps {
  documentState?: DocumentState;
}

export function AppLayout({ documentState = "draft" }: AppLayoutProps) {
  const [candidates, setCandidates] = useState<Candidate[]>(demoCandidates);
  const [curator, setCurator] = useState<CuratorProfile>(demoCurator);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const location = useLocation();
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

  const activeReportCandidateId = getReportCandidateId(location.pathname);
  const activeReport = activeReportCandidateId
    ? reports[activeReportCandidateId]
    : undefined;
  const headerDocumentState: DocumentState | undefined = activeReport
    ? activeReport.documentState
    : activeReportCandidateId
      ? documentState
      : undefined;

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
    getReportById: (candidateId: string) => reports[candidateId],
    getInterviewByCandidateId,
    updateReport,
  };

  return (
    <div className="flex min-h-screen bg-white text-slate-900">
      <aside
        id="app-sidebar"
        className={`flex shrink-0 flex-col overflow-hidden border-r border-slate-200/80 bg-[#F4F5F7] transition-[width] duration-200 ease-out motion-reduce:transition-none ${
          isSidebarCollapsed ? "w-16" : "w-60"
        }`}
      >
        <div
          className={`flex h-16 shrink-0 items-center ${
            isSidebarCollapsed ? "justify-center px-2" : "justify-between px-4"
          }`}
        >
          {!isSidebarCollapsed && (
            <span className="truncate text-sm font-semibold text-slate-700">
              Наставник
            </span>
          )}
          <button
            type="button"
            onClick={() => setIsSidebarCollapsed((prev) => !prev)}
            aria-expanded={!isSidebarCollapsed}
            aria-controls="app-sidebar"
            aria-label={
              isSidebarCollapsed
                ? "Развернуть боковое меню"
                : "Свернуть боковое меню"
            }
            title={
              isSidebarCollapsed
                ? "Развернуть боковое меню"
                : "Свернуть боковое меню"
            }
            className="rounded-lg p-2 text-slate-600 transition-colors duration-150 hover:bg-white hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E5BA41] focus-visible:ring-offset-1"
          >
            <PanelLeft className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <nav
          aria-label="Боковая навигация"
          className="flex flex-1 flex-col gap-1 px-2 py-2"
        >
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              title={isSidebarCollapsed ? item.label : undefined}
              className={({ isActive }) =>
                `flex items-center rounded-xl text-sm transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E5BA41] focus-visible:ring-offset-1 ${
                  isSidebarCollapsed
                    ? "justify-center px-0 py-2.5"
                    : "gap-2.5 px-3 py-2"
                } ${
                  isActive
                    ? "bg-[#F2CA52] font-medium text-[#1E2028]"
                    : "text-slate-600 hover:bg-white/70 hover:text-slate-900"
                }`
              }
            >
              <item.icon className="h-4 w-4 shrink-0" aria-hidden="true" />
              {!isSidebarCollapsed && (
                <span className="truncate">{item.label}</span>
              )}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="border-b border-slate-200 bg-white">
          <div className="flex flex-wrap items-center justify-between gap-3 px-8 py-4">
            <div>
              <p className="text-base font-semibold text-slate-900">
                Рабочее пространство наставника
              </p>
              <p className="text-sm text-slate-500">
                Интерактивный прототип · Вымышленные данные
              </p>
            </div>
            {headerDocumentState && (
              <DocumentStateBadge state={headerDocumentState} />
            )}
          </div>
        </header>

        <main className="flex-1 px-8 py-6">
          <div className="mx-auto w-full max-w-5xl">
            <div className="rounded-2xl border border-slate-200/80 bg-white p-6">
              <Outlet context={contextValue} />
            </div>
          </div>
        </main>

        <footer className="border-t border-slate-200 bg-white">
          <div className="mx-auto w-full max-w-5xl space-y-1 px-8 py-4 text-sm text-slate-500">
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
    </div>
  );
}
