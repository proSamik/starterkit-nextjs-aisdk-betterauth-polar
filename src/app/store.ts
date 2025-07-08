import { create } from "zustand";
import { persist } from "zustand/middleware";
import { devtools } from "zustand/middleware";
import { nanoid } from "nanoid";
import type { UIMessage } from "ai";

/**
 * Chat thread interface for managing individual conversations
 */
export interface ChatThread {
  id: string;
  title?: string;
  createdAt: number;
  updatedAt: number;
  messages: UIMessage[];
  model?: string;
}

/**
 * User preferences interface
 */
export interface UserPreferences {
  theme: string;
  language: string;
  sidebarCollapsed: boolean;
  emailNotifications: boolean;
  marketingEmails: boolean;
}

/**
 * UI state interface for managing component states
 */
export interface UIState {
  isMobile: boolean;
  isLoading: boolean;
  modals: {
    settings: boolean;
    profile: boolean;
    subscription: boolean;
  };
  notifications: Array<{
    id: string;
    type: "success" | "error" | "warning" | "info";
    message: string;
    timestamp: number;
  }>;
}

/**
 * Main application state interface
 */
export interface AppState {
  // User data
  user: {
    id?: string;
    email?: string;
    name?: string;
    avatar?: string;
    subscription?: {
      status: "active" | "inactive" | "trial" | "canceled";
      plan: "monthly" | "yearly" | "lifetime";
      expiresAt?: string;
    };
  };

  // User preferences with defaults
  preferences: UserPreferences;

  // UI state
  ui: UIState;

  // Chat state
  chat: {
    threads: Record<string, ChatThread>;
    currentThreadId?: string;
  };

  // Actions
  setUser: (user: Partial<AppState["user"]>) => void;
  updatePreferences: (preferences: Partial<UserPreferences>) => void;
  toggleSidebar: () => void;
  setMobile: (isMobile: boolean) => void;
  setLoading: (isLoading: boolean) => void;
  toggleModal: (modal: keyof UIState["modals"]) => void;
  addNotification: (
    notification: Omit<UIState["notifications"][0], "id" | "timestamp">,
  ) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
  resetState: () => void;

  // Chat actions
  createThread: (title?: string, model?: string) => ChatThread;
  getThread: (threadId: string) => ChatThread | undefined;
  updateThread: (
    threadId: string,
    updates: Partial<Omit<ChatThread, "id">>,
  ) => void;
  deleteThread: (threadId: string) => void;
  setCurrentThread: (threadId: string) => void;
  updateThreadMessages: (threadId: string, messages: UIMessage[]) => void;
  getThreadMessages: (threadId: string) => UIMessage[];
  getAllThreads: () => ChatThread[];
  clearAllThreads: () => void;
}

/**
 * Default preferences for new users
 */
const defaultPreferences: UserPreferences = {
  theme: "default",
  language: "en",
  sidebarCollapsed: false,
  emailNotifications: true,
  marketingEmails: false,
};

/**
 * Default UI state
 */
const defaultUIState: UIState = {
  isMobile: false,
  isLoading: false,
  modals: {
    settings: false,
    profile: false,
    subscription: false,
  },
  notifications: [],
};

/**
 * Main Zustand store with persistence for user preferences
 */
export const useAppStore = create<AppState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        user: {},
        preferences: defaultPreferences,
        ui: defaultUIState,
        chat: {
          threads: {},
          currentThreadId: undefined,
        },

        // Actions
        setUser: (userData) => {
          set(
            (state) => ({
              user: { ...state.user, ...userData },
            }),
            false,
            "setUser",
          );
        },

        updatePreferences: (newPreferences) => {
          set(
            (state) => ({
              preferences: { ...state.preferences, ...newPreferences },
            }),
            false,
            "updatePreferences",
          );
        },

        toggleSidebar: () => {
          set(
            (state) => ({
              preferences: {
                ...state.preferences,
                sidebarCollapsed: !state.preferences.sidebarCollapsed,
              },
            }),
            false,
            "toggleSidebar",
          );
        },

        setMobile: (isMobile) => {
          set(
            (state) => ({
              ui: { ...state.ui, isMobile },
            }),
            false,
            "setMobile",
          );
        },

        setLoading: (isLoading) => {
          set(
            (state) => ({
              ui: { ...state.ui, isLoading },
            }),
            false,
            "setLoading",
          );
        },

        toggleModal: (modal) => {
          set(
            (state) => ({
              ui: {
                ...state.ui,
                modals: {
                  ...state.ui.modals,
                  [modal]: !state.ui.modals[modal],
                },
              },
            }),
            false,
            `toggleModal:${modal}`,
          );
        },

        addNotification: (notification) => {
          const id = Math.random().toString(36).substring(2);
          const timestamp = Date.now();

          set(
            (state) => ({
              ui: {
                ...state.ui,
                notifications: [
                  ...state.ui.notifications,
                  { ...notification, id, timestamp },
                ],
              },
            }),
            false,
            "addNotification",
          );

          // Auto-remove notification after 5 seconds
          setTimeout(() => {
            get().removeNotification(id);
          }, 5000);
        },

        removeNotification: (id) => {
          set(
            (state) => ({
              ui: {
                ...state.ui,
                notifications: state.ui.notifications.filter(
                  (n) => n.id !== id,
                ),
              },
            }),
            false,
            "removeNotification",
          );
        },

        clearNotifications: () => {
          set(
            (state) => ({
              ui: {
                ...state.ui,
                notifications: [],
              },
            }),
            false,
            "clearNotifications",
          );
        },

        resetState: () => {
          set(
            {
              user: {},
              preferences: defaultPreferences,
              ui: defaultUIState,
              chat: {
                threads: {},
                currentThreadId: undefined,
              },
            },
            false,
            "resetState",
          );
        },

        // Chat actions
        createThread: (title?: string, model?: string) => {
          const threadId = nanoid();
          const now = Date.now();

          const systemMessage: UIMessage = {
            id: nanoid(),
            role: "system",
            content: "You are a helpful assistant. You have access to tools.",
            parts: [
              {
                type: "text",
                text: "You are a helpful assistant. You have access to tools.",
              },
            ],
          };

          const newThread: ChatThread = {
            id: threadId,
            title: title || "New Chat",
            createdAt: now,
            updatedAt: now,
            messages: [systemMessage],
            model: model || "gpt-4o", // Default to GPT-4o instead of Claude
          };

          set(
            (state) => ({
              chat: {
                ...state.chat,
                threads: {
                  ...state.chat.threads,
                  [threadId]: newThread,
                },
                currentThreadId: threadId,
              },
            }),
            false,
            "chat/createThread",
          );

          return newThread;
        },

        getThread: (threadId: string) => {
          return get().chat.threads[threadId];
        },

        updateThread: (
          threadId: string,
          updates: Partial<Omit<ChatThread, "id">>,
        ) => {
          const currentThread = get().chat.threads[threadId];
          if (!currentThread) return;

          set(
            (state) => ({
              chat: {
                ...state.chat,
                threads: {
                  ...state.chat.threads,
                  [threadId]: {
                    ...currentThread,
                    ...updates,
                    updatedAt: Date.now(),
                  },
                },
              },
            }),
            false,
            "chat/updateThread",
          );
        },

        deleteThread: (threadId: string) => {
          set(
            (state) => {
              const newThreads = { ...state.chat.threads };
              delete newThreads[threadId];

              return {
                chat: {
                  ...state.chat,
                  threads: newThreads,
                  currentThreadId:
                    state.chat.currentThreadId === threadId
                      ? undefined
                      : state.chat.currentThreadId,
                },
              };
            },
            false,
            "chat/deleteThread",
          );
        },

        setCurrentThread: (threadId: string) => {
          set(
            (state) => ({
              chat: {
                ...state.chat,
                currentThreadId: threadId,
              },
            }),
            false,
            "chat/setCurrentThread",
          );
        },

        updateThreadMessages: (threadId: string, messages: UIMessage[]) => {
          const currentThread = get().chat.threads[threadId];
          if (!currentThread) return;

          set(
            (state) => ({
              chat: {
                ...state.chat,
                threads: {
                  ...state.chat.threads,
                  [threadId]: {
                    ...currentThread,
                    messages,
                    updatedAt: Date.now(),
                  },
                },
              },
            }),
            false,
            "chat/updateThreadMessages",
          );
        },

        getThreadMessages: (threadId: string) => {
          const thread = get().chat.threads[threadId];
          return thread?.messages || [];
        },

        getAllThreads: () => {
          const threads = get().chat.threads;
          return Object.values(threads).sort(
            (a, b) => b.updatedAt - a.updatedAt,
          );
        },

        clearAllThreads: () => {
          set(
            (state) => ({
              chat: {
                ...state.chat,
                threads: {},
                currentThreadId: undefined,
              },
            }),
            false,
            "chat/clearAllThreads",
          );
        },
      }),
      {
        name: "polar-saas-kit-store",
        // Persist user preferences and chat threads
        partialize: (state) => ({
          user: state.user,
          preferences: state.preferences,
          chat: {
            threads: state.chat.threads,
            currentThreadId: state.chat.currentThreadId,
          },
        }),
        // Version for migration support
        version: 2,
      },
    ),
    {
      name: "polar-saas-kit",
    },
  ),
);

/**
 * Selector hooks for specific state slices
 */

/**
 * Hook to get user data
 */
export const useUser = () => useAppStore((state) => state.user);

/**
 * Hook to get user preferences
 */
export const usePreferences = () => useAppStore((state) => state.preferences);

/**
 * Hook to get UI state
 */
export const useUIState = () => useAppStore((state) => state.ui);

/**
 * Hook to get sidebar state
 */
export const useSidebar = () => {
  const isCollapsed = useAppStore(
    (state) => state.preferences.sidebarCollapsed,
  );
  const toggle = useAppStore((state) => state.toggleSidebar);

  return { isCollapsed, toggle };
};

/**
 * Hook to get theme preference
 */
export const useThemePreference = () => {
  const theme = useAppStore((state) => state.preferences.theme);
  const updatePreferences = useAppStore((state) => state.updatePreferences);

  const setTheme = (theme: string) => updatePreferences({ theme });

  return { theme, setTheme };
};

/**
 * Hook to get notifications
 */
export const useNotifications = () => {
  const notifications = useAppStore((state) => state.ui.notifications);
  const add = useAppStore((state) => state.addNotification);
  const remove = useAppStore((state) => state.removeNotification);
  const clear = useAppStore((state) => state.clearNotifications);

  return { notifications, add, remove, clear };
};

/**
 * Hook to get modal state
 */
export const useModals = () => {
  const modals = useAppStore((state) => state.ui.modals);
  const toggle = useAppStore((state) => state.toggleModal);

  return { modals, toggle };
};

/**
 * Hook to get loading state
 */
export const useLoading = () => {
  const isLoading = useAppStore((state) => state.ui.isLoading);
  const setLoading = useAppStore((state) => state.setLoading);

  return { isLoading, setLoading };
};

/**
 * Hook to get store actions
 */
export const useStoreActions = () => {
  const setUser = useAppStore((state) => state.setUser);
  const updatePreferences = useAppStore((state) => state.updatePreferences);
  const setMobile = useAppStore((state) => state.setMobile);
  const resetState = useAppStore((state) => state.resetState);

  return { setUser, updatePreferences, setMobile, resetState };
};

/**
 * Hook to get chat state and actions
 */
export const useChatStore = () => {
  const threads = useAppStore((state) => state.chat.threads);
  const currentThreadId = useAppStore((state) => state.chat.currentThreadId);
  const createThread = useAppStore((state) => state.createThread);
  const getThread = useAppStore((state) => state.getThread);
  const updateThread = useAppStore((state) => state.updateThread);
  const deleteThread = useAppStore((state) => state.deleteThread);
  const setCurrentThread = useAppStore((state) => state.setCurrentThread);
  const updateThreadMessages = useAppStore(
    (state) => state.updateThreadMessages,
  );
  const getThreadMessages = useAppStore((state) => state.getThreadMessages);
  const getAllThreads = useAppStore((state) => state.getAllThreads);
  const clearAllThreads = useAppStore((state) => state.clearAllThreads);

  return {
    threads,
    currentThreadId,
    createThread,
    getThread,
    updateThread,
    deleteThread,
    setCurrentThread,
    updateThreadMessages,
    getThreadMessages,
    getAllThreads,
    clearAllThreads,
  };
};

/**
 * Hook to get a specific thread
 */
export const useThread = (threadId?: string) => {
  const threads = useAppStore((state) => state.chat.threads);
  return threadId ? threads[threadId] : undefined;
};

/**
 * Hook to get all threads sorted by updatedAt
 */
export const useThreads = () => {
  const threads = useAppStore((state) => state.chat.threads);
  return Object.values(threads).sort((a, b) => b.updatedAt - a.updatedAt);
};

/**
 * Hook to get current thread
 */
export const useCurrentThread = () => {
  const currentThreadId = useAppStore((state) => state.chat.currentThreadId);
  const threads = useAppStore((state) => state.chat.threads);
  return currentThreadId ? threads[currentThreadId] : undefined;
};
