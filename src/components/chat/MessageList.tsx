import { useEffect, useRef, useState } from "react";
import { useChatContext } from "@/contexts/chat";
import MessageBubble from "./MessageBubble";
import { Loader2, ArrowDown } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";

interface MessageListProps {
  className?: string;
  onScroll?: (isScrolled: boolean) => void;
}

const MessageList = ({ className, onScroll }: MessageListProps) => {
  const { messages, isLoading } = useChatContext();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  const allowAutoScrollRef = useRef(true);
  const lastUserMessageRef = useRef<HTMLDivElement>(null);

  // Check if user has scrolled up
  const handleScroll = () => {
    if (!containerRef.current) return;
    
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 50;
    
    setShowScrollButton(!isAtBottom);
    
    // Call the onScroll prop with the scroll state
    if (onScroll) {
      onScroll(scrollTop > 10);
    }
    
    if (isAtBottom) {
      setIsUserScrolling(false);
      allowAutoScrollRef.current = true;
    }
  };

  // Auto-scroll behavior depending on who sent the last message
  useEffect(() => {
    if (messages.length === 0) return;
    
    const lastMessage = messages[messages.length - 1];
    const lastUserMessageIndex = [...messages].reverse().findIndex(m => m.role === 'user');
    const lastUserMessage = lastUserMessageIndex >= 0 ? messages[messages.length - 1 - lastUserMessageIndex] : null;
    
    // If the last message is from the user, center it and disable auto-scrolling for assistant replies
    if (lastMessage.role === 'user') {
      allowAutoScrollRef.current = false; // Lock scrolling until next user message
      
      // Find the last user message element
      const userMessages = document.querySelectorAll(`[data-role="user"][data-id="${lastMessage.id}"]`);
      if (userMessages.length > 0) {
        const lastUserMessage = userMessages[userMessages.length - 1];
        lastUserMessage.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
    // If the last message is from assistant, scroll to keep the last user message at the top
    else if (lastMessage.role === 'assistant' && lastUserMessage) {
      const userMessages = document.querySelectorAll(`[data-role="user"][data-id="${lastUserMessage.id}"]`);
      if (userMessages.length > 0) {
        const lastUserMessageElement = userMessages[userMessages.length - 1];
        lastUserMessageElement.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }, [messages]);

  // Handle scroll button click
  const handleScrollToBottom = () => {
    if (messagesEndRef.current) {
      allowAutoScrollRef.current = true; // Re-enable auto-scrolling
      setIsUserScrolling(false);
      messagesEndRef.current.scrollIntoView({ 
        behavior: "smooth",
        block: "end" 
      });
    }
  };

  // Set up scroll detection
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    
    container.addEventListener('scroll', handleScroll);
    container.addEventListener('touchmove', () => setIsUserScrolling(true));
    
    return () => {
      container.removeEventListener('scroll', handleScroll);
      container.removeEventListener('touchmove', () => setIsUserScrolling(true));
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className={cn(
        "p-2 sm:p-3 scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400",
        className
      )}
    >
      {messages.length === 0 ? (
        <div className="flex items-center justify-center min-h-[200px] sm:min-h-[400px]">
          <p className="text-muted-foreground text-center">
            Send a message to start chatting with Assistant
          </p>
        </div>
      ) : (
        <div className="space-y-6 pb-4">
          {messages.map((message) => (
            <MessageBubble 
              key={message.id} 
              message={message} 
            />
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
      
      {/* Scroll to bottom button */}
      <AnimatePresence>
        {showScrollButton && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute bottom-20 right-4 z-10"
          >
            <Button
              size="icon"
              className="rounded-full shadow-md h-10 w-10 bg-primary hover:bg-primary/80"
              onClick={handleScrollToBottom}
              aria-label="Scroll to bottom"
            >
              <ArrowDown className="h-5 w-5" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MessageList;
