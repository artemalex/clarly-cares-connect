
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Heart, LogOut, History, User } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { User as SupabaseUser } from "@supabase/supabase-js";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";

const Navbar = () => {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({
      data: {
        session
      }
    }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const {
      data: {
        subscription
      }
    } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);
  
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out successfully");
    navigate("/");
  };
  
  const getInitials = (email: string) => {
    return email.substring(0, 2).toUpperCase();
  };
  
  return <nav className="border-b bg-beige-400/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container flex items-center justify-between py-[14px] px-0">
        <Link to="/" className="flex items-center space-x-2 group">
          <Heart className="h-8 w-8 text-lavender-400 group-hover:scale-110 transition-transform" />
          <span className="font-display font-semibold bg-gradient-to-r from-lavender-600 to-coral-400 bg-clip-text text-transparent text-2xl">
            HelloClari
          </span>
        </Link>
        <div className="flex items-center space-x-2 md:space-x-4">
          {/* Only show Chat History for logged in users */}
          {user && <Button variant="ghost" asChild className={isMobile ? "px-2" : ""}>
              <Link to="/history">
                {isMobile ? <History className="h-4 w-4 text-eggplant-500" /> : "Chat History"}
              </Link>
            </Button>}
          
          {user ? <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="rounded-full w-10 h-10 p-0 border-teal-400">
                  <Avatar>
                    <AvatarFallback className="bg-lavender-300 text-eggplant-800">
                      {user.email ? getInitials(user.email) : "HC"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem className="text-sm opacity-70 text-eggplant-500">
                  {user.email}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/chat" className="cursor-pointer text-eggplant-700">My Chats</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/history" className="cursor-pointer flex items-center text-eggplant-700">
                    <History className="h-4 w-4 mr-2 text-eggplant-500" />
                    Chat History
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="cursor-pointer flex items-center text-eggplant-700">
                    <User className="h-4 w-4 mr-2 text-eggplant-500" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-red-500 focus:text-red-500">
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu> : <>
              <Button variant="outline" asChild className={`border-teal-400 text-eggplant-700 hover:bg-lavender-100 ${isMobile ? "px-3 py-1 h-auto text-sm" : ""}`}>
                <Link to="/login">Log In</Link>
              </Button>
              <Button asChild className={`bg-lavender-400 hover:bg-lavender-500 text-white ${isMobile ? "px-3 py-1 h-auto text-sm" : ""}`}>
                <Link to="/signup">Sign Up</Link>
              </Button>
            </>}
        </div>
      </div>
    </nav>;
};

export default Navbar;
