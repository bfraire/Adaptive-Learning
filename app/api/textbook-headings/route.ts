import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

function listH2Headings(markdown: string): string[] {
  return markdown
    .split("\n")
    .filter((line) => line.startsWith("## "))
    .map((line) => line.slice(3).trim());
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const chapterId = searchParams.get("chapterId") ?? "chapter-01";
  const sectionFile = searchParams.get("sectionFile") ?? "limited-section-01-1.md";

  const sectionPath = path.join(process.cwd(), "textbook", chapterId, sectionFile);
  const fullMarkdown = fs.readFileSync(sectionPath, "utf-8");

  const headings = listH2Headings(fullMarkdown);

  return NextResponse.json({
    success: true,
    chapterId,
    sectionFile,
    headings
  });
}
