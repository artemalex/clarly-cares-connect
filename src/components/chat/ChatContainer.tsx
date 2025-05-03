
import { useState } from "react";
import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import ChatInput from "./ChatInput";
import { useChatContext } from "@/contexts/chat";
import { useIsMobile } from "@/hooks/use-mobile";

const ChatContainer = () => {
  const { isLoading } = useChatContext();
  const [isScrolled, setIsScrolled] = useState(false);
  const isMobile = useIsMobile();

  // Track scrolling to collapse header on mobile - now handled in the Chat.tsx component
  
  return (
    <div className="border rounded-xl shadow-sm flex flex-col h-[80vh] sm:h-[75vh] bg-background overflow-hidden">
      <ChatHeader isCollapsed={isScrolled && isMobile} />
      <div className="message-list-container flex-1 overflow-y-auto sm:overflow-y-auto">
        <MessageList />
      </div>
      <ChatInput />
    </div>
  );
};

export default ChatContainer;
