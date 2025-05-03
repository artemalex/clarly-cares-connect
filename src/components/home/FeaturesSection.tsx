
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { MessageSquare, Heart, Brain, Shield, Sparkles, Zap } from "lucide-react";

const features = [
  {
    icon: <MessageSquare className="h-8 w-8 text-clarly-500" />,
    title: "Instant Presence",
    description: "Open the chat, type a word, and Clari answers in under two seconds—no office hours, no waiting room."
  },
  {
    icon: <Heart className="h-8 w-8 text-clarly-500" />,
    title: "Judgment-Free Listening",
    description: "Clari never lectures, diagnoses, or reports—she simply stays until the weight feels lighter."
  },
  {
    icon: <Brain className="h-8 w-8 text-clarly-500" />,
    title: "Two Ways to Talk",
    description: "Pick **Vent** to dump the day or **Reflect** to untangle it. Switch anytime with one tap."
  },
  {
    icon: <Shield className="h-8 w-8 text-clarly-500" />,
    title: "Private & Secure",
    description: "Your conversations stay between you and Clari. We only ask for your email to keep your account safe, and we never sell or share your data—ever."
  },
  {
    icon: <Sparkles className="h-8 w-8 text-clarly-500" />,
    title: "Learns *You*, Never Shares",
    description: "Clari adapts to your tone and patterns (not your identity) to mirror you better with every session."
  },
  {
    icon: <Zap className="h-8 w-8 text-clarly-500" />,
    title: "Unlimited Relief",
    description: "Chat as often as you like—less than one lunch, and thousands less than weekly therapy."
  }
];

const FeaturesSection = () => {
  return (
    <section className="py-16 bg-gradient-to-b from-white to-muted/30 rounded-xl">
      <div className="container">
        <h2 className="text-3xl font-bold text-center mb-4">How Clari Lightens the Load</h2>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          Six ways our always‑on AI confidant turns work‑day overwhelm into calm clarity.
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
