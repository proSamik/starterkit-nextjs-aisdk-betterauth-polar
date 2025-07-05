"use client";

import { createAuthClient } from "better-auth/react";

import { toast } from "sonner";
import { handleErrorWithToast } from "ui/shared-toast";
import { polarClient } from "@polar-sh/better-auth";
import { emailHarmony } from "better-auth-harmony";

/**
 * Trigger portal fallback API call
 */
async function triggerPortalFallback() {
  try {
    console.log("Calling fallback portal API directly...");
    const response = await fetch("/api/polar-fallback/portal", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    if (response.ok) {
      const result = await response.json();
      console.log("Fallback portal API response:", result);
      if (result.success && result.url) {
        console.log("Redirecting to portal URL:", result.url);
        window.location.href = result.url;
        return;
      }
    } else {
      console.error("Fallback portal API failed with status:", response.status);
    }

    // If fallback also fails, redirect to pricing page
    console.log("Portal fallback failed, redirecting to pricing");
    window.location.href = "/pricing";
  } catch (error) {
    console.error("Portal fallback error:", error);
    window.location.href = "/pricing";
  }
}

/**
 * Trigger orders fallback API call
 */
async function triggerOrdersFallback(options: {
  query: {
    page: number;
    limit: number;
    productBillingType: "one_time" | "recurring";
  };
}) {
  try {
    const params = new URLSearchParams({
      page: options.query.page.toString(),
      limit: options.query.limit.toString(),
      productBillingType: options.query.productBillingType,
    });

    console.log("Calling fallback orders API with params:", params.toString());
    const response = await fetch(`/api/polar-fallback/orders?${params}`);

    if (response.ok) {
      const result = await response.json();
      console.log("Fallback orders API response:", result);
      if (result.success) {
        // Format response to match Better Auth structure
        return {
          data: {
            result: result.data,
          },
        };
      }
    } else {
      console.error("Fallback orders API failed with status:", response.status);
    }

    throw new Error("Fallback orders also failed");
  } catch (fallbackError) {
    console.error("Orders fallback error:", fallbackError);
    return { data: { result: { items: [] } } };
  }
}

/**
 * Enhanced auth client with automatic fallback handling for Polar APIs
 */
export const authClient = createAuthClient({
  baseURL: process.env.BETTER_AUTH_URL || "",
  plugins: [polarClient(), emailHarmony()],
  fetchOptions: {
    onError(e) {
      if (e.error.status === 429) {
        toast.error("Too many requests. Please try again later.");
        return;
      }

      // Trigger fallback immediately for Polar-specific errors
      if (
        e.error.code === "ORDERS_LIST_FAILED" ||
        e.error.message?.includes("Orders list failed") ||
        e.error.code === "CUSTOMER_PORTAL_CREATION_FAILED" ||
        e.error.message?.includes("Customer portal creation failed")
      ) {
        console.log("Polar error detected, triggering fallback:", e.error);

        // Trigger appropriate fallback based on error type
        if (
          e.error.code === "ORDERS_LIST_FAILED" ||
          e.error.message?.includes("Orders list failed")
        ) {
          console.log("Triggering orders fallback...");
          // For orders, we can't directly call the fallback here since we don't have the parameters
          // So we'll set a flag and let the enhanced client handle it
          (window as any).__polarOrdersFallbackNeeded = true;
        }

        if (
          e.error.code === "CUSTOMER_PORTAL_CREATION_FAILED" ||
          e.error.message?.includes("Customer portal creation failed")
        ) {
          console.log("Triggering portal fallback...");
          // For portal, we can trigger the fallback immediately
          triggerPortalFallback();
        }

        // Don't show toast for these expected errors
        return;
      }

      // Show toast for other errors
      handleErrorWithToast(e.error);
    },
  },
});

/**
 * Enhanced customer methods with automatic fallback
 */
export const enhancedAuthClient = {
  ...authClient,
  customer: {
    ...authClient.customer,

    /**
     * Enhanced portal method - fallback is handled automatically by onError
     */
    portal: authClient.customer.portal,

    /**
     * Enhanced orders list method with automatic fallback
     */
    orders: {
      list: async (options: {
        query: {
          page: number;
          limit: number;
          productBillingType: "one_time" | "recurring";
        };
      }) => {
        console.log("Enhanced orders.list called with options:", options);

        // Check if fallback was already flagged by onError handler
        if ((window as any).__polarOrdersFallbackNeeded) {
          console.log("Orders fallback flag detected, using fallback directly");
          (window as any).__polarOrdersFallbackNeeded = false; // Clear flag
          return await triggerOrdersFallback(options);
        }

        try {
          const result = await authClient.customer.orders.list(options);
          console.log("Better Auth orders.list succeeded:", result);
          return result;
        } catch (error: any) {
          console.log("Better Auth orders.list failed with error:", error);

          // Check for various error conditions that indicate we should use fallback
          const shouldUseFallback =
            error?.error?.code === "ORDERS_LIST_FAILED" ||
            error?.error?.status === 500 ||
            error?.message?.includes("customerId") ||
            error?.message?.includes("customerExternalId") ||
            error?.error?.message?.includes("customerId") ||
            error?.error?.message?.includes("customerExternalId");

          if (shouldUseFallback) {
            console.log(
              "Using Polar fallback for orders due to error:",
              error?.error?.code || error?.error?.status || "validation error",
            );
            return await triggerOrdersFallback(options);
          } else {
            console.log(
              "Error doesn't match fallback conditions, re-throwing:",
              error,
            );
            throw error;
          }
        }
      },
    },

    // Keep original state method unchanged
    state: authClient.customer.state,
  },
};

export type AuthClient = typeof authClient;
