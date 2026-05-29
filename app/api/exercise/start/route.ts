import { NextResponse } from "next/server";

const FASTAPI_BASE = process.env.FASTAPI_URL ?? "http://localhost:8000";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const upstream = await fetch(`${FASTAPI_BASE}/session/start`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await upstream.json();
    return NextResponse.json(data, { status: upstream.status });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to reach exercise backend", detail: String(err) },
      { status: 502 }
    );
  }
}
