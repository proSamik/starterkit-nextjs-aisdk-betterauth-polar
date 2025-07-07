import { createAnthropic } from "@ai-sdk/anthropic";
import { createOpenAI } from "@ai-sdk/openai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const anthropic = createAnthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});

export const MODELS = {
  "gpt-4o": openai("gpt-4o"),
  "claude-3-5-sonnet-latest": anthropic("claude-3-5-sonnet-20240620"),
  "gemini-2.0-flash-exp": google("gemini-2.0-flash-exp"),
  "gemini-2.5-flash": google("gemini-2.5-flash"),
  "gemini-1.5-flash": google("gemini-1.5-flash"),
  "gemini-1.5-pro": google("gemini-1.5-pro"),
  "llama-3-8b": openrouter("meta-llama/llama-3-8b-instruct"),
  // "deepseek-r1-0528-qwen3-8b": openrouter("deepseek/deepseek-r1-0528-qwen3-8b:free"),
  // "qwen-2-7b": openrouter("qwen/qwen-2-7b-instruct"),
  // "qwen-32b-chat": openrouter("qwen/qwen-32b-instruct"),
} as const;

export type ModelId = keyof typeof MODELS;
