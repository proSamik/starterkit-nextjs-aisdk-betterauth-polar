"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useChatStore, useThread } from "@/app/store";
import Chat from "@/components/chat";
import { ModelId } from "@/lib/ai-models";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Menu, X } from "lucide-react";
import { ModelSelector } from "@/components/ui/model-selector";
import { ChatThreadList } from "@/components/chat-thread-list";
import { cn } from "@/lib/utils";

/**
 * Individual chat thread page component
 * Handles persistence for specific chat threads using threadId
 */
export default function ChatThreadPage() {
  const params = useParams();
  const router = useRouter();
  const threadId = params.threadId as string;

  const { getThread, createThread, setCurrentThread, updateThread } =
    useChatStore();

  const thread = useThread(threadId);
  const [model, setModel] = useState<ModelId>("gpt-4o"); // Use GPT-4o as default instead of Claude
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Initialize or validate thread on mount
  useEffect(() => {
    if (!threadId) {
      router.push("/app/chat");
      return;
    }

    const currentThread = getThread(threadId);

    // If thread doesn't exist, create it with the provided ID
    if (!currentThread) {
      // For new threads, we need to create them properly
      // Since we can't override the nanoid, we'll redirect to a new thread
      const newThread = createThread("New Chat", model);
      router.replace(`/app/chat/${newThread.id}`);
      return;
    }

    // Set as current thread and update model if needed
    setCurrentThread(threadId);
    if (currentThread.model && currentThread.model !== model) {
      console.log(
        `Loading thread ${threadId} with model: ${currentThread.model}`,
      );
      setModel(currentThread.model as ModelId);
    } else if (!currentThread.model) {
      // If thread doesn't have a model, set it to the current default
      console.log(`Setting default model for thread ${threadId}: ${model}`);
      updateThread(threadId, { model });
    }
  }, [
    threadId,
    getThread,
    createThread,
    setCurrentThread,
    updateThread,
    model,
    router,
  ]);

  // Handle model changes
  const handleModelChange = (newModel: ModelId) => {
    setModel(newModel);
    if (thread) {
      updateThread(threadId, { model: newModel });
    }
  };

  // Handle going back to chat list
  const handleBack = () => {
    router.push("/app/chat");
  };

  // Toggle sidebar visibility
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Show loading while thread is being set up
  if (!thread) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col relative">
      {/* Thread list sidebar - hidden by default */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 w-80 border-r border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-transform duration-300 z-40",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <ChatThreadList />
      </div>

      {/* Backdrop for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Header with navigation and controls */}
      <div
        className={cn(
          "flex items-center gap-4 p-4 border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-all duration-300",
          isSidebarOpen ? "lg:ml-80" : "ml-0",
        )}
      >
        {/* Sidebar toggle button */}
        <Button
          variant="outline"
          size="icon"
          onClick={toggleSidebar}
          className="h-8 w-8"
        >
          {isSidebarOpen ? (
            <X className="h-4 w-4" />
          ) : (
            <Menu className="h-4 w-4" />
          )}
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={handleBack}
          className="h-8 w-8"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>

        <div className="flex-1">
          <h1 className="text-lg font-semibold truncate">
            {thread.title || "Chat"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {new Date(thread.updatedAt).toLocaleDateString()}
          </p>
        </div>

        {/* Model selector in header */}
        <div className="flex items-center gap-2">
          <ModelSelector value={model} onValueChange={handleModelChange} />
        </div>
      </div>

      {/* Chat component with persistence */}
      <div
        className={cn(
          "flex-1 overflow-hidden transition-all duration-300",
          isSidebarOpen ? "lg:ml-80" : "ml-0",
        )}
      >
        <Chat
          model={model}
          threadId={threadId}
          onModelChange={handleModelChange}
        />
      </div>
    </div>
  );
}
