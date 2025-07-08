"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useChatStore, useThreads } from "@/app/store";
import { ChatThreadList } from "@/components/chat-thread-list";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Plus, Sparkles, Menu, X } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

/**
 * Main chat page component
 * Shows thread list and provides options to create new chats
 */
export default function ChatPage() {
  const router = useRouter();
  const threads = useThreads();
  const { createThread } = useChatStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  /**
   * Create a new chat thread and navigate to it
   */
  const handleNewChat = async () => {
    try {
      const newThread = createThread();
      router.push(`/app/chat/${newThread.id}`);
      toast.success("New chat created!");
    } catch (error) {
      console.error("Error creating thread:", error);
      toast.error("Failed to create new chat");
    }
  };

  /**
   * Toggle sidebar visibility
   */
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Auto-create and navigate to first thread if no threads exist
  useEffect(() => {
    if (threads.length === 0) {
      // Don't auto-create on first load, let user choose
      return;
    }
  }, [threads.length]);

  return (
    <div className="h-screen flex relative">
      {/* Sidebar toggle button */}
      <Button
        variant="outline"
        size="icon"
        onClick={toggleSidebar}
        className={cn(
          "fixed top-4 left-4 z-50 h-10 w-10",
          isSidebarOpen && "left-[20.5rem]", // Adjust position when sidebar is open
        )}
      >
        {isSidebarOpen ? (
          <X className="h-4 w-4" />
        ) : (
          <Menu className="h-4 w-4" />
        )}
      </Button>

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

      {/* Main content area */}
      <div
        className={cn(
          "flex-1 flex items-center justify-center p-8 transition-all duration-300",
          isSidebarOpen ? "lg:ml-80" : "ml-0",
        )}
      >
        {threads.length === 0 ? (
          // Welcome state for new users
          <div className="max-w-md text-center">
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                <MessageSquare className="h-8 w-8 text-primary" />
              </div>
              <h1 className="text-3xl font-bold mb-4">Welcome to AI Chat</h1>
              <p className="text-muted-foreground mb-8">
                Start a conversation with our AI assistant. Ask questions, get
                help with tasks, or just have a friendly chat.
              </p>
            </div>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  What can I help you with?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid gap-2">
                  <Button
                    variant="outline"
                    className="justify-start h-auto p-3"
                    onClick={handleNewChat}
                  >
                    <div className="text-left">
                      <div className="font-medium">Code assistance</div>
                      <div className="text-sm text-muted-foreground">
                        Help with programming and debugging
                      </div>
                    </div>
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-start h-auto p-3"
                    onClick={handleNewChat}
                  >
                    <div className="text-left">
                      <div className="font-medium">Writing & editing</div>
                      <div className="text-sm text-muted-foreground">
                        Improve your writing and create content
                      </div>
                    </div>
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-start h-auto p-3"
                    onClick={handleNewChat}
                  >
                    <div className="text-left">
                      <div className="font-medium">Analysis & research</div>
                      <div className="text-sm text-muted-foreground">
                        Data analysis and research assistance
                      </div>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Button onClick={handleNewChat} size="lg" className="w-full">
              <Plus className="h-5 w-5 mr-2" />
              Start New Chat
            </Button>

            {/* Show sidebar hint if threads exist */}
            {threads.length > 0 && (
              <div className="mt-6 text-sm text-muted-foreground">
                <p>💡 Use the menu button to access your previous chats</p>
              </div>
            )}
          </div>
        ) : (
          // Default state when threads exist
          <div className="text-center">
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-muted rounded-full mb-4">
                <MessageSquare className="h-8 w-8 text-muted-foreground" />
              </div>
              <h2 className="text-2xl font-semibold mb-2">Select a chat</h2>
              <p className="text-muted-foreground mb-6">
                Use the menu button to browse your conversations or start a new
                one
              </p>
            </div>

            <div className="space-y-4">
              <Button onClick={handleNewChat} size="lg">
                <Plus className="h-5 w-5 mr-2" />
                New Chat
              </Button>

              <div className="text-sm text-muted-foreground">
                <p>
                  💡 Click the menu button in the top-left to view your{" "}
                  {threads.length} saved conversation
                  {threads.length !== 1 ? "s" : ""}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
