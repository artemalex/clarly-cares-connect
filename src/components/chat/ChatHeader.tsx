import { useChatContext, MessageMode } from "@/contexts/ChatContext";
import { Button } from "@/components/ui/button";
import { Clock, Zap } from "lucide-react";
const ChatHeader = () => {
  const {
    mode,
    setMode
  } = useChatContext();
  const handleModeChange = (newMode: MessageMode) => {
    setMode(newMode);
  };
  return <div className="border-b p-4 bg-card rounded-t-xl">
      <h2 className="text-lg font-medium mb-2">Chat with HelloClarly</h2>
      
    </div>;
};
export default ChatHeader;