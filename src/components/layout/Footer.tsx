import { Heart } from "lucide-react";
const Footer = () => {
  return <footer className="border-t py-6 mt-8">
      <div className="container">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <Heart className="h-5 w-5 text-clarly-500" />
            <span className="font-display font-semibold text-clarly-700">HelloClari</span>
          </div>
          <div className="text-sm text-muted-foreground">
            <p>© 2025 HelloClari. All rights reserved.</p>
          </div>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Terms
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Privacy
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>;
};
export default Footer;