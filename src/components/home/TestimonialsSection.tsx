
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

const testimonials = [
  {
    quote: "HelloClari gave me a safe place to process my emotions after difficult meetings. It's like having a pocket therapist who's always available.",
    name: "Jamie",
    role: "Product Manager"
  },
  {
    quote: "When I felt invisible at work, HelloClari helped me feel seen. It's the emotional support I didn't know I needed until I tried it.",
    name: "Taylor",
    role: "UX Designer"
  },
  {
    quote: "Instead of bottling up my feelings or venting to colleagues, I can talk to HelloClari. It's made a huge difference in my work relationships.",
    name: "Alex",
    role: "Team Lead"
  }
];

const TestimonialsSection = () => {
  return (
    <section className="py-16 bg-background">
      <div className="container">
        <h2 className="text-3xl font-bold text-center mb-12">What People Are Saying</h2>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {testimonials.map((testimonial, i) => (
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
  );
};

export default TestimonialsSection;
