import { Link, useNavigate } from "@tanstack/react-router";
import { Waves, Bell, LogOut, User as UserIcon } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";

export function SiteHeader() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    if (!user) { setUnread(0); return; }
    const load = async () => {
      const { count } = await supabase.from("notifications").select("*", { count: "exact", head: true }).eq("read", false);
      setUnread(count ?? 0);
    };
    load();
    const ch = supabase.channel("notif").on("postgres_changes", { event: "*", schema: "public", table: "notifications" }, load).subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [user]);

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-background/80 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-full bg-gradient-ocean flex items-center justify-center shadow-soft">
            <Waves className="w-5 h-5 text-primary-foreground" />
          </div>
          <div className="leading-tight">
            <div className="font-display text-lg font-bold tracking-tight">Coastlink</div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground -mt-0.5">Safaris</div>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-7 text-sm font-medium">
          <Link to="/" activeOptions={{ exact: true }} activeProps={{ className: "text-primary" }} className="hover:text-primary transition">Home</Link>
          <Link to="/tours" activeProps={{ className: "text-primary" }} className="hover:text-primary transition">Tours</Link>
          <Link to="/about" activeProps={{ className: "text-primary" }} className="hover:text-primary transition">About</Link>
          <Link to="/contact" activeProps={{ className: "text-primary" }} className="hover:text-primary transition">Contact</Link>
        </nav>

        <div className="flex items-center gap-2">
          {user ? (
            <>
              <Link to="/notifications" className="relative">
                <Button variant="ghost" size="icon"><Bell className="w-5 h-5" /></Button>
                {unread > 0 && <span className="absolute top-1 right-1 w-4 h-4 text-[10px] flex items-center justify-center rounded-full bg-accent text-accent-foreground font-bold">{unread}</span>}
              </Link>
              <Link to="/dashboard"><Button variant="ghost" size="icon"><UserIcon className="w-5 h-5" /></Button></Link>
              <Button variant="ghost" size="icon" onClick={async () => { await supabase.auth.signOut(); navigate({ to: "/" }); }}>
                <LogOut className="w-5 h-5" />
              </Button>
            </>
          ) : (
            <>
              <Link to="/auth"><Button variant="ghost">Sign in</Button></Link>
              <Link to="/auth"><Button className="bg-gradient-sunset text-accent-foreground hover:opacity-90 shadow-soft">Get started</Button></Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
