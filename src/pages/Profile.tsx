
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";
import { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

const Profile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [displayName, setDisplayName] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [usageStats, setUsageStats] = useState({
    messagesUsed: 0,
    messagesLimit: 0
  });
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
      // Fetch user limits
      const { data: limitsData, error: limitsError } = await supabase
        .from('user_limits')
        .select('*')
        .eq('user_id', user.id)
        .single();
        
      if (limitsError && limitsError.code !== 'PGRST116') {
        throw limitsError;
      }
      
      if (limitsData) {
        setUsageStats({
          messagesUsed: limitsData.messages_used || 0,
          messagesLimit: limitsData.messages_limit || 0
        });
      }
      
      // Get user metadata if available
      const metadata = user.user_metadata;
      if (metadata && metadata.name) {
        setDisplayName(metadata.name);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error("Failed to load profile data");
    } finally {
      setLoading(false);
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
  
  const getInitials = (email: string) => {
    return email.substring(0, 2).toUpperCase();
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
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Your Profile</h1>
        
        <Tabs defaultValue="profile">
          <TabsList className="mb-6">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="usage">Usage Stats</TabsTrigger>
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
                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Messages Used</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-4xl font-bold">{usageStats.messagesUsed}</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Messages Limit</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-4xl font-bold">{usageStats.messagesLimit}</p>
                      <p className="text-sm text-muted-foreground mt-2">
                        {usageStats.messagesUsed >= usageStats.messagesLimit 
                          ? "You've reached your limit" 
                          : `${usageStats.messagesLimit - usageStats.messagesUsed} messages remaining`
                        }
                      </p>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="bg-slate-50 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    Need more messages? Consider upgrading your subscription for unlimited access.
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" onClick={() => navigate("/chat")}>
                  Go to Chat
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;
