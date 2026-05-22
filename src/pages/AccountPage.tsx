import { FormEvent, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Loader2, LogIn, ShieldCheck, UserPlus } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getCurrentUser, signIn, signOut, signUp, type BackendUser } from "@/lib/api";

const AccountPage = () => {
  const [searchParams] = useSearchParams();
  const requestedTab = searchParams.get("tab") === "signup" ? "signup" : "login";
  const [activeTab, setActiveTab] = useState<"login" | "signup">(requestedTab);

  const [user, setUser] = useState<BackendUser | null>(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  useEffect(() => {
    setActiveTab(requestedTab);
  }, [requestedTab]);

  useEffect(() => {
    let mounted = true;

    const loadUser = async () => {
      try {
        const response = await getCurrentUser();
        if (mounted && response.user) {
          setUser(response.user);
        }
      } catch {
        if (mounted) {
          setUser(null);
        }
      }
    };

    loadUser();

    return () => {
      mounted = false;
    };
  }, []);

  const handleSignup = async (e: FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthLoading(true);

    try {
      const response = await signUp(signupName, signupEmail, signupPassword);
      if (!response.ok || !response.user) {
        throw new Error(response.error || "Signup failed");
      }

      setUser(response.user);
      setSignupName("");
      setSignupEmail("");
      setSignupPassword("");
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : "Signup failed");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthLoading(true);

    try {
      const response = await signIn(loginEmail, loginPassword);
      if (!response.ok || !response.user) {
        throw new Error(response.error || "Login failed");
      }

      setUser(response.user);
      setLoginEmail("");
      setLoginPassword("");
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : "Login failed");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignOut = async () => {
    setAuthError(null);
    setAuthLoading(true);

    try {
      await signOut();
      setUser(null);
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : "Sign out failed");
    } finally {
      setAuthLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container max-w-3xl">
          <motion.div className="mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">Account Access</h1>
            <p className="text-muted-foreground">Login or sign up in a dedicated page.</p>
          </motion.div>

          <Card className="bg-card-gradient border-border">
            <CardHeader>
              <CardTitle className="font-display text-xl flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-primary" /> Account
              </CardTitle>
              <CardDescription>
                {user
                  ? `You are signed in as ${user.name || user.email}`
                  : "Sign up or sign in to enable account-based API access."}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {authError && (
                <div className="rounded-md border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {authError}
                </div>
              )}

              {user ? (
                <div className="space-y-3">
                  <div className="rounded-md border border-border bg-background p-4">
                    <p className="text-sm text-muted-foreground mb-3">Profile</p>
                    <div className="space-y-1.5 text-sm text-muted-foreground">
                      <p>
                        <span className="font-medium text-foreground">Name:</span> {user.name || "-"}
                      </p>
                      <p>
                        <span className="font-medium text-foreground">Email:</span> {user.email}
                      </p>
                      <p>
                        <span className="font-medium text-foreground">Role:</span> {user.role}
                      </p>
                    </div>
                  </div>

                  <Button variant="outline" className="w-full" onClick={handleSignOut} disabled={authLoading}>
                    {authLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                    Sign Out
                  </Button>
                </div>
              ) : (
                <Tabs
                  value={activeTab}
                  onValueChange={(value) => setActiveTab(value === "signup" ? "signup" : "login")}
                  className="w-full"
                >
                  <TabsList className="grid grid-cols-2 w-full">
                    <TabsTrigger value="login" className="gap-1">
                      <LogIn className="w-4 h-4" /> Login
                    </TabsTrigger>
                    <TabsTrigger value="signup" className="gap-1">
                      <UserPlus className="w-4 h-4" /> Signup
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="login">
                    <form className="space-y-3" onSubmit={handleLogin}>
                      <Input
                        type="email"
                        placeholder="Email"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        required
                      />
                      <Input
                        type="password"
                        placeholder="Password"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        required
                      />
                      <Button type="submit" className="w-full bg-hero-gradient text-primary-foreground" disabled={authLoading}>
                        {authLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                        Sign In
                      </Button>
                    </form>
                  </TabsContent>

                  <TabsContent value="signup">
                    <form className="space-y-3" onSubmit={handleSignup}>
                      <Input
                        placeholder="Full name"
                        value={signupName}
                        onChange={(e) => setSignupName(e.target.value)}
                        required
                      />
                      <Input
                        type="email"
                        placeholder="Email"
                        value={signupEmail}
                        onChange={(e) => setSignupEmail(e.target.value)}
                        required
                      />
                      <Input
                        type="password"
                        placeholder="Password"
                        value={signupPassword}
                        onChange={(e) => setSignupPassword(e.target.value)}
                        minLength={6}
                        required
                      />
                      <Button type="submit" className="w-full bg-hero-gradient text-primary-foreground" disabled={authLoading}>
                        {authLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                        Create Account
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AccountPage;