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

  try {
    const {
      messages,
      data,
      model,
    }: { messages: UIMessage[]; data?: { model: ModelId }; model?: ModelId } =
      await req.json();

    const modelId = data?.model || model;

    console.log(
      `API received model from data: ${data?.model}, from body: ${model}, using: ${modelId}`,
    );
    console.log(`API received ${messages.length} messages`);
    console.log(
      `Latest message:`,
      JSON.stringify(messages[messages.length - 1], null, 2),
    );

    if (!modelId || !MODELS[modelId]) {
      console.error(
        `Invalid model: ${modelId}. Available models:`,
        Object.keys(MODELS),
      );
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

    console.log(
      `Using AI model: ${modelId} -> ${MODELS[modelId]?.modelId || "Unknown"}`,
    );

    let coreMessages;
    try {
      console.log("Converting messages to core format...");
      coreMessages = convertToCoreMessages(messages);
      console.log("Message conversion successful");
    } catch (conversionError) {
      console.error("Error converting messages:", conversionError);
      return NextResponse.json(
        {
          error: `Message conversion failed: ${conversionError instanceof Error ? conversionError.message : "Unknown error"}`,
          type: "message_conversion_error",
        },
        { status: 400 },
      );
    }

    const result = streamText({
      model: MODELS[modelId],
      system:
        "do not respond on markdown or lists, keep your responses brief, you can ask the user to upload images or documents if it could help you understand the problem better",
      messages: coreMessages,
      tools: {
        calculate: calculatorTool,
        generateChart: chartGeneratorTool,
      },
    });

    return result.toDataStreamResponse({
      sendSources: true,
      sendReasoning: true,
      getErrorMessage: (error) => {
        console.error("Chat API Error:", error);

        if (error == null) {
          return "Unknown error occurred";
        }

        if (typeof error === "string") {
          return error;
        }

        if (error instanceof Error) {
          // Handle specific Anthropic error types
          if (
            error.message.includes("overloaded") ||
            error.message.includes("Overloaded")
          ) {
            return "Claude is currently experiencing high demand. Please try again in a few moments.";
          }

          if (
            error.message.includes("rate_limit") ||
            error.message.includes("429")
          ) {
            return "Rate limit exceeded. Please wait a moment before sending another message.";
          }

          if (
            error.message.includes("authentication") ||
            error.message.includes("401")
          ) {
            return "Authentication error. Please check your API configuration.";
          }

          if (
            error.message.includes("insufficient_quota") ||
            error.message.includes("quota")
          ) {
            return "API quota exceeded. Please check your usage limits.";
          }

          return error.message;
        }

        // Handle object errors (like from Anthropic API)
        if (typeof error === "object" && error !== null) {
          const errorObj = error as any;
          if (errorObj.type === "overloaded_error") {
            return "Claude is currently experiencing high demand. Please try again in a few moments.";
          }

          if (errorObj.type === "rate_limit_error") {
            return "Rate limit exceeded. Please wait a moment before sending another message.";
          }

          if (errorObj.message) {
            return errorObj.message;
          }
        }

        return JSON.stringify(error);
      },
    });
  } catch (error: any) {
    console.error("Chat API Route Error:", error);

    // Handle specific error types
    if (
      error?.type === "overloaded_error" ||
      error?.message?.includes("overloaded")
    ) {
      return NextResponse.json(
        {
          error:
            "Claude is currently experiencing high demand. Please try again in a few moments.",
          type: "overloaded_error",
        },
        { status: 503 },
      );
    }

    if (error?.status === 429 || error?.message?.includes("rate_limit")) {
      return NextResponse.json(
        {
          error:
            "Rate limit exceeded. Please wait a moment before sending another message.",
          type: "rate_limit_error",
        },
        { status: 429 },
      );
    }

    if (error?.status === 401 || error?.message?.includes("authentication")) {
      return NextResponse.json(
        {
          error: "Authentication error. Please check your API configuration.",
          type: "auth_error",
        },
        { status: 401 },
      );
    }

    // Generic server error
    return NextResponse.json(
      {
        error: "Internal server error. Please try again later.",
        type: "server_error",
      },
      { status: 500 },
    );
  }
}
