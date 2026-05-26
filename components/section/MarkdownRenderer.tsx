"use client";

import React from "react";
import Markdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

/**
 * Strip the leading H2 (## Heading) that we use for slicing,
 * so it doesn't duplicate the section title in the page flow.
 *
 * Preserves spacing (important for lists + math blocks).
 */
function stripLeadingH2(markdown: string) {
  return markdown.replace(/^##\s+.*(?:\r?\n)+/, "\n\n");
}

export function CaptionMarkdown({ children }: { children: string }) {
  return (
    <Markdown
      remarkPlugins={[remarkMath]}
      rehypePlugins={[rehypeKatex]}
      skipHtml={true}
      components={{
        p({ children }) {
          return <>{children}</>;
        },
      }}
    >
      {children}
    </Markdown>
  );
}

export default function MarkdownRenderer({
  markdown,
  stripH2 = true,
}: {
  markdown: string;
  stripH2?: boolean;
}) {
  const cleaned = stripH2 ? stripLeadingH2(markdown) : markdown;

  return (
    <article className="prose max-w-none text-black prose-headings:text-black prose-p:text-black prose-li:text-black prose-strong:text-black prose-ul:list-disc prose-ol:list-decimal prose-li:ml-6">
      <Markdown
        remarkPlugins={[remarkMath]}
        rehypePlugins={[rehypeKatex]}
        skipHtml={true}
        components={{
          p({ children }) {
            return <p style={{ marginBottom: "1em" }}>{children}</p>;
          },
          ul({ children }) {
            return <ul className="list-disc pl-6 my-3 space-y-1">{children}</ul>;
          },
          ol({ children }) {
            return <ol className="list-decimal pl-6 my-3 space-y-1">{children}</ol>;
          },
        }}
      >
        {cleaned}
      </Markdown>
    </article>
  );
}


