import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MarkdownContent } from "@/components/layout/MarkdownContent";
import type { ReportSection } from "@/types/candidateReport";

interface ReportSectionEditorProps {
  section: ReportSection;
  title: string;
  onChange: (section: ReportSection) => void;
}

export function ReportSectionEditor({
  section,
  title,
  onChange,
}: ReportSectionEditorProps) {
  const [mode, setMode] = useState<"edit" | "preview">("edit");

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
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
          aria-label={`Markdown раздела «${title}»`}
          className="min-h-[160px]"
        />
      ) : (
        <MarkdownContent markdown={section.markdown} />
      )}
    </section>
  );
}
