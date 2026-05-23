import { motion } from "framer-motion";
import { ArrowRight, Scan, ShieldCheck, Sprout } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-farm.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <img src={heroImage} alt="Lush farmland" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 via-foreground/60 to-foreground/20" />
      </div>

      <div className="container relative z-10 py-20">
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/20 text-primary-foreground text-sm font-medium mb-6 backdrop-blur-sm border border-primary/30">
              <Sprout className="w-4 h-4" />
              AI-Powered Crop Intelligence
            </span>

            <h1 className="font-display text-4xl md:text-6xl font-bold text-primary-foreground leading-tight mb-6">
              Detect Crop Diseases{" "}
              <span className="text-secondary">Before They Spread</span>
            </h1>

            <p className="text-lg text-primary-foreground/80 mb-8 max-w-lg leading-relaxed">
              Upload a photo of your crop and get instant AI-powered diagnosis with
              actionable treatment recommendations tailored for your farm.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link to="/detect">
                <Button size="lg" className="bg-hero-gradient text-primary-foreground hover:opacity-90 transition-opacity gap-2 shadow-leaf text-base px-8">
                  Scan Your Crop <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link to="/advisory">
                <Button size="lg" className="bg-white text-green-300 hover:bg-white/90 backdrop-blur-sm text-base px-8">
                  View Advisory
                </Button>
              </Link>
            </div>
          </motion.div>

          <motion.div
            className="grid grid-cols-3 gap-4 mt-16 max-w-lg"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            {[
              { icon: Scan, label: "Instant Detection", value: "< 5 sec" },
              { icon: ShieldCheck, label: "Accuracy Rate", value: "95%+" },
              { icon: Sprout, label: "Crops Supported", value: "50+" },
            ].map((stat, i) => (
              <div key={i} className="bg-primary-foreground/10 backdrop-blur-md rounded-lg p-4 border border-primary-foreground/10">
                <stat.icon className="w-5 h-5 text-secondary mb-2" />
                <p className="text-2xl font-bold text-primary-foreground">{stat.value}</p>
                <p className="text-xs text-primary-foreground/60">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
