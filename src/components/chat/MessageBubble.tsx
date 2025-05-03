
import { Message } from "@/contexts/chat";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble = ({ message }: MessageBubbleProps) => {
  const isUser = message.role === "user";
  const [isVisible, setIsVisible] = useState(false);
  const formattedTime = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  }).format(message.timestamp);

  // Add entrance animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={cn(
      "transition-all duration-300",
      isVisible ? "opacity-100 transform-none" : "opacity-0 translate-y-2",
      isUser ? "items-end" : "items-start",
      "flex flex-col"
    )}>
      <div className={cn(
        "message-bubble relative",
        isUser 
          ? "user-message rounded-tr-none max-w-[80%] sm:max-w-[70%] bg-gradient-to-br from-clarly-300 to-clarly-400" 
          : "assistant-message rounded-tl-none max-w-[85%] sm:max-w-[75%] bg-gradient-to-br from-support-100 to-support-200"
      )}>
        <p className="whitespace-pre-wrap break-words relative z-10">{message.content}</p>
        <div className={cn(
          "absolute inset-0 opacity-10 rounded-2xl",
          isUser ? "bg-clarly-pattern" : "bg-support-pattern"
        )}></div>
      </div>
      <span className="text-xs text-muted-foreground px-2 mt-1">
        {isUser ? "You" : "Assistant"} • {formattedTime}
      </span>
    </div>
  );
};

export default MessageBubble;
