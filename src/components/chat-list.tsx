"use client";

import { Message } from "ai";
import { Loader2 } from "lucide-react";
import Markdown from "react-markdown";

import { ToolDisplay } from "@/components/tool-display";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bot, User } from "lucide-react";

interface ChatListProps {
  messages: Message[];
}

/**
 * Determines if a string is a base64 encoded image
 */
function isBase64Image(str: string) {
  return str.startsWith("data:image/");
}

/**
 * Displays attached files in the chat
 */
function AttachmentDisplay({ content }: { content: string }) {
  if (isBase64Image(content)) {
    return (
      <img
        src={content}
        alt="Attached image"
        className="max-w-sm rounded-lg shadow-md"
      />
    );
  }
  return (
    <div className="max-w-sm p-3 bg-muted rounded-lg">
      <pre className="whitespace-pre-wrap text-sm">{content}</pre>
    </div>
  );
}

export function ChatList({ messages }: ChatListProps) {
  if (!messages.filter((m) => m.role !== "system").length) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold">AI Chat</h2>
          <p className="text-muted-foreground">
            Start a conversation by typing below.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative mx-auto max-w-2xl px-4">
      {messages
        .filter((m) => m.role !== "system")
        .map((message, index) => (
          <div key={index} className={cn("flex items-start py-4")}>
            <Avatar className="h-8 w-8 shrink-0">
              <AvatarFallback>
                {message.role === "user" ? <User /> : <Bot />}
              </AvatarFallback>
            </Avatar>
            <div className="ml-4 flex-1 space-y-2 overflow-hidden px-1">
              {/* Display message content */}
              {!message.parts && <Markdown>{message.content}</Markdown>}

              {/* Display attachments if any */}
              {message.experimental_attachments && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {message.experimental_attachments.map((attachment, idx) => (
                    <AttachmentDisplay key={idx} content={attachment.url} />
                  ))}
                </div>
              )}

              {/* Display tool invocations and message parts */}
              {message.parts?.map((part, index) => {
                if (part.type === "text") {
                  return <Markdown key={index}>{part.text}</Markdown>;
                }
                if (part.type === "tool-invocation") {
                  const { toolInvocation } = part;
                  if (toolInvocation.state === "call") {
                    return (
                      <div
                        key={toolInvocation.toolCallId}
                        className="p-4 my-2 border rounded-lg bg-muted"
                      >
                        <div className="flex items-center gap-2">
                          <Loader2 className="animate-spin" />
                          <p className="text-sm">
                            Calling tool: {toolInvocation.toolName} with args:{" "}
                            {JSON.stringify(toolInvocation.args)}
                          </p>
                        </div>
                      </div>
                    );
                  }
                  if (toolInvocation.state === "result") {
                    return (
                      <ToolDisplay
                        key={toolInvocation.toolCallId}
                        toolName={toolInvocation.toolName}
                        result={toolInvocation.result}
                      />
                    );
                  }
                }
              })}
            </div>
          </div>
        ))}
    </div>
  );
}
