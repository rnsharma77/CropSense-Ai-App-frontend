import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload, Camera, Loader2, AlertTriangle, CheckCircle, Leaf, ArrowLeft,
  History, Trash2, Download, RotateCcw, ZoomIn, ChevronDown, ChevronUp,
  Pill, Sprout, Shield, Clock, Gauge
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { analyzeCropImage, type DiagnosisResult } from "@/lib/api";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface ScanEntry {
  id: string;
  image: string;
  result: DiagnosisResult;
  timestamp: Date;
}

const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024;
const MAX_IMAGE_SIZE_MESSAGE = "Image must be under 10MB";

const severityColor = (s: string) => {
  if (s === "Low") return "bg-accent text-accent-foreground";
  if (s === "Medium") return "bg-secondary/20 text-secondary-foreground";
  return "bg-destructive/10 text-destructive";
};

const confidenceIcon = (c: string) => {
  if (c === "High") return <Gauge className="w-4 h-4 text-primary" />;
  if (c === "Medium") return <Gauge className="w-4 h-4 text-secondary" />;
  return <Gauge className="w-4 h-4 text-muted-foreground" />;
};

const DetectPage = () => {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [scanHistory, setScanHistory] = useState<ScanEntry[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    symptoms: true,
    organic: true,
    chemical: true,
    prevention: true,
  });
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const toggleSection = (key: string) => {
    setExpandedSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please upload a valid image file");
      return;
    }
    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      setError(MAX_IMAGE_SIZE_MESSAGE);
      return;
    }
    setResult(null);
    setError(null);
    const reader = new FileReader();
    reader.onload = (ev) => setImage(ev.target?.result as string);
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      setError(MAX_IMAGE_SIZE_MESSAGE);
      return;
    }
    setResult(null);
    setError(null);
    const reader = new FileReader();
    reader.onload = (ev) => setImage(ev.target?.result as string);
    reader.readAsDataURL(file);
  }, []);

  const analyze = async () => {
    if (!image) return;
    setLoading(true);
    setError(null);
    setProgress(0);

    // Simulated progress
    const progressInterval = setInterval(() => {
      setProgress((p) => Math.min(p + Math.random() * 15, 90));
    }, 400);

    try {
      const data = await analyzeCropImage(image);
      setProgress(100);
      setResult(data);

      // Add to history
      const entry: ScanEntry = {
        id: crypto.randomUUID(),
        image,
        result: data,
        timestamp: new Date(),
      };
      setScanHistory((prev) => [entry, ...prev].slice(0, 10));
    } catch (err: any) {
      setError(err.message || "Analysis failed. Please try again.");
    } finally {
      clearInterval(progressInterval);
      setLoading(false);
      setTimeout(() => setProgress(0), 1000);
    }
  };

  const loadFromHistory = (entry: ScanEntry) => {
    setImage(entry.image);
    setResult(entry.result);
    setError(null);
    setShowHistory(false);
  };

  const clearHistory = () => setScanHistory([]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container max-w-5xl">
          <div className="flex items-center justify-between mb-6">
            <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary">
              <ArrowLeft className="w-4 h-4" /> Back to Home
            </Link>
            {scanHistory.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowHistory(!showHistory)}
                className="gap-1"
              >
                <History className="w-4 h-4" />
                History ({scanHistory.length})
              </Button>
            )}
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
              Crop Disease Detection
            </h1>
            <p className="text-muted-foreground mb-8 max-w-xl">
              Upload a clear photo of the affected leaf or plant. Our AI vision model will analyze it and provide a comprehensive diagnosis.
            </p>
          </motion.div>

          {/* Scan History Panel */}
          <AnimatePresence>
            {showHistory && (
              <motion.div
                className="mb-6 bg-card border border-border rounded-xl p-4 overflow-hidden"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-display font-semibold text-foreground text-sm">Recent Scans</h3>
                  <Button variant="ghost" size="sm" onClick={clearHistory} className="text-xs text-muted-foreground gap-1">
                    <Trash2 className="w-3 h-3" /> Clear All
                  </Button>
                </div>
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {scanHistory.map((entry) => (
                    <button
                      key={entry.id}
                      onClick={() => loadFromHistory(entry)}
                      className="shrink-0 group relative"
                    >
                      <img
                        src={entry.image}
                        alt="Scan"
                        className="w-20 h-20 object-cover rounded-lg border border-border group-hover:border-primary transition-colors"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-foreground/70 text-primary-foreground text-[10px] px-1 py-0.5 rounded-b-lg truncate">
                        {entry.result.disease_name}
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="grid lg:grid-cols-5 gap-6">
            {/* Left: Upload */}
            <div className="lg:col-span-2">
              <motion.div
                className="border-2 border-dashed border-border rounded-xl p-6 text-center hover:border-primary/50 transition-colors bg-card-gradient sticky top-24"
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                {image ? (
                  <div className="space-y-4">
                    <div className="relative group">
                      <img
                        src={image}
                        alt="Uploaded crop"
                        className="w-full max-h-64 object-contain rounded-lg cursor-pointer"
                        onClick={() => setZoomedImage(image)}
                      />
                      <button
                        onClick={() => setZoomedImage(image)}
                        className="absolute top-2 right-2 bg-foreground/50 text-primary-foreground p-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <ZoomIn className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Progress bar */}
                    {loading && (
                      <div className="w-full bg-border rounded-full h-2 overflow-hidden">
                        <motion.div
                          className="h-full bg-hero-gradient rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                    )}

                    <div className="flex flex-col gap-2">
                      <Button
                        onClick={analyze}
                        disabled={loading}
                        className="w-full bg-hero-gradient text-primary-foreground hover:opacity-90"
                      >
                        {loading ? (
                          <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Analyzing ({Math.round(progress)}%)</>
                        ) : (
                          <><Leaf className="w-4 h-4 mr-2" /> Analyze Crop</>
                        )}
                      </Button>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <Camera className="w-4 h-4 mr-1" /> Change
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => { setImage(null); setResult(null); setError(null); }}
                        >
                          <RotateCcw className="w-4 h-4 mr-1" /> Reset
                        </Button>
                      </div>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </div>
                ) : (
                  <label className="cursor-pointer block py-8">
                    <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center mx-auto mb-4">
                      <Upload className="w-8 h-8 text-accent-foreground" />
                    </div>
                    <p className="text-lg font-medium text-foreground mb-1">Upload Crop Image</p>
                    <p className="text-sm text-muted-foreground mb-1">Drag & drop or click to browse</p>
                    <p className="text-xs text-muted-foreground">JPG, PNG up to 10MB</p>
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                  </label>
                )}

                {/* Tips */}
                <div className="mt-4 pt-4 border-t border-border">
                  <p className="text-xs font-semibold text-foreground mb-2">📸 Tips for best results:</p>
                  <ul className="text-xs text-muted-foreground space-y-1 text-left">
                    <li>• Focus on the affected area (leaf/stem)</li>
                    <li>• Use natural lighting, avoid shadows</li>
                    <li>• Include both healthy and diseased parts</li>
                    <li>• Capture from 20-30cm distance</li>
                  </ul>
                </div>
              </motion.div>
            </div>

            {/* Right: Results */}
            <div className="lg:col-span-3">
              {/* Error */}
              {error && (
                <motion.div
                  className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 flex items-start gap-3 mb-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <AlertTriangle className="w-5 h-5 text-destructive mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-destructive">Analysis Failed</p>
                    <p className="text-sm text-destructive/80">{error}</p>
                  </div>
                </motion.div>
              )}

              {/* Empty state */}
              {!result && !loading && !error && (
                <motion.div
                  className="flex flex-col items-center justify-center py-20 text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="w-20 h-20 rounded-full bg-accent/50 flex items-center justify-center mb-4">
                    <Leaf className="w-10 h-10 text-accent-foreground/50" />
                  </div>
                  <h3 className="font-display text-lg font-semibold text-muted-foreground mb-1">No Scan Results Yet</h3>
                  <p className="text-sm text-muted-foreground/70">Upload a crop image and click analyze to get started.</p>
                </motion.div>
              )}

              {/* Loading skeleton */}
              {loading && !result && (
                <motion.div className="space-y-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <div className="bg-card border border-border rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Loader2 className="w-5 h-5 animate-spin text-primary" />
                      <span className="text-sm font-medium text-foreground">AI is analyzing your crop image...</span>
                    </div>
                    <div className="space-y-3">
                      <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
                      <div className="h-3 bg-muted rounded animate-pulse w-1/2" />
                      <div className="h-3 bg-muted rounded animate-pulse w-5/6" />
                      <div className="h-3 bg-muted rounded animate-pulse w-2/3" />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Results */}
              <AnimatePresence>
                {result && (
                  <motion.div
                    className="space-y-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    {/* Header card */}
                    <div className="bg-background border border-border rounded-xl p-6 shadow-leaf">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h2 className="font-display text-2xl font-bold text-foreground">{result.disease_name}</h2>
                          <div className="flex items-center gap-4 mt-2">
                            <div className="flex items-center gap-1.5">
                              {confidenceIcon(result.confidence)}
                              <span className="text-xs text-muted-foreground">Confidence: <strong className="text-foreground">{result.confidence}</strong></span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Clock className="w-4 h-4 text-muted-foreground" />
                              <span className="text-xs text-muted-foreground">Just now</span>
                            </div>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${severityColor(result.severity)}`}>
                          {result.severity} Severity
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">{result.description}</p>
                    </div>

                    {/* Symptoms - collapsible */}
                    <div className="bg-background border border-border rounded-xl overflow-hidden">
                      <button
                        onClick={() => toggleSection("symptoms")}
                        className="w-full flex items-center justify-between p-4 hover:bg-muted/30 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 text-secondary" />
                          <h3 className="font-display font-semibold text-foreground text-sm">Symptoms ({result.symptoms.length})</h3>
                        </div>
                        {expandedSections.symptoms ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                      </button>
                      <AnimatePresence>
                        {expandedSections.symptoms && (
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: "auto" }}
                            exit={{ height: 0 }}
                            className="overflow-hidden"
                          >
                            <ul className="px-4 pb-4 space-y-2">
                              {result.symptoms.map((s, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                                  <span className="w-1.5 h-1.5 rounded-full bg-secondary mt-1.5 shrink-0" />
                                  {s}
                                </li>
                              ))}
                            </ul>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Treatment cards */}
                    <div className="grid sm:grid-cols-2 gap-4">
                      {/* Organic */}
                      <div className="bg-accent/30 border border-border rounded-xl overflow-hidden">
                        <button
                          onClick={() => toggleSection("organic")}
                          className="w-full flex items-center justify-between p-4 hover:bg-accent/50 transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <Sprout className="w-4 h-4 text-primary" />
                            <h3 className="font-display font-semibold text-foreground text-sm">Organic</h3>
                          </div>
                          {expandedSections.organic ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                        <AnimatePresence>
                          {expandedSections.organic && (
                            <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden">
                              <ul className="px-4 pb-4 space-y-2">
                                {result.treatment.organic.map((t, i) => (
                                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                                    {t}
                                  </li>
                                ))}
                              </ul>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Chemical */}
                      <div className="bg-secondary/5 border border-border rounded-xl overflow-hidden">
                        <button
                          onClick={() => toggleSection("chemical")}
                          className="w-full flex items-center justify-between p-4 hover:bg-secondary/10 transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <Pill className="w-4 h-4 text-secondary" />
                            <h3 className="font-display font-semibold text-foreground text-sm">Chemical</h3>
                          </div>
                          {expandedSections.chemical ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                        <AnimatePresence>
                          {expandedSections.chemical && (
                            <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden">
                              <ul className="px-4 pb-4 space-y-2">
                                {result.treatment.chemical.map((t, i) => (
                                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                                    <span className="w-1.5 h-1.5 rounded-full bg-secondary mt-1.5 shrink-0" />
                                    {t}
                                  </li>
                                ))}
                              </ul>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>

                    {/* Prevention */}
                    <div className="bg-background border border-border rounded-xl overflow-hidden">
                      <button
                        onClick={() => toggleSection("prevention")}
                        className="w-full flex items-center justify-between p-4 hover:bg-muted/30 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <Shield className="w-4 h-4 text-primary" />
                          <h3 className="font-display font-semibold text-foreground text-sm">Prevention ({result.prevention.length} tips)</h3>
                        </div>
                        {expandedSections.prevention ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                      <AnimatePresence>
                        {expandedSections.prevention && (
                          <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden">
                            <div className="px-4 pb-4 grid sm:grid-cols-2 gap-2">
                              {result.prevention.map((p, i) => (
                                <div key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                                  <Leaf className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                                  {p}
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                      <Button variant="outline" size="sm" className="gap-1" onClick={() => { setImage(null); setResult(null); }}>
                        <RotateCcw className="w-4 h-4" /> New Scan
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1"
                        onClick={() => {
                          const text = `CropSense AI Diagnosis\n\nDisease: ${result.disease_name}\nSeverity: ${result.severity}\nConfidence: ${result.confidence}\n\n${result.description}\n\nSymptoms:\n${result.symptoms.map(s => `- ${s}`).join("\n")}\n\nOrganic Treatment:\n${result.treatment.organic.map(t => `- ${t}`).join("\n")}\n\nChemical Treatment:\n${result.treatment.chemical.map(t => `- ${t}`).join("\n")}\n\nPrevention:\n${result.prevention.map(p => `- ${p}`).join("\n")}`;
                          const blob = new Blob([text], { type: "text/plain" });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement("a");
                          a.href = url;
                          a.download = `cropsense-diagnosis-${Date.now()}.txt`;
                          a.click();
                        }}
                      >
                        <Download className="w-4 h-4" /> Export Report
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </main>

      {/* Image zoom modal */}
      <AnimatePresence>
        {zoomedImage && (
          <motion.div
            className="fixed inset-0 z-50 bg-foreground/80 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setZoomedImage(null)}
          >
            <motion.img
              src={zoomedImage}
              alt="Zoomed"
              className="max-w-full max-h-full rounded-lg shadow-2xl"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
};

export default DetectPage;
