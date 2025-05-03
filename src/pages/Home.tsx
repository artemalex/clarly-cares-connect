
import { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useChatContext, MessageMode } from "@/contexts/chat";
import StickyCTA from "@/components/ui/sticky-cta";
import ChatModeSelector from "@/components/chat/ChatModeSelector";

// Imported components
import HeroSection from "@/components/home/HeroSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import PricingSection from "@/components/home/PricingSection";
import CTASection from "@/components/home/CTASection";

const Home = () => {
  const {
    setMode,
    startNewChat
  } = useChatContext();
  const [selectedMode, setSelectedMode] = useState<MessageMode>("slow");
  const [modeSelectorOpen, setModeSelectorOpen] = useState(false);
  const navigate = useNavigate();
  
  // Track last click time to prevent double clicks
  const lastClickTimeRef = useRef<number>(0);
  
  const handleStartChat = (mode: MessageMode) => {
    setMode(mode);
    startNewChat();
    navigate("/chat");
  };
  
  // Improved handler with debounce mechanism
  const handleOpenModeSelector = useCallback(() => {
    const now = Date.now();
    const timeSinceLastClick = now - lastClickTimeRef.current;
    
    // Only open if it's not already open AND enough time has passed (300ms)
    if (!modeSelectorOpen && timeSinceLastClick > 300) {
      console.log('Opening mode selector');
      lastClickTimeRef.current = now;
      setModeSelectorOpen(true);
    }
  }, [modeSelectorOpen]);
  
  const handleSelectMode = (mode: MessageMode) => {
    setMode(mode);
    setModeSelectorOpen(false);
    startNewChat();
    navigate("/chat");
  };
  
  // Handler for closing the modal that ensures state is properly reset
  const handleCloseModal = () => {
    console.log('Closing mode selector');
    setModeSelectorOpen(false);
  };
  
  return (
    <div className="min-h-screen">
      {/* Component Sections */}
      <HeroSection 
        selectedMode={selectedMode} 
        handleStartChat={handleStartChat} 
      />
      <FeaturesSection />
      <TestimonialsSection />
      <PricingSection />
      <CTASection 
        selectedMode={selectedMode} 
        handleStartChat={handleStartChat} 
      />
      
      {/* Sticky CTA that appears after scrolling */}
      <StickyCTA text="Start for Free" onClick={handleOpenModeSelector} scrollThreshold={25} />
      
      {/* Chat Mode Selector Dialog */}
      <ChatModeSelector
        isOpen={modeSelectorOpen}
        onClose={handleCloseModal}
        onSelectMode={handleSelectMode}
      />
    </div>
  );
};

export default Home;
