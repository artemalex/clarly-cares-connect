import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
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

  // Reset selected mode when the dialog opens
  useEffect(() => {
    if (isOpen) {
      console.log('Mode selector opened');
    }
  }, [isOpen]);
  const handleConfirm = () => {
    console.log('Confirming mode selection:', selectedMode);
    onSelectMode(selectedMode);
  };
  const handleDialogChange = (open: boolean) => {
    if (!open) {
      console.log('Dialog closed via UI interaction');
      onClose();
    }
  };
  return <Dialog open={isOpen} onOpenChange={handleDialogChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">Pick the mode that fits your mood</DialogTitle>
          
        </DialogHeader>
        
        <div className="flex flex-col gap-4 py-4">
          <button onClick={() => setSelectedMode("vent")} className={cn("flex items-start gap-3 p-4 rounded-lg border transition-all", selectedMode === "vent" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50")}>
            
            <div className="text-left">
              <h3 className="font-medium">🔥 Vent Mode</h3>
              
              
              <div className="mt-2">
                <ul className="text-xs list-disc list-inside mt-1 text-muted-foreground">
                  <li>Get things off your chest fast</li>
                  <li>Speak freely without judgment</li>
                  <li>Feel heard — not analyzed</li>
                </ul>
              </div>
            </div>
          </button>
          
          <button onClick={() => setSelectedMode("slow")} className={cn("flex items-start gap-3 p-4 rounded-lg border transition-all", selectedMode === "slow" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50")}>
            
            <div className="text-left">
              <h3 className="font-medium">🧠 Reflect Mode</h3>
              
              
              <div className="mt-2">
                <ul className="text-xs list-disc list-inside mt-1 text-muted-foreground">
                  <li>Untangle mixed emotions</li>
                  <li>Make sense of a tough moment</li>
                  <li>Talk it out at your own pace</li>
                </ul>
              </div>
            </div>
          </button>
        </div>
        
        <div className="flex justify-end">
          <Button onClick={handleConfirm}>
            Continue with {selectedMode === "slow" ? "Reflect" : "Vent"} Mode
          </Button>
        </div>
      </DialogContent>
    </Dialog>;
};
export default ChatModeSelector;