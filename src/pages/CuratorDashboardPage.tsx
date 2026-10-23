import { ArrowRight, ClipboardCheck, History, Users } from "lucide-react";
import { Link, useOutletContext } from "react-router-dom";

import type { AppOutletContext } from "@/components/layout/AppLayout";

function getInitials(fullName: string): string {
  return fullName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function formatEventTimestamp(timestamp: string): string {
  const date = new Date(timestamp);

  if (Number.isNaN(date.getTime())) {
    return timestamp;
  }

  return date.toLocaleString("ru-RU", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const cardClassName =
  "rounded-2xl border border-transparent bg-[#F4F5F7] p-5 transition-colors hover:border-slate-300 dark:bg-[#252525] dark:hover:border-[#383838]";

const focusRingClassName =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E5BA41] focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[#191919]";

export function CuratorDashboardPage() {
  const { candidates, curator } = useOutletContext<AppOutletContext>();

  const inReviewCount = candidates.filter(
    (candidate) => candidate.pipelineStage === "in_review",
  ).length;

  const events = curator.recentEvents;

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <section className={cardClassName}>
        <div className="flex items-center gap-4">
          {curator.avatarUrl ? (
            <img
              src={curator.avatarUrl}
              alt={curator.fullName}
              className="h-14 w-14 rounded-full object-cover"
            />
          ) : (
            <div
              aria-hidden="true"
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#F2CA52] text-lg font-semibold text-[#1E2028]"
            >
              {getInitials(curator.fullName)}
            </div>
          )}
          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-[#9B9B9B]">
              Наставник
            </p>
            <h1 className="truncate text-2xl font-semibold tracking-tight text-slate-900 dark:text-[#E3E3E3]">
              {curator.fullName}
            </h1>
            <span className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-transparent bg-white px-3 py-1 text-xs font-medium text-slate-700 dark:border-[#3A3A3A] dark:bg-[#2F2F2F] dark:text-slate-200">
              {curator.direction}
            </span>
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-[#E3E3E3]">
          Очередь задач
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className={cardClassName}>
            <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-[#9B9B9B]">
              <Users className="h-4 w-4" aria-hidden="true" />
              Всего в базе
            </div>
            <p className="mt-2 text-3xl font-semibold text-slate-900 dark:text-[#E3E3E3]">
              {candidates.length}
            </p>
          </div>
          <div className={cardClassName}>
            <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-[#9B9B9B]">
              <ClipboardCheck className="h-4 w-4" aria-hidden="true" />
              Ожидают проверки отчёта
            </div>
            <p className="mt-2 text-3xl font-semibold text-slate-900 dark:text-[#E3E3E3]">
              {inReviewCount}
            </p>
          </div>
        </div>
      </section>

      <Link
        to="/candidates"
        className={`group flex items-center justify-between gap-4 rounded-2xl border border-transparent bg-[#F4F5F7] p-6 transition-colors hover:border-slate-300 dark:bg-[#252525] dark:hover:border-[#383838] ${focusRingClassName}`}
      >
        <div className="min-w-0">
          <p className="text-lg font-semibold text-slate-900 dark:text-[#E3E3E3]">
            Перейти к реестру кандидатов
          </p>
          <p className="mt-1 text-sm text-slate-500 dark:text-[#9B9B9B]">
            Все кандидаты, этапы отбора и отчёты наставника.
          </p>
        </div>
        <ArrowRight
          className="h-5 w-5 shrink-0 text-slate-500 transition-transform group-hover:translate-x-1 dark:text-[#9B9B9B]"
          aria-hidden="true"
        />
      </Link>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-[#E3E3E3]">
          Последние события · {events.length}
        </h2>
        {events.length === 0 ? (
          <p className="rounded-2xl border border-transparent bg-[#F4F5F7] p-5 text-sm text-slate-500 dark:bg-[#252525] dark:text-[#9B9B9B]">
            Событий пока нет.
          </p>
        ) : (
          <ul className="space-y-2">
            {events.map((event) => {
              const content = (
                <>
                  <History
                    className="mt-0.5 h-4 w-4 shrink-0 text-slate-400 dark:text-[#9B9B9B]"
                    aria-hidden="true"
                  />
                  <div className="min-w-0">
                    <p className="text-sm text-slate-900 dark:text-[#E3E3E3]">
                      {event.text}
                    </p>
                    <p className="mt-1 text-xs text-slate-500 dark:text-[#9B9B9B]">
                      {formatEventTimestamp(event.timestamp)}
                    </p>
                  </div>
                </>
              );

              return (
                <li key={event.id}>
                  {event.candidateId ? (
                    <Link
                      to={`/candidates/${event.candidateId}`}
                      className={`flex items-start gap-3 rounded-2xl border border-transparent bg-[#F4F5F7] p-4 transition-colors hover:border-slate-300 dark:bg-[#252525] dark:hover:border-[#383838] ${focusRingClassName}`}
                    >
                      {content}
                    </Link>
                  ) : (
                    <div className="flex items-start gap-3 rounded-2xl border border-transparent bg-[#F4F5F7] p-4 dark:bg-[#252525]">
                      {content}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
