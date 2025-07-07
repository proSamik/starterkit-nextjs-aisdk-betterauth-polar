"use client";

import { Message } from "ai";
import { Loader2, Edit2, Trash2, RotateCcw } from "lucide-react";
import Markdown from "react-markdown";
import { useState } from "react";

import { ToolDisplay } from "@/components/tool-display";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Bot, User } from "lucide-react";
import { FilePreview } from "@/components/file-preview";

export interface ChatListProps {
  messages: Message[];
  onEditMessage?: (messageIndex: number, newContent: string) => void;
  onDeleteMessage?: (messageIndex: number) => void;
  onRegenerateResponse?: () => void;
  messageVersions: Record<
    string,
    { content: string; parts: Message["parts"] }[]
  >;
  onSwitchVersion: (messageId: string, versionIndex: number) => void;
}

/**
 * Displays attached files in the chat
 */
function AttachmentDisplay({
  attachment,
}: { attachment: { url: string; name?: string; contentType?: string } }) {
  return (
    <FilePreview
      file={{
        name: attachment.name || "Attachment",
        type: attachment.contentType || "application/octet-stream",
        url: attachment.url,
      }}
      showRemoveButton={false}
      className="max-w-sm"
    />
  );
}

export function ChatList({
  messages,
  onEditMessage,
  onDeleteMessage,
  onRegenerateResponse,
  messageVersions,
  onSwitchVersion,
}: ChatListProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editContent, setEditContent] = useState("");
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

  const handleStartEdit = (messageIndex: number, content: string) => {
    setEditingIndex(messageIndex);
    setEditContent(content);
  };

  const handleSaveEdit = async (messageIndex: number) => {
    if (onEditMessage && editContent.trim()) {
      onEditMessage(messageIndex, editContent.trim());
      setEditingIndex(null);
      setEditContent("");
    }
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditContent("");
  };

  return (
    <div className="relative mx-auto max-w-2xl px-4">
      {messages
        .filter((m) => m.role !== "system")
        .map((message, index) => {
          const isEditing = editingIndex === index;
          const isLastAssistantMessage =
            index === messages.length - 1 && message.role === "assistant";

          return (
            <div key={index} className={cn("group flex items-start py-4")}>
              <Avatar className="h-8 w-8 shrink-0">
                <AvatarFallback>
                  {message.role === "user" ? <User /> : <Bot />}
                </AvatarFallback>
              </Avatar>

              <div className="ml-4 flex-1 space-y-2 overflow-hidden px-1">
                {/* Editing mode */}
                {isEditing ? (
                  <div className="space-y-2">
                    <Textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="min-h-[100px]"
                      placeholder="Edit message..."
                    />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleSaveEdit(index)}
                        disabled={!editContent.trim()}
                      >
                        Save
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleCancelEdit}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Display message content */}
                    {!message.parts && <Markdown>{message.content}</Markdown>}

                    {/* Display attachments if any */}
                    {message.experimental_attachments && (
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        {message.experimental_attachments.map(
                          (attachment, idx) => (
                            <AttachmentDisplay
                              key={idx}
                              attachment={attachment}
                            />
                          ),
                        )}
                      </div>
                    )}

                    {/* Display tool invocations and message parts */}
                    {message.parts?.map((part, partIndex) => {
                      if (part.type === "text") {
                        return <Markdown key={partIndex}>{part.text}</Markdown>;
                      }
                      // reasoning parts:
                      if (part.type === "reasoning") {
                        return (
                          <pre key={index}>
                            {part.details.map((detail) =>
                              detail.type === "text"
                                ? detail.text
                                : "<redacted>",
                            )}
                          </pre>
                        );
                      }
                      if (part.type === "source") {
                        return (
                          <span key={`source-${part.source.id}`}>
                            [
                            <a href={part.source.url} target="_blank">
                              {part.source.title ??
                                new URL(part.source.url).hostname}
                            </a>
                            ]
                          </span>
                        );
                      } else if (
                        part.type === "file" &&
                        part.mimeType.startsWith("image/")
                      ) {
                        return (
                          <FilePreview
                            key={index}
                            file={{
                              name: `file-${index}`,
                              type: part.mimeType,
                              url: `data:${part.mimeType};base64,${part.data}`,
                            }}
                            showRemoveButton={false}
                            className="max-w-sm"
                          />
                        );
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
                                  Calling tool: {toolInvocation.toolName} with
                                  args: {JSON.stringify(toolInvocation.args)}
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

                    {/* Versioning UI */}
                    {messageVersions && messageVersions[message.id] && (
                      <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                        <span>Versions:</span>
                        {messageVersions[message.id].map((_, vIndex) => (
                          <Button
                            key={vIndex}
                            size="sm"
                            className="h-6 px-2"
                            variant={
                              message.content ===
                              messageVersions[message.id][vIndex].content
                                ? "secondary"
                                : "ghost"
                            }
                            onClick={() =>
                              onSwitchVersion?.(message.id, vIndex)
                            }
                          >
                            {vIndex + 1}
                          </Button>
                        ))}
                        <Button
                          key="latest"
                          size="sm"
                          className="h-6 px-2"
                          variant={
                            !messageVersions[message.id].some(
                              (v) => v.content === message.content,
                            )
                              ? "secondary"
                              : "ghost"
                          }
                          onClick={() =>
                            onSwitchVersion?.(
                              message.id,
                              messageVersions[message.id].length,
                            )
                          }
                        >
                          {messageVersions[message.id].length + 1}
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Action buttons - only show when not editing and when hovering */}
              {!isEditing &&
                (onEditMessage || onDeleteMessage || onRegenerateResponse) && (
                  <div className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center">
                    <div className="flex gap-1">
                      {/* Edit button */}
                      {message.role === "user" && onEditMessage && (
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() =>
                            handleStartEdit(index, message.content)
                          }
                          className="h-8 w-8"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                      )}
                      {/* Delete button */}
                      {onDeleteMessage && (
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => onDeleteMessage(index)}
                          className="h-8 w-8"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                      {/* Regenerate button */}
                      {isLastAssistantMessage && onRegenerateResponse && (
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={onRegenerateResponse}
                          className="h-8 w-8"
                        >
                          <RotateCcw className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                )}
            </div>
          );
        })}
    </div>
  );
}
