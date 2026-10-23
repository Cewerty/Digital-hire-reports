import {
  ArrowRight,
  ClipboardCheck,
  FileCheck,
  History,
  Users,
} from "lucide-react";
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
  "rounded-2xl border border-transparent bg-muted p-5 transition-colors hover:border-border";

const focusRingClassName =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-strong focus-visible:ring-offset-2 focus-visible:ring-offset-background";

export function CuratorDashboardPage() {
  const { candidates, curator } = useOutletContext<AppOutletContext>();

  const inReviewCount = candidates.filter(
    (candidate) => candidate.pipelineStage === "in_review",
  ).length;

  const reviewedCount = candidates.filter(
    (candidate) => candidate.pipelineStage === "reviewed",
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
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-brand text-lg font-semibold text-brand-foreground"
            >
              {getInitials(curator.fullName)}
            </div>
          )}
          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Наставник
            </p>
            <h1 className="truncate text-2xl font-semibold tracking-tight text-foreground">
              {curator.fullName}
            </h1>
            <span className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-foreground">
              {curator.direction}
            </span>
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
          Очередь задач
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className={cardClassName}>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4" aria-hidden="true" />
              Всего в базе
            </div>
            <p className="mt-2 text-3xl font-semibold text-foreground">
              {candidates.length}
            </p>
          </div>
          <div className={cardClassName}>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <ClipboardCheck className="h-4 w-4" aria-hidden="true" />
              Ожидают проверки отчёта
            </div>
            <p className="mt-2 text-3xl font-semibold text-foreground">
              {inReviewCount}
            </p>
          </div>
          <div className={cardClassName}>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <FileCheck className="h-4 w-4" aria-hidden="true" />
              Рассмотрено
            </div>
            <p className="mt-2 text-3xl font-semibold text-foreground">
              {reviewedCount}
            </p>
          </div>
        </div>
      </section>

      <Link
        to="/candidates"
        className={`group flex items-center justify-between gap-4 rounded-2xl border border-transparent bg-muted p-6 transition-colors hover:border-border ${focusRingClassName}`}
      >
        <div className="min-w-0">
          <p className="text-lg font-semibold text-foreground">
            Перейти к реестру кандидатов
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Все кандидаты, этапы отбора и отчёты наставника.
          </p>
        </div>
        <ArrowRight
          className="h-5 w-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1"
          aria-hidden="true"
        />
      </Link>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
          Последние события · {events.length}
        </h2>
        {events.length === 0 ? (
          <p className="rounded-2xl border border-transparent bg-muted p-5 text-sm text-muted-foreground">
            Событий пока нет.
          </p>
        ) : (
          <ul className="space-y-2">
            {events.map((event) => {
              const content = (
                <>
                  <History
                    className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground"
                    aria-hidden="true"
                  />
                  <div className="min-w-0">
                    <p className="text-sm text-foreground">{event.text}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
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
                      className={`flex items-start gap-3 rounded-2xl border border-transparent bg-muted p-4 transition-colors hover:border-border ${focusRingClassName}`}
                    >
                      {content}
                    </Link>
                  ) : (
                    <div className="flex items-start gap-3 rounded-2xl border border-transparent bg-muted p-4">
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
