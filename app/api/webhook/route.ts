import { NextRequest, NextResponse } from "next/server";
import { runClaude } from "@/lib/claude";

export async function POST(request: NextRequest) {
  const event = request.headers.get("x-github-event");
  console.log(`[webhook] Received event: ${event}`);

  if (!event) {
    return NextResponse.json({ error: "Missing x-github-event header" }, { status: 400 });
  }

  const body = await request.json();

  if (event === "issues" && body.action === "opened") {
    const { title, body: issueBody } = body.issue;
    console.log(`[webhook] New issue opened: "${title}"`);

    // Run Claude async — don't block the webhook response
    runClaude(title, issueBody ?? "");

    return NextResponse.json({ message: "Issue received, Claude is processing" });
  }

  console.log(`[webhook] Ignored event: ${event} / ${body.action ?? "no action"}`);
  return NextResponse.json({ message: "Event ignored" });
}
