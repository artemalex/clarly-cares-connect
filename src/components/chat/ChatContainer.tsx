
import { useState, useRef } from "react";
import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import ChatInput from "./ChatInput";
import ChatModeSelector from "./ChatModeSelector";
import { useChatContext } from "@/contexts/chat";
import { useIsMobile } from "@/hooks/use-mobile";
import { MessageMode } from "@/contexts/chat/constants";
import { cn } from "@/lib/utils";

const ChatContainer = () => {
  const { isLoading, setMode, startNewChat, messages } = useChatContext();
  const [isScrolled, setIsScrolled] = useState(false);
  const [showModeSelector, setShowModeSelector] = useState(messages.length === 0);
  const isMobile = useIsMobile();
  const containerRef = useRef<HTMLDivElement>(null);

  const handleSelectMode = (mode: MessageMode) => {
    setMode(mode);
    setShowModeSelector(false);
    startNewChat();
  };

  return (
    <>
      <div 
        ref={containerRef}
        className={cn(
          "flex flex-col bg-background h-full flex-1 flex-grow overflow-hidden",
          "border rounded-xl shadow-sm"
        )}
      >
        <ChatHeader isCollapsed={isScrolled} />
        <MessageList 
          className="flex-1 overflow-y-auto" 
          onScroll={(scrolled) => setIsScrolled(scrolled)} 
        />
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
