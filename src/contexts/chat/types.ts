
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
  mode: MessageMode | null;
  messagesUsed: number;
  remainingMessages: number;
  isLoading: boolean;
  isSubscribed: boolean;
  conversationId: string | null;
  setMode: (mode: MessageMode) => void;
  sendMessage: (content: string) => void;
  startNewChat: (isInitial?: boolean, selectedMode?: MessageMode) => Promise<void>;
  checkSubscriptionStatus: () => Promise<void>;
  loadConversation: (id: string) => Promise<void>;
  generateInitialMessage: (conversationId: string) => Promise<void>;
  updateConversationMode: (selectedMode: MessageMode) => Promise<void>;
}
