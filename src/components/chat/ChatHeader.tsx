
import { useChatContext, MessageMode } from "@/contexts/ChatContext";
import { Button } from "@/components/ui/button";
import { Clock, Zap } from "lucide-react";

const ChatHeader = () => {
  const { mode, setMode } = useChatContext();

  const handleModeChange = (newMode: MessageMode) => {
    setMode(newMode);
  };

  return (
    <div className="border-b p-4 bg-card rounded-t-xl">
      <h2 className="text-lg font-medium mb-2">Chat with HelloClarly</h2>
      <div className="flex space-x-2">
        <Button
          size="sm"
          variant={mode === "slow" ? "default" : "outline"}
          onClick={() => handleModeChange("slow")}
          className="flex items-center"
        >
          <Clock className="h-4 w-4 mr-2" />
          Slow Down
        </Button>
        <Button
          size="sm"
          variant={mode === "vent" ? "default" : "outline"}
          onClick={() => handleModeChange("vent")}
          className="flex items-center"
        >
          <Zap className="h-4 w-4 mr-2" />
          Vent
        </Button>
      </div>
    </div>
  );
};

export default ChatHeader;
