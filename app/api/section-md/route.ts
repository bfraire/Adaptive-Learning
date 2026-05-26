// app/api/section-md/route.ts
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { sliceMarkdownByH2 } from "@/lib/sliceMarkdown";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const chapterId = searchParams.get("chapterId") ?? "chapter-01";
  const sectionId = searchParams.get("sectionId") ?? "section-01-1";

  // variant can be:
  // - "source"  -> loads textbook/<chapterId>/<sectionId>/source.md
  // - "<file>.md" -> loads textbook/<chapterId>/<sectionId>/rewrites/<file>.md
  const variant = searchParams.get("variant") ?? "source";

  // optional: slices content from "## <heading>"
  const heading = searchParams.get("heading") ?? "";

  const baseDir = path.join(process.cwd(), "textbook", chapterId, sectionId);

  const filePath =
    variant === "source"
      ? path.join(baseDir, "source.md")
      : path.join(baseDir, "rewrites", variant);

  if (!fs.existsSync(filePath)) {
    return NextResponse.json(
      { success: false, error: "Markdown file not found", filePath },
      { status: 404 }
    );
  }

  const fullMarkdown = fs.readFileSync(filePath, "utf-8");

  const markdown = heading ? sliceMarkdownByH2(fullMarkdown, heading) : fullMarkdown;

  if (heading && !markdown) {
    return NextResponse.json(
      { success: false, error: `Heading not found: ${heading}`, filePath },
      { status: 400 }
    );
  }

  return NextResponse.json({
    success: true,
    markdown,
    filePath,
  });
}


