import { Link } from "react-router-dom";

export function ReviewPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Проверка и правка</h2>
        <p className="mt-1 text-sm text-slate-500">
          Раздел находится в разработке.
        </p>
      </div>

      <Link
        to="/report"
        className="inline-flex items-center rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100"
      >
        ← К отчёту
      </Link>
    </div>
  );
}
