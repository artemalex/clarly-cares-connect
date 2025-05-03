
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ChatContainer from "@/components/chat/ChatContainer";
import PaywallModal from "@/components/subscription/PaywallModal";
import { useChatContext } from "@/contexts/chat";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const Chat = () => {
  const { remainingMessages, startNewChat } = useChatContext();
  const [paywallOpen, setPaywallOpen] = useState(false);
  const { id } = useParams<{ id?: string }>();
  const isMobile = useIsMobile();

  // Show paywall when messages are depleted
  useEffect(() => {
    if (remainingMessages <= 0) {
      setPaywallOpen(true);
    }
  }, [remainingMessages]);
  
  return (
    <div className="container py-4 sm:py-6 px-2 sm:px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-3 sm:mb-5">
          <h1 className="text-xl sm:text-2xl font-bold">Chat with HelloClarly</h1>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size={isMobile ? "sm" : "default"}
              onClick={startNewChat}
              className="flex items-center whitespace-nowrap"
            >
              <Plus className="h-4 w-4 mr-1" />
              New Chat
            </Button>
          </div>
        </div>
        
        <ChatContainer />
        
        <PaywallModal 
          open={paywallOpen} 
          onClose={() => setPaywallOpen(false)} 
        />
      </div>
    </div>
  );
};

export default Chat;
