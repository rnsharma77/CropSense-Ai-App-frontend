import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Droplets, Sun, Wind, ThermometerSun, Bug, Sprout, ArrowLeft,
  Search, Calendar, BookOpen, ChevronRight, Wheat, Grape, Apple,
  Flower2, TreeDeciduous, Leaf, Filter
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

type Tab = "advisory" | "encyclopedia" | "calendar";

const advisoryCards = [
  {
    icon: Droplets,
    category: "Water",
    title: "Irrigation Management",
    tips: [
      "Water early morning to reduce evaporation",
      "Use drip irrigation for 30-50% water savings",
      "Monitor soil moisture with sensors before watering",
      "Mulch around plants to retain moisture",
    ],
  },
  {
    icon: Sun,
    category: "Growth",
    title: "Sunlight & Spacing",
    tips: [
      "Ensure proper spacing for adequate air circulation",
      "Use shade nets during extreme heat (>40°C)",
      "Rotate crops to prevent soil depletion",
      "Plant tall crops to shelter sensitive ones",
    ],
  },
  {
    icon: ThermometerSun,
    category: "Seasonal",
    title: "Seasonal Care",
    tips: [
      "Pre-monsoon: Apply fungicides preventively",
      "Summer: Increase watering frequency",
      "Winter: Protect crops from frost with covers",
      "Post-harvest: Replenish soil with compost",
    ],
  },
  {
    icon: Bug,
    category: "Pest",
    title: "Pest Management",
    tips: [
      "Install pheromone traps for early detection",
      "Use neem oil spray as organic pest deterrent",
      "Introduce beneficial insects like ladybugs",
      "Remove infected plant parts immediately",
    ],
  },
  {
    icon: Sprout,
    category: "Soil",
    title: "Soil Health",
    tips: [
      "Test soil pH annually — aim for 6.0-7.0",
      "Add organic matter (compost) each season",
      "Practice cover cropping to prevent erosion",
      "Avoid over-tilling to protect soil structure",
    ],
  },
  {
    icon: Wind,
    category: "Disease",
    title: "Disease Prevention",
    tips: [
      "Ensure proper drainage to avoid waterlogging",
      "Clean tools between plants to stop spread",
      "Choose disease-resistant crop varieties",
      "Maintain field hygiene — remove crop debris",
    ],
  },
];

const cropEncyclopedia = [
  {
    icon: Wheat,
    name: "Rice (Oryza sativa)",
    diseases: ["Blast", "Bacterial Leaf Blight", "Sheath Blight", "Brown Spot"],
    season: "Kharif (Jun-Nov)",
    soil: "Clayey, pH 5.5-6.5",
    water: "Standing water required",
  },
  {
    icon: Wheat,
    name: "Wheat (Triticum aestivum)",
    diseases: ["Rust (Yellow, Brown, Black)", "Powdery Mildew", "Karnal Bunt"],
    season: "Rabi (Nov-Mar)",
    soil: "Loamy, pH 6.0-7.5",
    water: "4-6 irrigations",
  },
  {
    icon: Leaf,
    name: "Tomato (Solanum lycopersicum)",
    diseases: ["Early Blight", "Late Blight", "Fusarium Wilt", "Leaf Curl Virus"],
    season: "Year-round (varies)",
    soil: "Well-drained, pH 6.0-6.8",
    water: "Regular, avoid overwatering",
  },
  {
    icon: Grape,
    name: "Grape (Vitis vinifera)",
    diseases: ["Downy Mildew", "Powdery Mildew", "Anthracnose", "Grey Mould"],
    season: "Feb-Jun",
    soil: "Sandy loam, pH 6.5-7.5",
    water: "Drip irrigation preferred",
  },
  {
    icon: Apple,
    name: "Cotton (Gossypium)",
    diseases: ["Bacterial Blight", "Grey Mildew", "Root Rot", "Leaf Curl"],
    season: "Kharif (Apr-Oct)",
    soil: "Black cotton soil, pH 6.0-8.0",
    water: "6-8 irrigations",
  },
  {
    icon: TreeDeciduous,
    name: "Maize (Zea mays)",
    diseases: ["Maydis Leaf Blight", "Downy Mildew", "Stalk Rot", "Turcicum Blight"],
    season: "Kharif & Rabi",
    soil: "Well-drained loam, pH 5.5-7.0",
    water: "Critical at tasseling stage",
  },
  {
    icon: Flower2,
    name: "Potato (Solanum tuberosum)",
    diseases: ["Late Blight", "Early Blight", "Black Scurf", "Common Scab"],
    season: "Rabi (Oct-Feb)",
    soil: "Sandy loam, pH 5.0-6.5",
    water: "Regular, well-drained",
  },
  {
    icon: Leaf,
    name: "Banana (Musa)",
    diseases: ["Panama Wilt", "Sigatoka", "Bunchy Top Virus", "Anthracnose"],
    season: "Year-round",
    soil: "Rich loamy, pH 6.5-7.5",
    water: "High water requirement",
  },
];

const seasonalCalendar = [
  { month: "January", tasks: ["Rabi crop care", "Wheat irrigation", "Pest monitoring"], season: "Winter" },
  { month: "February", tasks: ["Apply top-dressing fertilizers", "Pruning fruit trees", "Prepare summer seedbeds"], season: "Late Winter" },
  { month: "March", tasks: ["Harvest rabi crops", "Prepare fields for summer", "Soil testing"], season: "Spring" },
  { month: "April", tasks: ["Summer plowing", "Sow Kharif nurseries", "Install drip irrigation"], season: "Spring" },
  { month: "May", tasks: ["Prepare fields for monsoon", "Apply organic manure", "Seed treatment"], season: "Pre-Monsoon" },
  { month: "June", tasks: ["Kharif sowing (rice, maize)", "Install pest traps", "Weed management"], season: "Monsoon" },
  { month: "July", tasks: ["Transplanting rice", "Apply fertilizers", "Monitor for diseases"], season: "Monsoon" },
  { month: "August", tasks: ["Intercultural operations", "Pest surveillance", "Top-dressing nitrogen"], season: "Monsoon" },
  { month: "September", tasks: ["Late Kharif sowing", "Drainage management", "Prepare rabi seedbeds"], season: "Late Monsoon" },
  { month: "October", tasks: ["Harvest Kharif crops", "Sow rabi crops (wheat, mustard)", "Soil preparation"], season: "Post-Monsoon" },
  { month: "November", tasks: ["Rabi sowing continues", "Apply base fertilizers", "Winter crop management"], season: "Early Winter" },
  { month: "December", tasks: ["Irrigation scheduling", "Frost protection", "Harvest sugarcane"], season: "Winter" },
];

const AdvisoryPage = () => {
  const [activeTab, setActiveTab] = useState<Tab>("advisory");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [expandedCrop, setExpandedCrop] = useState<string | null>(null);

  const currentMonth = new Date().getMonth();

  const categories = [...new Set(advisoryCards.map((c) => c.category))];

  const filteredAdvisory = advisoryCards.filter((card) => {
    const matchesSearch = !searchQuery || card.title.toLowerCase().includes(searchQuery.toLowerCase()) || card.tips.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = !selectedCategory || card.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const filteredCrops = cropEncyclopedia.filter(
    (crop) => !searchQuery || crop.name.toLowerCase().includes(searchQuery.toLowerCase()) || crop.diseases.some((d) => d.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const tabs = [
    { id: "advisory" as Tab, label: "Advisory", icon: Sprout },
    { id: "encyclopedia" as Tab, label: "Crop Encyclopedia", icon: BookOpen },
    { id: "calendar" as Tab, label: "Seasonal Calendar", icon: Calendar },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container">
          <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-6">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>

          <motion.div
            className="max-w-2xl mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
              Farmer Advisory
            </h1>
            <p className="text-muted-foreground">
              Expert farming tips, crop encyclopedia, and seasonal planning tools to maximize your yield.
            </p>
          </motion.div>

          {/* Tabs */}
          <div className="flex flex-wrap gap-2 mb-6">
            {tabs.map((tab) => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveTab(tab.id)}
                className={activeTab === tab.id ? "bg-hero-gradient text-primary-foreground" : ""}
              >
                <tab.icon className="w-4 h-4 mr-1.5" />
                {tab.label}
              </Button>
            ))}
          </div>

          {/* Search */}
          <div className="relative mb-6 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder={activeTab === "encyclopedia" ? "Search crops or diseases..." : "Search tips..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Advisory Tab */}
          {activeTab === "advisory" && (
            <>
              <div className="flex gap-2 mb-6 flex-wrap">
                <Button
                  variant={selectedCategory === null ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(null)}
                  className={selectedCategory === null ? "bg-hero-gradient text-primary-foreground" : ""}
                >
                  <Filter className="w-3 h-3 mr-1" /> All
                </Button>
                {categories.map((cat) => (
                  <Button
                    key={cat}
                    variant={selectedCategory === cat ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(cat)}
                    className={selectedCategory === cat ? "bg-hero-gradient text-primary-foreground" : ""}
                  >
                    {cat}
                  </Button>
                ))}
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAdvisory.map((card, i) => (
                  <motion.div
                    key={i}
                    className="bg-card-gradient border border-border rounded-xl p-6 hover:shadow-leaf transition-shadow"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    layout
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
                        <card.icon className="w-5 h-5 text-accent-foreground" />
                      </div>
                      <div>
                        <h3 className="font-display text-base font-semibold text-foreground">{card.title}</h3>
                        <span className="text-xs text-muted-foreground">{card.category}</span>
                      </div>
                    </div>
                    <ul className="space-y-2">
                      {card.tips.map((tip, j) => (
                        <li key={j} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                ))}
              </div>
            </>
          )}

          {/* Encyclopedia Tab */}
          {activeTab === "encyclopedia" && (
            <div className="grid md:grid-cols-2 gap-4">
              {filteredCrops.map((crop, i) => (
                <motion.div
                  key={i}
                  className="bg-card-gradient border border-border rounded-xl overflow-hidden hover:shadow-leaf transition-shadow"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  layout
                >
                  <button
                    onClick={() => setExpandedCrop(expandedCrop === crop.name ? null : crop.name)}
                    className="w-full flex items-center justify-between p-5 text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
                        <crop.icon className="w-5 h-5 text-accent-foreground" />
                      </div>
                      <div>
                        <h3 className="font-display font-semibold text-foreground text-sm">{crop.name}</h3>
                        <p className="text-xs text-muted-foreground">{crop.season}</p>
                      </div>
                    </div>
                    <ChevronRight className={`w-4 h-4 text-muted-foreground transition-transform ${expandedCrop === crop.name ? "rotate-90" : ""}`} />
                  </button>

                  <AnimatePresence>
                    {expandedCrop === crop.name && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: "auto" }}
                        exit={{ height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-5 space-y-3 border-t border-border pt-3">
                          <div>
                            <p className="text-xs font-semibold text-foreground mb-1">Common Diseases</p>
                            <div className="flex flex-wrap gap-1.5">
                              {crop.diseases.map((d, j) => (
                                <span key={j} className="px-2 py-0.5 bg-destructive/10 text-destructive rounded-full text-xs">{d}</span>
                              ))}
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-3 text-xs">
                            <div>
                              <p className="font-semibold text-foreground">Soil</p>
                              <p className="text-muted-foreground">{crop.soil}</p>
                            </div>
                            <div>
                              <p className="font-semibold text-foreground">Water</p>
                              <p className="text-muted-foreground">{crop.water}</p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          )}

          {/* Calendar Tab */}
          {activeTab === "calendar" && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {seasonalCalendar.map((item, i) => (
                <motion.div
                  key={i}
                  className={`border rounded-xl p-5 transition-shadow ${
                    i === currentMonth
                      ? "border-primary bg-accent/50 shadow-leaf"
                      : "border-border bg-card-gradient hover:shadow-leaf"
                  }`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-display font-bold text-foreground">{item.month}</h3>
                    {i === currentMonth && (
                      <span className="px-2 py-0.5 bg-primary text-primary-foreground rounded-full text-xs font-semibold">Now</span>
                    )}
                  </div>
                  <span className="text-xs text-secondary font-medium">{item.season}</span>
                  <ul className="mt-3 space-y-1.5">
                    {item.tasks.map((task, j) => (
                      <li key={j} className="flex items-start gap-2 text-xs text-muted-foreground">
                        <span className="w-1 h-1 rounded-full bg-primary mt-1.5 shrink-0" />
                        {task}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdvisoryPage;
