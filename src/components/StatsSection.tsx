import { motion } from "framer-motion";
import { TrendingUp, Users, Scan, Globe } from "lucide-react";
import { useEffect, useState } from "react";

const stats = [
  { icon: Scan, value: 125000, suffix: "+", label: "Scans Performed", color: "text-primary" },
  { icon: Users, value: 48000, suffix: "+", label: "Farmers Helped", color: "text-secondary" },
  { icon: TrendingUp, value: 95, suffix: "%", label: "Accuracy Rate", color: "text-primary" },
  { icon: Globe, value: 32, suffix: "", label: "Countries", color: "text-secondary" },
];

const AnimatedNumber = ({ target, suffix }: { target: number; suffix: string }) => {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!started) return;
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [started, target]);

  return (
    <motion.span
      onViewportEnter={() => setStarted(true)}
      viewport={{ once: true }}
    >
      {count.toLocaleString()}{suffix}
    </motion.span>
  );
};

const StatsSection = () => (
  <section className="py-16 bg-foreground">
    <div className="container">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
          >
            <stat.icon className={`w-6 h-6 mx-auto mb-3 ${stat.color === "text-primary" ? "text-accent" : "text-secondary"}`} />
            <p className="text-3xl md:text-4xl font-bold text-primary-foreground font-display">
              <AnimatedNumber target={stat.value} suffix={stat.suffix} />
            </p>
            <p className="text-sm text-primary-foreground/50 mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default StatsSection;
