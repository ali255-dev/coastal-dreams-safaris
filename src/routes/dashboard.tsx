import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { Calendar, MapPin, CreditCard, BadgeCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMembership, MEMBER_DISCOUNT_PERCENT } from "@/lib/membership";

export const Route = createFileRoute("/dashboard")({
  component: Dashboard,
  head: () => ({ meta: [
    { title: "My Journeys — Coastlink Safaris" },
    { name: "description", content: "Review your Coastlink Safaris bookings and membership details." },
    { property: "og:title", content: "My Journeys — Coastlink Safaris" },
    { property: "og:description", content: "Review your coastal Kenya bookings and Coastlink membership." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
});

type Booking = {
  id: string; travel_date: string; guests: number; total_kes: number; status: string; payment_status: string;
  tours: { title: string; location: string; slug: string } | null;
};

function Dashboard() {
  const { user, loading } = useAuth();
  const nav = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const membership = useMembership();

  useEffect(() => {
    if (!loading && !user) nav({ to: "/auth" });
  }, [user, loading]);

  useEffect(() => {
    if (!user) return;
    supabase.from("bookings").select("id,travel_date,guests,total_kes,status,payment_status,tours(title,location,slug)").order("created_at", { ascending: false })
      .then(({ data }) => setBookings((data as Booking[]) ?? []));
  }, [user]);

  if (!user) return null;
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <section className="bg-gradient-hero text-primary-foreground py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="font-display text-4xl font-bold">Jambo, {user.email?.split("@")[0]}</h1>
          <p className="opacity-90 mt-1">Your coast journeys, all in one place.</p>
        </div>
      </section>
      <section className="max-w-7xl mx-auto px-4 -mt-8 relative">
        <div className="bg-card border border-border rounded-2xl p-6 shadow-soft flex flex-wrap items-center gap-4 justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-gradient-ocean flex items-center justify-center">
              <BadgeCheck className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <div className="font-display text-lg font-bold">Coastlink Member</div>
              <p className="text-sm text-muted-foreground">
                {membership.discountPercent > 0
                  ? `${MEMBER_DISCOUNT_PERCENT}% member discount is active on every booking.`
                  : `Free membership active — ${MEMBER_DISCOUNT_PERCENT}% off unlocks after your first paid trip.`}
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-display font-bold text-primary">{membership.discountPercent}%</div>
            <div className="text-xs text-muted-foreground">{membership.paidTrips} paid trip{membership.paidTrips === 1 ? "" : "s"}</div>
          </div>
        </div>
      </section>
      <section className="max-w-7xl mx-auto px-4 py-10">
        <h2 className="font-display text-2xl font-bold mb-6">Your bookings</h2>
        {bookings.length === 0 ? (
          <div className="bg-card border border-border rounded-2xl p-10 text-center">
            <p className="text-muted-foreground mb-4">No bookings yet — your coast story awaits.</p>
            <Link to="/tours" search={{ q: "", cat: "" }}><Button className="bg-gradient-sunset text-accent-foreground">Browse tours</Button></Link>
          </div>
        ) : (
          <div className="space-y-3">
            {bookings.map((b) => (
              <div key={b.id} className="bg-card border border-border rounded-2xl p-5 flex flex-wrap items-center gap-4 justify-between shadow-soft">
                <div>
                  <div className="font-display text-lg font-bold">{b.tours?.title}</div>
                  <div className="text-sm text-muted-foreground flex flex-wrap gap-3 mt-1">
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{b.tours?.location}</span>
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{b.travel_date}</span>
                    <span>{b.guests} guests</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="font-bold">KES {b.total_kes.toLocaleString()}</div>
                    <div className="text-xs"><span className={`px-2 py-0.5 rounded-full ${b.payment_status === "paid" ? "bg-primary/10 text-primary" : "bg-accent/20 text-accent-foreground"}`}>{b.payment_status}</span></div>
                  </div>
                  {b.payment_status !== "paid" && (
                    <Link to="/payment/$id" params={{ id: b.id }}><Button size="sm" className="bg-gradient-sunset text-accent-foreground"><CreditCard className="w-3 h-3 mr-1" />Pay</Button></Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
      <SiteFooter />
    </div>
  );
}
