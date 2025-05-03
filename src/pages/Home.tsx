import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Heart, Clock, Zap, Sparkles, MessageSquare, Brain, Shield, ArrowRight } from "lucide-react";
import { useChatContext, MessageMode } from "@/contexts/chat";
const Home = () => {
  const {
    setMode
  } = useChatContext();
  const [selectedMode, setSelectedMode] = useState<MessageMode>("slow");
  const handleStartChat = (mode: MessageMode) => {
    setMode(mode);
  };
  return <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-clarly-50/50 to-support-50/50 py-16 md:py-24">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <div className="animate-fade-up">
              <div className="flex justify-center mb-6">
                <Heart className="h-16 w-16 text-clarly-500" />
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-clarly-600 to-support-600 bg-clip-text text-empath-950">
                Your Emotional Support Companion
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                HelloClarly provides a safe space to express your feelings, find clarity,
                and feel understood — whenever you need it.
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

      {/* Mode Selection Section */}
      <section className="py-16 container">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">Choose Your Support Style</h2>
          <p className="text-center text-muted-foreground mb-10 max-w-2xl mx-auto">
            Select the conversation style that best fits your current needs
          </p>
          
          <div className="grid md:grid-cols-2 gap-8">
            <Card className={`cursor-pointer transition-all duration-300 hover:shadow-md ${selectedMode === "slow" ? "border-clarly-500 shadow-md" : ""} h-full`} onClick={() => setSelectedMode("slow")}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <Clock className="h-5 w-5 mr-2 text-clarly-500" />
                    Slow Down Mode
                  </CardTitle>
                  {selectedMode === "slow" && <Sparkles className="h-5 w-5 text-clarly-500" />}
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
            
            <Card className={`cursor-pointer transition-all duration-300 hover:shadow-md ${selectedMode === "vent" ? "border-clarly-500 shadow-md" : ""} h-full`} onClick={() => setSelectedMode("vent")}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <Zap className="h-5 w-5 mr-2 text-clarly-500" />
                    Vent Mode
                  </CardTitle>
                  {selectedMode === "vent" && <Sparkles className="h-5 w-5 text-clarly-500" />}
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
            <Button size="lg" className="px-6" asChild>
              <Link to="/chat" onClick={() => handleStartChat(selectedMode)}>
                Start Chatting in {selectedMode === "slow" ? "Slow Down" : "Vent"} Mode
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gradient-to-b from-white to-muted/30 rounded-xl">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-4">How HelloClarly Helps</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Our AI-powered emotional support companion is designed to be there for you
          </p>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto">
            {[{
            icon: <MessageSquare className="h-8 w-8 text-clarly-500" />,
            title: "Instant Support",
            description: "Available 24/7 to listen and respond when you need emotional support most."
          }, {
            icon: <Heart className="h-8 w-8 text-clarly-500" />,
            title: "Judgment-Free Zone",
            description: "Share your thoughts without fear of judgment or criticism in a safe space."
          }, {
            icon: <Brain className="h-8 w-8 text-clarly-500" />,
            title: "Personalized Experience",
            description: "Choose between different conversation styles based on your current needs."
          }, {
            icon: <Shield className="h-8 w-8 text-clarly-500" />,
            title: "Private & Secure",
            description: "Your conversations are private and protected with industry-standard encryption."
          }, {
            icon: <Sparkles className="h-8 w-8 text-clarly-500" />,
            title: "Continuous Improvement",
            description: "Our AI evolves to provide better emotional support with every conversation."
          }, {
            icon: <Zap className="h-8 w-8 text-clarly-500" />,
            title: "Unlimited Access",
            description: "Subscribe for unlimited conversations whenever you need support."
          }].map((feature, i) => <Card key={i} className="bg-background border-none shadow-sm hover:shadow-md transition-all">
                <CardHeader>
                  <div className="mb-2">{feature.icon}</div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>)}
          </div>
        </div>
      </section>

      {/* CTA Section */}
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
    </div>;
};
export default Home;