
import { useEffect, useRef } from "react";
import { useChatContext } from "@/contexts/chat";
import MessageBubble from "./MessageBubble";
import { Loader2 } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const MessageList = () => {
  const { messages, isLoading } = useChatContext();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  // Auto-scroll that will trigger on new messages for desktop only
  // Mobile scrolling is now handled in the Chat.tsx component
  useEffect(() => {
    if (!isMobile && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isMobile]);

  return (
    <div className="p-2 sm:p-3">
      {messages.length === 0 ? (
        <div className="flex items-center justify-center min-h-[200px] sm:min-h-[400px]">
          <p className="text-muted-foreground text-center">
            Send a message to start chatting with Assistant
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
          {isLoading && (
            <div className="flex items-center space-x-2 animate-fade-in">
              <div className="message-bubble assistant-message rounded-tl-none flex items-center space-x-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Assistant is typing...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      )}
    </div>
  );
};

export default MessageList;
