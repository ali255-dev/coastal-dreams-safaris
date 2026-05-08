import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight, Search, Shield, Heart, Compass } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { TourCard, type Tour } from "@/components/tour-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import heroImg from "@/assets/hero-coast.jpg";

export const Route = createFileRoute("/")({ component: Index });

function Index() {
  const [featured, setFeatured] = useState<Tour[]>([]);
  const [q, setQ] = useState("");

  useEffect(() => {
    supabase.from("tours").select("*").eq("featured", true).limit(4).then(({ data }) => setFeatured((data as Tour[]) ?? []));
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      {/* HERO */}
      <section className="relative h-[88vh] min-h-[600px] flex items-center overflow-hidden">
        <img src={heroImg} alt="Aerial view of Kenya's turquoise coast with a Swahili dhow" width={1920} height={1080} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-deep/80 via-deep/40 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 w-full">
          <div className="max-w-2xl text-primary-foreground">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur border border-white/20 text-xs font-medium mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" /> Karibu Pwani — Welcome to the Coast
            </div>
            <h1 className="font-display text-5xl md:text-7xl font-bold leading-[1.05] mb-6">
              Where the <span className="text-gradient-sunset">Swahili coast</span> opens its arms
            </h1>
            <p className="text-lg md:text-xl opacity-90 mb-8 max-w-xl">
              Curated journeys through Lamu, Mombasa, Diani and Watamu. Sail dhows, taste spice, dance with the Mijikenda — live the Kenyan coast.
            </p>

            <form onSubmit={(e) => { e.preventDefault(); window.location.href = `/tours?q=${encodeURIComponent(q)}`; }}
              className="flex gap-2 p-2 bg-background/95 backdrop-blur rounded-2xl shadow-glow max-w-lg">
              <div className="flex items-center pl-3 text-muted-foreground"><Search className="w-5 h-5" /></div>
              <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search beaches, culture, dhows..." className="border-0 focus-visible:ring-0 text-foreground bg-transparent" />
              <Button type="submit" className="bg-gradient-sunset text-accent-foreground hover:opacity-90">Explore</Button>
            </form>
          </div>
        </div>
      </section>

      {/* WHY */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: Compass, title: "Local Guides", text: "Born-and-raised coast experts who unlock places guidebooks miss." },
            { icon: Heart, title: "Cultural Depth", text: "Connect with Swahili and Mijikenda communities, not just postcards." },
            { icon: Shield, title: "Safe & Secure", text: "Verified operators, secure payments, and 24/7 trip support." },
          ].map((f) => (
            <div key={f.title} className="p-6 rounded-2xl bg-card border border-border shadow-soft hover:shadow-glow transition">
              <div className="w-12 h-12 rounded-xl bg-gradient-ocean flex items-center justify-center mb-4 text-primary-foreground">
                <f.icon className="w-6 h-6" />
              </div>
              <h3 className="font-display text-xl font-bold mb-2">{f.title}</h3>
              <p className="text-muted-foreground text-sm">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURED */}
      <section className="max-w-7xl mx-auto px-4 pb-20">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="text-xs uppercase tracking-[0.3em] text-accent font-semibold mb-2">Featured Journeys</div>
            
          </div>
          <Link to="/tours" className="hidden md:flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all">All tours <ArrowRight className="w-4 h-4" /></Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featured.map((t) => <TourCard key={t.id} tour={t} />)}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 pb-24">
        <div className="rounded-3xl bg-gradient-hero p-10 md:p-16 text-primary-foreground relative overflow-hidden shadow-glow">
          <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-accent/20 blur-3xl" />
          <div className="relative max-w-2xl">
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">Your coast story starts here.</h2>
            <p className="text-lg opacity-90 mb-8">Sign up to save tours, book in seconds, and get notified about secret spots and seasonal experiences.</p>
            <Link to="/auth"><Button size="lg" className="bg-accent text-accent-foreground hover:opacity-90 shadow-soft">Create your account</Button></Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
