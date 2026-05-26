"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import MarkdownRenderer, { CaptionMarkdown } from "./MarkdownRenderer";
import { QuizBlock, QuizBlockProps, QuizQuestion } from "./QuizBlock";

export type TextSource = {
  chapterId: string;
  sectionId: string;
  variant: string;  // "source" OR "<rewriteFilename>.md"
  heading?: string; // slice by "## Heading"
};

export type TextBlock = {
  id: string;
  kind: "text";
  label?: string;
  title?: string;
  hideTitle?: boolean;
  source: TextSource;
  keepMarkdownHeading?: boolean;
};


export type FigureBlock = {
  id: string;
  kind: "figure";
  title?: string;
  src: string;
  alt: string;
  caption?: string;
  maxHeightPx?: number;
};

export type CalloutKind = "definition" | "example" | "checkpoint" | "note";

export type CalloutBlock = {
  id: string;
  kind: "callout";
  calloutType: CalloutKind;
  title?: string;   // e.g. "Definition"
  label?: string;   // optional small eyebrow
  source?: TextSource; // optional file-backed content
  markdown?: string;   // or inline markdown
};

export type DividerBlock = {
  id: string;
  kind: "divider";
};

export type QuizBlockContent = {
  id: string;
  kind: "quiz";
  title?: string;
  questions: QuizQuestion[];
  sectionConcepts: string[];
};

export type ContentBlock = TextBlock | FigureBlock | CalloutBlock | DividerBlock | QuizBlockContent;

type Props = {
  blocks: ContentBlock[];
};

function sourceKey(s: TextSource) {
  return `${s.chapterId}|${s.sectionId}|${s.variant}|${s.heading ?? ""}`;
}

function CalloutStyle(type: CalloutKind) {
  // OpenStax-ish: subtle background + border + label
  switch (type) {
    case "definition":
      return "border-gray-200 bg-gray-50";
    case "example":
      return "border-gray-200 bg-gray-50";
    case "checkpoint":
      return "border-gray-200 bg-gray-50";
    case "note":
    default:
      return "border-gray-200 bg-gray-50";
  }
}

function CalloutLabel(type: CalloutKind) {
  switch (type) {
    case "definition":
      return "Definition";
    case "example":
      return "Example";
    case "checkpoint":
      return "Checkpoint";
    case "note":
    default:
      return "Note";
  }
}

export default function ReaderBlocks({ blocks }: Props) {
  const textSources = useMemo(() => {
    const sources: TextSource[] = [];
    for (const b of blocks) {
      if (b.kind === "text") sources.push(b.source);
      if (b.kind === "callout" && b.source) sources.push(b.source);
    }
    // unique
    return Array.from(new Map(sources.map((s) => [sourceKey(s), s])).values());
  }, [blocks]);

  const [mdCache, setMdCache] = useState<Record<string, string>>({});
  const [mdError, setMdError] = useState<Record<string, string>>({});
  const [mdLoading, setMdLoading] = useState<Record<string, boolean>>({});

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      const toLoad = textSources.filter((s) => {
        const k = sourceKey(s);
        return !mdCache[k] && !mdLoading[k] && !mdError[k];
      });

      if (toLoad.length === 0) return;

      setMdLoading((prev) => {
        const next = { ...prev };
        for (const s of toLoad) next[sourceKey(s)] = true;
        return next;
      });

      await Promise.all(
        toLoad.map(async (s) => {
          const k = sourceKey(s);
          try {
            const url =
              `/api/section-md?chapterId=${encodeURIComponent(s.chapterId)}` +
              `&sectionId=${encodeURIComponent(s.sectionId)}` +
              `&variant=${encodeURIComponent(s.variant)}` +
              (s.heading ? `&heading=${encodeURIComponent(s.heading)}` : "");

            const res = await fetch(url);
            const data = await res.json();

            if (!res.ok || !data.success) {
              throw new Error(data.error ?? "Failed to load markdown");
            }

            if (!cancelled) {
              setMdCache((prev) => ({ ...prev, [k]: (data.markdown ?? "").toString() }));
            }
          } catch (e: any) {
            if (!cancelled) {
              setMdError((prev) => ({ ...prev, [k]: e?.message ?? "Load error" }));
            }
          } finally {
            // Always clear loading state even if cancelled — prevents blocks
            // from getting stuck in "Loading…" when profile/rewriteFilename changes.
            setMdLoading((prev) => ({ ...prev, [k]: false }));
          }
        })
      );
    };

    load();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [textSources]);

  return (
    <div className="space-y-10">
      {blocks.map((block) => {
        if (block.kind === "divider") {
          return <hr key={block.id} className="border-gray-200" />;
        }

        if (block.kind === "quiz") {
          return (
            <QuizBlock
              key={block.id}
              title={block.title}
              questions={block.questions}
              sectionConcepts={block.sectionConcepts}
              sectionId={block.id}
              />
          );
        }

        if (block.kind === "figure") {
          return <Figure key={block.id} {...block} />;
        }

        if (block.kind === "callout") {
          const content = resolveBlockMarkdown(block, mdCache, mdLoading, mdError);
          return (
            <Callout
              key={block.id}
              calloutType={block.calloutType}
              title={block.title}
              label={block.label}
              markdown={content.markdown}
              loading={content.loading}
              error={content.error}
              keepMarkdownHeading={true}
            />
          );
        }

        // Text block in reading flow
        const content = resolveBlockMarkdown(block, mdCache, mdLoading, mdError);
        return (
          <section key={block.id} className="space-y-3 text-black">
            {block.label && (
              <div className="text-xs tracking-wide uppercase text-indigo-200">
                {block.label}
              </div>
            )}

        {block.title && !block.hideTitle && (
            <h2 className="text-2xl font-bold text-black">
            {block.title}
            </h2>
        )}


            {content.loading && <p className="text-sm text-black">Loading…</p>}

            {!content.loading && content.error && (
              <div className="text-sm text-black">
                <div className="font-semibold">Couldn’t load this section.</div>
                <div className="mt-1">Error: {content.error}</div>
                <div className="mt-2 text-xs">
                  Looking for:{" "}
                  <span className="font-mono">{block.source.variant}</span>
                  {block.source.heading ? (
                    <>
                      {" "}
                      / heading:{" "}
                      <span className="font-mono">{block.source.heading}</span>
                    </>
                  ) : null}
                </div>
              </div>
            )}

            {!content.loading && !content.error && (
              <MarkdownRenderer
                markdown={content.markdown}
                stripH2={!block.keepMarkdownHeading}
              />
            )}
          </section>
        );
      })}
    </div>
  );
}

function resolveBlockMarkdown(
  block: TextBlock | CalloutBlock,
  mdCache: Record<string, string>,
  mdLoading: Record<string, boolean>,
  mdError: Record<string, string>
) {
  if ("markdown" in block && typeof block.markdown === "string") {
    return { markdown: block.markdown, loading: false, error: "" };
  }
  if (!block.source) {
    return { markdown: "", loading: false, error: "No source provided." };
  }

  const k = sourceKey(block.source);
  return {
    markdown: mdCache[k] ?? "",
    loading: !!mdLoading[k],
    error: mdError[k] ?? "",
  };
}

function Figure({
  title,
  src,
  alt,
  caption,
}: FigureBlock) {
  return (
    <figure className="text-black">
      {title && (
        <div className="text-sm font-semibold text-black mb-2">{title}</div>
      )}

      {/* Centered figure container (like your card style) */}
      <div className="bg-white border border-gray-200 rounded-lg p-3">
        {/* Center the image and limit its height */}
        <div className="relative w-full flex justify-center">
          <Image
            src={src}
            alt={alt}
            width={1200}
            height={800}
            className="w-full h-auto object-contain"
            style={{ maxHeight: "420px" }} // ✅ controls "too big" issue
            priority={false}
          />
        </div>
      </div>

      {caption && (
        <figcaption className="mt-2 text-sm text-black text-center">
          <CaptionMarkdown>{caption}</CaptionMarkdown>
        </figcaption>
      )}
    </figure>
  );
}

function Callout({
  calloutType,
  title,
  label,
  markdown,
  loading,
  error,
  keepMarkdownHeading = true,
}: {
  calloutType: CalloutKind;
  title?: string;
  label?: string;
  markdown: string;
  loading: boolean;
  error: string;
  keepMarkdownHeading?: boolean;
}) {
  const labelText = title ?? CalloutLabel(calloutType);

  return (
    <aside
      className={[
        "rounded-lg border px-4 py-4",
        CalloutStyle(calloutType),
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="space-y-1">
          {label && (
            <div className="text-xs tracking-wide uppercase text-black">
              {label}
            </div>
          )}
          <div className="text-sm font-semibold text-black">{labelText}</div>
        </div>
      </div>

      {loading && <p className="text-sm text-black">Loading…</p>}

      {!loading && error && (
        <div className="text-sm text-black">
          <div className="font-semibold">Couldn’t load this callout.</div>
          <div className="mt-1">Error: {error}</div>
        </div>
      )}

      {!loading && !error && (
        <MarkdownRenderer markdown={markdown} stripH2={!keepMarkdownHeading ? false : true} />
      )}
    </aside>
  );
}
