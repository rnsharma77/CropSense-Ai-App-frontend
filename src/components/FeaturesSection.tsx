import { motion } from "framer-motion";
import { Camera, Brain, FileText, CloudSun, Bug, Leaf } from "lucide-react";

const features = [
  {
    icon: Camera,
    title: "Photo Upload",
    description: "Snap a photo of any affected crop leaf or plant and upload it for instant analysis.",
  },
  {
    icon: Brain,
    title: "AI Diagnosis",
    description: "Advanced AI models identify diseases, pests, and nutrient deficiencies with high accuracy.",
  },
  {
    icon: FileText,
    title: "Treatment Plans",
    description: "Get detailed treatment recommendations including organic and chemical solutions.",
  },
  {
    icon: CloudSun,
    title: "Weather Insights",
    description: "Contextual advice based on local weather patterns and seasonal crop cycles.",
  },
  {
    icon: Bug,
    title: "Pest Alerts",
    description: "Stay ahead with early warnings about pest outbreaks in your region.",
  },
  {
    icon: Leaf,
    title: "Crop Advisory",
    description: "Personalized farming tips for soil health, irrigation, and sustainable practices.",
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-24 bg-card-gradient">
      <div className="container">
        <motion.div
          className="text-center max-w-2xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-sm font-semibold text-secondary uppercase tracking-wider">Features</span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-3 mb-4">
            Everything Your Farm Needs
          </h2>
          <p className="text-muted-foreground">
            From disease detection to personalized advisory — CropSense AI is your intelligent farming companion.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              className="group bg-background rounded-xl p-6 border border-border hover:shadow-leaf transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="w-12 h-12 rounded-lg bg-accent flex items-center justify-center mb-4 group-hover:bg-hero-gradient transition-colors duration-300">
                <feature.icon className="w-6 h-6 text-accent-foreground group-hover:text-primary-foreground transition-colors duration-300" />
              </div>
              <h3 className="font-display text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
