
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container flex items-center justify-between py-4">
        <Link to="/" className="flex items-center space-x-2 group">
          <Heart className="h-8 w-8 text-clarly-500 group-hover:scale-110 transition-transform" />
          <span className="text-2xl font-display font-semibold bg-gradient-to-r from-clarly-600 to-support-600 bg-clip-text text-transparent">
            HelloClarly
          </span>
        </Link>
        <div className="flex items-center space-x-4">
          <Button variant="ghost" asChild>
            <Link to="/chat">Chat Now</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/login">Log In</Link>
          </Button>
          <Button asChild>
            <Link to="/signup">Sign Up</Link>
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
