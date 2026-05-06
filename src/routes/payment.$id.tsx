import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";
import { CreditCard, Lock, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/payment/$id")({ component: Payment });

function Payment() {
  const { id } = Route.useParams();
  const { user, loading } = useAuth();
  const nav = useNavigate();
  const [booking, setBooking] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => { if (!loading && !user) nav({ to: "/auth" }); }, [user, loading]);
  useEffect(() => {
    if (!user) return;
    supabase.from("bookings").select("*,tours(title,location)").eq("id", id).maybeSingle().then(({ data }) => setBooking(data));
  }, [id, user]);

  const pay = async (e: React.FormEvent) => {
    e.preventDefault(); setSubmitting(true);
    // Simulated payment — replace with Stripe/Paddle webhook in production
    await new Promise((r) => setTimeout(r, 1200));
    await supabase.from("bookings").update({ payment_status: "paid", status: "confirmed" }).eq("id", id);
    await supabase.from("notifications").insert({ user_id: user!.id, title: "Payment received", body: `Payment of KES ${booking.total_kes.toLocaleString()} confirmed for ${booking.tours?.title}.` });
    setSubmitting(false); setDone(true);
    toast.success("Payment successful!");
  };

  if (!booking) return <div className="min-h-screen"><SiteHeader /><div className="text-center py-20 text-muted-foreground">Loading...</div></div>;

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="max-w-2xl mx-auto px-4 py-12">
        {done ? (
          <div className="bg-card rounded-3xl p-10 text-center shadow-glow border border-border">
            <CheckCircle2 className="w-16 h-16 text-primary mx-auto mb-4" />
            <h1 className="font-display text-3xl font-bold mb-2">Asante sana!</h1>
            <p className="text-muted-foreground mb-6">Your booking is confirmed. We've sent a notification with the details.</p>
            <Button onClick={() => nav({ to: "/dashboard" })} className="bg-gradient-sunset text-accent-foreground">View bookings</Button>
          </div>
        ) : (
          <div className="bg-card rounded-3xl p-8 shadow-soft border border-border">
            <h1 className="font-display text-3xl font-bold mb-1">Complete payment</h1>
            <p className="text-sm text-muted-foreground mb-6 flex items-center gap-1"><Lock className="w-3 h-3" />Secure checkout (demo mode)</p>

            <div className="bg-secondary rounded-xl p-4 mb-6">
              <div className="font-semibold">{booking.tours?.title}</div>
              <div className="text-sm text-muted-foreground">{booking.travel_date} · {booking.guests} guests</div>
              <div className="mt-3 pt-3 border-t flex justify-between font-bold text-lg"><span>Total</span><span>KES {booking.total_kes.toLocaleString()}</span></div>
            </div>

            <form onSubmit={pay} className="space-y-3">
              <div><Label>Card number</Label><Input placeholder="4242 4242 4242 4242" required /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Expiry</Label><Input placeholder="MM/YY" required /></div>
                <div><Label>CVC</Label><Input placeholder="123" required /></div>
              </div>
              <div><Label>Name on card</Label><Input required /></div>
              <Button type="submit" disabled={submitting} className="w-full bg-gradient-sunset text-accent-foreground"><CreditCard className="w-4 h-4 mr-2" />{submitting ? "Processing..." : `Pay KES ${booking.total_kes.toLocaleString()}`}</Button>
            </form>
          </div>
        )}
      </div>
      <SiteFooter />
    </div>
  );
}
