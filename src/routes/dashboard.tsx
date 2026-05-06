import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { Calendar, MapPin, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/dashboard")({ component: Dashboard });

type Booking = {
  id: string; travel_date: string; guests: number; total_kes: number; status: string; payment_status: string;
  tours: { title: string; location: string; slug: string } | null;
};

function Dashboard() {
  const { user, loading } = useAuth();
  const nav = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);

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
      <section className="max-w-7xl mx-auto px-4 py-10">
        <h2 className="font-display text-2xl font-bold mb-6">Your bookings</h2>
        {bookings.length === 0 ? (
          <div className="bg-card border border-border rounded-2xl p-10 text-center">
            <p className="text-muted-foreground mb-4">No bookings yet — your coast story awaits.</p>
            <Link to="/tours"><Button className="bg-gradient-sunset text-accent-foreground">Browse tours</Button></Link>
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
