
import { useState } from "react";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Clock, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { MessageMode } from "@/contexts/chat";

interface ChatModeSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectMode: (mode: MessageMode) => void;
}

const ChatModeSelector = ({ 
  isOpen, 
  onClose, 
  onSelectMode 
}: ChatModeSelectorProps) => {
  const [selectedMode, setSelectedMode] = useState<MessageMode>("slow");
  
  const handleConfirm = () => {
    onSelectMode(selectedMode);
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">Choose Your Support Style</DialogTitle>
          <DialogDescription className="text-center">
            Select the conversation style that best fits your current needs
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col gap-4 py-4">
          <button
            onClick={() => setSelectedMode("slow")}
            className={cn(
              "flex items-start gap-3 p-4 rounded-lg border transition-all",
              selectedMode === "slow" 
                ? "border-primary bg-primary/5" 
                : "border-border hover:border-primary/50"
            )}
          >
            <div className={cn(
              "mt-1 p-2 rounded-full",
              selectedMode === "slow" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
            )}>
              <Clock className="h-5 w-5" />
            </div>
            <div className="text-left">
              <h3 className="font-medium">Slow Down Mode</h3>
              <p className="text-sm text-muted-foreground">
                Thoughtful conversations to help you process and reflect
              </p>
              
              <div className="mt-2">
                <p className="text-xs font-medium">Perfect when you need to:</p>
                <ul className="text-xs list-disc list-inside mt-1 text-muted-foreground">
                  <li>Process complex emotions at your own pace</li>
                  <li>Work through a difficult decision mindfully</li>
                  <li>Find clarity in challenging situations</li>
                </ul>
              </div>
            </div>
          </button>
          
          <button
            onClick={() => setSelectedMode("vent")}
            className={cn(
              "flex items-start gap-3 p-4 rounded-lg border transition-all",
              selectedMode === "vent" 
                ? "border-primary bg-primary/5" 
                : "border-border hover:border-primary/50"
            )}
          >
            <div className={cn(
              "mt-1 p-2 rounded-full",
              selectedMode === "vent" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
            )}>
              <Zap className="h-5 w-5" />
            </div>
            <div className="text-left">
              <h3 className="font-medium">Vent Mode</h3>
              <p className="text-sm text-muted-foreground">
                Quick emotional release when you just need to be heard
              </p>
              
              <div className="mt-2">
                <p className="text-xs font-medium">Perfect when you need to:</p>
                <ul className="text-xs list-disc list-inside mt-1 text-muted-foreground">
                  <li>Quickly release built-up emotions</li>
                  <li>Get something off your chest without judgment</li>
                  <li>Feel validated without receiving advice</li>
                </ul>
              </div>
            </div>
          </button>
        </div>
        
        <div className="flex justify-end">
          <Button onClick={handleConfirm}>
            Continue with {selectedMode === "slow" ? "Slow Down" : "Vent"} Mode
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ChatModeSelector;
