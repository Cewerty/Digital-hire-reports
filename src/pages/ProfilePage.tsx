import { Link } from "react-router-dom";

export function ProfilePage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Профиль и материалы интервью</h2>
        <p className="mt-1 text-sm text-slate-500">
          Раздел находится в разработке.
        </p>
      </div>

      <Link
        to="/report"
        className="inline-flex items-center rounded-md bg-slate-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-800"
      >
        Перейти к отчёту
      </Link>
    </div>
  );
}
