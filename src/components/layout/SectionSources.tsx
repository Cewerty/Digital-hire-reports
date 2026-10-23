import { useId, useState } from "react";

import type { InterviewEntry } from "@/types/candidateReport";

interface SectionSourcesProps {
  sourceEntryIds: string[];
  entries: InterviewEntry[];
}

export function SectionSources({
  sourceEntryIds,
  entries,
}: SectionSourcesProps) {
  const [isOpen, setIsOpen] = useState(false);
  const listId = useId();

  const uniqueSourceIds = Array.from(new Set(sourceEntryIds));

  const sources = uniqueSourceIds
    .map((id) => entries.find((entry) => entry.id === id))
    .filter((entry): entry is InterviewEntry => entry !== undefined);

  if (sources.length === 0) {
    return (
      <p className="text-sm text-slate-500 dark:text-[#9B9B9B]">
        Источники раздела не указаны
      </p>
    );
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-controls={listId}
        className="inline-flex items-center rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition-colors duration-200 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E5BA41] focus-visible:ring-offset-2 focus-visible:ring-offset-background dark:border-[#2E2E2E] dark:bg-[#252525] dark:text-[#E3E3E3] dark:hover:bg-[#2F2F2F]"
      >
        Источники раздела · {sources.length}
      </button>

      <div id={listId} hidden={!isOpen} className="mt-3 space-y-3">
        {sources.map((source) => (
          <article
            key={source.id}
            className="rounded-md border border-slate-200 bg-slate-50 p-3 dark:border-[#2E2E2E] dark:bg-[#2F2F2F]"
          >
            <h4 className="text-sm font-semibold text-slate-900 dark:text-[#E3E3E3]">
              {source.question}
            </h4>
            <p className="mt-1 whitespace-pre-wrap text-sm text-slate-700 dark:text-[#E3E3E3]">
              {source.answer}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}
