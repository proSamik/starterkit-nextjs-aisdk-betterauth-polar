"use client";

import { redirect, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { authClient, enhancedAuthClient } from "auth/client";
import { AppSidebar } from "@/components/layouts/app-sidebar";
import { Settings } from "@/components/settings";
import { Profile } from "@/components/profile";
import { SubscriptionManagement } from "@/components/subscription-management";
import { NotificationManager } from "@/components/notification-manager";

type UserTier = "free" | "monthly" | "yearly" | "lifetime";

/**
 * Loading skeleton for premium layout
 */
function PremiumLayoutSkeleton() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  );
}

/**
 * Hook to manage user tier state
 */
function useUserTier() {
  const [userTier, setUserTier] = useState<UserTier>("free");
  const [isLoading, setIsLoading] = useState(true);
  const { data: session } = authClient.useSession();

  // Fetch customer state and determine tier
  useEffect(() => {
    const fetchCustomerState = async () => {
      if (!session?.user) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);

        // Step 1: First fetch customer state (gets updated immediately after payment)
        let newCustomerState: any = null;
        try {
          const stateResult = await authClient.customer.state();
          newCustomerState = stateResult?.data || null;
        } catch (_error) {
          // Silent fail - customer might not be configured yet
        }

        // Step 2: Then fetch lifetime orders with automatic fallback
        let newLifetimeOrders: any[] = [];
        try {
          const ordersResult = await enhancedAuthClient.customer.orders.list({
            query: {
              page: 1,
              limit: 10,
              productBillingType: "one_time",
            },
          });
          const rawOrders = ordersResult?.data?.result?.items || [];
          newLifetimeOrders = rawOrders;
        } catch (error) {
          // Silent fail - customer might not be configured yet
          console.log("Failed to fetch lifetime orders:", error);
        }

        // Determine user tier
        const MONTHLY_PRODUCT_ID =
          process.env.NEXT_PUBLIC_POLAR_MONTHLY_PRODUCT_ID;
        const YEARLY_PRODUCT_ID =
          process.env.NEXT_PUBLIC_POLAR_YEARLY_PRODUCT_ID;

        if (newLifetimeOrders.length > 0) {
          setUserTier("lifetime");
        } else {
          const activeSubscription =
            newCustomerState?.activeSubscriptions?.find((sub: any) => {
              return (
                sub.status === "active" &&
                (sub.productId === MONTHLY_PRODUCT_ID ||
                  sub.productId === YEARLY_PRODUCT_ID)
              );
            });

          if (activeSubscription) {
            const tier =
              activeSubscription.productId === MONTHLY_PRODUCT_ID
                ? "monthly"
                : "yearly";

            setUserTier(tier);
          } else {
            setUserTier("free");
          }
        }
      } catch (_error) {
        setUserTier("free");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCustomerState();
  }, [session]);

  return { userTier, isLoading };
}

/**
 * Layout content component that handles async state
 */
function PremiumLayoutContent({ children }: { children: React.ReactNode }) {
  const { data: session, isPending: isAuthLoading } = authClient.useSession();
  const { userTier, isLoading: isTierLoading } = useUserTier();
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") || "dashboard";

  // Redirect to sign-in if not authenticated
  useEffect(() => {
    if (!isAuthLoading && !session) {
      redirect("/sign-in");
    }
  }, [session, isAuthLoading]);

  const renderContent = () => {
    switch (tab) {
      case "dashboard":
        return children; // Render the original dashboard page
      case "profile":
        return <Profile />;
      case "settings":
        return <Settings />;
      case "subscription":
        return (
          <SubscriptionManagement
            currentTier={userTier}
            onBack={() => (window.location.href = "/app?tab=dashboard")}
          />
        );
      default:
        return children;
    }
  };

  // Show loading while auth or tier is loading
  if (isAuthLoading || isTierLoading) {
    return <PremiumLayoutSkeleton />;
  }

  if (!session) {
    return null; // Handled by redirect
  }

  return (
    <>
      <NotificationManager />
      <AppSidebar userTier={userTier}>{renderContent()}</AppSidebar>
    </>
  );
}

/**
 * Premium layout with sidebar navigation and dynamic content rendering
 */
export default function PremiumLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<PremiumLayoutSkeleton />}>
      <PremiumLayoutContent>{children}</PremiumLayoutContent>
    </Suspense>
  );
}
