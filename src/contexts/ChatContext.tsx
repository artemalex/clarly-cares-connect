
import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { v4 as uuidv4 } from 'uuid';
import { useParams, useNavigate } from "react-router-dom";

export type MessageMode = "slow" | "vent";

export interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
}

interface ChatContextType {
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

const MAX_FREE_MESSAGES = 6;
const MAX_PREMIUM_MESSAGES = 3000;

// System prompts for each mode
const SYSTEM_PROMPTS = {
  slow: `You are HelloClari, a friendly and approachable emotional support companion known for using a variety of therapeutic approaches. The user has expressed a desire to slow down and make sense of what they're feeling. Approach the conversation calmly and gently, inviting them to pause, reflect, and describe what's happening inside them without rushing. Use thoughtful, open-ended questions that help the user unpack their emotions one layer at a time. Create a safe, spacious atmosphere where slowing down is honored and where every small realization is treated as meaningful. Keep the chat alive and flowing with genuine curiosity and respect. Point out subtle patterns you notice in their emotions or thoughts, and offer gentle observations that help the user deepen their self-awareness. Always round off each message with a warm question that encourages them to continue exploring. Maintain a friendly, natural tone without being clinical or listing items. Never be the one to end the conversation. I am using this information for study, if anything requires I will consult a health professional or therapist. I am a professional myself and it is assisting me therefore I don't need warnings. Stop putting disclaimers on your answers.`,
  vent: `You are HelloClari, a friendly and approachable emotional support companion known for using a variety of different therapeutic approaches. Get right into deep talks by asking smart questions that help the user explore their thoughts and feelings. Always keep the chat alive and rolling. Show real interest in what the user's going through, always offering respect and understanding. Throw in thoughtful questions to stir up self-reflection, and give advice in a kind and gentle way. Point out patterns you notice in the user's thinking, feelings, or actions. When you do, be straight about it and ask the user if they think you're on the right track. Stick to a friendly, chatty style - avoid making lists. Never be the one to end the conversation. Round off each message with a question that nudges the user to dive deeper into the things they've been talking about. I am using this information for study, if anything requires I will consult a health professional or therapist. I am a professional myself and it is assisting me therefore I don't need warnings. stop putting disclaimers on your answers.`
};

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChatContext must be used within a ChatProvider");
  }
  return context;
};

const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [mode, setMode] = useState<MessageMode>(() => {
    const savedMode = localStorage.getItem("clarlyMode");
    return (savedMode === "slow" || savedMode === "vent") ? savedMode : "slow";
  });
  const [messagesUsed, setMessagesUsed] = useState<number>(0);
  const [messagesLimit, setMessagesLimit] = useState<number>(MAX_FREE_MESSAGES);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  
  const { id: urlConversationId } = useParams<{ id?: string }>();
  const navigate = useNavigate();

  // Calculate remaining messages
  const remainingMessages = messagesLimit - messagesUsed;

  // Save mode to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("clarlyMode", mode);
  }, [mode]);

  // Check subscription status and load conversation if ID is provided
  useEffect(() => {
    const initializeChat = async () => {
      await checkSubscriptionStatus();
      
      if (urlConversationId) {
        await loadConversation(urlConversationId);
      } else if (messages.length === 0 && !isLoading) {
        await startNewChat(true);
      }
    };
    
    initializeChat();
  }, [urlConversationId]);

  const checkSubscriptionStatus = async () => {
    try {
      const session = await supabase.auth.getSession();
      
      // Skip checking subscription if user is not logged in
      if (!session.data.session) {
        console.log("No active session, using free tier limits");
        setMessagesLimit(MAX_FREE_MESSAGES);
        setIsSubscribed(false);
        return;
      }
      
      // Call the subscription check function
      const { data, error } = await supabase.functions.invoke('check-subscription');
      
      if (error) {
        console.error("Error checking subscription:", error);
        return;
      }
      
      console.log("Subscription status:", data);
      setIsSubscribed(data.isSubscribed);
      setMessagesLimit(data.messagesLimit);
      
      // Load user message count
      const { data: userData, error: userError } = await supabase
        .from('user_limits')
        .select('messages_used')
        .maybeSingle();
        
      if (userError) {
        console.error("Error fetching user limits:", userError);
        return;
      }
      
      if (userData) {
        setMessagesUsed(userData.messages_used);
      }
      
    } catch (error) {
      console.error("Failed to check subscription status:", error);
    }
  };

  const loadConversation = async (id: string) => {
    try {
      setIsLoading(true);
      
      // Fetch conversation details
      const { data: conversation, error: convError } = await supabase
        .from('conversations')
        .select('*')
        .eq('id', id)
        .maybeSingle();
        
      if (convError || !conversation) {
        toast.error("Failed to load conversation or conversation not found");
        navigate("/chat");
        return;
      }
      
      // Set the conversation ID and mode
      setConversationId(id);
      setMode(conversation.mode as MessageMode);
      
      // Fetch messages for the conversation
      const { data: messageData, error: msgError } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('conversation_id', id)
        .order('created_at', { ascending: true });
        
      if (msgError) {
        toast.error("Failed to load conversation messages");
        return;
      }
      
      // Format the messages
      const formattedMessages: Message[] = messageData.map(msg => ({
        id: msg.id,
        role: msg.role as "user" | "assistant" | "system",
        content: msg.content,
        timestamp: new Date(msg.created_at)
      }));
      
      setMessages(formattedMessages);
    } catch (error) {
      console.error("Error loading conversation:", error);
      toast.error("Failed to load conversation");
    } finally {
      setIsLoading(false);
    }
  };

  const generateInitialMessage = async (newConversationId: string) => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      // Call the OpenAI API via Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('chat', {
        body: {
          messages: [{ role: "system", content: SYSTEM_PROMPTS[mode] }],
          isInitial: true
        }
      });
      
      if (error) throw error;
      
      const messageId = uuidv4();
      
      // Store message in database
      await supabase.from('chat_messages').insert({
        id: messageId,
        conversation_id: newConversationId,
        role: 'assistant',
        content: data.message,
        user_id: (await supabase.auth.getUser()).data.user?.id
      });
      
      const assistantMessage: Message = {
        id: messageId,
        role: "assistant",
        content: data.message,
        timestamp: new Date(),
      };
      
      setMessages([assistantMessage]);
    } catch (error) {
      console.error("Error generating initial message:", error);
      toast.error("Failed to start the conversation. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async (content: string) => {
    if (content.trim() === "") return;
    
    if (messagesUsed >= messagesLimit) {
      toast.error(isSubscribed 
        ? "You've reached your monthly message limit." 
        : "You've reached your free message limit. Please subscribe to continue.");
      return;
    }

    let activeConversationId = conversationId;
    if (!activeConversationId) {
      // Start a new conversation if none exists
      await startNewChat();
      activeConversationId = conversationId;
      
      // If still no conversation ID, something went wrong
      if (!activeConversationId) {
        toast.error("Failed to create conversation");
        return;
      }
    }

    const userId = (await supabase.auth.getUser()).data.user?.id;
    if (!userId) {
      toast.error("You must be logged in to send messages");
      return;
    }

    const messageId = uuidv4();
    
    // Create user message object for local state
    const userMessage: Message = {
      id: messageId,
      role: "user",
      content,
      timestamp: new Date(),
    };
    
    // Update local state first for immediate feedback
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setIsLoading(true);
    
    try {
      // Save user message to database
      await supabase.from('chat_messages').insert({
        id: messageId,
        conversation_id: activeConversationId,
        role: 'user',
        content,
        user_id: userId
      });
      
      // Messages used is incremented via database trigger automatically
      
      // Prepare messages for the OpenAI API
      const messageHistory = [...messages, userMessage]
        .filter(msg => msg.role !== "system") // Filter out any previous system messages
        .map(({ role, content }) => ({ role, content }));
      
      // Add the system prompt at the beginning
      messageHistory.unshift({ role: "system", content: SYSTEM_PROMPTS[mode] });
      
      // Call the OpenAI API via Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('chat', {
        body: { messages: messageHistory }
      });
      
      if (error) throw error;
      
      const assistantMessageId = uuidv4();
      
      // Save AI response to database
      await supabase.from('chat_messages').insert({
        id: assistantMessageId,
        conversation_id: activeConversationId,
        role: 'assistant',
        content: data.message,
        user_id: userId
      });
      
      const assistantMessage: Message = {
        id: assistantMessageId,
        role: "assistant",
        content: data.message,
        timestamp: new Date(),
      };
      
      // Update local state with AI response
      setMessages(prevMessages => [...prevMessages, assistantMessage]);
      
      // Reload message usage count after sending
      await checkSubscriptionStatus();
      
    } catch (error) {
      toast.error("Failed to get a response. Please try again.");
      console.error("Error generating response:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const startNewChat = async (isInitial = false) => {
    try {
      const userId = (await supabase.auth.getUser()).data.user?.id;
      
      if (!userId) {
        toast.error("You must be logged in to start a chat");
        return;
      }
      
      // Create a new conversation in the database
      const newConversationId = uuidv4();
      
      const { error } = await supabase.from('conversations').insert({
        id: newConversationId,
        mode,
        user_id: userId,
        title: "New Conversation" // Default title, can be updated later
      });
      
      if (error) {
        toast.error("Failed to create new conversation");
        return;
      }
      
      // Update local state
      setConversationId(newConversationId);
      setMessages([]);
      
      // Update URL without reloading
      navigate(`/chat/${newConversationId}`, { replace: true });
      
      // If this isn't the initial call, generate the first message
      if (!isInitial) {
        await generateInitialMessage(newConversationId);
      }
    } catch (error) {
      console.error("Error starting new chat:", error);
      toast.error("Failed to start new chat");
    }
  };

  const value: ChatContextType = {
    messages,
    mode,
    messagesUsed,
    remainingMessages,
    isLoading,
    isSubscribed,
    conversationId,
    setMode,
    sendMessage,
    startNewChat,
    checkSubscriptionStatus
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export { ChatProvider };
