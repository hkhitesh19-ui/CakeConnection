'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Star, Heart, ShoppingBag, ArrowRight } from 'lucide-react';
import { Container } from '@/components/ui';
import { cn } from '@/utils';
import { useCartStore, useWishlistStore, useUIStore } from '@/stores';
import { getProductsByCategory } from '@/lib/db';

export default function BestsellersSection() {
  const [activeTab, setActiveTab] = useState<'cakes' | 'flowers'>('cakes');
  const [cakes, setCakes] = useState<any[]>([]);
  const [flowers, setFlowers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const addItem = useCartStore((s) => s.addItem);
  const toggleWishlist = useWishlistStore((s) => s.toggleItem);
  const isInWishlist = useWishlistStore((s) => s.isInWishlist);
  const addToast = useUIStore((s) => s.addToast);

  useEffect(() => {
    async function loadData() {
      try {
        const cakesData = await getProductsByCategory('cakes');
        const flowersData = await getProductsByCategory('flowers');
        
        setCakes(cakesData.slice(0, 4).map(p => {
          const primaryVariant = p.variants[0] || { price: 0, compareAtPrice: 0, weight: '' };
          return {
            id: p.id,
            name: p.name,
            image: p.images[0]?.url || '/images/hero-cake.png',
            price: primaryVariant.price,
            originalPrice: primaryVariant.compareAtPrice || primaryVariant.price * 1.3,
            weight: primaryVariant.weight,
            rating: p.rating,
            reviews: p.reviewCount,
            badge: p.isBestseller ? 'Bestseller' : p.isNewArrival ? 'New' : undefined,
            slug: p.slug,
          };
        }));

        setFlowers(flowersData.slice(0, 4).map(p => {
          const primaryVariant = p.variants[0] || { price: 0, compareAtPrice: 0, weight: '' };
          return {
            id: p.id,
            name: p.name,
            image: p.images[0]?.url || '/images/hero-flowers.png',
            price: primaryVariant.price,
            originalPrice: primaryVariant.compareAtPrice || primaryVariant.price * 1.3,
            weight: primaryVariant.weight,
            rating: p.rating,
            reviews: p.reviewCount,
            badge: p.isBestseller ? 'Bestseller' : p.isNewArrival ? 'New' : undefined,
            slug: p.slug,
          };
        }));
      } catch (err) {
        console.error('Failed to load bestseller products:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const activeProducts = activeTab === 'cakes' ? cakes : flowers;

  const handleAddToCart = (product: any) => {
    addItem({
      productId: product.id,
      variantId: 'default',
      name: product.name,
      image: product.image,
      weight: product.weight,
      price: product.price,
      quantity: 1,
    });
    addToast({ type: 'success', message: `${product.name} added to cart!` });
  };


  return (
    <section className="py-16 bg-surface-primary overflow-hidden">
      <Container as="div" size="xl">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10 pb-4 border-b border-border-secondary">
          {/* Header text */}
          <div className="flex items-center gap-6">
            <h2 className="font-display text-3xl font-bold text-text-primary">
              Bestsellers
            </h2>
            
            {/* Winni-style Tab Selectors */}
            <div className="flex bg-surface-secondary border border-border-secondary rounded-xl p-1">
              <button
                onClick={() => setActiveTab('cakes')}
                className={cn(
                  'px-6 py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer',
                  activeTab === 'cakes'
                    ? 'bg-brand-rose text-white shadow-lg'
                    : 'text-text-secondary hover:text-text-primary'
                )}
              >
                Cakes
              </button>
              <button
                onClick={() => setActiveTab('flowers')}
                className={cn(
                  'px-6 py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer',
                  activeTab === 'flowers'
                    ? 'bg-brand-rose text-white shadow-lg'
                    : 'text-text-secondary hover:text-text-primary'
                )}
              >
                Flowers
              </button>
            </div>
          </div>

          <Link
            href={activeTab === 'cakes' ? '/cakes' : '/flowers'}
            className="px-5 py-2.5 bg-brand-rose/10 hover:bg-brand-rose hover:text-white text-brand-rose font-bold text-xs rounded-xl uppercase tracking-wider transition-all"
          >
            View All
          </Link>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <AnimatePresence mode="wait">
            {activeProducts.map((product) => {
              const isWishlisted = isInWishlist(product.id);
              const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
              return (
                <motion.article
                  key={product.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.4 }}
                  className="group relative flex flex-col rounded-2xl border border-border-secondary bg-surface-secondary overflow-hidden hover:border-brand-rose/30 transition-all duration-300 shadow-md"
                >
                  {/* Image and badges */}
                  <div className="relative aspect-square overflow-hidden bg-surface-tertiary">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    {/* Top Right Heart button */}
                    <button
                      onClick={() => toggleWishlist({ productId: product.id, name: product.name, image: product.image, price: product.price, addedAt: new Date().toISOString() })}
                      className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-surface-primary/70 backdrop-blur-sm border border-border-secondary transition-all hover:bg-white hover:scale-105 cursor-pointer"
                    >
                      <Heart
                        className={cn(
                          'h-4 w-4 transition-colors',
                          isWishlisted ? 'fill-brand-rose text-brand-rose' : 'text-text-secondary'
                        )}
                      />
                    </button>

                    {/* Category Label at bottom of image */}
                    {product.badge && (
                      <div className="absolute bottom-0 left-0 right-0 bg-brand-rose/85 backdrop-blur-xs py-1 text-center text-[10px] font-bold text-white uppercase tracking-wider">
                        {product.badge}
                      </div>
                    )}
                  </div>

                  {/* Content area */}
                  <div className="flex flex-col flex-1 p-4 text-left">
                    {/* Name */}
                    <h3 className="font-display text-sm sm:text-base font-semibold text-text-primary leading-snug line-clamp-2 min-h-[40px]">
                      <Link href={`/product/${product.slug}`} className="hover:text-brand-rose transition-colors">
                        {product.name}
                      </Link>
                    </h3>

                    {/* Pricing: Discounted, Original, and Percent Badge */}
                    <div className="mt-3 flex items-center flex-wrap gap-1.5">
                      <span className="text-base sm:text-lg font-bold text-brand-rose">
                        ₹{product.price}
                      </span>
                      <span className="text-xs text-text-muted line-through">
                        ₹{product.originalPrice}
                      </span>
                      <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider">
                        {discount}% OFF
                      </span>
                    </div>

                    {/* Footer Row: Rating Green Badge + Add to Cart Button */}
                    <div className="mt-4 flex items-center justify-between gap-3 pt-3 border-t border-border-secondary/40">
                      {/* Green rating badge */}
                      <div className="flex items-center gap-1 px-2 py-0.5 bg-emerald-600 text-white rounded text-xs font-bold">
                        <span>4.7</span>
                        <Star className="w-3 h-3 fill-white" />
                      </div>

                      {/* Mini Add to Cart Button */}
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="p-2 bg-brand-rose hover:bg-brand-rose-dark text-white rounded-xl transition-all shadow-md cursor-pointer flex items-center gap-1 text-xs font-semibold"
                        title="Add to Cart"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Add</span>
                      </button>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </AnimatePresence>
        </div>
      </Container>
    </section>
  );
}

