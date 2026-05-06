import { Link } from "@tanstack/react-router";
import { MapPin, Star, Clock } from "lucide-react";

export type Tour = {
  id: string;
  title: string;
  slug: string;
  description: string;
  location: string;
  category: string;
  price_kes: number;
  duration_days: number;
  image_url: string | null;
  rating: number | null;
};

const imageMap: Record<string, string> = {
  "/src/assets/tour-lamu.jpg": new URL("../assets/tour-lamu.jpg", import.meta.url).href,
  "/src/assets/tour-diani.jpg": new URL("../assets/tour-diani.jpg", import.meta.url).href,
  "/src/assets/tour-dhow.jpg": new URL("../assets/tour-dhow.jpg", import.meta.url).href,
  "/src/assets/tour-mombasa.jpg": new URL("../assets/tour-mombasa.jpg", import.meta.url).href,
  "/src/assets/tour-watamu.jpg": new URL("../assets/tour-watamu.jpg", import.meta.url).href,
  "/src/assets/tour-mida.jpg": new URL("../assets/tour-mida.jpg", import.meta.url).href,
  "/src/assets/tour-culture.jpg": new URL("../assets/tour-culture.jpg", import.meta.url).href,
};

export function resolveTourImage(url: string | null) {
  if (!url) return "";
  return imageMap[url] || url;
}

export function TourCard({ tour }: { tour: Tour }) {
  return (
    <Link to="/tours/$slug" params={{ slug: tour.slug }} className="group block rounded-2xl overflow-hidden bg-card border border-border shadow-soft hover:shadow-glow transition-all duration-300 hover:-translate-y-1">
      <div className="aspect-[4/3] overflow-hidden bg-muted relative">
        <img src={resolveTourImage(tour.image_url)} alt={tour.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-background/90 backdrop-blur text-xs font-semibold">{tour.category}</div>
      </div>
      <div className="p-5">
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
          <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{tour.location}</span>
          <span className="flex items-center gap-1"><Star className="w-3 h-3 fill-accent text-accent" />{tour.rating?.toFixed(1)}</span>
        </div>
        <h3 className="font-display text-lg font-bold leading-snug mb-1 group-hover:text-primary transition">{tour.title}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{tour.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="w-3 h-3" />{tour.duration_days} day{tour.duration_days > 1 ? "s" : ""}</span>
          <div className="text-right">
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider">From</div>
            <div className="font-bold text-primary">KES {tour.price_kes.toLocaleString()}</div>
          </div>
        </div>
      </div>
    </Link>
  );
}
