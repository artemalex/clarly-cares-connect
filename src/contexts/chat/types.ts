
import { MessageMode } from "./constants";

export interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

export interface ChatContextType {
  messages: Message[];
  mode: MessageMode;
  messagesUsed: number;
  remainingMessages: number;
  isLoading: boolean;
  isSubscribed: boolean;
  conversationId: string | null;
  setMode: (mode: MessageMode) => void;
  sendMessage: (content: string) => void;
  startNewChat: () => void;
  checkSubscriptionStatus: () => Promise<void>;
}
