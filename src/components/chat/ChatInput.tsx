
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Mic, Send } from "lucide-react";
import { useChatContext } from "@/contexts/chat";
import VoiceRecorder from "./VoiceRecorder";
import { Dialog, DialogContent } from "@/components/ui/dialog";

const ChatInput = () => {
  const [message, setMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const { sendMessage, isLoading, remainingMessages, isSubscribed } = useChatContext();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      sendMessage(message);
      setMessage("");
    }
  };

  const handleVoiceTranscript = (text: string) => {
    sendMessage(text);
    setIsRecording(false);
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t bg-card rounded-b-xl">
      <div className="flex flex-col space-y-2">
        <div className="flex justify-between items-center mb-2">
          {/* Only show remaining messages for non-subscribed users with messages left */}
          {!isSubscribed && remainingMessages > 0 && (
            <span className="text-sm text-muted-foreground">
              {remainingMessages} free messages remaining
            </span>
          )}
          {/* Always show message limit warning when reached */}
          {remainingMessages <= 0 && (
            <span className="text-sm text-muted-foreground">
              You've reached your message limit
            </span>
          )}
        </div>
        
        <div className="flex space-x-2">
          <Textarea
            placeholder="Type your message here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="resize-none flex-1"
            disabled={isLoading || remainingMessages <= 0}
          />
          <div className="flex flex-col space-y-2">
            <Button 
              type="button" 
              variant="outline" 
              size="icon"
              onClick={() => setIsRecording(true)}
              disabled={isLoading || remainingMessages <= 0}
              className="rounded-full h-10 w-10"
            >
              <Mic className="h-4 w-4" />
            </Button>
            <Button 
              type="submit" 
              disabled={!message.trim() || isLoading || remainingMessages <= 0}
              size="icon"
              className="rounded-full h-10 w-10"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      
      <Dialog open={isRecording} onOpenChange={setIsRecording}>
        <DialogContent className="sm:max-w-md">
          <VoiceRecorder 
            onTranscriptSend={handleVoiceTranscript} 
            disabled={isLoading || remainingMessages <= 0}
          />
        </DialogContent>
      </Dialog>
    </form>
  );
};

export default ChatInput;
