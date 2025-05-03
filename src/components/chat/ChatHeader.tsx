
import { useChatContext } from "@/contexts/chat";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

interface ChatHeaderProps {
  isCollapsed?: boolean;
}

const ChatHeader = ({ isCollapsed = false }: ChatHeaderProps) => {
  const { mode, conversationId } = useChatContext();
  const [title, setTitle] = useState<string | null>("Chat with HelloClari");
  
  useEffect(() => {
    // Load conversation title if available
    if (conversationId) {
      fetchConversationTitle();
    }
  }, [conversationId]);
  
  const fetchConversationTitle = async () => {
    try {
      if (!conversationId) return;
      
      const { data, error } = await supabase
        .from('conversations')
        .select('title')
        .eq('id', conversationId)
        .maybeSingle();
      
      if (error || !data) return;
      
      if (data.title) {
        setTitle(data.title);
      }
    } catch (error) {
      console.error("Error fetching conversation title:", error);
    }
  };
  
  return (
    <div className={cn(
      "border-b bg-card rounded-t-xl transition-all duration-300 overflow-hidden",
      isCollapsed ? "py-1" : "py-3 px-4"
    )}>
      <div className="flex justify-between items-center">
        <h2 className={cn(
          "font-medium truncate transition-all",
          isCollapsed ? "text-sm mx-4" : "text-lg"
        )}>
          {title || "Chat with HelloClari"}
        </h2>
      </div>
    </div>
  );
};

export default ChatHeader;
