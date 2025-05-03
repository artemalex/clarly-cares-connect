
import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import ChatContainer from "@/components/chat/ChatContainer";
import ChatModeSelector from "@/components/chat/ChatModeSelector";
import PaywallModal from "@/components/subscription/PaywallModal";
import { useChatContext } from "@/contexts/chat";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const Chat = () => {
  const { remainingMessages, startNewChat, messages, setMode } = useChatContext();
  const [paywallOpen, setPaywallOpen] = useState(false);
  const [modeSelectorOpen, setModeSelectorOpen] = useState(false);
  const { id } = useParams<{ id?: string }>();
  const isMobile = useIsMobile();
  const [isScrolled, setIsScrolled] = useState(false);
  const pageRef = useRef<HTMLDivElement>(null);

  // Show paywall when messages are depleted
  useEffect(() => {
    if (remainingMessages <= 0) {
      setPaywallOpen(true);
    }
  }, [remainingMessages]);

  // Handle scroll event on mobile to collapse header
  useEffect(() => {
    if (!isMobile) return;
    
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isMobile]);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    if (isMobile && messages.length > 0) {
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, isMobile]);

  const handleNewChat = () => {
    setModeSelectorOpen(true);
  };

  const handleSelectMode = (mode: typeof import('@/contexts/chat').MessageMode) => {
    setMode(mode);
    setModeSelectorOpen(false);
    startNewChat();
  };
  
  return (
    <div 
      ref={pageRef}
      className="container py-4 sm:py-6 px-2 sm:px-4 flex flex-col mobile-chat-page"
    >
      <div className="max-w-4xl mx-auto w-full flex flex-col flex-grow">
        <div className="flex justify-between items-center mb-3 sm:mb-5 sticky-header">
          <h1 className="text-xl sm:text-2xl font-bold">Chat with HelloClarly</h1>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size={isMobile ? "sm" : "default"}
              onClick={handleNewChat}
              className="flex items-center whitespace-nowrap"
            >
              <Plus className="h-4 w-4 mr-1" />
              New Chat
            </Button>
          </div>
        </div>
        
        <div className="flex-grow mobile-chat-container">
          <ChatContainer />
        </div>
        
        <PaywallModal 
          open={paywallOpen} 
          onClose={() => setPaywallOpen(false)} 
        />
        
        <ChatModeSelector
          isOpen={modeSelectorOpen}
          onClose={() => setModeSelectorOpen(false)}
          onSelectMode={handleSelectMode}
        />
      </div>
    </div>
  );
};

export default Chat;
