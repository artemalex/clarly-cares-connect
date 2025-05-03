
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Heart } from "lucide-react";
import { MessageMode } from "@/contexts/chat";

interface HeroSectionProps {
  selectedMode: MessageMode;
  handleStartChat: (mode: MessageMode) => void;
}

const HeroSection = ({ selectedMode, handleStartChat }: HeroSectionProps) => {
  return (
    <section className="bg-gradient-to-b from-clarly-50/50 to-support-50/50 py-16 md:py-24">
      <div className="container">
        <div className="max-w-4xl mx-auto text-center">
          <div className="animate-fade-up">
            <div className="flex justify-center mb-6">
              <Heart className="h-16 w-16 text-clarly-500" />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-clarly-600 to-support-600 bg-clip-text text-empath-950">
              When work drains you emotionally, talk to Clari.
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Instant, confidential AI support—no HR forms, no therapy bills, just calm breath back.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="px-8 py-6 text-lg" asChild>
                <Link to="/chat" onClick={() => handleStartChat(selectedMode)}>
                  Start Chatting <ArrowRight className="ml-2" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="px-8 py-6 text-lg" asChild>
                <Link to="/signup">Create Account</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
