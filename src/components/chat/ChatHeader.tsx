
import { useChatContext, MessageMode } from "@/contexts/ChatContext";
import { Button } from "@/components/ui/button";
import { Clock, Zap, AudioWaveform } from "lucide-react";

const ChatHeader = () => {
  const { mode, setMode } = useChatContext();
  
  const handleModeChange = (newMode: MessageMode) => {
    setMode(newMode);
  };
  
  return (
    <div className="border-b p-4 bg-card rounded-t-xl">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium">Chat with HelloClari</h2>
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
