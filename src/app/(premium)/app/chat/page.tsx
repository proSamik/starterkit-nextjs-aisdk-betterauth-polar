"use client";

import Chat from "@/components/chat";
import { ModelId } from "@/lib/ai-models";

/**
 * Main chat page component
 * Renders the chat interface with default model
 */
export default function ChatPage() {
  const defaultModel: ModelId = "claude-3-5-sonnet-latest";

  return (
    <div className="h-screen flex flex-col">
      <Chat model={defaultModel} />
    </div>
  );
}
