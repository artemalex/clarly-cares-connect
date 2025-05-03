
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Heart, Clock, Zap, Sparkles, MessageSquare, Brain, Shield, ArrowRight } from "lucide-react";
import { useChatContext, MessageMode } from "@/contexts/chat";
import { cn } from "@/lib/utils";

const Home = () => {
  const { setMode } = useChatContext();
  const [selectedMode, setSelectedMode] = useState<MessageMode>("slow");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Animation delay for staggered entrance
    setIsLoaded(true);
  }, []);

  const handleStartChat = (mode: MessageMode) => {
    setMode(mode);
  };

  // Custom animation classes for staggered entrance
  const getAnimationClass = (index: number) => {
    return cn(
      "transition-all duration-500",
      isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
      { "transition-delay-100": index === 0 },
      { "transition-delay-200": index === 1 },
      { "transition-delay-300": index === 2 },
      { "transition-delay-400": index === 3 },
      { "transition-delay-500": index === 4 },
      { "transition-delay-600": index === 5 },
    );
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section with enhanced styling */}
      <section className="bg-gradient-to-b from-clarly-50/50 via-white/0 to-support-50/50 py-16 md:py-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-clarly-100/20 rounded-full blur-3xl -mr-32 -mt-32" aria-hidden="true"></div>
        <div className="absolute bottom-0 left-0 w-2/3 h-1/2 bg-support-100/20 rounded-full blur-3xl -ml-32 -mb-32" aria-hidden="true"></div>
        
        <div className="container relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className={cn(
              "transition-all duration-700",
              isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
            )}>
              <div className="flex justify-center mb-6">
                <Heart className={cn(
                  "h-16 w-16 text-clarly-500 transition-all duration-1000",
                  isLoaded ? "scale-100 animate-pulse-gentle" : "scale-50"
                )} />
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-clarly-600 to-support-600 bg-clip-text text-transparent">
                Your Emotional Support Companion
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                HelloClarly provides a safe space to express your feelings, find clarity,
                and feel understood — whenever you need it.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  className={cn(
                    "px-8 py-6 text-lg relative overflow-hidden group",
                    "bg-gradient-to-r from-clarly-500 to-clarly-600 hover:from-clarly-600 hover:to-clarly-700"
                  )}
                  asChild
                >
                  <Link to="/chat" onClick={() => handleStartChat(selectedMode)}>
                    <span className="relative z-10 flex items-center">
                      Start Chatting <ArrowRight className="ml-2 transition-transform group-hover:translate-x-1" />
                    </span>
                    <span className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
                  </Link>
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="px-8 py-6 text-lg border-2" 
                  asChild
                >
                  <Link to="/signup">Create Account</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mode Selection Section with enhanced cards */}
      <section className="py-16 container">
        <div className="max-w-5xl mx-auto">
          <h2 className={cn(
            "text-3xl font-bold text-center mb-4 transition-all duration-700",
            isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}>
            Choose Your Support Style
          </h2>
          <p className={cn(
            "text-center text-muted-foreground mb-10 max-w-2xl mx-auto transition-all duration-700 delay-100",
            isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}>
            Select the conversation style that best fits your current needs
          </p>
          
          <div className="grid md:grid-cols-2 gap-8">
            <Card 
              className={cn(
                "cursor-pointer transition-all duration-500",
                "hover:shadow-lg hover:-translate-y-1",
                selectedMode === "slow" ? "border-clarly-500 shadow-md" : "",
                "h-full glassmorphism",
                isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
              )}
              onClick={() => setSelectedMode("slow")}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <Clock className="h-5 w-5 mr-2 text-clarly-500" />
                    Slow Down Mode
                  </CardTitle>
                  {selectedMode === "slow" && (
                    <Sparkles className="h-5 w-5 text-clarly-500 animate-pulse-gentle" />
                  )}
                </div>
                <CardDescription className="text-base">
                  Thoughtful conversations to help you process and reflect
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="font-medium">Perfect when you need to:</p>
                <ul className="list-disc list-inside mt-2 space-y-2 text-muted-foreground">
                  <li>Process complex emotions at your own pace</li>
                  <li>Work through a difficult decision mindfully</li>
                  <li>Find clarity in challenging situations</li>
                </ul>
              </CardContent>
            </Card>
            
            <Card 
              className={cn(
                "cursor-pointer transition-all duration-500 delay-100",
                "hover:shadow-lg hover:-translate-y-1",
                selectedMode === "vent" ? "border-clarly-500 shadow-md" : "",
                "h-full glassmorphism",
                isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
              )}
              onClick={() => setSelectedMode("vent")}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <Zap className="h-5 w-5 mr-2 text-clarly-500" />
                    Vent Mode
                  </CardTitle>
                  {selectedMode === "vent" && (
                    <Sparkles className="h-5 w-5 text-clarly-500 animate-pulse-gentle" />
                  )}
                </div>
                <CardDescription className="text-base">
                  Quick emotional release when you just need to be heard
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="font-medium">Perfect when you need to:</p>
                <ul className="list-disc list-inside mt-2 space-y-2 text-muted-foreground">
                  <li>Quickly release built-up emotions</li>
                  <li>Get something off your chest without judgment</li>
                  <li>Feel validated without receiving advice</li>
                </ul>
              </CardContent>
            </Card>
          </div>
          
          <div className="flex justify-center mt-10">
            <Button 
              size="lg" 
              className={cn(
                "px-6 shadow-md bg-gradient-to-r from-support-500 to-support-600 hover:from-support-600 hover:to-support-700 transition-all duration-500 delay-200",
                isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              )}
              asChild
            >
              <Link to="/chat" onClick={() => handleStartChat(selectedMode)}>
                Start Chatting in {selectedMode === "slow" ? "Slow Down" : "Vent"} Mode
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section with enhanced cards */}
      <section className="py-16 bg-gradient-to-b from-white to-muted/30 rounded-xl">
        <div className="container">
          <h2 className={cn(
            "text-3xl font-bold text-center mb-4",
            "transition-all duration-700 delay-200",
            isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}>
            How HelloClarly Helps
          </h2>
          <p className={cn(
            "text-center text-muted-foreground mb-12 max-w-2xl mx-auto",
            "transition-all duration-700 delay-300",
            isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}>
            Our AI-powered emotional support companion is designed to be there for you
          </p>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto">
            {[
              {
                icon: <MessageSquare className="h-8 w-8 text-clarly-500" />,
                title: "Instant Support",
                description: "Available 24/7 to listen and respond when you need emotional support most."
              },
              {
                icon: <Heart className="h-8 w-8 text-clarly-500" />,
                title: "Judgment-Free Zone",
                description: "Share your thoughts without fear of judgment or criticism in a safe space."
              },
              {
                icon: <Brain className="h-8 w-8 text-clarly-500" />,
                title: "Personalized Experience",
                description: "Choose between different conversation styles based on your current needs."
              },
              {
                icon: <Shield className="h-8 w-8 text-clarly-500" />,
                title: "Private & Secure",
                description: "Your conversations are private and protected with industry-standard encryption."
              },
              {
                icon: <Sparkles className="h-8 w-8 text-clarly-500" />,
                title: "Continuous Improvement",
                description: "Our AI evolves to provide better emotional support with every conversation."
              },
              {
                icon: <Zap className="h-8 w-8 text-clarly-500" />,
                title: "Unlimited Access",
                description: "Subscribe for unlimited conversations whenever you need support."
              }
            ].map((feature, i) => (
              <Card 
                key={i} 
                className={cn(
                  "bg-background border-none shadow-sm hover:shadow-md transition-all hover:-translate-y-1 duration-300 glassmorphism",
                  getAnimationClass(i)
                )}
              >
                <CardHeader>
                  <div className="mb-2 transition-transform hover:scale-110 duration-300">{feature.icon}</div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section with enhanced styling */}
      <section className="py-16 container">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className={cn(
            "text-3xl font-bold mb-4",
            "transition-all duration-700 delay-400",
            isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}>
            Ready to Get Started?
          </h2>
          <p className={cn(
            "text-xl text-muted-foreground mb-8",
            "transition-all duration-700 delay-500",
            isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}>
            Begin your journey to better emotional well-being today with HelloClarly.
          </p>
          <Button 
            size="lg" 
            className={cn(
              "px-8 py-6 text-lg shadow-lg relative group overflow-hidden",
              "bg-gradient-to-r from-clarly-500 to-support-500",
              "hover:from-clarly-600 hover:to-support-600",
              "transition-all duration-700 delay-600",
              isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            )} 
            asChild
          >
            <Link to="/chat" onClick={() => handleStartChat(selectedMode)}>
              <span className="relative z-10">Start Your First Conversation</span>
              <span className="absolute inset-0 bg-white/10 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></span>
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Home;
