
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MessageMode } from "@/contexts/chat";
interface CTASectionProps {
  selectedMode: MessageMode;
  handleStartChat: (mode: MessageMode) => void;
  handleOpenModeSelector: () => void;
}
const CTASection = ({
  selectedMode,
  handleStartChat,
  handleOpenModeSelector
}: CTASectionProps) => {
  return <section className="py-16 container">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Feel Lighter?</h2>
        <p className="text-xl text-muted-foreground mb-8">Start your first chat with HelloClari now and see how fast work stress eases.</p>
        <Button size="lg" className="px-8 py-6 text-lg" onClick={handleOpenModeSelector}>
          Start Your First Conversation
        </Button>
      </div>
    </section>;
};
export default CTASection;
