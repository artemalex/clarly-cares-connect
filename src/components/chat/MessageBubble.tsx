
import { Message } from "@/contexts/chat";
import { cn } from "@/lib/utils";
import SuggestionButtons from "./SuggestionButtons";

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble = ({ message }: MessageBubbleProps) => {
  const isUser = message.role === "user";
  const formattedTime = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  }).format(message.timestamp);

  return (
    <div className={cn(
      "animate-fade-up flex flex-col",
      isUser ? "items-end" : "items-start"
    )}>
      <div className={cn(
        "message-bubble",
        isUser ? "user-message rounded-tr-none" : "assistant-message rounded-tl-none"
      )}>
        <p className="whitespace-pre-wrap">{message.content}</p>
        
        {!isUser && message.suggestions && message.suggestions.length > 0 && (
          <SuggestionButtons suggestions={message.suggestions} />
        )}
      </div>
      <span className="text-xs text-muted-foreground px-2">
        {isUser ? "You" : "Assistant"} • {formattedTime}
      </span>
    </div>
  );
};

export default MessageBubble;
