import { Home, PanelLeft, Users } from "lucide-react";
import { useCallback, useMemo, useRef, useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";

import { DocumentStateBadge } from "@/components/layout/DocumentStateBadge";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import {
  demoCandidates,
  demoCurator,
  getInterviewByCandidateId as getInterviewByCandidateIdFromData,
  getReportByCandidateId,
} from "@/data/demoData";
import { applyReportUpdate } from "@/lib/reportTransitions";
import type {
  Candidate,
  CandidateReport,
  CuratorProfile,
  InterviewEntry,
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
  { to: "/", label: "Главная (Ментор)", icon: Home, end: true },
  { to: "/candidates", label: "Кандидаты", icon: Users, end: false },
] as const;

const REPORT_ROUTE_PATTERN = /^\/candidates\/([^/]+)\/(?:report|review)\/?$/;

/**
 * Ширина рабочей области зависит от типа страницы (docs/design-system.md §3.2):
 * списки и дашборд — `max-w-6xl`, текстовые страницы — `max-w-4xl`
 * для комфортной длины строки 65–75 символов.
 */
function getContentWidthClass(pathname: string): string {
  if (
    pathname === "/" ||
    pathname === "/candidates" ||
    pathname === "/candidates/"
  ) {
    return "max-w-6xl";
  }
  return "max-w-4xl";
}

function getReportCandidateId(pathname: string): string | undefined {
  return REPORT_ROUTE_PATTERN.exec(pathname)?.[1];
}

export function AppLayout() {
  const [candidates, setCandidates] = useState<Candidate[]>(demoCandidates);
  const [curator, setCurator] = useState<CuratorProfile>(demoCurator);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const location = useLocation();
  const [reports, setReports] = useState<Record<string, CandidateReport>>(
    () => {
      // `getReportByCandidateId` возвращает глубокую копию, поэтому словарь
      // не делит состояние с демонстрационными данными модуля.
      const initial: Record<string, CandidateReport> = {};
      for (const candidate of demoCandidates) {
        const report = getReportByCandidateId(candidate.id);
        if (report) {
          initial[candidate.id] = report;
        }
      }
      return initial;
    },
  );

  // Зеркала изменяемого состояния, синхронизируемые синхронно внутри
  // `updateReport`. Синхронизация через `useEffect` не подходит: два вызова
  // `updateReport` в одном тике прочитали бы устаревшее предыдущее состояние
  // и потеряли бы событие в ленте или переход `pipelineStage` (§11.2).
  const reportsRef = useRef(reports);
  const candidatesRef = useRef(candidates);
  const curatorRef = useRef(curator);

  const activeReportCandidateId = getReportCandidateId(location.pathname);
  const activeReport = activeReportCandidateId
    ? reports[activeReportCandidateId]
    : undefined;
  const headerDocumentState = activeReport?.documentState;

  const updateReport = useCallback((updatedReport: CandidateReport) => {
    const previous = {
      reports: reportsRef.current,
      candidates: candidatesRef.current,
      curator: curatorRef.current,
    };

    const next = applyReportUpdate(previous, updatedReport);

    // Синхронно обновляем зеркала до `setState`: следующий вызов
    // `updateReport` в том же тике увидит актуальное предыдущее состояние.
    reportsRef.current = next.reports;
    candidatesRef.current = next.candidates;
    curatorRef.current = next.curator;

    setReports(next.reports);
    // `applyReportUpdate` возвращает те же ссылки, если переход этапа
    // не требуется, — лишние ре-рендеры не нужны.
    if (next.candidates !== previous.candidates) {
      setCandidates(next.candidates);
    }
    if (next.curator !== previous.curator) {
      setCurator(next.curator);
    }
  }, []);

  const getReportById = useCallback(
    (candidateId: string) => reports[candidateId],
    [reports],
  );

  // Кандидат читается из изменяемого состояния, а не из демоданных:
  // после утверждения отчёта `pipelineStage` обновляется в `candidates`,
  // и профиль должен показывать актуальный этап.
  const getCandidateById = useCallback(
    (id: string) => candidates.find((candidate) => candidate.id === id),
    [candidates],
  );

  // Материалы интервью отдаются копией массива: страницы не должны
  // мутировать демонстрационные данные модуля.
  //
  // ВНИМАНИЕ (тех. долг, docs/decisions.md §11.7): результат НЕ мемоизирован,
  // каждый вызов возвращает новый массив. Не использовать результат этого
  // геттера в зависимостях `useMemo` / `useEffect` / `useCallback` — иначе
  // эффект будет перезапускаться на каждом рендере.
  const getInterviewByCandidateId = useCallback(
    (candidateId: string) => [
      ...getInterviewByCandidateIdFromData(candidateId),
    ],
    [],
  );

  const contextValue = useMemo<AppOutletContext>(
    () => ({
      candidates,
      curator,
      reports,
      getCandidateById,
      getReportById,
      getInterviewByCandidateId,
      updateReport,
    }),
    [
      candidates,
      curator,
      reports,
      getCandidateById,
      getReportById,
      getInterviewByCandidateId,
      updateReport,
    ],
  );

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <aside
        id="app-sidebar"
        className={`flex shrink-0 flex-col overflow-hidden border-r border-border bg-sidebar transition-[width] duration-200 ease-out motion-reduce:transition-none ${
          isSidebarCollapsed ? "w-16" : "w-60"
        }`}
      >
        <div
          className={`flex h-16 shrink-0 items-center ${
            isSidebarCollapsed ? "justify-center px-2" : "justify-between px-4"
          }`}
        >
          {!isSidebarCollapsed && (
            <span className="truncate text-sm font-semibold text-foreground">
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
            className="rounded-lg p-2 text-muted-foreground transition-colors duration-150 hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E5BA41] focus-visible:ring-offset-1 focus-visible:ring-offset-background"
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
              aria-label={isSidebarCollapsed ? item.label : undefined}
              title={isSidebarCollapsed ? item.label : undefined}
              className={({ isActive }) =>
                `flex items-center rounded-xl text-sm transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E5BA41] focus-visible:ring-offset-1 ${
                  isSidebarCollapsed
                    ? "justify-center px-0 py-2.5"
                    : "gap-2.5 px-3 py-2"
                } ${
                  isActive
                    ? "bg-[#F2CA52] font-medium text-[#1E2028] shadow-xs"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
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
        <header className="border-b border-border bg-background">
          <div className="flex flex-wrap items-center justify-between gap-3 px-8 py-4">
            <div>
              <p className="text-base font-semibold text-foreground">
                Цифровой двойник наставника
              </p>
              <p className="text-sm text-muted-foreground">
                Интерактивный прототип · Вымышленные данные
              </p>
            </div>
            <div className="flex items-center gap-2">
              {headerDocumentState && (
                <DocumentStateBadge state={headerDocumentState} />
              )}
              <ThemeToggle />
            </div>
          </div>
        </header>

        <main className="flex-1 px-8 py-6">
          <div
            className={`mx-auto w-full ${getContentWidthClass(location.pathname)}`}
          >
            <div className="rounded-2xl border border-border bg-background p-6">
              <Outlet context={contextValue} />
            </div>
          </div>
        </main>

        <footer className="border-t border-border bg-background">
          <div
            className={`mx-auto w-full space-y-1 px-8 py-4 text-sm text-muted-foreground ${getContentWidthClass(location.pathname)}`}
          >
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
