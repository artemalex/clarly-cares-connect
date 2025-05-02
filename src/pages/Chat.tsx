
import { useState, useEffect } from "react";
import ChatContainer from "@/components/chat/ChatContainer";
import PaywallModal from "@/components/subscription/PaywallModal";
import { useChatContext } from "@/contexts/ChatContext";
import { Button } from "@/components/ui/button";
import { RefreshCw, Plus } from "lucide-react";

const Chat = () => {
  const { remainingMessages, startNewChat } = useChatContext();
  const [paywallOpen, setPaywallOpen] = useState(false);

  // Show paywall when messages are depleted
  useEffect(() => {
    if (remainingMessages <= 0) {
      setPaywallOpen(true);
    }
  }, [remainingMessages]);
  
  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Chat with HelloClarly</h1>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={startNewChat}
              className="flex items-center"
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
