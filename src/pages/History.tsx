
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Clock, MessageSquare } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

interface Conversation {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
  mode: string;
}

const History = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        navigate("/login", { replace: true });
        return;
      }
      
      fetchConversations();
    };
    
    checkAuth();
  }, [navigate]);
  
  const fetchConversations = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .order('updated_at', { ascending: false });
        
      if (error) throw error;
      
      // Generate titles for conversations without titles
      const conversationsWithTitles = await Promise.all(
        (data || []).map(async (conv) => {
          if (!conv.title || conv.title === "New Conversation") {
            // Get the first user message to generate a title
            const { data: messages } = await supabase
              .from('chat_messages')
              .select('content')
              .eq('conversation_id', conv.id)
              .eq('role', 'user')
              .order('created_at', { ascending: true })
              .limit(1);
              
            if (messages && messages.length > 0) {
              const shortTitle = messages[0].content.substring(0, 40) + (messages[0].content.length > 40 ? '...' : '');
              return { ...conv, title: shortTitle };
            }
          }
          return conv;
        })
      );
      
      setConversations(conversationsWithTitles);
    } catch (error) {
      console.error("Error fetching conversations:", error);
      toast.error("Failed to load chat history. Please try again later.");
    } finally {
      setLoading(false);
    }
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    });
  };
  
  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Your Chat History</h1>
          <p className="text-muted-foreground">
            Review and continue your previous conversations
          </p>
        </div>
        
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, index) => (
              <Card key={index} className="border shadow-sm">
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full" />
                </CardContent>
                <CardFooter>
                  <Skeleton className="h-10 w-[100px]" />
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : conversations.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            {conversations.map((conversation) => (
              <Card key={conversation.id} className="border shadow-sm hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="truncate">
                    {conversation.title || "Untitled Conversation"}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {formatDate(conversation.updated_at)}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="capitalize bg-slate-100 px-2 py-0.5 rounded-full text-xs">
                      {conversation.mode} Mode
                    </span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    size="sm" 
                    onClick={() => navigate(`/chat/${conversation.id}`)}
                    className="flex items-center"
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Continue Chat
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 border rounded-lg bg-slate-50">
            <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No conversations yet</h3>
            <p className="text-muted-foreground mb-4">
              Start a new chat to begin your journey with HelloClari
            </p>
            <Button onClick={() => navigate("/chat")}>Start a New Chat</Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
