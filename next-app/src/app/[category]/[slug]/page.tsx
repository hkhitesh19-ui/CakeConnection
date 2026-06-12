import { Metadata, ResolvingMetadata } from 'next';
import { notFound } from 'next/navigation';
import ProductDetailClient from '@/components/product/ProductDetailClient';
import { getProductBySlug } from '@/data/products';
import { siteConfig } from '@/config/site.config';

type Props = {
  params: Promise<{ category: string; slug: string }>;
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const resolvedParams = await params;
  // Try to find the product
  const product = getProductBySlug(resolvedParams.slug);

  if (!product) {
    return {
      title: 'Product Not Found',
      description: 'The product you are looking for does not exist.',
    };
  }

  // Optionally access and extend parent metadata
  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: product.name,
    description: product.shortDescription,
    keywords: product.tags.join(', '),
    openGraph: {
      title: `${product.name} | ${siteConfig.name}`,
      description: product.shortDescription,
      url: `${siteConfig.url}/${resolvedParams.category}/${resolvedParams.slug}`,
      siteName: siteConfig.name,
      images: [
        {
          url: product.images[0]?.url || '/og-image.jpg',
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
      description: product.shortDescription,
      images: [product.images[0]?.url || '/og-image.jpg'],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const resolvedParams = await params;
  // Validate if product actually exists
  const product = getProductBySlug(resolvedParams.slug);

  if (!product) {
    notFound();
  }

  // The Client Component handles all the interactive UI, state, variants, and adding to cart
  return <ProductDetailClient />;
}
