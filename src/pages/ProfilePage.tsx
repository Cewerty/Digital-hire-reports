import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

import { EmptyState } from "@/components/layout/EmptyState";
import { LoadingState } from "@/components/layout/LoadingState";
import {
  candidate,
  interviewEntries,
  parseDemoViewState,
} from "@/data/demoData";

const candidateRows: Array<{ label: string; value: string }> = [
  { label: "ФИО", value: candidate.fullName },
  { label: "Предпочитаемое обращение", value: candidate.preferredName },
  { label: "Курс", value: String(candidate.course) },
  { label: "Группа", value: candidate.group },
  { label: "Специальность", value: candidate.specialty },
];

export function ProfilePage() {
  const [searchParams] = useSearchParams();
  const demoState = parseDemoViewState(searchParams.get("state"));
  const showEmpty = demoState === "empty";
  const [isLoading, setIsLoading] = useState(demoState === "loading");

  useEffect(() => {
    if (demoState !== "loading") {
      return;
    }

    setIsLoading(true);
    const timer = window.setTimeout(() => setIsLoading(false), 800);

    return () => window.clearTimeout(timer);
  }, [demoState]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h2 className="text-xl font-semibold">Профиль и материалы интервью</h2>
        <LoadingState label="Загрузка профиля кандидата…" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Профиль и материалы интервью</h2>
        <p className="mt-1 text-sm text-slate-500">
          В прототипе данные кандидата имитируют импорт из 1С и доступны только
          для чтения.
        </p>
      </div>

      {showEmpty ? (
        <EmptyState
          title="Кандидат не найден"
          description="Данные профиля недоступны. Проверьте, что кандидат был импортирован из 1С."
        />
      ) : (
        <section
          aria-labelledby="candidate-card-heading"
          className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
        >
          <h3 id="candidate-card-heading" className="text-lg font-semibold">
            Карточка кандидата
          </h3>
          <dl className="mt-3 grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2">
            {candidateRows.map((row) => (
              <div key={row.label}>
                <dt className="text-sm text-slate-500">{row.label}</dt>
                <dd className="text-sm font-medium">{row.value}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      <section
        aria-labelledby="interview-heading"
        className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
      >
        <h3 id="interview-heading" className="text-lg font-semibold">
          Материалы интервью
        </h3>
        {showEmpty || interviewEntries.length === 0 ? (
          <div className="mt-3">
            <EmptyState
              title="Материалы интервью отсутствуют"
              description="По этому кандидату ещё нет записанных вопросов и ответов."
            />
          </div>
        ) : (
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
        )}
      </section>

      {showEmpty ? null : (
        <Link
          to="/report"
          className="inline-flex items-center rounded-md bg-slate-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2"
        >
          Перейти к отчёту
        </Link>
      )}
    </div>
  );
}
