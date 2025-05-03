
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { MessageSquare, Heart, Brain, Shield, Sparkles, Zap } from "lucide-react";

const features = [
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
];

const FeaturesSection = () => {
  return (
    <section className="py-16 bg-gradient-to-b from-white to-muted/30 rounded-xl">
      <div className="container">
        <h2 className="text-3xl font-bold text-center mb-4">How HelloClarly Helps</h2>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          Our AI-powered emotional support companion is designed to be there for you
        </p>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto">
          {features.map((feature, i) => (
            <Card key={i} className="bg-background border-none shadow-sm hover:shadow-md transition-all">
              <CardHeader>
                <div className="mb-2">{feature.icon}</div>
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
  );
};

export default FeaturesSection;
