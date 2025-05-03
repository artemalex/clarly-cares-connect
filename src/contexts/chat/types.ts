export type MessageRole = "user" | "assistant";

// Add the MessageMode type definition
export type MessageMode = "slow" | "vent";

export interface Message {
  id: string;
  content: string;
  role: MessageRole;
  timestamp: Date;
}

export interface ChatContextType {
  messages: Message[];
  addMessage: (message: Message) => void;
  isLoading: boolean;
  sendMessage: (content: string) => void;
  mode: MessageMode;
  setMode: (mode: MessageMode) => void;
  startNewChat: () => void;
  remainingMessages: number;
  isSubscribed: boolean;
}
