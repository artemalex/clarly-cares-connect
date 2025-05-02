
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { useChatContext } from "@/contexts/ChatContext";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

interface PaywallModalProps {
  open: boolean;
  onClose: () => void;
}

const PaywallModal = ({ open, onClose }: PaywallModalProps) => {
  const { remainingMessages } = useChatContext();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = async () => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {});
      
      if (error) {
        throw new Error(error.message);
      }
      
      if (data?.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.url;
      } else {
        throw new Error("Failed to create checkout session");
      }
    } catch (error) {
      console.error("Subscription error:", error);
      toast.error("Failed to start subscription process. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-display text-center">
            {remainingMessages <= 0 ? "Message Limit Reached" : "Upgrade to Premium"}
          </DialogTitle>
          <DialogDescription className="text-center pt-2">
            {remainingMessages <= 0 
              ? "You've used all your free messages for today." 
              : "Get unlimited access to Dr. Clarly"}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="rounded-lg border p-4 bg-muted/30">
            <h3 className="font-medium text-lg mb-2">Premium Plan</h3>
            <p className="text-2xl font-bold mb-4">$9.99<span className="text-sm font-normal text-muted-foreground">/month</span></p>
            
            <ul className="space-y-2">
              {[
                "3,000 messages per month",
                "Priority support",
                "Save conversation history",
                "Access to all conversation modes"
              ].map((feature, i) => (
                <li key={i} className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-secondary mr-2" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="flex flex-col space-y-2">
            <Button onClick={handleSubscribe} disabled={isLoading} className="w-full">
              {isLoading ? "Processing..." : "Subscribe Now"}
            </Button>
            <Button variant="outline" onClick={onClose} className="w-full">
              Maybe Later
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaywallModal;
