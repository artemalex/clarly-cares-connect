
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { 
  Hourglass,
  Heart,
  GitBranch,
  CloudCog,
  Sprout,
  LifeBuoy
} from "lucide-react";

const features = [{
  icon: <Hourglass className="h-8 w-8 text-empath-500" />,
  title: "Instant Space to Breathe",
  description: "Overwhelmed at your desk? HelloClari is ready in seconds — no appointments, no waiting, just type and feel the pressure start to lift."
}, {
  icon: <Heart className="h-8 w-8 text-empath-500" />,
  title: "Talk Without Judgment",
  description: "Whether you're spiraling or just numb, HelloClari listens without fixing or labeling. Say what you need — unfiltered, uninterrupted."
}, {
  icon: <GitBranch className="h-8 w-8 text-empath-500" />,
  title: "Vent to Release. Reflect to Explore.",
  description: "Choose how you want to show up: Vent Mode to release what's stuck, or Reflect Mode to explore what's underneath it."
}, {
  icon: <CloudCog className="h-8 w-8 text-empath-500" />,
  title: "Think More Clearly, Feel More in Control",
  description: "As you talk, HelloClari helps organize your thoughts — so you leave the conversation feeling steadier and more self-aware."
}, {
  icon: <Sprout className="h-8 w-8 text-empath-500" />,
  title: "Build Emotional Habits, Effortlessly",
  description: "The more you talk, the more HelloClari learns your emotional language — helping you spot patterns and grow without the pressure to \"perform.\""
}, {
  icon: <LifeBuoy className="h-8 w-8 text-empath-500" />,
  title: "Support That's Always There",
  description: "Whether it's a rough morning or a midnight spiral, HelloClari is on — as often as you need — for the cost of a single lunch."
}];

const FeaturesSection = () => {
  return <section className="py-16 bg-gradient-to-b from-white to-muted/30 rounded-xl">
      <div className="container">
        <h2 className="text-3xl font-bold text-center mb-4">Turn Daily Stress into Clarity, Calm, and Control</h2>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">Six ways HelloClari helps you feel lighter, clearer, and more grounded</p>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto">
          {features.map((feature, i) => <Card key={i} className="bg-background border-none shadow-sm hover:shadow-md transition-all">
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
    </section>;
};

export default FeaturesSection;
