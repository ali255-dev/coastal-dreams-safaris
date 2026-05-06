import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import cultureImg from "@/assets/tour-culture.jpg";

export const Route = createFileRoute("/about")({
  component: About,
  head: () => ({ meta: [{ title: "About — Coastlink Safaris" }, { name: "description", content: "Coastlink Safaris connects visitors with the people, culture, and nature of the Kenyan coast." }] }),
});

function About() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <section className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-xs uppercase tracking-[0.3em] text-accent font-semibold mb-3">Our story</div>
        <h1 className="font-display text-5xl font-bold mb-6">The coast belongs to those who feel it.</h1>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          Coastlink Safaris was born on the white sands of Diani with a simple belief: the Kenyan coast deserves to be experienced through the people who call it home. From the carved doors of Lamu to the spice markets of Mombasa, from the Mijikenda kayas to the coral gardens of Watamu — we connect curious travelers with authentic coastal Kenya.
        </p>
        <img src={cultureImg} alt="Mijikenda dancers on the beach" className="rounded-3xl shadow-soft my-8 w-full" loading="lazy" />
        <h2 className="font-display text-3xl font-bold mt-10 mb-3">Why we do this</h2>
        <p className="text-muted-foreground leading-relaxed">
          Tourism should give back. Every booking through Coastlink supports local guides, artisans, and conservation efforts along the coast. We're not just selling trips — we're weaving connections between visitors and the rich cultural fabric of pwani.
        </p>
      </section>
      <SiteFooter />
    </div>
  );
}
