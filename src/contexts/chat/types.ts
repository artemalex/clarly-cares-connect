
import { User } from "@supabase/supabase-js";

export type MessageRole = "system" | "user" | "assistant" | "function";

export type Message = {
  id?: string;
  role: MessageRole;
  content: string;
  created_at?: string;
  timestamp?: Date; // Ensure timestamp property is defined
};

export type MessageMode = "vent" | "slow";

export type ChatContextType = {
  messages: Message[];
  mode: MessageMode | null;
  messagesUsed: number;
  remainingMessages: number;
  isLoading: boolean;
  isSubscribed: boolean;
  freeTrialActive: boolean;
  freeTrialEndDate: Date | null;
  conversationId: string | null;
  setMode: (mode: MessageMode) => void;
  sendMessage: (message: string) => Promise<void>;
  // Fix the function signature to match implementation
  startNewChat: (mode?: MessageMode | null) => Promise<string | null>;
  checkSubscriptionStatus: () => Promise<void>;
  loadConversation: (id: string) => Promise<void>;
  generateInitialMessage: (conversationId: string) => Promise<void>;
  updateConversationMode: (mode: MessageMode) => Promise<void>;
};
