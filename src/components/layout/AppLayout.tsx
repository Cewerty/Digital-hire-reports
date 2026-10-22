import { NavLink, Outlet } from "react-router-dom";

import { DocumentStateBadge } from "@/components/layout/DocumentStateBadge";
import type { DocumentState } from "@/types/candidateReport";

const NAV_ITEMS = [
  { to: "/", label: "Профиль и интервью", end: true },
  { to: "/report", label: "Отчёт", end: false },
  { to: "/review", label: "Проверка и правка", end: false },
] as const;

interface AppLayoutProps {
  documentState?: DocumentState;
}

export function AppLayout({ documentState = "draft" }: AppLayoutProps) {
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
                  `rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
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
          <Outlet />
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
