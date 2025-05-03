
import { useChatContext } from "@/contexts/chat";
import { cn } from "@/lib/utils";
import { Clock, Zap } from "lucide-react";
import { MessageMode } from "@/contexts/chat/constants"; // Fix import to use constants

interface ChatHeaderProps {
  isCollapsed?: boolean;
}

const ChatHeader = ({ isCollapsed = false }: ChatHeaderProps) => {
  const { mode } = useChatContext();
  
  return (
    <div className={cn(
      "border-b bg-card rounded-t-xl transition-all duration-300 overflow-hidden",
      isCollapsed ? "py-1" : "py-3 px-4"
    )}>
      <div className="flex items-center">
        <div className={cn(
          "p-1.5 rounded-full mr-2",
          "bg-empath-200 text-empath-800"
        )}>
          {mode === "slow" ? (
            <Clock className="h-4 w-4" />
          ) : (
            <Zap className="h-4 w-4" />
          )}
        </div>
        <span className="text-sm font-medium">
          {mode === "slow" ? "Slow Down Mode" : "Vent Mode"}
        </span>
      </div>
    </div>
  );
};

export default ChatHeader;
