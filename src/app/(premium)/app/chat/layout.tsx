"use client";

import { redirect } from "next/navigation";
import { useEffect } from "react";
import { authClient } from "auth/client";

/**
 * Chat-specific layout component
 * Ensures user is authenticated before accessing chat features
 */
export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, isPending: isAuthLoading } = authClient.useSession();

  // Redirect to sign-in if not authenticated
  useEffect(() => {
    if (!isAuthLoading && !session) {
      redirect("/sign-in");
    }
  }, [session, isAuthLoading]);

  // Show loading while checking auth
  if (isAuthLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!session) {
    return null; // Handled by redirect
  }

  return <>{children}</>;
}
