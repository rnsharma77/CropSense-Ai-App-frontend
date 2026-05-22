import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Rajesh Kumar",
    role: "Rice Farmer, Punjab",
    content: "CropSense AI detected blight in my paddy field 2 weeks before it became visible. Saved 30% of my harvest that season.",
    rating: 5,
  },
  {
    name: "Maria Santos",
    role: "Vineyard Owner, Brazil",
    content: "The treatment recommendations are incredibly detailed. Both organic and chemical options with exact application instructions.",
    rating: 5,
  },
  {
    name: "James Okafor",
    role: "Cassava Farmer, Nigeria",
    content: "As a smallholder farmer, I couldn't afford a crop consultant. CropSense AI gives me expert-level advice for free.",
    rating: 5,
  },
];

const Testimonials = () => (
  <section className="py-24 bg-background">
    <div className="container">
      <motion.div
        className="text-center max-w-2xl mx-auto mb-16"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <span className="text-sm font-semibold text-secondary uppercase tracking-wider">Testimonials</span>
        <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-3 mb-4">
          Trusted by Farmers Worldwide
        </h2>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-6">
        {testimonials.map((t, i) => (
          <motion.div
            key={i}
            className="bg-card-gradient border border-border rounded-xl p-6 relative"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
          >
            <Quote className="w-8 h-8 text-accent mb-4" />
            <p className="text-muted-foreground text-sm leading-relaxed mb-6">{t.content}</p>
            <div className="flex items-center gap-1 mb-3">
              {Array.from({ length: t.rating }).map((_, j) => (
                <Star key={j} className="w-4 h-4 fill-secondary text-secondary" />
              ))}
            </div>
            <p className="font-semibold text-foreground text-sm">{t.name}</p>
            <p className="text-xs text-muted-foreground">{t.role}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default Testimonials;
