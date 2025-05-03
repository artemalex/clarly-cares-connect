
import React from "react";
import { Button } from "@/components/ui/button";
import { useChatContext } from "@/contexts/chat";

interface SuggestionButtonsProps {
  suggestions: string[];
}

const SuggestionButtons: React.FC<SuggestionButtonsProps> = ({ suggestions }) => {
  const { sendMessage } = useChatContext();
  
  if (!suggestions || suggestions.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {suggestions.map((suggestion, index) => (
        <Button
          key={index}
          variant="outline"
          size="sm"
          className="text-xs text-left whitespace-normal h-auto py-1 bg-muted/50"
          onClick={() => sendMessage(suggestion)}
        >
          {suggestion}
        </Button>
      ))}
    </div>
  );
};

export default SuggestionButtons;
