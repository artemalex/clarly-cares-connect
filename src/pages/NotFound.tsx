
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";

const NotFound = () => {
  return (
    <div className="container flex flex-col items-center justify-center text-center h-[70vh] py-16">
      <Heart className="h-16 w-16 text-clarly-500 mb-6" />
      <h1 className="text-4xl font-bold mb-4">Page Not Found</h1>
      <p className="text-xl text-muted-foreground mb-8 max-w-md">
        We can't seem to find the page you're looking for. Let's get you back on track.
      </p>
      <Button asChild>
        <Link to="/">
          Return Home
        </Link>
      </Button>
    </div>
  );
};

export default NotFound;
