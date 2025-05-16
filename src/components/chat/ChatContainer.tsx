
import { useState, useRef } from "react";
import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import ChatInput from "./ChatInput";
import ChatModeSelector from "./ChatModeSelector";
import { useChatContext } from "@/contexts/chat";
import { useIsMobile } from "@/hooks/use-mobile";
import { MessageMode } from "@/contexts/chat/types";
import { cn } from "@/lib/utils";

const ChatContainer = () => {
  const { isLoading, setMode, startNewChat, messages, mode, updateConversationMode, conversationId } = useChatContext();
  const [isScrolled, setIsScrolled] = useState(false);
  const [showModeSelector, setShowModeSelector] = useState(false);
  const isMobile = useIsMobile();
  const containerRef = useRef<HTMLDivElement>(null);

  const handleSelectMode = (selectedMode: MessageMode) => {
    console.log('Mode selected in ChatContainer:', selectedMode);
    setMode(selectedMode);
    setShowModeSelector(false);
    
    // Only start a new chat if we don't have an existing conversation
    if (!conversationId) {
      startNewChat(selectedMode);
    } else {
      // If we have an existing conversation, update its mode
      updateConversationMode(selectedMode);
    }
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
        initialMode={mode}
      />
    </>
  );
};

export default ChatContainer;
