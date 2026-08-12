import { Buffet } from "@/components/sections/buffet";
import { Dishes } from "@/components/sections/dishes";
import { Hero } from "@/components/sections/hero";
import { Location } from "@/components/sections/location";
import { SiteFooter } from "@/components/sections/site-footer";
import { SiteHeader } from "@/components/sections/site-header";
import { RestaurantJsonLd } from "@/components/shared/restaurant-jsonld";

export default function HomePage() {
  return (
    <div className="max-w-full overflow-x-hidden">
      <RestaurantJsonLd />
      <SiteHeader />
      <main>
        <Hero />
        <Dishes />
        <Buffet />
        <Location />
      </main>
      <SiteFooter />
    </div>
  );
}
