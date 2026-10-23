import ReactMarkdown from "react-markdown";

interface MarkdownContentProps {
  markdown: string;
}

export function MarkdownContent({ markdown }: MarkdownContentProps) {
  return (
    <div className="prose prose-slate max-w-none dark:prose-invert prose-headings:font-semibold prose-p:leading-relaxed">
      <ReactMarkdown>{markdown}</ReactMarkdown>
    </div>
  );
}
