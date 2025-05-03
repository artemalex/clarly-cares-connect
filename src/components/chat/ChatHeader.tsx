
import { useChatContext } from "@/contexts/chat";
import { MessageMode } from "@/contexts/chat";
import { Button } from "@/components/ui/button";
import { AudioWaveform } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useState, useEffect } from "react";

const ChatHeader = () => {
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
    <div className="border-b p-4 bg-card rounded-t-xl">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium truncate">
          {title || "Chat with HelloClari"}
        </h2>
      </div>
      <p className="text-sm text-muted-foreground mt-2">
        <AudioWaveform className="h-4 w-4 inline-block mr-1" />
        You can now use voice input! Switch to the voice tab below to record messages.
      </p>
    </div>
  );
};

export default ChatHeader;
