import { Link } from "react-router-dom";

import { candidate, interviewEntries } from "@/data/demoData";

export function ProfilePage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Профиль и материалы интервью</h2>
        <p className="mt-1 text-sm text-slate-500">
          В прототипе данные кандидата имитируют импорт из 1С и доступны только
          для чтения.
        </p>
      </div>

      <section
        aria-labelledby="candidate-card-heading"
        className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
      >
        <h3 id="candidate-card-heading" className="text-lg font-semibold">
          Карточка кандидата
        </h3>
        <dl className="mt-3 grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2">
          <div>
            <dt className="text-sm text-slate-500">ФИО</dt>
            <dd className="text-sm font-medium">{candidate.fullName}</dd>
          </div>
          <div>
            <dt className="text-sm text-slate-500">Предпочитаемое обращение</dt>
            <dd className="text-sm font-medium">{candidate.preferredName}</dd>
          </div>
          <div>
            <dt className="text-sm text-slate-500">Курс</dt>
            <dd className="text-sm font-medium">{candidate.course}</dd>
          </div>
          <div>
            <dt className="text-sm text-slate-500">Группа</dt>
            <dd className="text-sm font-medium">{candidate.group}</dd>
          </div>
          <div>
            <dt className="text-sm text-slate-500">Специальность</dt>
            <dd className="text-sm font-medium">{candidate.specialty}</dd>
          </div>
        </dl>
      </section>

      <section
        aria-labelledby="interview-heading"
        className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
      >
        <h3 id="interview-heading" className="text-lg font-semibold">
          Материалы интервью
        </h3>
        <div className="mt-3 space-y-4">
          {interviewEntries.map((entry) => (
            <article
              key={entry.id}
              className="rounded-md border border-slate-100 bg-slate-50 p-3"
            >
              <h4 className="text-sm font-semibold text-slate-900">
                {entry.question}
              </h4>
              <p className="mt-1 whitespace-pre-wrap text-sm text-slate-700">
                {entry.answer}
              </p>
            </article>
          ))}
        </div>
      </section>

      <Link
        to="/report"
        className="inline-flex items-center rounded-md bg-slate-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-800"
      >
        Перейти к отчёту
      </Link>
    </div>
  );
}
