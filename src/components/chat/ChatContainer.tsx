
import { useState } from "react";
import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import ChatInput from "./ChatInput";
import ChatModeSelector from "./ChatModeSelector";
import { useChatContext } from "@/contexts/chat";
import { useIsMobile } from "@/hooks/use-mobile";

const ChatContainer = () => {
  const { isLoading, setMode, startNewChat, messages } = useChatContext();
  const [isScrolled, setIsScrolled] = useState(false);
  const [showModeSelector, setShowModeSelector] = useState(messages.length === 0);
  const isMobile = useIsMobile();

  const handleSelectMode = (mode: typeof import('@/contexts/chat').MessageMode) => {
    setMode(mode);
    setShowModeSelector(false);
    startNewChat();
  };
  
  return (
    <>
      <div className="border rounded-xl shadow-sm flex flex-col h-[80vh] sm:h-[75vh] bg-background overflow-hidden">
        <ChatHeader isCollapsed={isScrolled && isMobile} />
        <div className="message-list-container flex-1 overflow-y-auto sm:overflow-y-auto">
          <MessageList />
        </div>
        <ChatInput />
      </div>
      
      <ChatModeSelector
        isOpen={showModeSelector}
        onClose={() => setShowModeSelector(false)}
        onSelectMode={handleSelectMode}
      />
    </>
  );
};

export default ChatContainer;
