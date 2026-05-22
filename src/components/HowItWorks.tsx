import { motion } from "framer-motion";
import { Camera, ArrowRight, Zap, Shield } from "lucide-react";

const steps = [
  {
    num: "01",
    icon: Camera,
    title: "Capture",
    description: "Take a clear photo of the affected crop leaf or plant area using your phone camera.",
  },
  {
    num: "02",
    icon: Zap,
    title: "Analyze",
    description: "Our AI processes the image using advanced vision models trained on millions of crop disease samples.",
  },
  {
    num: "03",
    icon: Shield,
    title: "Act",
    description: "Receive detailed diagnosis with organic & chemical treatments, severity level, and prevention strategies.",
  },
];

const HowItWorks = () => (
  <section className="py-24 bg-background">
    <div className="container">
      <motion.div
        className="text-center max-w-2xl mx-auto mb-16"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <span className="text-sm font-semibold text-secondary uppercase tracking-wider">How It Works</span>
        <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-3 mb-4">
          Three Steps to Healthier Crops
        </h2>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-8 relative">
        {/* Connecting line */}
        <div className="hidden md:block absolute top-16 left-[20%] right-[20%] h-0.5 bg-border" />

        {steps.map((step, i) => (
          <motion.div
            key={i}
            className="relative text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15 }}
          >
            <div className="w-16 h-16 rounded-full bg-hero-gradient flex items-center justify-center mx-auto mb-6 relative z-10 shadow-leaf">
              <step.icon className="w-7 h-7 text-primary-foreground" />
            </div>
            <span className="text-xs font-bold text-secondary tracking-widest mb-2 block">{step.num}</span>
            <h3 className="font-display text-xl font-bold text-foreground mb-2">{step.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">{step.description}</p>
            {i < steps.length - 1 && (
              <ArrowRight className="hidden md:block absolute top-14 -right-4 w-5 h-5 text-muted-foreground/30 z-20" />
            )}
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorks;
