"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { htmlToText } from "html-to-text";
import { useChatStore, useThreads, type ChatThread } from "@/app/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  MessageSquare,
  Plus,
  Trash2,
  MoreVertical,
  Calendar,
  Edit3,
  Check,
  X,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ChatThreadListProps {
  className?: string;
}

/**
 * Chat thread list component for displaying and managing chat threads
 */
export function ChatThreadList({ className }: ChatThreadListProps) {
  const router = useRouter();
  const threads = useThreads();
  const { createThread, deleteThread, updateThread } = useChatStore();
  const [isCreating, setIsCreating] = useState(false);
  const [editingThreadId, setEditingThreadId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");

  /**
   * Create a new chat thread and navigate to it
   */
  const handleNewThread = async () => {
    if (isCreating) return;

    setIsCreating(true);
    try {
      const newThread = createThread();
      router.push(`/app/chat/${newThread.id}`);
      toast.success("New chat created!");
    } catch (error) {
      console.error("Error creating thread:", error);
      toast.error("Failed to create new chat");
    } finally {
      setIsCreating(false);
    }
  };

  /**
   * Navigate to a specific thread
   */
  const handleSelectThread = (threadId: string) => {
    router.push(`/app/chat/${threadId}`);
  };

  /**
   * Delete a thread with confirmation
   */
  const handleDeleteThread = (threadId: string, threadTitle: string) => {
    if (confirm(`Are you sure you want to delete "${threadTitle}"?`)) {
      try {
        deleteThread(threadId);
        toast.success("Chat deleted");
      } catch (error) {
        console.error("Error deleting thread:", error);
        toast.error("Failed to delete chat");
      }
    }
  };

  /**
   * Start editing a thread title
   */
  const handleStartEditTitle = (threadId: string, currentTitle: string) => {
    setEditingThreadId(threadId);
    setEditingTitle(currentTitle || "");
  };

  /**
   * Save the edited title
   */
  const handleSaveTitle = (threadId: string) => {
    if (editingTitle.trim()) {
      updateThread(threadId, { title: editingTitle.trim() });
      toast.success("Title updated");
    }
    setEditingThreadId(null);
    setEditingTitle("");
  };

  /**
   * Cancel title editing
   */
  const handleCancelEdit = () => {
    setEditingThreadId(null);
    setEditingTitle("");
  };

  /**
   * Format thread date for display
   */
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return "Today";
    } else if (diffDays === 1) {
      return "Yesterday";
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  /**
   * Strip HTML tags manually as fallback
   */
  const stripHtml = (html: string): string => {
    // Remove HTML tags
    let text = html.replace(/<[^>]*>/g, "");
    // Decode HTML entities
    text = text.replace(/&nbsp;/g, " ");
    text = text.replace(/&lt;/g, "<");
    text = text.replace(/&gt;/g, ">");
    text = text.replace(/&amp;/g, "&");
    text = text.replace(/&quot;/g, '"');
    text = text.replace(/&#39;/g, "'");
    // Clean up whitespace
    return text.replace(/\s+/g, " ").trim();
  };

  /**
   * Get thread preview (first user message) - properly handles message parts like chat-list.tsx
   */
  const getThreadPreview = (thread: ChatThread) => {
    const firstUserMessage = thread.messages.find((m) => m.role === "user");
    if (firstUserMessage) {
      console.log("Full message object:", firstUserMessage);

      let contentToProcess = "";

      // Handle message parts like in chat-list.tsx
      if (firstUserMessage.parts && firstUserMessage.parts.length > 0) {
        // Find the first text part
        const textPart = firstUserMessage.parts.find(
          (part) => part.type === "text",
        );
        if (textPart && textPart.text) {
          contentToProcess = textPart.text;
          console.log("Using text from parts:", contentToProcess);
        } else {
          contentToProcess = firstUserMessage.content;
          console.log("No text parts found, using content:", contentToProcess);
        }
      } else {
        // No parts, use content directly
        contentToProcess = firstUserMessage.content;
        console.log("No parts, using content:", contentToProcess);
      }

      let plainText = "";

      try {
        // Try using html-to-text library first
        plainText = htmlToText(contentToProcess, {
          wordwrap: false,
          selectors: [
            { selector: "img", format: "skip" },
            { selector: "a", options: { ignoreHref: true } },
          ],
        }).trim();

        console.log("html-to-text result:", plainText);
      } catch (error) {
        console.error("html-to-text failed:", error);
        // Fallback to manual HTML stripping
        plainText = stripHtml(contentToProcess);
        console.log("Manual HTML strip result:", plainText);
      }

      // If still empty or has HTML, try manual stripping
      if (!plainText || plainText.includes("<") || plainText.includes(">")) {
        plainText = stripHtml(contentToProcess);
        console.log("Final fallback result:", plainText);
      }

      // Return truncated preview
      const preview =
        plainText.slice(0, 100) + (plainText.length > 100 ? "..." : "");

      console.log("Final preview:", preview);
      return preview;
    }
    return "No messages yet";
  };

  return (
    <div className={cn("h-full flex flex-col", className)}>
      {/* Header with new chat button */}
      <div className="p-4 border-b border-border/50">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Chats</h2>
          <Button
            onClick={handleNewThread}
            disabled={isCreating}
            size="sm"
            className="h-8"
          >
            <Plus className="h-4 w-4 mr-1" />
            New Chat
          </Button>
        </div>
      </div>

      {/* Thread list */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {threads.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No chats yet</h3>
            <p className="text-muted-foreground mb-4">
              Start a new conversation to see your chats here
            </p>
            <Button onClick={handleNewThread} disabled={isCreating}>
              <Plus className="h-4 w-4 mr-2" />
              Start New Chat
            </Button>
          </div>
        ) : (
          threads.map((thread) => (
            <Card
              key={thread.id}
              className="cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => handleSelectThread(thread.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {editingThreadId === thread.id ? (
                        <div className="flex items-center gap-2 flex-1">
                          <Input
                            value={editingTitle}
                            onChange={(e) => setEditingTitle(e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                            className="text-sm h-7"
                            placeholder="Enter thread title"
                            autoFocus
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                handleSaveTitle(thread.id);
                              } else if (e.key === "Escape") {
                                handleCancelEdit();
                              }
                            }}
                          />
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-6 w-6"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSaveTitle(thread.id);
                            }}
                          >
                            <Check className="h-3 w-3" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-6 w-6"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCancelEdit();
                            }}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ) : (
                        <>
                          <h3 className="font-medium truncate flex-1">
                            {thread.title || "Untitled Chat"}
                          </h3>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-6 w-6 opacity-0 group-hover:opacity-100"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStartEditTitle(
                                thread.id,
                                thread.title || "",
                              );
                            }}
                          >
                            <Edit3 className="h-3 w-3" />
                          </Button>
                        </>
                      )}
                      {thread.model && (
                        <Badge variant="secondary" className="text-xs">
                          {thread.model
                            .replace("claude-3-5-sonnet-latest", "Claude")
                            .replace("gpt-4o", "GPT-4o")}
                        </Badge>
                      )}
                    </div>

                    <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                      {getThreadPreview(thread)}
                    </p>

                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>{formatDate(thread.updatedAt)}</span>
                      <span>•</span>
                      <span>
                        {
                          thread.messages.filter((m) => m.role !== "system")
                            .length
                        }{" "}
                        messages
                      </span>
                    </div>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger
                      asChild
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 ml-2"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStartEditTitle(thread.id, thread.title || "");
                        }}
                      >
                        <Edit3 className="h-4 w-4 mr-2" />
                        Edit Title
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteThread(
                            thread.id,
                            thread.title || "Untitled Chat",
                          );
                        }}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
