
import { useChatContext } from "@/contexts/chat";
import { cn } from "@/lib/utils";

interface ChatHeaderProps {
  isCollapsed?: boolean;
}

const ChatHeader = ({ isCollapsed = false }: ChatHeaderProps) => {
  const { mode, conversationId } = useChatContext();
  
  return (
    <div className={cn(
      "border-b bg-card rounded-t-xl transition-all duration-300 overflow-hidden",
      isCollapsed ? "py-1" : "py-3 px-4"
    )}>
      <div className="flex justify-between items-center">
        {/* Header content can be added here if needed in the future */}
      </div>
    </div>
  );
};

export default ChatHeader;
