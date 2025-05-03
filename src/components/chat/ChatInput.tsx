
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Mic, Send } from "lucide-react";
import { useChatContext } from "@/contexts/chat";
import VoiceRecorder from "./VoiceRecorder";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

const ChatInput = () => {
  const [message, setMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const { sendMessage, isLoading, remainingMessages, isSubscribed } = useChatContext();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isMobile = useIsMobile();
  const [sendButtonPressed, setSendButtonPressed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      // Trigger send button animation
      setSendButtonPressed(true);
      setTimeout(() => setSendButtonPressed(false), 300);
      
      sendMessage(message);
      setMessage("");
      setIsFocused(false);
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleVoiceTranscript = (text: string) => {
    sendMessage(text);
    setIsRecording(false);
  };
  
  // Auto resize textarea as user types
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  return (
    <form 
      onSubmit={handleSubmit} 
      className={cn(
        "p-2 sm:p-3 border-t bg-card rounded-b-xl transition-all",
        isFocused ? "pb-3 shadow-lg" : "pb-2",
        isMobile && "sticky-input"
      )}
    >
      <div className="flex flex-col space-y-2">
        {/* Show remaining messages indicator */}
        <div className={cn(
          "flex justify-between items-center transition-all overflow-hidden",
          (isFocused && !isSubscribed && remainingMessages > 0) || remainingMessages <= 0 
            ? "max-h-6 mb-1 opacity-100" 
            : "max-h-0 mb-0 opacity-0"
        )}>
          {!isSubscribed && remainingMessages > 0 && (
            <span className="text-xs text-muted-foreground">
              {remainingMessages} free messages remaining
            </span>
          )}
          {remainingMessages <= 0 && (
            <span className="text-xs text-muted-foreground">
              You've reached your message limit
            </span>
          )}
        </div>
        
        <div className="flex space-x-2 items-end">
          <Textarea
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => message.length === 0 && setIsFocused(false)}
            className={cn(
              "resize-none flex-1 transition-all rounded-2xl py-2 px-3 min-h-0 border-muted focus-visible:ring-clarly-400 focus-visible:border-clarly-300",
              isFocused ? "min-h-[80px] shadow-sm" : "min-h-[40px]"
            )}
            disabled={isLoading || remainingMessages <= 0}
            ref={textareaRef}
            rows={1}
          />
          <div className="flex space-x-2">
            <Button 
              type="button" 
              variant="outline" 
              size="icon"
              onClick={() => setIsRecording(true)}
              disabled={isLoading || remainingMessages <= 0}
              className="rounded-full h-10 w-10 flex-shrink-0 hover:bg-support-100 hover:text-support-600 transition-all"
            >
              <Mic className="h-4 w-4" />
            </Button>
            <Button 
              type="submit" 
              disabled={!message.trim() || isLoading || remainingMessages <= 0}
              size="icon"
              className={cn(
                "rounded-full h-10 w-10 flex-shrink-0 transition-all",
                sendButtonPressed ? "bg-support-600 scale-95" : "bg-primary hover:bg-primary/90"
              )}
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
