"use client";

import { useChat } from "@ai-sdk/react";
import { nanoid } from "nanoid";
import { htmlToText } from "html-to-text";
import { useMemo, useRef, useState, useEffect, DragEvent } from "react";
import { UIMessage } from "ai";
import { CircleIcon, ArrowUpCircle, PaperclipIcon, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ChatList } from "@/components/chat-list";
import { ModelId } from "@/lib/ai-models";
import { TiptapEditor } from "@/components/tiptap-editor";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { ModelSelector } from "@/components/ui/model-selector";

/**
 * Component to preview text file content
 */
function TextFilePreview({ file }: { file: File }) {
  const [content, setContent] = useState<string>("");

  useEffect(() => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result;
      setContent(typeof text === "string" ? text.slice(0, 100) : "");
    };
    reader.readAsText(file);
  }, [file]);

  return (
    <div>
      {content}
      {content.length >= 100 && "..."}
    </div>
  );
}

/**
 * Chat component for AI conversation with tool support.
 * Uses useChat hook and memoizes initialMessages to prevent infinite render loop.
 */
export default function Chat({ model: initialModel }: { model: ModelId }) {
  const [model, setModel] = useState<ModelId>(initialModel);
  const initialMessages = useMemo<UIMessage[]>(
    () => [
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
    ],
    [],
  );

  const { messages, append, status, input, setInput } = useChat({
    api: "/api/chat",
    initialMessages,
    onError: () => toast.error("An error occurred. Please try again."),
  });

  const [files, setFiles] = useState<FileList | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleTiptapChange = (value: string) => {
    setInput(value);
  };

  const handlePaste = (event: React.ClipboardEvent) => {
    const items = event.clipboardData?.items;

    if (items) {
      const newFiles = Array.from(items)
        .map((item) => item.getAsFile())
        .filter((file): file is File => file !== null);

      if (newFiles.length > 0) {
        const validFiles = newFiles.filter(
          (file) =>
            file.type.startsWith("image/") || file.type.startsWith("text/"),
        );

        if (validFiles.length === newFiles.length) {
          const dataTransfer = new DataTransfer();

          // Add existing files if any
          if (files) {
            Array.from(files).forEach((file) => dataTransfer.items.add(file));
          }

          // Add new files
          validFiles.forEach((file) => dataTransfer.items.add(file));

          setFiles(dataTransfer.files);
        } else {
          toast.error("Only image and text files are allowed");
        }
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
    const droppedFiles = event.dataTransfer.files;
    const droppedFilesArray = Array.from(droppedFiles);
    if (droppedFilesArray.length > 0) {
      const validFiles = droppedFilesArray.filter(
        (file) =>
          file.type.startsWith("image/") || file.type.startsWith("text/"),
      );

      if (validFiles.length === droppedFilesArray.length) {
        const dataTransfer = new DataTransfer();

        // Add existing files if any
        if (files) {
          Array.from(files).forEach((file) => dataTransfer.items.add(file));
        }

        // Add new files
        validFiles.forEach((file) => dataTransfer.items.add(file));

        setFiles(dataTransfer.files);
      } else {
        toast.error("Only image and text files are allowed!");
      }
    }
    setIsDragging(false);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (selectedFiles) {
      const validFiles = Array.from(selectedFiles).filter(
        (file) =>
          file.type.startsWith("image/") || file.type.startsWith("text/"),
      );

      if (validFiles.length === selectedFiles.length) {
        const dataTransfer = new DataTransfer();

        // Add existing files if any
        if (files) {
          Array.from(files).forEach((file) => dataTransfer.items.add(file));
        }

        // Add new files
        validFiles.forEach((file) => dataTransfer.items.add(file));

        setFiles(dataTransfer.files);
      } else {
        toast.error("Only image and text files are allowed");
      }
    }
  };

  const removeFile = (index: number) => {
    if (!files) return;
    const dataTransfer = new DataTransfer();
    Array.from(files).forEach((file, i) => {
      if (i !== index) {
        dataTransfer.items.add(file);
      }
    });
    setFiles(dataTransfer.files);
  };

  const customHandleSubmit = async () => {
    const textInput = htmlToText(input);
    if (!textInput.trim()) return;

    // Store files in a local variable before clearing
    const currentFiles = files;

    // Clear input and files immediately for better UX
    setInput("");
    setFiles(null);

    try {
      // Convert FileList to array of base64 strings for JSON compatibility
      const fileContents = currentFiles
        ? await Promise.all(
            Array.from(currentFiles).map(
              (file) =>
                new Promise<{ url: string; name: string; contentType: string }>(
                  (resolve, reject) => {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      const result = reader.result;
                      if (typeof result === "string") {
                        // For text files, we want to keep the text content
                        if (file.type.startsWith("text/")) {
                          resolve({
                            url: result,
                            name: file.name,
                            contentType: file.type,
                          });
                        } else {
                          // For images, we need to ensure it's a data URL
                          const dataUrl = result.startsWith("data:")
                            ? result
                            : `data:${file.type};base64,${btoa(result)}`;
                          resolve({
                            url: dataUrl,
                            name: file.name,
                            contentType: file.type,
                          });
                        }
                      } else {
                        reject(new Error("Failed to read file"));
                      }
                    };
                    reader.onerror = () => reject(reader.error);

                    if (file.type.startsWith("text/")) {
                      reader.readAsText(file);
                    } else {
                      reader.readAsDataURL(file);
                    }
                  },
                ),
            ),
          )
        : [];

      // Create message with attachments
      const message = {
        id: nanoid(),
        content: textInput,
        role: "user" as const,
        experimental_attachments: fileContents,
      };

      try {
        await append(message, {
          data: {
            model,
            experimental_model_id: model,
          },
        });
      } catch (error) {
        console.error("Error sending message:", error);
        toast.error("Failed to send message. Please try again.");
      }
    } catch (error) {
      console.error("Error processing files:", error);
      toast.error("Failed to process attached files. Please try again.");
    }
  };

  const isLoading = status === "submitted" || status === "streaming";

  return (
    <Card
      className="h-full flex flex-col bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <CardContent className="flex-grow overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
        <div className="flex justify-end mb-4">
          <ModelSelector value={model} onValueChange={setModel} />
        </div>
        <ChatList messages={messages} />
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
                (images and text files)
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
      <CardFooter className="p-4 border-t border-border/50 bg-gradient-to-t from-background to-background/95">
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
            accept="image/*,text/*"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileChange}
          />

          <div className="flex-1 relative flex flex-col gap-2">
            <AnimatePresence>
              {files && (
                <motion.div
                  className="flex flex-wrap gap-2 p-2 border border-border/50 rounded-lg bg-muted/30"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                >
                  {Array.from(files).map((file, index) => (
                    <motion.div
                      key={file.name}
                      className="relative group"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                    >
                      {file.type.startsWith("image") ? (
                        <div className="relative">
                          <img
                            src={URL.createObjectURL(file)}
                            alt={file.name}
                            className="rounded-md w-16 h-16 object-cover"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-md" />
                        </div>
                      ) : file.type.startsWith("text") ? (
                        <div className="text-[8px] leading-1 w-28 h-16 overflow-hidden text-zinc-500 border p-2 rounded-lg bg-white dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-400">
                          <TextFilePreview file={file} />
                        </div>
                      ) : null}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          removeFile(index);
                        }}
                        className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

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
          </div>

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
                    !input.trim() && "opacity-50",
                  )}
                  disabled={isLoading || !input.trim()}
                >
                  {isLoading ? (
                    <CircleIcon className="h-5 w-5 animate-pulse text-muted-foreground" />
                  ) : (
                    <ArrowUpCircle className="h-5 w-5 text-primary-foreground" />
                  )}
                </Button>
              </motion.div>
            </AnimatePresence>
          </div>
        </form>
      </CardFooter>
    </Card>
  );
}
