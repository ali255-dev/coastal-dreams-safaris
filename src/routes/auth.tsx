import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { toast } from "sonner";
import { Waves } from "lucide-react";

export const Route = createFileRoute("/auth")({ component: AuthPage });

function AuthPage() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const signIn = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Welcome back!"); nav({ to: "/dashboard" });
  };
  const signUp = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    const { error } = await supabase.auth.signUp({
      email, password,
      options: { emailRedirectTo: `${window.location.origin}/dashboard`, data: { full_name: name } },
    });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Account created — check your email to confirm.");
  };
  const oauth = async (provider: "google") => {
    const r = await lovable.auth.signInWithOAuth(provider, { redirect_uri: window.location.origin + "/dashboard" });
    if (r.error) toast.error("Sign-in failed");
    else if (!r.redirected) nav({ to: "/dashboard" });
  };

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="max-w-md mx-auto px-4 py-16">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-ocean mx-auto flex items-center justify-center shadow-glow mb-4"><Waves className="w-7 h-7 text-primary-foreground" /></div>
          <h1 className="font-display text-3xl font-bold">Welcome to Coastlink</h1>
          <p className="text-muted-foreground text-sm mt-1">Sign in to book and save your coast journeys.</p>
        </div>
        <div className="bg-card border border-border rounded-2xl p-6 shadow-soft">
          <div className="space-y-2 mb-5">
            <Button onClick={() => oauth("google")} variant="outline" className="w-full">
              <svg className="w-4 h-4 mr-2" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6.5 29.3 4.5 24 4.5 13.2 4.5 4.5 13.2 4.5 24S13.2 43.5 24 43.5 43.5 34.8 43.5 24c0-1.2-.1-2.3-.3-3.5z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 16 19 13 24 13c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6.5 29.3 4.5 24 4.5 16.3 4.5 9.7 9 6.3 14.7z"/><path fill="#4CAF50" d="M24 43.5c5.2 0 9.9-2 13.4-5.2l-6.2-5.2c-2 1.4-4.5 2.2-7.2 2.2-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 38.9 16.2 43.5 24 43.5z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.1 5.6l6.2 5.2C42.6 35.5 45 30.2 45 24c0-1.2-.1-2.3-.3-3.5z"/></svg>
              Continue with Google
            </Button>
            <Button onClick={() => toast.info("Facebook sign-in requires custom OAuth setup — contact support.")} variant="outline" className="w-full">
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.95.93-1.95 1.88v2.26h3.32l-.53 3.49h-2.79V24C19.61 23.1 24 18.1 24 12.07z"/></svg>
              Continue with Facebook
            </Button>
          </div>
          <div className="flex items-center gap-3 my-4 text-xs text-muted-foreground"><div className="flex-1 h-px bg-border" /> or <div className="flex-1 h-px bg-border" /></div>
          <Tabs defaultValue="signin">
            <TabsList className="grid grid-cols-2 mb-4 w-full"><TabsTrigger value="signin">Sign in</TabsTrigger><TabsTrigger value="signup">Sign up</TabsTrigger></TabsList>
            <TabsContent value="signin">
              <form onSubmit={signIn} className="space-y-3">
                <div><Label>Email</Label><Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></div>
                <div><Label>Password</Label><Input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} /></div>
                <Button type="submit" disabled={loading} className="w-full bg-primary">Sign in</Button>
              </form>
            </TabsContent>
            <TabsContent value="signup">
              <form onSubmit={signUp} className="space-y-3">
                <div><Label>Full name</Label><Input required value={name} onChange={(e) => setName(e.target.value)} /></div>
                <div><Label>Email</Label><Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></div>
                <div><Label>Password</Label><Input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} /></div>
                <Button type="submit" disabled={loading} className="w-full bg-gradient-sunset text-accent-foreground">Create account</Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}
