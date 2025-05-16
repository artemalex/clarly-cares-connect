
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { useChatContext } from "@/contexts/chat";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface PaywallModalProps {
  open: boolean;
  onClose: () => void;
}

const PaywallModal = ({ open, onClose }: PaywallModalProps) => {
  const { remainingMessages, isSubscribed, freeTrialActive, freeTrialEndDate } = useChatContext();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const formatDate = (date: Date | null) => {
    if (!date) return "";
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleSubscribe = async () => {
    setIsLoading(true);
    
    try {
      // Check if user is logged in
      const { data: sessionData } = await supabase.auth.getSession();
      
      if (!sessionData.session) {
        // Redirect to login if not logged in
        toast.info("Please sign in to subscribe.");
        navigate("/login?redirect=subscribe");
        onClose();
        return;
      }
      
      // Call the checkout function
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

  // If user is subscribed but somehow still seeing the paywall, provide helpful message
  if (isSubscribed && remainingMessages <= 0) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-display text-center">Message Limit Reached</DialogTitle>
            <DialogDescription className="text-center pt-2">
              You've used all your premium messages for this month.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center pt-4">
            <Button onClick={onClose}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

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
              : "Get unlimited access to HelloClarly"}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          {freeTrialActive && freeTrialEndDate && (
            <div className="rounded-lg border border-green-100 bg-green-50 p-4 text-center">
              <h3 className="font-medium text-green-800">Your Free Trial is Active!</h3>
              <p className="text-green-700 text-sm mt-1">
                You have premium access until {formatDate(freeTrialEndDate)}
              </p>
            </div>
          )}
        
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
            {!freeTrialActive && (
              <Button onClick={handleSubscribe} disabled={isLoading} className="w-full">
                {isLoading ? "Processing..." : "Subscribe Now"}
              </Button>
            )}
            <Button variant="outline" onClick={onClose} className="w-full">
              {freeTrialActive ? "Continue Using Free Trial" : "Maybe Later"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaywallModal;
