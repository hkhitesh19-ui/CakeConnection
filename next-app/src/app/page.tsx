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
  FastDeliveryCarousel,
} from '@/components/home';

export const metadata: Metadata = {
  title: "Online Cake Delivery in Vadodara — Same Day & Midnight | CakeConnection",
  description: "Order 100% eggless cakes & fresh flowers in Vadodara. Same-day delivery in 2–4 hours (cut-off 6 PM). Midnight delivery at ₹149. Birthday, designer, photo cakes. Free delivery above ₹999.",
  keywords: "cake delivery vadodara, eggless cake vadodara, online cake order, birthday cake vadodara, same day cake delivery vadodara, midnight cake delivery, flower bouquet vadodara",
  alternates: {
    canonical: 'https://cakeconnection.in',
  },
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
        <FastDeliveryCarousel
          title="2 Hours SuperFast Delivery"
          category="cakes"
          viewAllLink="/cakes?sort=fast"
        />
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
