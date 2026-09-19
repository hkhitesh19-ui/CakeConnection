import { Metadata, ResolvingMetadata } from 'next';
import { notFound } from 'next/navigation';
import ProductDetailClient from '@/components/product/ProductDetailClient';
import { getProductBySlug, getRelatedProducts, getProductsByCategory } from '@/lib/db';
import { siteConfig } from '@/config/site.config';
import { generateProductSchema } from '@/lib/seo/schema';

type Props = {
  params: Promise<{ category: string; slug: string }>;
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const resolvedParams = await params;
  const product = await getProductBySlug(resolvedParams.slug);

  if (!product) {
    return {
      title: 'Product Not Found',
      description: 'The product you are looking for does not exist.',
    };
  }

  const previousImages = (await parent).openGraph?.images || [];
  const canonicalUrl = `${siteConfig.url}/${resolvedParams.category}/${resolvedParams.slug}`;
  const productImage = product.images[0]?.url || '/og-image.jpg';

  return {
    title: product.name,
    description: product.shortDescription || product.description?.slice(0, 155),
    keywords: product.tags,
    alternates: {
      canonical: canonicalUrl,  // ✅ Added: prevents duplicate content issues
    },
    openGraph: {
      title: `${product.name} | ${siteConfig.name}`,
      description: product.shortDescription || product.description?.slice(0, 155),
      url: canonicalUrl,
      siteName: siteConfig.name,
      images: [
        {
          url: productImage,
          width: 800,
          height: 600,
          alt: product.images[0]?.alt || product.name,
        },
        ...previousImages,
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: product.name,
      description: product.shortDescription || product.description?.slice(0, 155),
      images: [productImage],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const resolvedParams = await params;
  const product = await getProductBySlug(resolvedParams.slug);

  if (!product) {
    notFound();
  }

  // Fetch 3 Cakes, 3 Flowers, and 3 Combos for "You Might Also Like" section
  const [allCakes, allFlowers, allCombos] = await Promise.all([
    getProductsByCategory('cakes'),
    getProductsByCategory('flowers'),
    getProductsByCategory('combos'),
  ]);

  const cakes3 = allCakes.filter(p => p.id !== product.id).slice(0, 3);
  const flowers3 = allFlowers.filter(p => p.id !== product.id).slice(0, 3);
  const combos3 = allCombos.filter(p => p.id !== product.id).slice(0, 3);
  const relatedProducts = [...cakes3, ...flowers3, ...combos3];

  // ✅ Server-side ProductSchema JSON-LD for Google rich results (price + rating in SERP)
  const lowestVariantPrice = product.variants?.length
    ? Math.min(...product.variants.map(v => v.price)).toString()
    : '0';

  const productSchema = generateProductSchema({
    name: product.name,
    description: product.shortDescription || product.description || '',
    image: product.images[0]?.url || `${siteConfig.url}/og-image.jpg`,
    price: lowestVariantPrice,
    sku: product.variants?.[0]?.sku || product.id,
    inStock: product.isAvailable,
    category: resolvedParams.category,
    slug: resolvedParams.slug,
    rating: product.rating || undefined,
    reviewCount: product.reviewCount || undefined,
  });

  return (
    <>
      {/* ✅ Product structured data — enables price + rating rich results in Google SERP */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <ProductDetailClient product={product} relatedProducts={relatedProducts} />
    </>
  );
}

