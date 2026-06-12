import { Metadata } from 'next';
import {
  LoadingScreen,
  HeroSection,
  CategoriesSection,
  ShopByOccasion,
  BestsellerCarousel,
  DeliveryBanner,
  ComboGifts,
  DeliverySection,
  TrustBadges,
  Testimonials,
  InstagramGallery,
  FAQ,
  FooterCTA,
} from '@/components/home';

export const metadata: Metadata = {
  title: "Premium Cakes & Flower Bouquets in Vadodara | Same Day Delivery",
  description: "Order premium cakes, flower bouquets, and gift combos online in Vadodara. Same day delivery available. Chocolate, Red Velvet, Black Forest & more.",
  keywords: "cake delivery vadodara, flower bouquet vadodara, online cake order, birthday cake",
};

export default function HomePage() {
  return (
    <>
      {/* Cinematic Loading Screen */}
      {/* Note: In Next.js, we can just render the client component that handles state */}
      <LoadingScreen />

      <main className="overflow-hidden bg-white text-text-primary">
        <HeroSection />
        <CategoriesSection />
        <ShopByOccasion />
        <BestsellerCarousel
          title="Bestselling Cakes"
          category="cakes"
          viewAllLink="/cakes?sort=bestseller"
        />
        <DeliveryBanner />
        <BestsellerCarousel
          title="Fresh Flower Bouquets"
          category="flowers"
          viewAllLink="/flowers"
        />
        <ComboGifts />
        <DeliverySection />
        <TrustBadges />
        <Testimonials />
        <InstagramGallery />
        <FAQ />
        <FooterCTA />
      </main>
    </>
  );
}
