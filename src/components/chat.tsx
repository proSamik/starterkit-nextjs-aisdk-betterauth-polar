"use client";

import { useChat } from "@ai-sdk/react";
import { nanoid } from "nanoid";
import { htmlToText } from "html-to-text";
import {
  useMemo,
  useRef,
  useState,
  DragEvent,
  useCallback,
  useEffect,
} from "react";
import { UIMessage } from "ai";
import { CircleIcon, ArrowUpCircle, PaperclipIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ChatList } from "@/components/chat-list";
import { ModelId } from "@/lib/ai-models";
import { TiptapEditor } from "@/components/tiptap-editor";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { ModelSelector } from "@/components/ui/model-selector";
import { FilePreviewGrid } from "@/components/file-preview";
import { useChatStore } from "@/app/store";

interface ChatProps {
  model: ModelId;
  threadId?: string;
  onModelChange?: (model: ModelId) => void;
}

/**
 * Generate a thread title from the first user message
 */
const generateTitleFromMessage = (content: string): string => {
  console.log("generateTitleFromMessage - input:", content);

  if (!content || content.trim().length === 0) {
    console.log(
      "generateTitleFromMessage - empty content, returning 'New Chat'",
    );
    return "New Chat";
  }

  // Convert HTML to plain text if needed (content should already be plain text now)
  let plainText = content;
  if (content.includes("<") || content.includes(">")) {
    console.log(
      "generateTitleFromMessage - HTML detected, converting to plain text",
    );
    plainText = htmlToText(content, {
      wordwrap: false,
      selectors: [
        { selector: "img", format: "skip" },
        { selector: "a", options: { ignoreHref: true } },
      ],
    }).trim();
  }

  console.log("generateTitleFromMessage - plain text:", plainText);

  // Extract first sentence or first 60 characters
  const sentences = plainText.split(/[.!?]+/);
  let title = sentences[0]?.trim() || plainText;

  console.log("generateTitleFromMessage - first sentence:", title);

  // Truncate if too long
  if (title.length > 60) {
    title = title.substring(0, 57) + "...";
    console.log("generateTitleFromMessage - truncated:", title);
  }

  // Fallback if empty
  if (!title || title.length < 3) {
    console.log("generateTitleFromMessage - too short, returning 'New Chat'");
    return "New Chat";
  }

  console.log("generateTitleFromMessage - final title:", title);
  return title;
};

/**
 * Chat component for AI conversation with tool support and persistence.
 * Uses useChat hook with id and initialMessages for thread persistence.
 */
export default function Chat({
  model: initialModel,
  threadId,
  onModelChange,
}: ChatProps) {
  const [model, setModel] = useState<ModelId>(initialModel);

  const { getThread, updateThreadMessages, updateThread } = useChatStore();

  // Sync model with thread model when threadId or initialModel changes
  useEffect(() => {
    if (threadId) {
      const thread = getThread(threadId);
      if (thread?.model && thread.model !== model) {
        console.log(
          `Chat component syncing model from thread: ${thread.model}`,
        );
        setModel(thread.model as ModelId);
      }
    } else {
      // For new chats without threadId, use the initialModel
      setModel(initialModel);
    }
  }, [threadId, initialModel, getThread, model]);

  // Handle model changes
  const handleModelChange = useCallback(
    (newModel: ModelId) => {
      console.log(`Chat component model changed to: ${newModel}`);
      setModel(newModel);
      onModelChange?.(newModel);
    },
    [onModelChange],
  );

  // Get initial messages from store if threadId exists
  const initialMessages = useMemo<UIMessage[]>(() => {
    if (threadId) {
      const thread = getThread(threadId);
      if (thread?.messages) {
        return thread.messages;
      }
    }

    // Default system message for new chats
    return [
      {
        id: nanoid(),
        role: "system",
        content: "You are a helpful assistant. You have access to tools.",
        parts: [
          {
            type: "text",
            text: "You are a helpful assistant. You have access to tools.",
          },
        ],
      },
    ];
  }, [threadId, getThread]);

  const { messages, append, status, input, setInput, setMessages, reload } =
    useChat({
      api: "/api/chat",
      id: threadId, // This enables persistence for the specific thread
      initialMessages,
      experimental_throttle: 50,
      onFinish: (message) => {
        console.log("Finished streaming message:", message);
        // Update the store with the new messages
        if (threadId) {
          // Convert Message to UIMessage format
          const uiMessage: UIMessage = {
            ...message,
            parts: message.parts || [{ type: "text", text: message.content }],
          };
          const updatedMessages = [...messages, uiMessage];
          updateThreadMessages(threadId, updatedMessages);

          // Title generation now happens immediately when user sends message
          // No need to generate title here in the AI response callback
        }
      },
      onError: (error) => {
        console.error("Chat error:", error);
        toast.error("An error occurred. Please try again.");
      },
      onResponse: (response) => {
        console.log("Received HTTP response from server:", response);
      },
    });

  // Sync messages with store when they change
  useEffect(() => {
    if (threadId && messages.length > 0) {
      updateThreadMessages(threadId, messages);
    }
  }, [messages, threadId, updateThreadMessages]);

  const [uploadedFiles, setUploadedFiles] = useState<
    Array<{ name: string; type: string; url: string; size?: number }>
  >([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [loadingPreviews, setLoadingPreviews] = useState<Set<string>>(
    new Set(),
  );
  const [messageVersions, setMessageVersions] = useState<
    Record<string, { content: string; parts: UIMessage["parts"] }[]>
  >({});
  const [uploadingFiles, setUploadingFiles] = useState<
    Array<{ name: string; type: string }>
  >([]);

  const handlePreviewLoad = (url: string) => {
    setLoadingPreviews((prev) => {
      const newSet = new Set(prev);
      newSet.delete(url);
      return newSet;
    });
  };

  const handleFileSelected = async (selectedFiles: FileList) => {
    if (!selectedFiles || selectedFiles.length === 0) return;

    const validFiles = Array.from(selectedFiles).filter(
      (file) =>
        file.type.startsWith("image/") || file.type === "application/pdf",
    );
    if (validFiles.length !== selectedFiles.length) {
      toast.error("Only image and PDF files are allowed");
      return;
    }

    // Add files to uploading state
    setUploadingFiles(
      validFiles.map((file) => ({
        name: file.name,
        type: file.type,
      })),
    );

    const dataTransfer = new DataTransfer();
    validFiles.forEach((file) => dataTransfer.items.add(file));

    setIsUploading(true);
    try {
      const newUploadedFiles = await uploadFiles(dataTransfer.files);
      setUploadedFiles((prev) => [...prev, ...newUploadedFiles]);

      // Track new previews that need to load
      const newUrls = newUploadedFiles.map((f) => f.url);
      setLoadingPreviews((prev) => new Set([...prev, ...newUrls]));
    } catch (error: any) {
      toast.error(error.message || "File upload failed.");
    } finally {
      setIsUploading(false);
      setUploadingFiles([]); // Clear uploading files
    }
  };

  const handleTiptapChange = (value: string) => {
    setInput(value);
  };

  const handlePaste = (event: React.ClipboardEvent) => {
    const items = event.clipboardData?.items;
    if (items) {
      const dataTransfer = new DataTransfer();
      Array.from(items).forEach((item) => {
        const file = item.getAsFile();
        if (file) {
          dataTransfer.items.add(file);
        }
      });
      if (dataTransfer.files.length > 0) {
        handleFileSelected(dataTransfer.files);
      }
    }
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    if (event.dataTransfer.files) {
      handleFileSelected(event.dataTransfer.files);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      handleFileSelected(event.target.files);
      if (event.target) event.target.value = ""; // Reset file input
    }
  };

  const removeUploadedFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  /**
   * Upload files to Cloudflare R2 and return URLs
   */
  const uploadFiles = async (
    fileList: FileList,
  ): Promise<
    Array<{ name: string; type: string; url: string; size?: number }>
  > => {
    const formData = new FormData();
    Array.from(fileList).forEach((file) => {
      formData.append("files", file);
    });

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Upload failed");
    }

    const result = await response.json();
    return result.files;
  };

  /**
   * Handle form submission with file attachments and retry logic for API errors
   */
  const customHandleSubmit = async () => {
    if (input.trim().length === 0 && uploadedFiles.length === 0) return;

    // Convert HTML input to plain text for storage but keep HTML for sending
    const htmlContent = input.trim();
    const plainTextContent = htmlToText(htmlContent, {
      wordwrap: false,
      selectors: [
        { selector: "img", format: "skip" },
        { selector: "a", options: { ignoreHref: true } },
      ],
    }).trim();

    console.log("Original HTML:", htmlContent);
    console.log("Converted to plain text:", plainTextContent);

    const messageToSend = htmlContent; // Send HTML to API for processing
    const messageToStore = plainTextContent; // Store plain text
    const attachments = uploadedFiles;

    // Clear input immediately for UX
    setInput("");
    setUploadedFiles([]);

    // Log attachments being sent (no processing needed - use R2 URLs directly)
    if (attachments && attachments.length > 0) {
      console.log(
        "Sending attachments as URLs:",
        attachments.map((f) => ({ name: f.name, type: f.type, url: f.url })),
      );
    }

    // Create proper attachment objects for AI SDK
    const sdkAttachments = attachments.map((file) => ({
      name: file.name,
      contentType: file.type,
      url: file.url,
    }));

    const message: UIMessage = {
      id: nanoid(),
      role: "user",
      content: messageToStore, // Store plain text instead of HTML
      parts: [
        {
          type: "text" as const,
          text: messageToStore, // Store plain text in parts
        },
      ],
      experimental_attachments: sdkAttachments,
    };

    // Generate title from first user message immediately (don't wait for AI response)
    if (threadId && messageToStore.trim()) {
      const thread = getThread(threadId);
      console.log("Checking if should generate title:", {
        threadExists: !!thread,
        currentTitle: thread?.title,
        shouldGenerate: !thread?.title || thread?.title === "New Chat",
        messageCount: messages.length,
      });

      if (
        thread &&
        (!thread.title || thread.title === "New Chat") &&
        messages.length === 1
      ) {
        // This is the first user message in a new thread
        console.log(
          "Generating title from first user message:",
          messageToStore,
        );
        const generatedTitle = generateTitleFromMessage(messageToStore);
        console.log("Generated title immediately:", generatedTitle);
        updateThread(threadId, { title: generatedTitle });
      }
    }

    try {
      console.log(`Sending message with model: ${model}`);
      console.log(`Message content:`, messageToSend);
      console.log(`Full message object:`, JSON.stringify(message, null, 2));

      // Retry logic with exponential backoff for handling overloaded errors
      await retryWithBackoff(async () => {
        await append(message, {
          body: {
            model,
          },
          data: {
            model,
            experimental_model_id: model,
          },
          experimental_attachments:
            sdkAttachments.length > 0 ? sdkAttachments : undefined,
        });
      });
    } catch (error: any) {
      console.error("Failed to send message after retries:", error);

      // Handle specific error types
      if (
        error?.message?.includes("overloaded") ||
        error?.type === "overloaded_error"
      ) {
        toast.error(
          "Claude is currently overloaded. Please try again in a few moments.",
        );
      } else if (
        error?.message?.includes("rate_limit") ||
        error?.status === 429
      ) {
        toast.error(
          "Rate limit exceeded. Please wait a moment before sending another message.",
        );
      } else {
        toast.error("Failed to send message. Please try again.");
      }
    }
  };

  /**
   * Retry function with exponential backoff for handling API errors
   */
  const retryWithBackoff = async (
    fn: () => Promise<void>,
    maxRetries: number = 3,
    baseDelay: number = 1000,
  ): Promise<void> => {
    let lastError: any;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        await fn();
        return; // Success, exit the retry loop
      } catch (error: any) {
        lastError = error;

        // Don't retry for certain errors
        if (error?.status === 401 || error?.status === 403) {
          throw error; // Authentication/authorization errors shouldn't be retried
        }

        // If this was the last attempt, throw the error
        if (attempt === maxRetries) {
          throw error;
        }

        // Calculate delay with exponential backoff
        const delay = baseDelay * Math.pow(2, attempt);
        const jitter = Math.random() * 0.1 * delay; // Add 10% jitter
        const totalDelay = delay + jitter;

        console.log(
          `Attempt ${attempt + 1} failed, retrying in ${Math.round(totalDelay)}ms...`,
          error?.message,
        );

        // Show user-friendly message for retries
        if (attempt === 0) {
          if (
            error?.message?.includes("overloaded") ||
            error?.type === "overloaded_error"
          ) {
            toast.loading("Claude is busy, retrying...", {
              duration: totalDelay,
            });
          } else {
            toast.loading("Retrying...", { duration: totalDelay });
          }
        }

        await new Promise((resolve) => setTimeout(resolve, totalDelay));
      }
    }

    throw lastError;
  };

  const isLoading =
    status === "submitted" || status === "streaming" || isUploading;

  /**
   * Edit a message at a specific index
   */
  const editMessage = async (messageIndex: number, newContent: string) => {
    const historyToEdit = messages.slice(0, messageIndex + 1);

    historyToEdit[messageIndex] = {
      ...historyToEdit[messageIndex],
      content: newContent,
    };

    // When a user message is edited, clear any existing versions for subsequent assistant messages
    if (messages[messageIndex + 1]) {
      const assistantMessageId = messages[messageIndex + 1].id;
      setMessageVersions((prev) => {
        const newVersions = { ...prev };
        delete newVersions[assistantMessageId];
        return newVersions;
      });
    }

    setMessages(historyToEdit);

    // Update store with edited messages
    if (threadId) {
      updateThreadMessages(threadId, historyToEdit);
    }

    console.log(`Reloading with model: ${model}`);

    // Pass model information to reload function
    await reload({
      body: {
        model,
      },
      data: {
        model,
        experimental_model_id: model,
      },
    });
  };

  /**
   * Delete a message at a specific index
   */
  const deleteMessage = (messageIndex: number) => {
    const updatedMessages = messages.filter(
      (_, index) => index !== messageIndex,
    );
    setMessages(updatedMessages);

    // Update store with remaining messages
    if (threadId) {
      updateThreadMessages(threadId, updatedMessages);
    }
  };

  /**
   * Regenerate the last assistant message
   */
  const regenerateLastResponse = async () => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && lastMessage.role === "assistant") {
      // Store the current version before reloading
      setMessageVersions((prev) => {
        const existingVersions = prev[lastMessage.id] ?? [];
        // Add the current last message content as a "version"
        const allVersions = [
          ...existingVersions,
          { content: lastMessage.content, parts: lastMessage.parts },
        ];
        return { ...prev, [lastMessage.id]: allVersions };
      });

      try {
        await reload();
      } catch (error) {
        console.error("Error regenerating response:", error);
        toast.error("Failed to regenerate response. Please try again.");
      }
    } else {
      toast.error("No assistant message to regenerate.");
    }
  };

  const handleSwitchVersion = (messageId: string, versionIndex: number) => {
    const allVersions = [
      ...(messageVersions[messageId] ?? []),
      {
        content: messages.find((m) => m.id === messageId)?.content ?? "",
        parts: messages.find((m) => m.id === messageId)?.parts,
      },
    ];
    const targetVersion = allVersions[versionIndex];

    if (targetVersion) {
      const updatedMessages = messages.map((msg) =>
        msg.id === messageId
          ? {
              ...msg,
              ...targetVersion,
              parts: targetVersion.parts || [
                { type: "text", text: targetVersion.content },
              ],
            }
          : msg,
      );
      setMessages(updatedMessages);

      // Update store with version-switched messages
      if (threadId) {
        updateThreadMessages(threadId, updatedMessages);
      }
    }
  };

  return (
    <Card
      className="h-full flex flex-col bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <CardContent className="flex-grow overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
        {/* Only show model selector if onModelChange is not provided (for standalone usage) */}
        {!onModelChange && (
          <div className="flex justify-end mb-4">
            <ModelSelector value={model} onValueChange={handleModelChange} />
          </div>
        )}
        <div className="flex-1 overflow-y-auto">
          <ChatList
            messages={messages}
            onEditMessage={editMessage}
            onDeleteMessage={deleteMessage}
            onRegenerateResponse={regenerateLastResponse}
            messageVersions={messageVersions}
            onSwitchVersion={handleSwitchVersion}
          />
        </div>
        <AnimatePresence>
          {isDragging && (
            <motion.div
              className="fixed inset-0 pointer-events-none bg-background/90 z-50 flex items-center justify-center flex-col gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="text-lg">Drag and drop files here</div>
              <div className="text-sm text-muted-foreground">
                (images and PDF files)
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
      <CardFooter className="p-4 border-t border-border/50 bg-gradient-to-t from-background to-background/95 shrink-0">
        <div className="flex flex-col w-full gap-2">
          <AnimatePresence>
            {(uploadedFiles.length > 0 || uploadingFiles.length > 0) && (
              <motion.div
                className="w-full p-2 border border-border/50 rounded-lg bg-muted/30"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
              >
                <FilePreviewGrid
                  files={uploadedFiles}
                  onRemoveFile={removeUploadedFile}
                  uploadingFiles={uploadingFiles}
                  onFileLoaded={(url: string) => handlePreviewLoad(url)}
                />
              </motion.div>
            )}
          </AnimatePresence>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void customHandleSubmit();
            }}
            className="flex items-end space-x-4 w-full"
          >
            {/* Hidden file input */}
            <input
              type="file"
              multiple
              accept="image/*,.pdf,application/pdf"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileChange}
            />

            <motion.div
              className="flex-1 relative"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <TiptapEditor
                value={input || ""}
                onChange={handleTiptapChange}
                onSubmit={() => void customHandleSubmit()}
                onPaste={handlePaste}
              />
              <div
                className={cn(
                  "absolute inset-0 rounded-lg pointer-events-none transition-opacity duration-200",
                  "bg-gradient-to-t from-background/10 to-transparent",
                  isLoading ? "opacity-50" : "opacity-0",
                )}
              />
            </motion.div>

            <div className="flex gap-2">
              <Button
                type="button"
                size="icon"
                variant="ghost"
                onClick={handleUploadClick}
                className="rounded-full h-10 w-10"
                disabled={isLoading}
              >
                <PaperclipIcon className="h-5 w-5" />
              </Button>

              <AnimatePresence mode="wait">
                <motion.div
                  key={isLoading ? "loading" : "ready"}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Button
                    type="submit"
                    size="icon"
                    variant={isLoading ? "ghost" : "default"}
                    className={cn(
                      "rounded-full h-10 w-10 flex items-center justify-center transition-all duration-200",
                      isLoading
                        ? "bg-muted hover:bg-muted"
                        : "shadow-lg hover:shadow-xl",
                      !input.trim() &&
                        uploadedFiles.length === 0 &&
                        "opacity-50",
                    )}
                    disabled={
                      isLoading ||
                      (!input.trim() && uploadedFiles.length === 0) ||
                      loadingPreviews.size > 0
                    }
                  >
                    {isLoading || loadingPreviews.size > 0 ? (
                      <CircleIcon className="h-5 w-5 animate-pulse text-muted-foreground" />
                    ) : (
                      <ArrowUpCircle className="h-5 w-5 text-primary-foreground" />
                    )}
                  </Button>
                </motion.div>
              </AnimatePresence>
            </div>
          </form>
        </div>
      </CardFooter>
    </Card>
  );
}
