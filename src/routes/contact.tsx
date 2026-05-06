import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/contact")({
  component: Contact,
  head: () => ({ meta: [{ title: "Contact — Coastlink Safaris" }, { name: "description", content: "Get in touch with Coastlink Safaris to plan your Kenyan coast journey." }] }),
});

function Contact() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <section className="max-w-5xl mx-auto px-4 py-16 grid md:grid-cols-2 gap-10">
        <div>
          <h1 className="font-display text-5xl font-bold mb-4">Karibu — let's talk.</h1>
          <p className="text-muted-foreground mb-8">Tell us about the coast journey you're dreaming of.</p>
          <div className="space-y-4 text-sm">
            <div className="flex items-center gap-3"><Mail className="w-5 h-5 text-primary" />hello@coastlinksafaris.co.ke</div>
            <div className="flex items-center gap-3"><Phone className="w-5 h-5 text-primary" />+254 700 000 000</div>
            <div className="flex items-center gap-3"><MapPin className="w-5 h-5 text-primary" />Mombasa, Kenya</div>
          </div>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); toast.success("Message sent — asante!"); (e.target as HTMLFormElement).reset(); }} className="bg-card p-6 rounded-2xl border border-border shadow-soft space-y-3">
          <div><Label>Name</Label><Input required /></div>
          <div><Label>Email</Label><Input type="email" required /></div>
          <div><Label>Message</Label><Textarea rows={5} required /></div>
          <Button type="submit" className="w-full bg-gradient-sunset text-accent-foreground">Send message</Button>
        </form>
      </section>
      <SiteFooter />
    </div>
  );
}
