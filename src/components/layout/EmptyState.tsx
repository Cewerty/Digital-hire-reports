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
    <div className="rounded-2xl border border-dashed border-border bg-muted p-6 text-center transition-colors duration-150">
      <h3 className="text-base font-semibold text-foreground">{title}</h3>
      {description ? (
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      ) : null}
      {action ? <div className="mt-4 flex justify-center">{action}</div> : null}
    </div>
  );
}
