import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { TourCard, type Tour } from "@/components/tour-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/tours")({
  validateSearch: (s: Record<string, unknown>) => ({ q: (s.q as string) ?? "", cat: (s.cat as string) ?? "" }),
  component: ToursPage,
  head: () => ({ meta: [{ title: "All Tours — Coastlink Safaris" }, { name: "description", content: "Browse all coastal Kenya tours: beaches, culture, adventure, and nature." }] }),
});

const CATEGORIES = ["All", "Beach", "Culture", "Adventure", "Nature"];

function ToursPage() {
  const { q, cat } = Route.useSearch();
  const nav = useNavigate();
  const [tours, setTours] = useState<Tour[]>([]);
  const [search, setSearch] = useState(q);
  const [category, setCategory] = useState(cat || "All");

  useEffect(() => {
    let query = supabase.from("tours").select("*").order("featured", { ascending: false });
    if (category && category !== "All") query = query.eq("category", category);
    if (q) query = query.or(`title.ilike.%${q}%,description.ilike.%${q}%,location.ilike.%${q}%`);
    query.then(({ data }) => setTours((data as Tour[]) ?? []));
  }, [q, category]);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <section className="bg-gradient-hero text-primary-foreground py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="font-display text-5xl font-bold mb-3">Find your coast moment</h1>
          <p className="opacity-90 mb-8">Browse {tours.length || "all"} curated experiences across Kenya's coastline.</p>
          <form onSubmit={(e) => { e.preventDefault(); nav({ to: "/tours", search: { q: search, cat: category === "All" ? "" : category } }); }}
            className="flex gap-2 p-2 bg-background rounded-2xl shadow-glow max-w-xl">
            <div className="flex items-center pl-3 text-muted-foreground"><Search className="w-5 h-5" /></div>
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name, place..." className="border-0 focus-visible:ring-0 text-foreground bg-transparent" />
            <Button type="submit" className="bg-gradient-sunset text-accent-foreground">Search</Button>
          </form>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex flex-wrap gap-2 mb-8">
          {CATEGORIES.map((c) => (
            <button key={c} onClick={() => { setCategory(c); nav({ to: "/tours", search: { q, cat: c === "All" ? "" : c } }); }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition border ${category === c ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border hover:border-primary"}`}>
              {c}
            </button>
          ))}
        </div>
        {tours.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">No tours found. Try another search.</div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {tours.map((t) => <TourCard key={t.id} tour={t} />)}
          </div>
        )}
      </section>
      <SiteFooter />
    </div>
  );
}
