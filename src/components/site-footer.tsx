import { Waves } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="bg-deep text-primary-foreground mt-24">
      <div className="max-w-7xl mx-auto px-4 py-12 grid md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-full bg-gradient-sunset flex items-center justify-center"><Waves className="w-4 h-4" /></div>
            <span className="font-display font-bold text-lg">Coastlink Safaris</span>
          </div>
          <p className="text-sm opacity-80">Authentic journeys along Kenya's stunning coast — from Lamu to Diani.</p>
        </div>
        <div>
          <h4 className="font-semibold mb-3">Explore</h4>
          <ul className="space-y-2 text-sm opacity-80">
            <li>Lamu</li><li>Mombasa</li><li>Diani</li><li>Watamu</li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3">Company</h4>
          <ul className="space-y-2 text-sm opacity-80"><li>About</li><li>Contact</li><li>Careers</li></ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3">Contact</h4>
          <p className="text-sm opacity-80">hello@coastlinksafaris.co.ke<br/>Mombasa, Kenya</p>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs opacity-70">© {new Date().getFullYear()} Coastlink Safaris. Karibu Pwani.</div>
    </footer>
  );
}
