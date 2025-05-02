
import { Message } from "@/contexts/ChatContext";
import { cn } from "@/lib/utils";

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
      </div>
      <span className="text-xs text-muted-foreground px-2">
        {isUser ? "You" : "Assistant"} • {formattedTime}
      </span>
    </div>
  );
};

export default MessageBubble;
