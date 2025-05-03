
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MessageMode } from "@/contexts/chat";

interface CTASectionProps {
  selectedMode: MessageMode;
  handleStartChat: (mode: MessageMode) => void;
}

const CTASection = ({ selectedMode, handleStartChat }: CTASectionProps) => {
  return (
    <section className="py-16 container">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
        <p className="text-xl text-muted-foreground mb-8">
          Begin your journey to better emotional well-being today with HelloClarly.
        </p>
        <Button size="lg" className="px-8 py-6 text-lg" asChild>
          <Link to="/chat" onClick={() => handleStartChat(selectedMode)}>
            Start Your First Conversation
          </Link>
        </Button>
      </div>
    </section>
  );
};

export default CTASection;
