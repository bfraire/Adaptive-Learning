// lib/sliceMarkdown.ts

/**
 * Extracts a subsection starting at "## <heading>" up to (but not including)
 * the next "## " header. Returns null if heading isn't found.
 */
export function sliceMarkdownByH2(markdown: string, heading: string): string | null {
  const needle = `## ${heading}`;
  const start = markdown.indexOf(needle);
  if (start === -1) return null;

  const afterStart = markdown.slice(start);
  const nextIdx = afterStart.indexOf("\n## ", 1);
  return nextIdx === -1 ? afterStart.trim() : afterStart.slice(0, nextIdx).trim();
}

