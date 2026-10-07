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
  WhyChooseUsSection,
  Testimonials,
  InstagramGallery,
  FAQ,
  FooterCTA,
  FastDeliveryCarousel,
} from '@/components/home';

export const metadata: Metadata = {
  title: "Online Cake & Flower Delivery in Vadodara | Live Cake Bakery - Cake Connection",
  description: "Order fresh live cakes, custom birthday cakes & flower bouquets online at cakeconnection.in. Same-day & midnight delivery in Vadodara & Manjalpur. Order now!",
  keywords: "online cake delivery in vadodara, same day cake and flower delivery vadodara, best live cake shop in manjalpur vadodara, customized theme cake online vadodara, fresh flower bouquet delivery vadodara, live cake vadodara, midnight cake delivery manjalpur",
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
        <WhyChooseUsSection />
        <Testimonials />
        <InstagramGallery />
        <FAQ />
        <FooterCTA />
      </main>
    </>
  );
}
