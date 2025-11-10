import { HeroCarousel } from "@/components/hero-carousel";
import { LocationInput } from "@/components/location-input";
import { CategoryChips } from "@/components/category-chips";

export default async function HomePage() {
  return (
    <div className="space-y-6 pb-6">
      {/* Hero Carousel - above header content */}
      <HeroCarousel />

      {/* Location Input */}
      <LocationInput />

      {/* Top Categories */}
      <div className="overflow-visible">
        <CategoryChips />
      </div>
    </div>
  );
}

