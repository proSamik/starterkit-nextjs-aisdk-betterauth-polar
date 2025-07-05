import { getSession } from "@/lib/auth/server";
import { createOpenAI } from "@ai-sdk/openai";
import { convertToModelMessages, streamText, UIMessage } from "ai";
import { NextRequest, NextResponse } from "next/server";

if (!process.env.OPENAI_API_KEY) {
  console.warn("OPENAI_API_KEY is not set. The chat API will not work.");
}

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  const session = await getSession();

  if (!session?.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ error: "Missing API Key" }, { status: 500 });
  }

  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: openai("gpt-4o"),
    system:
      "do not respond on markdown or lists, keep your responses brief, you can ask the user to upload images or documents if it could help you understand the problem better",
    messages: convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse();
}
