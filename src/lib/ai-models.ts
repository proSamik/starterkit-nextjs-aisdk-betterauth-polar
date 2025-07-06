import { createAnthropic } from "@ai-sdk/anthropic";
import { createOpenAI } from "@ai-sdk/openai";

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const anthropic = createAnthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export const MODELS = {
  "gpt-4o": openai("gpt-4o"),
  "claude-3-5-sonnet-latest": anthropic("claude-3-5-sonnet-20240620"),
} as const;

export type ModelId = keyof typeof MODELS;
