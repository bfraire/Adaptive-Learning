// app/api/rewrite-chapter/route.ts
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

import { buildPrompt } from "@/lib/buildPrompt";
import { getGeminiModel } from "@/lib/geminiClient";
import { sliceMarkdownByH2 } from "@/lib/sliceMarkdown";

type RewriteBody = {
  chapterId?: string;  // e.g. "chapter-01"
  sectionId?: string;  // e.g. "section-01-1"

  // Optional: rewrite only one H2 section ("## <heading>")
  heading?: string;

  // Learner profile
  classification: string; // "Novice" | "Intermediate" | "Expert"
  interest: string;        // e.g. "sports"
  contentStyle: string;    // e.g. "concise"

  // When true, writes the output to textbook/<chapterId>/<sectionId>/rewrites/<slug>.md
  save?: boolean;
};

function slugify(s: string) {
  return s.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as RewriteBody;

    if (!body.classification || !body.interest || !body.contentStyle) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: classification, interest, contentStyle." },
        { status: 400 }
      );
    }

    const chapterId = body.chapterId ?? "chapter-01";
    const sectionId = body.sectionId ?? "section-01-1";

    // 1) Load source.md for this section
    const sectionPath = path.join(
      process.cwd(),
      "textbook",
      chapterId,
      sectionId,
      "source.md"
    );

    if (!fs.existsSync(sectionPath)) {
      return NextResponse.json(
        { success: false, error: `source.md not found at textbook/${chapterId}/${sectionId}/source.md` },
        { status: 404 }
      );
    }

    const fullMarkdown = fs.readFileSync(sectionPath, "utf-8");

    // 2) Optionally slice to a single H2 section
    const chapterText = body.heading
      ? sliceMarkdownByH2(fullMarkdown, body.heading)
      : fullMarkdown;

    if (!chapterText) {
      return NextResponse.json(
        { success: false, error: `Heading not found in source.md: "${body.heading}"` },
        { status: 400 }
      );
    }

    // 3) Load prompt template
    const promptPath = path.join(process.cwd(), "prompts", "chapter_rewrite.json");
    if (!fs.existsSync(promptPath)) {
      return NextResponse.json(
        { success: false, error: "Missing prompts/chapter_rewrite.json" },
        { status: 500 }
      );
    }

    const promptConfig = JSON.parse(fs.readFileSync(promptPath, "utf-8")) as {
      model?: string;
      userTemplate: string[];
    };

    const modelName = promptConfig.model ?? "gemini-2.5-flash";

    if (!Array.isArray(promptConfig.userTemplate) || promptConfig.userTemplate.length === 0) {
      return NextResponse.json(
        { success: false, error: "Invalid prompt template format." },
        { status: 500 }
      );
    }

    // 4) Build prompt
    const prompt = buildPrompt(promptConfig.userTemplate, {
      classification: body.classification,
      interest: body.interest,
      contentStyle: body.contentStyle,
      chapterText,
    });

    // 5) Call Gemini
    const model = getGeminiModel(modelName);
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 8192,
      },
    });

    const rewrittenMarkdown = result.response.text();

    // 6) Optionally save to rewrites/
    if (body.save) {
      const slug = `${slugify(body.classification)}-${slugify(body.interest)}-${slugify(body.contentStyle)}.md`;
      const rewritesDir = path.join(process.cwd(), "textbook", chapterId, sectionId, "rewrites");
      fs.mkdirSync(rewritesDir, { recursive: true });
      fs.writeFileSync(path.join(rewritesDir, slug), rewrittenMarkdown, "utf-8");
    }

    const slug = `${slugify(body.classification)}-${slugify(body.interest)}-${slugify(body.contentStyle)}.md`;

    return NextResponse.json(
      {
        success: true,
        chapterId,
        sectionId,
        heading: body.heading ?? null,
        saved: body.save ? slug : null,
        rewrittenMarkdown,
      },
      { status: 200 }
    );
  } catch (err: unknown) {
    console.error("rewrite-chapter error:", err);

    const message = err instanceof Error ? err.message : "Unknown error";
    const isQuota = message.includes("429") || message.toLowerCase().includes("quota");

    return NextResponse.json(
      {
        success: false,
        error: isQuota
          ? "Gemini quota/rate limit hit. Try again later or reduce chunk size."
          : message,
      },
      { status: isQuota ? 429 : 500 }
    );
  }
}
