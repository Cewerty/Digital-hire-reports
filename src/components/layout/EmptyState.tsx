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
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center shadow-sm dark:border-[#3A3A3A] dark:bg-[#202020]">
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
