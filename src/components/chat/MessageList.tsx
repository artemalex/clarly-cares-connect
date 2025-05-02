
import { useEffect, useRef } from "react";
import { useChatContext } from "@/contexts/ChatContext";
import MessageBubble from "./MessageBubble";
import { Loader2 } from "lucide-react";

const MessageList = () => {
  const { messages, isLoading } = useChatContext();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 p-4 overflow-y-auto">
      {messages.length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <p className="text-muted-foreground text-center">
            Send a message to start chatting with Dr. Clarly
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
          {isLoading && (
            <div className="flex items-center space-x-2 animate-fade-in">
              <div className="message-bubble assistant-message rounded-tl-none flex items-center space-x-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Dr. Clarly is typing...</span>
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
