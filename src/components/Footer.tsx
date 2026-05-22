import { Leaf } from "lucide-react";

const Footer = () => (
  <footer className="bg-foreground text-primary-foreground/70 py-12">
    <div className="container">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-hero-gradient flex items-center justify-center">
            <Leaf className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-display font-bold text-primary-foreground">CropSense AI</span>
        </div>
        <p className="text-sm">© {new Date().getFullYear()} CropSense AI. Empowering farmers with AI.</p>
      </div>
    </div>
  </footer>
);

export default Footer;
