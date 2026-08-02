import React, { useState } from 'react';
import ClothDoodlesBackground from '../components/ui/ClothDoodlesBackground';
import HeroSection from '../components/home/HeroSection';
import BrandStrip from '../components/home/BrandStrip';
import CategoryCircles from '../components/home/CategoryCircles';
import FeaturedCollections from '../components/home/FeaturedCollections';
import BestSellers from '../components/home/BestSellers';
import TrendingProducts from '../components/home/TrendingProducts';
import SeasonalCollection from '../components/home/SeasonalCollection';
import LimitedTimeOffers from '../components/home/LimitedTimeOffers';
import WhyChooseUs from '../components/home/WhyChooseUs';
import CustomerReviews from '../components/home/CustomerReviews';
import InstagramGallery from '../components/home/InstagramGallery';
import NewsletterSection from '../components/home/NewsletterSection';
import QuickViewModal from '../components/ui/QuickViewModal';

export default function Home() {
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  return (
    <main className="w-full bg-[#FFF8EC] relative overflow-hidden">
      {/* Animated Cloth Doodles Background */}
      <ClothDoodlesBackground />

      {/* Page Sections */}
      <div className="relative z-10 space-y-0">
        <HeroSection />
        <BrandStrip />
        <CategoryCircles />
        <FeaturedCollections />
        <BestSellers onQuickView={setQuickViewProduct} />
        <LimitedTimeOffers />
        <TrendingProducts onQuickView={setQuickViewProduct} />
        <SeasonalCollection onQuickView={setQuickViewProduct} />
        <WhyChooseUs />
        <CustomerReviews />
        <InstagramGallery />
        <NewsletterSection />
      </div>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
      )}
    </main>
  );
}
