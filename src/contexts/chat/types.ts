
import { MessageMode } from "./constants";

export type { MessageMode };

export interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
}

export interface ChatContextType {
  messages: Message[];
  mode: MessageMode;
  messagesUsed: number;
  remainingMessages: number;
  isLoading: boolean;
  isSubscribed: boolean;
  isGuest: boolean;
  guestId: string | null;
  conversationId: string | null;
  setMode: (mode: MessageMode) => void;
  sendMessage: (content: string) => void;
  startNewChat: () => void;
  migrateGuestData: () => Promise<boolean>;
  checkSubscriptionStatus: () => Promise<void>;
}
