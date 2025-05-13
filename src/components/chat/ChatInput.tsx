import { useState, useRef, useEffect, KeyboardEvent } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Mic, Send, LogIn } from "lucide-react";
import { useChatContext } from "@/contexts/chat";
import VoiceRecorder from "./VoiceRecorder";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const ChatInput = () => {
  const [message, setMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [micHovered, setMicHovered] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { sendMessage, isLoading } = useChatContext();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
    };
    
    checkAuth();
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });
    
    return () => subscription.unsubscribe();
  }, []);

  // Auto focus on the textarea when component mounts
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!message.trim() || isLoading) return;

    if (!isAuthenticated) {
      // Store the message in localStorage
      const pendingMessages = JSON.parse(localStorage.getItem('pending_messages') || '[]');
      pendingMessages.push(message);
      localStorage.setItem('pending_messages', JSON.stringify(pendingMessages));
      
      // Show toast and redirect to signup
      toast.info("Please sign up to start chatting!");
      navigate("/signup");
      return;
    }

    // If authenticated, send the message
    await sendMessage(message);
    setMessage("");
    setIsFocused(false);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // Prevent default to avoid new line
      handleSubmit();
    }
  };

  const handleVoiceTranscript = (text: string) => {
    if (!isAuthenticated) {
      // Store the voice message in localStorage
      const pendingMessages = JSON.parse(localStorage.getItem('pending_messages') || '[]');
      pendingMessages.push(text);
      localStorage.setItem('pending_messages', JSON.stringify(pendingMessages));
      
      // Show toast and redirect to signup
      toast.info("Please sign up to start chatting!");
      navigate("/signup");
      return;
    }

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
    <div className="p-4 border-t bg-background">
      {!isAuthenticated && (
        <div className="mb-4 p-4 bg-muted rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <LogIn className="h-5 w-5" />
            <span>Sign up to start chatting!</span>
          </div>
          <Button onClick={() => navigate("/signup")} variant="default">
            Sign Up
          </Button>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={isAuthenticated ? "Type your message..." : "Sign up to start chatting..."}
            className={cn(
              "w-full resize-none rounded-lg border bg-background px-4 py-3 pr-12",
              "focus:outline-none focus:ring-2 focus:ring-primary",
              "min-h-[44px] max-h-[200px]",
              !isAuthenticated && "opacity-50 cursor-not-allowed"
            )}
            disabled={!isAuthenticated}
            rows={1}
          />
          <Button
            type="submit"
            size="icon"
            className={cn(
              "absolute right-2 bottom-2",
              "h-8 w-8",
              "rounded-full",
              "bg-primary text-primary-foreground",
              "hover:bg-primary/90",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
            disabled={!message.trim() || isLoading || !isAuthenticated}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        
        {!isMobile && (
          <Button
            type="button"
            size="icon"
            variant="outline"
            className={cn(
              "h-12 w-12",
              "rounded-full",
              "border-2",
              isRecording && "border-primary bg-primary/10"
            )}
            onClick={() => setIsRecording(true)}
            disabled={!isAuthenticated}
          >
            <Mic className="h-5 w-5" />
          </Button>
        )}
      </form>

      <Dialog open={isRecording} onOpenChange={setIsRecording}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Voice Message</DialogTitle>
          </DialogHeader>
          <div className="p-4">
            <p className="text-center text-muted-foreground">
              Voice messages are coming soon!
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ChatInput;
