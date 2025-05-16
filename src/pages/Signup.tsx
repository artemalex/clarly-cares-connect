import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Heart } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { clearGuestId, getGuestId } from "@/utils/guestUtils";

const Signup = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!acceptTerms) {
      setError("You must accept the terms and conditions to create an account.");
      return;
    }
    
    if (!email || !password) {
      setError("Please fill in all required fields.");
      return;
    }
    
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) throw error;
      
      if (data.user) {
        // Set up trial period
        const trialEndsAt = new Date();
        trialEndsAt.setDate(trialEndsAt.getDate() + 7);

        await supabase
          .from('subscriptions')
          .insert({
            user_id: data.user.id,
            is_active: false,
            trial_ends_at: trialEndsAt.toISOString(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });

        toast.success("Account created successfully! You have 7 days of free access.");
        navigate("/chat");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred during signup.");
      toast.error("Signup failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleGoogleSignup = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/chat`
        }
      });
      
      if (error) throw error;
    } catch (err: any) {
      setError(err.message || "An error occurred during Google signup.");
      toast.error("Google signup failed. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="container flex items-center justify-center py-16">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-2">
            <Heart className="h-8 w-8 text-clarly-500" />
          </div>
          <CardTitle className="text-2xl">Create an account</CardTitle>
          <CardDescription>
            Enter your email below to create your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <form onSubmit={handleEmailSignup} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="m@example.com" 
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="terms" 
                checked={acceptTerms}
                onCheckedChange={(checked) => setAcceptTerms(checked === true)}
              />
              <Label htmlFor="terms" className="text-sm">
                I agree to the{" "}
                <Link to="/terms" className="text-clarly-600 hover:underline">
                  terms and conditions
                </Link>
              </Label>
            </div>
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>
          
          <div className="flex items-center my-4">
            <Separator className="flex-1" />
            <span className="px-3 text-sm text-muted-foreground">Or continue with</span>
            <Separator className="flex-1" />
          </div>
          
          <Button 
            type="button"
            variant="outline" 
            className="w-full flex items-center justify-center space-x-2"
            onClick={handleGoogleSignup}
            disabled={isLoading}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" className="h-5 w-5">
              <path fill="#EA4335" d="M12 5c1.6168 0 3.1013.5978 4.2.1.5853.9 1.0922 2.1 1.354 3.4H23v3.1h-5.4458c-.4765 1.8-1.5566 3.3-3.0822 4.3C16.0678 19.2 14.142 20 12 20c-2.1421 0-4.0678-.8-5.472-2.1-1.4045-1.3-2.3278-3.2-2.472-5.2C3.9278 11 4.1222 9.3 4.8 7.9c.678-1.4 1.7678-2.6 3.128-3.4C9.2878 3.7 10.5981 3.3 12 3.3V5z"/>
              <path fill="#34A853" d="M12 5v4h5.4458c-.2618-1.3-.7687-2.5-1.354-3.4C14.9013 5.5978 13.4168 5 12 5z"/>
              <path fill="#4A90E2" d="M23 8.5h-5.5542c.2618 1.3.7687 2.5 1.354 3.4 1.0987.9 2.5832 1.5 4.0002 1.5V8.5z"/>
              <path fill="#FBBC05" d="M4 8.5c.1442 2 1.0675 3.9 2.472 5.2C7.8762 15 9.8019 15.8 12 15.8v-4H4v-3.3z"/>
            </svg>
            <span>Sign up with Google</span>
          </Button>
        </CardContent>
        <CardFooter className="flex flex-col">
          <p className="text-sm text-muted-foreground text-center">
            Already have an account?{" "}
            <Link to="/login" className="text-clarly-600 hover:underline">
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Signup;
