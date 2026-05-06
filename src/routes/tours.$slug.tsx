import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { resolveTourImage, type Tour } from "@/components/tour-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, Star, Clock, Users, CreditCard } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

export const Route = createFileRoute("/tours/$slug")({ component: TourDetail });

function TourDetail() {
  const { slug } = Route.useParams();
  const { user } = useAuth();
  const nav = useNavigate();
  const [tour, setTour] = useState<Tour | null>(null);
  const [date, setDate] = useState("");
  const [guests, setGuests] = useState(2);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    supabase.from("tours").select("*").eq("slug", slug).maybeSingle().then(({ data }) => setTour(data as Tour | null));
  }, [slug]);

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) { nav({ to: "/auth" }); return; }
    if (!tour) return;
    if (!date) { toast.error("Pick a travel date"); return; }
    setSubmitting(true);
    const total = tour.price_kes * guests;
    const { data, error } = await supabase.from("bookings").insert({
      user_id: user.id, tour_id: tour.id, travel_date: date, guests, total_kes: total,
    }).select().single();
    setSubmitting(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Booking created — proceed to payment");
    nav({ to: "/payment/$id", params: { id: data.id } });
  };

  if (!tour) return (<div className="min-h-screen bg-background"><SiteHeader /><div className="max-w-7xl mx-auto px-4 py-20 text-center text-muted-foreground">Loading...</div></div>);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="relative h-[60vh] min-h-[400px]">
        <img src={resolveTourImage(tour.image_url)} alt={tour.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
      </div>
      <section className="max-w-7xl mx-auto px-4 -mt-32 relative grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-card rounded-3xl p-8 shadow-soft border border-border">
            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-3">
              <span className="px-2.5 py-1 rounded-full bg-primary/10 text-primary font-semibold text-xs">{tour.category}</span>
              <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{tour.location}</span>
              <span className="flex items-center gap-1"><Star className="w-4 h-4 fill-accent text-accent" />{tour.rating?.toFixed(1)}</span>
              <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{tour.duration_days} day{tour.duration_days > 1 ? "s" : ""}</span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">{tour.title}</h1>
            <p className="text-lg text-muted-foreground leading-relaxed">{tour.description}</p>

            <div className="mt-8 grid sm:grid-cols-3 gap-4">
              {["Local guide included", "Hotel pickup", "All entry fees"].map((x) => (
                <div key={x} className="p-4 rounded-xl bg-secondary text-sm font-medium">✓ {x}</div>
              ))}
            </div>
          </div>
        </div>
        <aside className="bg-card rounded-3xl p-6 shadow-glow border border-border h-fit lg:sticky lg:top-24">
          <div className="text-sm text-muted-foreground">From</div>
          <div className="text-3xl font-display font-bold text-primary mb-1">KES {tour.price_kes.toLocaleString()}</div>
          <div className="text-xs text-muted-foreground mb-6">per person</div>
          <form onSubmit={handleBook} className="space-y-4">
            <div>
              <Label htmlFor="date">Travel date</Label>
              <Input id="date" type="date" min={new Date().toISOString().split("T")[0]} value={date} onChange={(e) => setDate(e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="guests"><Users className="w-3 h-3 inline mr-1" />Guests</Label>
              <Input id="guests" type="number" min={1} max={20} value={guests} onChange={(e) => setGuests(parseInt(e.target.value) || 1)} required />
            </div>
            <div className="flex justify-between text-sm pt-3 border-t">
              <span>Total</span>
              <span className="font-bold text-lg">KES {(tour.price_kes * guests).toLocaleString()}</span>
            </div>
            <Button type="submit" disabled={submitting} className="w-full bg-gradient-sunset text-accent-foreground hover:opacity-90">
              <CreditCard className="w-4 h-4 mr-2" />{user ? "Book now" : "Sign in to book"}
            </Button>
            {!user && <p className="text-xs text-center text-muted-foreground"><Link to="/auth" className="underline">Sign in</Link> to complete booking</p>}
          </form>
        </aside>
      </section>
      <SiteFooter />
    </div>
  );
}
