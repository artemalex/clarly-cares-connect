
import { useChatContext } from "@/contexts/chat";
import { cn } from "@/lib/utils";
import { Heart, MessageSquare } from "lucide-react";
import { useState, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

interface ChatHeaderProps {
  isCollapsed?: boolean;
}

const ChatHeader = ({ isCollapsed = false }: ChatHeaderProps) => {
  const { mode, conversationId } = useChatContext();
  const isMobile = useIsMobile();
  const [animateHeart, setAnimateHeart] = useState(false);

  // Add a heartbeat animation effect
  useEffect(() => {
    const timer = setInterval(() => {
      setAnimateHeart(true);
      setTimeout(() => setAnimateHeart(false), 1000);
    }, 10000);
    
    return () => clearInterval(timer);
  }, []);

  return (
    <div className={cn(
      "border-b bg-card rounded-t-xl transition-all duration-300 overflow-hidden",
      isCollapsed ? "py-1" : "py-3 px-4"
    )}>
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Heart 
            className={cn(
              "h-5 w-5 text-clarly-500 transition-all", 
              animateHeart ? "scale-125" : "scale-100"
            )}
          />
          <span className="font-display font-medium text-foreground/80 text-sm">
            {mode === "slow" ? "Slow Down Mode" : "Vent Mode"}
          </span>
        </div>
        <div className="flex items-center text-xs text-muted-foreground">
          <MessageSquare className="h-3.5 w-3.5 mr-1 text-muted-foreground/70" />
          <span>Conversation {conversationId.slice(0, 6)}</span>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
