import type { ReactNode } from "react";

function renderInline(text: string): ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={index} className="font-semibold text-portal-heading">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
}

export function AIMarkdownContent({
  content,
  className = "",
}: {
  content: string;
  className?: string;
}) {
  const lines = content.replace(/\r\n/g, "\n").split("\n");
  const nodes: ReactNode[] = [];
  let listItems: string[] = [];
  let key = 0;

  const flushList = () => {
    if (listItems.length === 0) return;
    nodes.push(
      <ul key={key++} className="my-2 list-disc space-y-1.5 pl-5">
        {listItems.map((item, i) => (
          <li key={i} className="text-portal leading-relaxed">
            {renderInline(item)}
          </li>
        ))}
      </ul>
    );
    listItems = [];
  };

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();

    if (!line.trim()) {
      flushList();
      continue;
    }

    if (line.startsWith("## ")) {
      flushList();
      nodes.push(
        <h3
          key={key++}
          className="mb-2 mt-4 first:mt-0 font-display text-base font-bold text-portal-heading"
        >
          {line.slice(3).trim()}
        </h3>
      );
      continue;
    }

    if (line.startsWith("### ")) {
      flushList();
      nodes.push(
        <h4
          key={key++}
          className="mb-1.5 mt-3 first:mt-0 text-sm font-semibold text-portal-heading"
        >
          {line.slice(4).trim()}
        </h4>
      );
      continue;
    }

    if (line.startsWith("- ")) {
      listItems.push(line.slice(2).trim());
      continue;
    }

    flushList();
    nodes.push(
      <p key={key++} className="my-2 leading-relaxed text-portal first:mt-0 last:mb-0">
        {renderInline(line.trim())}
      </p>
    );
  }

  flushList();

  return <div className={`ai-markdown ${className}`}>{nodes}</div>;
}
