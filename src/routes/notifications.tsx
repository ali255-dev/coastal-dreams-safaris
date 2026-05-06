import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { Bell, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/notifications")({ component: Notifications });

type N = { id: string; title: string; body: string | null; read: boolean; created_at: string };

function Notifications() {
  const { user, loading } = useAuth();
  const nav = useNavigate();
  const [items, setItems] = useState<N[]>([]);

  useEffect(() => { if (!loading && !user) nav({ to: "/auth" }); }, [user, loading]);

  const load = async () => {
    const { data } = await supabase.from("notifications").select("*").order("created_at", { ascending: false });
    setItems((data as N[]) ?? []);
  };
  useEffect(() => { if (user) load(); }, [user]);

  const markAll = async () => {
    await supabase.from("notifications").update({ read: true }).eq("read", false);
    load();
  };

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-display text-3xl font-bold flex items-center gap-2"><Bell className="w-7 h-7 text-primary" />Notifications</h1>
          {items.some(i => !i.read) && <Button variant="outline" onClick={markAll}><Check className="w-4 h-4 mr-1" />Mark all read</Button>}
        </div>
        {items.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground bg-card rounded-2xl border border-border">No notifications yet.</div>
        ) : (
          <div className="space-y-2">
            {items.map((n) => (
              <div key={n.id} className={`p-5 rounded-2xl border ${n.read ? "bg-card border-border" : "bg-primary/5 border-primary/30"}`}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-semibold">{n.title}</div>
                    {n.body && <p className="text-sm text-muted-foreground mt-1">{n.body}</p>}
                    <div className="text-xs text-muted-foreground mt-2">{new Date(n.created_at).toLocaleString()}</div>
                  </div>
                  {!n.read && <span className="w-2 h-2 rounded-full bg-accent mt-2" />}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <SiteFooter />
    </div>
  );
}
