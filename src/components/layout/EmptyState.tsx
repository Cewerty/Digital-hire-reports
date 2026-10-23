import type { ReactNode } from "react";

interface EmptyStateProps {
  /** Заголовок пустого состояния. */
  title: string;
  /** Пояснение, почему данные отсутствуют. */
  description?: string;
  /** Необязательное действие, например кнопка перехода. */
  action?: ReactNode;
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-[#F4F5F7] p-6 text-center transition-colors duration-150 dark:border-[#383838] dark:bg-[#252525]">
      <h3 className="text-base font-semibold text-slate-900 dark:text-[#E3E3E3]">
        {title}
      </h3>
      {description ? (
        <p className="mt-1 text-sm text-slate-500 dark:text-[#9B9B9B]">
          {description}
        </p>
      ) : null}
      {action ? <div className="mt-4 flex justify-center">{action}</div> : null}
    </div>
  );
}
