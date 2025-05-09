
import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import ChatContainer from "@/components/chat/ChatContainer";
import ChatModeSelector from "@/components/chat/ChatModeSelector";
import PaywallModal from "@/components/subscription/PaywallModal";
import { useChatContext } from "@/contexts/chat";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { MessageMode } from "@/contexts/chat/constants";
import { cn } from "@/lib/utils";

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

  const handleNewChat = () => {
    setModeSelectorOpen(true);
  };

  const handleSelectMode = (mode: MessageMode) => {
    setMode(mode);
    setModeSelectorOpen(false);
    startNewChat();
  };
  
  return (
    <div 
      ref={pageRef}
      className="flex flex-col min-h-[calc(100vh-64px)]"
    >
      {/* Add keyframes for the waveform animation */}
      <style jsx global>{`
        @keyframes pulse {
          0% { opacity: 0.6; }
          50% { opacity: 1; }
          100% { opacity: 0.6; }
        }
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        
        @keyframes scale-in {
          0% { transform: scale(0.9); }
          100% { transform: scale(1.1); }
        }
        .animate-scale-in {
          animation: scale-in 0.3s ease-out forwards;
        }
        
        @keyframes fade-in {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
      
      <div className="container py-4 sm:py-6 px-2 sm:px-4 flex flex-col flex-1">
        <div className="max-w-4xl mx-auto w-full flex flex-col flex-1">
          <div className={cn(
            "flex justify-between items-center mb-3 sm:mb-5 transition-all duration-300 sticky top-0 bg-background z-10 py-2",
            isScrolled && "shadow-sm"
          )}>
            <h1 className={cn(
              "font-bold transition-all",
              isScrolled ? "text-lg" : "text-xl sm:text-2xl"
            )}>
              Chat with HelloClari
            </h1>
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
          
          <div className="flex-1 flex flex-col">
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
    </div>
  );
};

export default Chat;
