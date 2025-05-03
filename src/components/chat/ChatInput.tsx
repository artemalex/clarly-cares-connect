
import { useState, useRef, useEffect, KeyboardEvent } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Mic, Send } from "lucide-react";
import { useChatContext } from "@/contexts/chat";
import VoiceRecorder from "./VoiceRecorder";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const ChatInput = () => {
  const [message, setMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const { sendMessage, isLoading, remainingMessages, isSubscribed } = useChatContext();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isMobile = useIsMobile();

  // Auto focus on the textarea when component mounts
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (message.trim()) {
      sendMessage(message);
      setMessage("");
      setIsFocused(false);
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // Prevent default to avoid new line
      handleSubmit();
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
        "p-2 sm:p-3 border-t bg-card sticky bottom-0 z-10",
        "rounded-b-xl transition-all",
        isFocused ? "pb-3" : "pb-2"
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
        
        <div className="relative flex flex-col sm:flex-row">
          <Textarea
            placeholder="Type a message... (Press Enter to send)"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => message.length === 0 && setIsFocused(false)}
            className={cn(
              "resize-none flex-1 pr-[90px] transition-all rounded-2xl py-2 px-3 min-h-0",
              isFocused ? "min-h-[80px]" : "min-h-[40px]"
            )}
            disabled={isLoading || remainingMessages <= 0}
            ref={textareaRef}
            rows={1}
          />
          <div className="absolute right-2 bottom-2 flex flex-col gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="icon"
                    onClick={() => setIsRecording(true)}
                    disabled={isLoading || remainingMessages <= 0}
                    className="rounded-full h-8 w-8 flex-shrink-0"
                  >
                    <Mic className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Record voice message</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    type="submit" 
                    disabled={!message.trim() || isLoading || remainingMessages <= 0}
                    size="icon"
                    className="rounded-full h-8 w-8 flex-shrink-0"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Send message (Enter)</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        <div className="text-xs text-muted-foreground mt-1 ml-2 hidden sm:block">
          <span>Press <kbd className="px-1 py-0.5 bg-muted text-muted-foreground rounded border">Enter</kbd> to send, <kbd className="px-1 py-0.5 bg-muted text-muted-foreground rounded border">Shift+Enter</kbd> for new line</span>
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
