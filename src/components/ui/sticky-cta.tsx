
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

interface StickyCTAProps {
  text: string;
  linkTo: string;
  scrollThreshold?: number; // Percentage of page height (0-100)
}

export const StickyCTA = ({
  text,
  linkTo,
  scrollThreshold = 25,
}: StickyCTAProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const docHeight = document.body.scrollHeight;
      
      // Calculate the scroll percentage
      const scrollPercentage = (scrollPosition / (docHeight - windowHeight)) * 100;
      
      // Show when scrolled past threshold, hide when near the top
      if (scrollPercentage >= scrollThreshold && scrollPosition > 100) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrollThreshold]);

  return (
    <div
      className={`fixed bottom-6 left-0 right-0 z-50 flex justify-center transition-all duration-300 ${
        isVisible
          ? "translate-y-0 opacity-100"
          : "translate-y-16 opacity-0 pointer-events-none"
      }`}
    >
      <Button
        size="lg"
        className="px-6 py-6 text-lg shadow-lg animate-fade-up"
        asChild
      >
        <Link to={linkTo}>
          {text} <ArrowRight className="ml-2" />
        </Link>
      </Button>
    </div>
  );
};

export default StickyCTA;
