import { getSession } from "@/lib/auth/server";
import { MODELS, ModelId } from "@/lib/ai-models";
import { convertToCoreMessages, streamText, UIMessage } from "ai";
import { NextRequest, NextResponse } from "next/server";
import { calculatorTool } from "@/lib/ai-tools/calculator";
import { chartGeneratorTool } from "@/lib/ai-tools/chart-generator";

if (!process.env.OPENAI_API_KEY) {
  console.warn(
    "OPENAI_API_KEY is not set. The chat API will not work for OpenAI models.",
  );
}

if (!process.env.ANTHROPIC_API_KEY) {
  console.warn(
    "ANTHROPIC_API_KEY is not set. The chat API will not work for Anthropic models.",
  );
}

export async function POST(req: NextRequest) {
  const session = await getSession();

  if (!session?.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const {
    messages,
    data,
  }: { messages: UIMessage[]; data: { model: ModelId } } = await req.json();

  const modelId = data.model;

  if (!modelId || !MODELS[modelId]) {
    return NextResponse.json(
      { error: "Invalid model selected" },
      { status: 400 },
    );
  }

  if (modelId.startsWith("claude") && !process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: "Missing API Key for Anthropic" },
      { status: 500 },
    );
  }

  if (modelId.startsWith("gpt") && !process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: "Missing API Key for OpenAI" },
      { status: 500 },
    );
  }

  const result = streamText({
    model: MODELS[modelId],
    system:
      "do not respond on markdown or lists, keep your responses brief, you can ask the user to upload images or documents if it could help you understand the problem better",
    messages: convertToCoreMessages(messages),
    tools: {
      calculate: calculatorTool,
      generateChart: chartGeneratorTool,
    },
  });

  return result.toDataStreamResponse({
    sendSources: true,
    sendReasoning: true,
    getErrorMessage: (error) => {
      if (error == null) {
        return "unknown error";
      }

      if (typeof error === "string") {
        return error;
      }

      if (error instanceof Error) {
        return error.message;
      }

      return JSON.stringify(error);
    },
  });
}
