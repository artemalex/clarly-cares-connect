
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
import { useChatContext } from "@/contexts/chat";
import VoiceRecorder from "./VoiceRecorder";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ChatInput = () => {
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState<string>("text");
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
    setActiveTab("text");
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t bg-card rounded-b-xl">
      <div className="flex flex-col space-y-2">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-muted-foreground">
            {remainingMessages > 0 
              ? `${remainingMessages} ${isSubscribed ? 'premium' : 'free'} messages remaining` 
              : "You've reached your message limit"}
          </span>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 mb-2">
            <TabsTrigger value="text">Text</TabsTrigger>
            <TabsTrigger value="voice">Voice</TabsTrigger>
          </TabsList>
          
          <TabsContent value="text" className="mt-0">
            <div className="flex space-x-2">
              <Textarea
                placeholder="Type your message here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="resize-none flex-1"
                disabled={isLoading || remainingMessages <= 0}
              />
              <Button 
                type="submit" 
                disabled={!message.trim() || isLoading || remainingMessages <= 0}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="voice" className="mt-0">
            <VoiceRecorder 
              onTranscriptSend={handleVoiceTranscript} 
              disabled={isLoading || remainingMessages <= 0}
            />
          </TabsContent>
        </Tabs>
      </div>
    </form>
  );
};

export default ChatInput;
