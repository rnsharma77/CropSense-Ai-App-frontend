import { Link, useLocation } from "react-router-dom";
import { Leaf, Menu, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { getCurrentUser, signOut, type BackendUser } from "@/lib/api";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<BackendUser | null>(null);
  const [signingOut, setSigningOut] = useState(false);
  const location = useLocation();

  const links = [
    { to: "/", label: "Home" },
    { to: "/detect", label: "Detect Disease" },
    { to: "/advisory", label: "Advisory" },
    { to: "/assistant", label: "Assistant" },
  ];

  const firstName = useMemo(() => {
    const name = (user?.name || "").trim();
    if (name) {
      return name.split(/\s+/)[0];
    }

    const email = (user?.email || "").trim();
    if (email.includes("@")) {
      return email.split("@")[0];
    }

    return "User";
  }, [user]);

  useEffect(() => {
    let mounted = true;

    const loadUser = async () => {
      try {
        const response = await getCurrentUser();
        if (mounted && response.user) {
          setUser(response.user);
          return;
        }
      } catch {
        // no-op
      }

      if (mounted) {
        setUser(null);
      }
    };

    loadUser();

    return () => {
      mounted = false;
    };
  }, [location.pathname]);

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      await signOut();
      setUser(null);
      setOpen(false);
    } finally {
      setSigningOut(false);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-hero-gradient flex items-center justify-center">
            <Leaf className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-display font-bold text-xl text-foreground">CropSense AI</span>
        </Link>

        <div className="hidden md:flex items-center gap-8 flex-1 justify-end">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                location.pathname === link.to ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}

          <div className="h-6 w-px bg-border" />

          <div className="flex items-center gap-2">
            {user ? (
              <>
                <Link to="/assistant/account">
                  <Button variant="outline" className="border-border text-foreground hover:bg-muted/50">
                    Hi, {firstName}
                  </Button>
                </Link>
                <Button variant="ghost" className="text-muted-foreground hover:text-foreground" onClick={handleSignOut} disabled={signingOut}>
                  {signingOut ? "Signing Out..." : "Sign Out"}
                </Button>
              </>
            ) : (
              <>
                <Link to="/assistant/account?tab=login">
                  <Button variant="outline" className="border-border text-foreground hover:bg-muted/50">
                    Sign In
                  </Button>
                </Link>
                <Link to="/assistant/account?tab=signup">
                  <Button className="bg-hero-gradient text-primary-foreground hover:opacity-90 transition-opacity">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}

            <Link to="/detect">
              <Button className="bg-hero-gradient text-primary-foreground hover:opacity-90 transition-opacity">
                Scan Crop
              </Button>
            </Link>
          </div>
        </div>

        <button className="md:hidden" onClick={() => setOpen(!open)}>
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-border bg-background p-4 space-y-3">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setOpen(false)}
              className="block py-2 text-sm font-medium text-muted-foreground hover:text-primary"
            >
              {link.label}
            </Link>
          ))}

          {user ? (
            <>
              <Link to="/assistant/account" onClick={() => setOpen(false)}>
                <Button variant="outline" className="w-full border-border text-foreground hover:bg-muted/50">
                  Hi, {firstName}
                </Button>
              </Link>
              <Button variant="ghost" className="w-full" onClick={handleSignOut} disabled={signingOut}>
                {signingOut ? "Signing Out..." : "Sign Out"}
              </Button>
            </>
          ) : (
            <>
              <Link to="/assistant/account?tab=login" onClick={() => setOpen(false)}>
                <Button variant="outline" className="w-full border-border text-foreground hover:bg-muted/50">
                  Sign In
                </Button>
              </Link>
              <Link to="/assistant/account?tab=signup" onClick={() => setOpen(false)}>
                <Button className="w-full bg-hero-gradient text-primary-foreground">Sign Up</Button>
              </Link>
            </>
          )}

          <Link to="/detect" onClick={() => setOpen(false)}>
            <Button className="w-full bg-hero-gradient text-primary-foreground">Scan Crop</Button>
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
