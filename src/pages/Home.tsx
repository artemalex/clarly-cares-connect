
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Heart, Clock, Zap, Sparkles, MessageSquare } from "lucide-react";
import { useChatContext, MessageMode } from "@/contexts/ChatContext";

const Home = () => {
  const { setMode } = useChatContext();
  const [selectedMode, setSelectedMode] = useState<MessageMode>("slow");

  const handleStartChat = (mode: MessageMode) => {
    setMode(mode);
  };

  return (
    <div className="container py-12">
      <section className="max-w-4xl mx-auto text-center mb-16">
        <div className="flex justify-center mb-6">
          <Heart className="h-16 w-16 text-clarly-500" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-clarly-600 to-support-600 bg-clip-text text-transparent">
          Your Emotional Support Companion
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Dr. Clarly provides a safe space to express your feelings, find clarity,
          and feel understood — whenever you need it.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" asChild>
            <Link to="/chat" onClick={() => handleStartChat(selectedMode)}>
              Start Chatting
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link to="/signup">Create Account</Link>
          </Button>
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-12">Choose Your Support Style</h2>
        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          <Card 
            className={`cursor-pointer transition-all duration-300 hover:shadow-md ${selectedMode === "slow" ? "border-clarly-500 shadow-md" : ""}`}
            onClick={() => setSelectedMode("slow")}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-clarly-500" />
                  Slow Down Mode
                </CardTitle>
                {selectedMode === "slow" && <Sparkles className="h-5 w-5 text-clarly-500" />}
              </div>
              <CardDescription>
                Thoughtful conversations to help you process and reflect
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Perfect when you need to:</p>
              <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
                <li>Process complex emotions</li>
                <li>Work through a difficult decision</li>
                <li>Find clarity in a challenging situation</li>
              </ul>
            </CardContent>
          </Card>
          
          <Card 
            className={`cursor-pointer transition-all duration-300 hover:shadow-md ${selectedMode === "vent" ? "border-clarly-500 shadow-md" : ""}`}
            onClick={() => setSelectedMode("vent")}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <Zap className="h-5 w-5 mr-2 text-clarly-500" />
                  Vent Mode
                </CardTitle>
                {selectedMode === "vent" && <Sparkles className="h-5 w-5 text-clarly-500" />}
              </div>
              <CardDescription>
                Quick emotional release when you just need to be heard
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Perfect when you need to:</p>
              <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
                <li>Quickly release built-up tension</li>
                <li>Get something off your chest</li>
                <li>Feel validated without advice</li>
              </ul>
            </CardContent>
          </Card>
        </div>
        
        <div className="flex justify-center mt-8">
          <Button size="lg" asChild>
            <Link to="/chat" onClick={() => handleStartChat(selectedMode)}>
              Start Chatting in {selectedMode === "slow" ? "Slow Down" : "Vent"} Mode
            </Link>
          </Button>
        </div>
      </section>

      <section className="py-12 bg-muted/30 rounded-xl px-4">
        <h2 className="text-3xl font-bold text-center mb-12">How Dr. Clarly Helps</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {[
            {
              icon: <MessageSquare className="h-8 w-8 text-clarly-500" />,
              title: "Instant Support",
              description: "Available 24/7 to listen and respond when you need emotional support."
            },
            {
              icon: <Heart className="h-8 w-8 text-clarly-500" />,
              title: "Judgment-Free Zone",
              description: "Share your thoughts without fear of judgment or criticism."
            },
            {
              icon: <Sparkles className="h-8 w-8 text-clarly-500" />,
              title: "Personalized Experience",
              description: "Choose between different conversation styles to match your needs."
            }
          ].map((feature, i) => (
            <Card key={i} className="bg-background">
              <CardHeader>
                <div className="mb-2">{feature.icon}</div>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
