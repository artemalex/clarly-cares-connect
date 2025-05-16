
import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { useChatContext } from "@/contexts/ChatContext";

const SubscriptionSuccess = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const sessionId = params.get('session_id');
  const [isVerifying, setIsVerifying] = useState(true);
  const { checkSubscriptionStatus } = useChatContext();
  
  useEffect(() => {
    const verifySubscription = async () => {
      try {
        // Call the check-subscription endpoint to update subscription status
        await supabase.functions.invoke('check-subscription');
        
        // Update the context
        await checkSubscriptionStatus();
        
        setIsVerifying(false);
      } catch (error) {
        console.error("Error verifying subscription:", error);
        toast.error("Failed to verify subscription status. Please contact support if you continue to have issues.");
        setIsVerifying(false);
      }
    };
    
    verifySubscription();
  }, []);

  return (
    <div className="container py-12 max-w-xl mx-auto">
      <Card className="p-8 text-center">
        {isVerifying ? (
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <h1 className="text-2xl font-bold">Verifying your subscription...</h1>
            <p className="text-muted-foreground">Please wait while we confirm your payment.</p>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-6">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              <CheckCircle className="h-10 w-10 text-primary" />
            </div>
            <h1 className="text-3xl font-bold">Welcome to Premium!</h1>
            <p className="text-lg text-muted-foreground max-w-md">
              Your subscription was successful. You now have access to all premium features and 3,000 messages per month.
            </p>
            <div className="flex space-x-4 mt-6">
              <Button asChild size="lg">
                <Link to="/chat">Continue to Chat</Link>
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default SubscriptionSuccess;
