
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
import { useChatContext } from "@/contexts/ChatContext";

const ChatInput = () => {
  const [message, setMessage] = useState("");
  const { sendMessage, isLoading, remainingMessages, isSubscribed } = useChatContext();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      sendMessage(message);
      setMessage("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t bg-card rounded-b-xl">
      <div className="flex flex-col space-y-2">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-muted-foreground">
            {remainingMessages > 0 
              ? `${remainingMessages} ${isSubscribed ? 'premium' : 'free'} messages remaining` 
              : "You've reached your message limit"}
          </span>
        </div>
        <div className="flex space-x-2">
          <Textarea
            placeholder="Type your message here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="resize-none flex-1"
            disabled={isLoading || remainingMessages <= 0}
          />
          <Button 
            type="submit" 
            disabled={!message.trim() || isLoading || remainingMessages <= 0}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </form>
  );
};

export default ChatInput;
