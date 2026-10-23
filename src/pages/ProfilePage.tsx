import { useEffect, useState } from "react";
import {
  Link,
  useOutletContext,
  useParams,
  useSearchParams,
} from "react-router-dom";

import type { AppOutletContext } from "@/components/layout/AppLayout";
import { EmptyState } from "@/components/layout/EmptyState";
import { LoadingState } from "@/components/layout/LoadingState";
import { Button } from "@/components/ui/button";
import { parseDemoViewState } from "@/data/demoData";
import type { InterviewEntry } from "@/types/candidateReport";

export function ProfilePage() {
  const { id = "c-01" } = useParams<{ id: string }>();
  const { getCandidateById, getInterviewByCandidateId, getReportById } =
    useOutletContext<AppOutletContext>();
  const [searchParams] = useSearchParams();
  const demoState = parseDemoViewState(searchParams.get("state"));
  const showEmpty = demoState === "empty";
  const [isLoading, setIsLoading] = useState(demoState === "loading");

  const candidate = getCandidateById(id);
  const interviewEntries = getInterviewByCandidateId(id);
  const hasReport = Boolean(getReportById(id));

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

  if (!candidate) {
    return (
      <div className="space-y-6">
        <h2 className="text-xl font-semibold">Профиль и материалы интервью</h2>
        <EmptyState
          title="Кандидат не найден"
          description="Данные профиля недоступны. Проверьте, что кандидат был импортирован из 1С."
        />
      </div>
    );
  }

  const candidateRows: Array<{ label: string; value: string }> = [
    { label: "ФИО", value: candidate.fullName },
    { label: "Предпочитаемое обращение", value: candidate.preferredName },
    { label: "Курс", value: String(candidate.course) },
    { label: "Группа", value: candidate.group },
    { label: "Специальность", value: candidate.specialty },
  ];

  const isUninterviewed =
    candidate.pipelineStage === "uninterviewed" ||
    interviewEntries.length === 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Профиль и материалы интервью</h2>
        <p className="mt-1 text-sm text-muted-foreground">
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
          className="rounded-2xl border border-transparent bg-[#F4F5F7] p-5 transition-colors hover:border-slate-300 dark:bg-[#252525] dark:hover:border-[#383838]"
        >
          <h3 id="candidate-card-heading" className="text-lg font-semibold">
            Карточка кандидата
          </h3>
          <dl className="mt-3 grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2">
            {candidateRows.map((row) => (
              <div key={row.label}>
                <dt className="text-sm text-muted-foreground">{row.label}</dt>
                <dd className="text-sm font-medium">{row.value}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      <section
        aria-labelledby="interview-heading"
        className="rounded-2xl border border-transparent bg-[#F4F5F7] p-5 transition-colors hover:border-slate-300 dark:bg-[#252525] dark:hover:border-[#383838]"
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
            {interviewEntries.map((entry: InterviewEntry) => (
              <article
                key={entry.id}
                className="rounded-xl border border-slate-200/80 bg-white p-4 transition-colors hover:border-slate-300 dark:border-[#3A3A3A] dark:bg-[#2F2F2F] dark:hover:border-[#4A4A4A]"
              >
                <h4 className="text-sm font-semibold text-slate-900 dark:text-[#E3E3E3]">
                  {entry.question}
                </h4>
                <p className="mt-1 whitespace-pre-wrap text-sm text-slate-700 dark:text-slate-200">
                  {entry.answer}
                </p>
              </article>
            ))}
          </div>
        )}
      </section>

      {showEmpty ? null : isUninterviewed ? (
        <div className="space-y-2">
          <Button type="button" disabled>
            Перейти к отчёту
          </Button>
          <p className="text-sm text-muted-foreground">
            Отчёт станет доступен после проведения интервью.
          </p>
        </div>
      ) : !hasReport ? (
        <div className="space-y-2">
          <Button type="button" disabled>
            Перейти к отчёту
          </Button>
          <p className="text-sm text-muted-foreground">
            Отчёт по этому кандидату ещё не создан.
          </p>
        </div>
      ) : (
        <Button asChild>
          <Link to={`/candidates/${candidate.id}/report`}>
            Перейти к отчёту
          </Link>
        </Button>
      )}
    </div>
  );
}
