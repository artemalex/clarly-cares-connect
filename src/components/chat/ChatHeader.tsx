
import { useChatContext } from "@/contexts/chat";
import { MessageMode } from "@/contexts/chat";
import { Button } from "@/components/ui/button";
import { Clock, Zap, AudioWaveform } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useState, useEffect } from "react";

const ChatHeader = () => {
  const { mode, setMode, conversationId } = useChatContext();
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
  
  const handleModeChange = async (newMode: MessageMode) => {
    setMode(newMode);
    
    // Update conversation mode in database
    if (conversationId) {
      try {
        await supabase
          .from('conversations')
          .update({ mode: newMode })
          .eq('id', conversationId);
      } catch (error) {
        console.error("Error updating conversation mode:", error);
      }
    }
  };
  
  return (
    <div className="border-b p-4 bg-card rounded-t-xl">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium truncate">
          {title || "Chat with HelloClari"}
        </h2>
        <div className="flex space-x-2">
          <Button 
            size="sm" 
            variant={mode === "slow" ? "default" : "outline"}
            onClick={() => handleModeChange("slow")}
            className="flex items-center"
          >
            <Clock className="h-4 w-4 mr-1" />
            Reflective
          </Button>
          <Button 
            size="sm" 
            variant={mode === "vent" ? "default" : "outline"}
            onClick={() => handleModeChange("vent")}
            className="flex items-center"
          >
            <Zap className="h-4 w-4 mr-1" />
            Direct
          </Button>
        </div>
      </div>
      <p className="text-sm text-muted-foreground mt-2">
        <AudioWaveform className="h-4 w-4 inline-block mr-1" />
        You can now use voice input! Switch to the voice tab below to record messages.
      </p>
    </div>
  );
};

export default ChatHeader;
