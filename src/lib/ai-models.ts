import { createAnthropic } from "@ai-sdk/anthropic";
import { createOpenAI } from "@ai-sdk/openai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const anthropic = createAnthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});

export const MODELS = {
  "gpt-4o": openai("gpt-4o"),
  "claude-3-5-sonnet-latest": anthropic("claude-3-5-sonnet-20240620"),
  "gemini-2.0-flash-exp": google("gemini-2.0-flash-exp"),
  "gemini-2.5-flash": google("gemini-2.5-flash"),
  "gemini-1.5-flash": google("gemini-1.5-flash"),
  "gemini-1.5-pro": google("gemini-1.5-pro"),
} as const;

export type ModelId = keyof typeof MODELS;
