import ReactMarkdown from "react-markdown";

interface MarkdownContentProps {
  markdown: string;
}

export function MarkdownContent({ markdown }: MarkdownContentProps) {
  return (
    <div className="prose prose-slate max-w-none">
      <ReactMarkdown>{markdown}</ReactMarkdown>
    </div>
  );
}
