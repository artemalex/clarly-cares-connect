
import { Message } from "@/contexts/chat";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

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
    <motion.div 
      className={cn(
        "flex flex-col",
        isUser ? "items-end" : "items-start"
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className={cn(
        "message-bubble transition-shadow hover:shadow-md",
        isUser 
          ? "user-message rounded-tr-none max-w-[80%] sm:max-w-[70%]" 
          : "assistant-message rounded-tl-none max-w-[85%] sm:max-w-[75%]"
      )}>
        <p className="whitespace-pre-wrap break-words">{message.content}</p>
      </div>
      <span className="text-xs text-muted-foreground px-2 mt-1">
        {isUser ? "You" : "Assistant"} • {formattedTime}
      </span>
    </motion.div>
  );
};

export default MessageBubble;
