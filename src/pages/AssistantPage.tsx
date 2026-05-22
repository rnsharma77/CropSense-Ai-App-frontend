import { motion } from "framer-motion";
import { ArrowLeft, MessageCircle, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const AssistantPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container max-w-5xl">
          <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-6">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>

          <motion.div className="max-w-3xl mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">CropSense Assistant</h1>
            <p className="text-muted-foreground">
              Choose what you want to do. Account access and farming chat are now fully separated.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-card-gradient border-border">
              <CardHeader>
                <CardTitle className="font-display text-xl flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-primary" /> Account Page
                </CardTitle>
                <CardDescription>
                  Use a dedicated page only for login/signup and account session actions.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link to="/assistant/account">
                  <Button className="w-full bg-hero-gradient text-primary-foreground">Open Account</Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="bg-card-gradient border-border">
              <CardHeader>
                <CardTitle className="font-display text-xl flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-primary" /> Chat Page
                </CardTitle>
                <CardDescription>
                  Use a separate page only for AI farming chat with no login/signup forms mixed in.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link to="/assistant/chat">
                  <Button className="w-full bg-hero-gradient text-primary-foreground">Open Chat</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AssistantPage;
