import { EmptyState } from "@/components/layout/EmptyState";
import { MarkdownContent } from "@/components/layout/MarkdownContent";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { ReportSection } from "@/types/candidateReport";
import { useEffect, useId, useState } from "react";

interface ReportSectionEditorProps {
  section: ReportSection;
  title: string;
  onChange: (section: ReportSection) => void;
  /** Ошибка валидации раздела; выводится под редактором. */
  error?: string;
}

export function ReportSectionEditor({
  section,
  title,
  onChange,
  error,
}: ReportSectionEditorProps) {
  const [mode, setMode] = useState<"edit" | "preview">("edit");
  const errorId = useId();

  // Ошибка валидации требует перевода фокуса в поле ввода. В режиме
  // предпросмотра `Textarea` не отрендерена, поэтому возвращаемся в редактор.
  useEffect(() => {
    if (error) {
      setMode("edit");
    }
  }, [error]);

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-[#E3E3E3]">
          {title}
        </h3>
        <div className="flex gap-2">
          <Button
            type="button"
            variant={mode === "edit" ? "secondary" : "ghost"}
            size="sm"
            aria-pressed={mode === "edit"}
            onClick={() => setMode("edit")}
          >
            Редактирование
          </Button>
          <Button
            type="button"
            variant={mode === "preview" ? "secondary" : "ghost"}
            size="sm"
            aria-pressed={mode === "preview"}
            onClick={() => setMode("preview")}
          >
            Предпросмотр
          </Button>
        </div>
      </div>

      {mode === "edit" ? (
        <Textarea
          value={section.markdown}
          onChange={(event) =>
            onChange({ ...section, markdown: event.target.value })
          }
          placeholder="Введите текст раздела в формате Markdown"
          aria-label={`Markdown раздела «${title}»`}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          className="min-h-[160px]"
        />
      ) : section.markdown.trim().length > 0 ? (
        <MarkdownContent markdown={section.markdown} />
      ) : (
        <EmptyState
          title="Раздел не заполнен"
          description="Добавьте содержание, чтобы увидеть предпросмотр."
        />
      )}

      {error ? (
        <p
          id={errorId}
          role="alert"
          className="text-sm text-red-600 dark:text-rose-300"
        >
          {error}
        </p>
      ) : null}
    </section>
  );
}
