import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Страница не найдена</h2>
        <p className="mt-1 text-sm text-slate-500">
          Запрошенный раздел не существует в прототипе.
        </p>
      </div>

      <Link
        to="/candidates"
        className="inline-flex items-center rounded-md bg-slate-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-800"
      >
        К списку кандидатов
      </Link>
    </div>
  );
}
