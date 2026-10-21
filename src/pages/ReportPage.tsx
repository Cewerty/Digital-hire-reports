import { Link } from "react-router-dom";

export function ReportPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Отчёт</h2>
        <p className="mt-1 text-sm text-slate-500">
          Раздел находится в разработке.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link
          to="/"
          className="inline-flex items-center rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100"
        >
          ← Профиль
        </Link>
        <Link
          to="/review"
          className="inline-flex items-center rounded-md bg-slate-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-800"
        >
          Перейти к проверке →
        </Link>
      </div>
    </div>
  );
}
