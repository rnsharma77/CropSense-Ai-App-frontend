import { motion } from "framer-motion";
import { ArrowRight, Leaf } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const CTASection = () => (
  <section className="py-24 relative overflow-hidden">
    <div className="absolute inset-0 bg-hero-gradient opacity-95" />
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent_60%)]" />

    <div className="container relative z-10">
      <motion.div
        className="text-center max-w-2xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <div className="w-14 h-14 rounded-full bg-primary-foreground/10 flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
          <Leaf className="w-7 h-7 text-primary-foreground" />
        </div>
        <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
          Ready to Protect Your Crops?
        </h2>
        <p className="text-primary-foreground/70 mb-8 max-w-lg mx-auto">
          Join thousands of farmers using AI to detect diseases early, reduce crop loss, and increase their yield.
        </p>
        <Link to="/detect">
          <Button size="lg" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 gap-2 text-base px-10 shadow-amber">
            Start Scanning Now <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </motion.div>
    </div>
  </section>
);

export default CTASection;
