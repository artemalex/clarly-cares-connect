import { Link } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
const PricingSection = () => {
  return <section className="py-16 bg-gradient-to-b from-white to-muted/30">
      <div className="container">
        <h2 className="text-3xl font-bold text-center mb-4">One Flat Price, Unlimited Support</h2>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          Less than the cost of lunch for your emotional well-being
        </p>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Tier */}
          <Card className="border shadow-sm">
            <CardHeader>
              <CardTitle className="text-2xl">Free Trial</CardTitle>
              <CardDescription>Try HelloClari with no commitment</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <p className="text-4xl font-bold">€0<span className="text-lg text-muted-foreground font-normal">/forever</span></p>
              </div>
              <ul className="space-y-3">
                {["3 free emotional support sessions", "Basic personalization", "Text-based chat interface"].map((feature, i) => <li key={i} className="flex items-start">
                    <Check className="h-5 w-5 text-clarly-500 mr-2 shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>)}
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
                {["Unlimited emotional support", "Deep personalization", "Advanced emotional pattern recognition", "Priority response times", "Safe, private, and judgment-free space"].map((feature, i) => <li key={i} className="flex items-start">
                    <Check className="h-5 w-5 text-clarly-500 mr-2 shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>)}
              </ul>
              <Button className="w-full mt-8" size="lg" asChild>
                <Link to="/signup">Subscribe Now</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>;
};
export default PricingSection;