import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Heart, Clock, Zap, Sparkles, MessageSquare, Brain, Shield, ArrowRight, Check, Star } from "lucide-react";
import { useChatContext, MessageMode } from "@/contexts/chat";
import StickyCTA from "@/components/ui/sticky-cta";

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

      {/* Testimonials Section */}
      <section className="py-16 bg-background">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">What People Are Saying</h2>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                quote: "EmpathAI gave me a safe place to process my emotions after difficult meetings. It's like having a pocket therapist who's always available.",
                name: "Jamie",
                role: "Product Manager"
              },
              {
                quote: "When I felt invisible at work, EmpathAI helped me feel seen. It's the emotional support I didn't know I needed until I tried it.",
                name: "Taylor",
                role: "UX Designer"
              },
              {
                quote: "Instead of bottling up my feelings or venting to colleagues, I can talk to EmpathAI. It's made a huge difference in my work relationships.",
                name: "Alex",
                role: "Team Lead"
              }
            ].map((testimonial, i) => (
              <Card key={i} className="bg-white border shadow-sm">
                <CardContent className="pt-6">
                  <div className="flex mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="h-5 w-5 fill-clarly-500 text-clarly-500" />
                    ))}
                  </div>
                  <p className="mb-6 italic text-muted-foreground">{testimonial.quote}</p>
                  <div className="font-semibold">{testimonial.name}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 bg-gradient-to-b from-white to-muted/30">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-4">Simple, Transparent Pricing</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Less than the cost of lunch for your emotional well-being
          </p>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Tier */}
            <Card className="border shadow-sm">
              <CardHeader>
                <CardTitle className="text-2xl">Free Trial</CardTitle>
                <CardDescription>Try EmpathAI with no commitment</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <p className="text-4xl font-bold">€0<span className="text-lg text-muted-foreground font-normal">/forever</span></p>
                </div>
                <ul className="space-y-3">
                  {[
                    "3 free emotional support sessions",
                    "Basic personalization",
                    "Text-based chat interface"
                  ].map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <Check className="h-5 w-5 text-clarly-500 mr-2 shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full mt-8" size="lg" variant="outline" asChild>
                  <Link to="/signup">Start Free Trial</Link>
                </Button>
              </CardContent>
            </Card>
            
            {/* Premium Tier */}
            <Card className="border border-clarly-200 shadow-md relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-clarly-500 text-white px-4 py-1 text-sm font-medium">
                Most Popular
              </div>
              <CardHeader>
                <CardTitle className="text-2xl">Premium</CardTitle>
                <CardDescription>Unlimited emotional support</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <p className="text-4xl font-bold">€10<span className="text-lg text-muted-foreground font-normal">/month</span></p>
                </div>
                <ul className="space-y-3">
                  {[
                    "Unlimited emotional support",
                    "Deep personalization",
                    "Advanced emotional pattern recognition",
                    "Priority response times",
                    "Safe, private, and judgment-free space"
                  ].map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <Check className="h-5 w-5 text-clarly-500 mr-2 shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full mt-8" size="lg" asChild>
                  <Link to="/signup">Subscribe Now</Link>
                </Button>
              </CardContent>
            </Card>
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
      
      {/* Sticky CTA that appears after scrolling */}
      <StickyCTA text="Start for Free" linkTo="/signup" scrollThreshold={25} />
    </div>;
};
export default Home;
