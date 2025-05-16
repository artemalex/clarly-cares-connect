import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useNavigate, Link } from "react-router-dom";
import { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { MessageSquare, Clock, CreditCard, Gift } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useChatContext } from "@/contexts/chat";

interface Conversation {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
  mode: string;
}

const Profile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [displayName, setDisplayName] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoadingConversations, setIsLoadingConversations] = useState(false);
  const [isCreatingCheckout, setIsCreatingCheckout] = useState(false);
  const { messagesUsed, remainingMessages, isSubscribed, freeTrialActive, freeTrialEndDate, checkSubscriptionStatus } = useChatContext();
  
  const navigate = useNavigate();
  
  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        navigate("/login", { replace: true });
        return;
      }
      
      setUser(data.session.user);
      fetchUserProfile(data.session.user);
    };
    
    checkAuth();
  }, [navigate]);
  
  const fetchUserProfile = async (user: User) => {
    try {
      // Refresh subscription status
      await checkSubscriptionStatus();
      
      // Get user metadata if available
      const metadata = user.user_metadata;
      if (metadata && metadata.name) {
        setDisplayName(metadata.name);
      }
      
      // Fetch recent conversations
      fetchRecentConversations();
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error("Failed to load profile data");
    } finally {
      setLoading(false);
    }
  };
  
  const fetchRecentConversations = async () => {
    setIsLoadingConversations(true);
    try {
      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .order('updated_at', { ascending: false })
        .limit(5);
        
      if (error) throw error;
      
      setConversations(data || []);
    } catch (error) {
      console.error("Error fetching conversations:", error);
      toast.error("Failed to load recent conversations");
    } finally {
      setIsLoadingConversations(false);
    }
  };
  
  const updateProfile = async () => {
    if (!user) return;
    
    setIsSaving(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: { name: displayName }
      });
      
      if (error) throw error;
      
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleManageSubscription = async () => {
    if (!user) return;
    
    setIsCreatingCheckout(true);
    try {
      if (isSubscribed) {
        // Direct user to customer portal to manage their subscription
        const { data, error } = await supabase.functions.invoke('customer-portal');
        if (error) throw error;
        
        // Redirect to Stripe Customer Portal
        window.location.href = data.url;
      } else {
        // Create checkout session for new subscription
        const { data, error } = await supabase.functions.invoke('create-checkout');
        if (error) throw error;
        
        // Redirect to Stripe Checkout
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Error managing subscription:", error);
      toast.error("Failed to process subscription request");
    } finally {
      setIsCreatingCheckout(false);
    }
  };
  
  const getInitials = (email: string) => {
    return email.substring(0, 2).toUpperCase();
  };
  
  const formatDate = (dateString: string | Date | null) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    });
  };
  
  if (loading) {
    return (
      <div className="container py-8">
        <div className="max-w-3xl mx-auto">
          <Skeleton className="h-12 w-1/3 mb-6" />
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-1/4" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-20 w-20 rounded-full mx-auto" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
  
  if (!user) return null;
  
  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Your Profile</h1>
        
        <Tabs defaultValue="profile">
          <TabsList className="mb-6">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="usage">Usage Stats</TabsTrigger>
            <TabsTrigger value="history">Chat History</TabsTrigger>
            <TabsTrigger value="subscription">Subscription</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>
                  Update your profile information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex justify-center">
                  <Avatar className="h-20 w-20">
                    <AvatarFallback className="text-xl">
                      {user.email ? getInitials(user.email) : "HC"}
                    </AvatarFallback>
                  </Avatar>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      value={user.email || ""}
                      disabled 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="displayName">Display Name</Label>
                    <Input 
                      id="displayName" 
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="Enter your name"
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={updateProfile} disabled={isSaving}>
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="usage">
            <Card>
              <CardHeader>
                <CardTitle>Usage Statistics</CardTitle>
                <CardDescription>
                  Track your conversation usage
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {freeTrialActive && freeTrialEndDate && (
                  <div className="bg-green-50 border border-green-100 p-4 rounded-lg text-center mb-4">
                    <Gift className="h-5 w-5 text-green-600 mx-auto mb-2" />
                    <h3 className="text-lg font-medium text-green-800">Free Trial Active</h3>
                    <p className="text-sm text-green-700">
                      You have premium access until {formatDate(freeTrialEndDate)}
                    </p>
                  </div>
                )}
              
                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Messages Used</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-4xl font-bold">{messagesUsed}</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Messages Remaining</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-4xl font-bold">
                        {isSubscribed ? "Unlimited" : remainingMessages}
                      </p>
                      {!isSubscribed && !freeTrialActive && remainingMessages <= 3 && (
                        <p className="text-sm text-amber-500 mt-2">
                          You're running low on messages! Consider upgrading.
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </div>
                
                {!isSubscribed && !freeTrialActive && (
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      Need more messages? Consider upgrading your subscription for unlimited access.
                    </p>
                    <Button 
                      variant="outline" 
                      className="mt-2"
                      onClick={handleManageSubscription}
                      disabled={isCreatingCheckout}
                    >
                      {isCreatingCheckout ? "Processing..." : "Upgrade Now"}
                    </Button>
                  </div>
                )}
                
                <Button 
                  variant="ghost" 
                  className="w-full"
                  onClick={() => checkSubscriptionStatus()}
                >
                  Refresh Stats
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Recent Conversations</CardTitle>
                <CardDescription>
                  Your recent chat history with HelloClari
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingConversations ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, index) => (
                      <div key={index} className="space-y-2">
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                      </div>
                    ))}
                  </div>
                ) : conversations.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Conversation</TableHead>
                        <TableHead>Mode</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {conversations.map((conversation) => (
                        <TableRow key={conversation.id}>
                          <TableCell className="font-medium">
                            {conversation.title || "Untitled Conversation"}
                          </TableCell>
                          <TableCell className="capitalize">
                            {conversation.mode}
                          </TableCell>
                          <TableCell>
                            {formatDate(conversation.updated_at)}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              asChild
                            >
                              <Link to={`/chat/${conversation.id}`}>
                                Continue
                              </Link>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8">
                    <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No conversations yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Start a new chat with HelloClari
                    </p>
                    <Button asChild>
                      <Link to="/chat">Start Chatting</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={fetchRecentConversations}>
                  Refresh
                </Button>
                <Button asChild>
                  <Link to="/history">View All History</Link>
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="subscription">
            <Card>
              <CardHeader>
                <CardTitle>Subscription Management</CardTitle>
                <CardDescription>
                  Manage your HelloClari subscription
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-slate-50 p-6 rounded-lg text-center">
                  <div className="mb-6">
                    <span className="inline-block bg-white p-3 rounded-full shadow mb-4">
                      <CreditCard className="h-8 w-8 text-clarly-500" />
                    </span>
                    <h3 className="text-xl font-bold mb-2">
                      {isSubscribed ? (freeTrialActive ? "Free Trial" : "HelloClari Premium") : "Free Plan"}
                    </h3>
                    <p className="text-muted-foreground">
                      {isSubscribed 
                        ? (freeTrialActive 
                          ? `You have premium access until ${formatDate(freeTrialEndDate)}` 
                          : "You have access to all premium features")
                        : "Upgrade to get unlimited messages and premium features"}
                    </p>
                  </div>
                  
                  {isSubscribed && !freeTrialActive ? (
                    <div className="space-y-4">
                      <div className="px-4 py-3 bg-green-50 text-green-700 rounded-md text-sm">
                        Your subscription is active
                      </div>
                      <Button 
                        onClick={handleManageSubscription} 
                        disabled={isCreatingCheckout}
                      >
                        {isCreatingCheckout ? "Processing..." : "Manage Subscription"}
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="grid gap-4">
                        <div className="flex items-center justify-between p-4 border rounded-md">
                          <div className="font-medium">Free Plan</div>
                          <div>6 messages / month</div>
                        </div>
                        {freeTrialActive && (
                          <div className="flex items-center justify-between p-4 border-2 border-green-200 bg-green-50 rounded-md">
                            <div className="font-medium">Free Trial</div>
                            <div>3,000 messages</div>
                          </div>
                        )}
                        <div className="flex items-center justify-between p-4 border border-clarly-200 bg-clarly-50 rounded-md">
                          <div className="font-medium">Premium</div>
                          <div>3,000 messages / month</div>
                        </div>
                      </div>
                      {!freeTrialActive && (
                        <Button 
                          onClick={handleManageSubscription} 
                          disabled={isCreatingCheckout}
                          className="w-full"
                        >
                          {isCreatingCheckout ? "Processing..." : "Upgrade to Premium - $9.99/month"}
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;
