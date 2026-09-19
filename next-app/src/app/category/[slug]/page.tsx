import { redirect } from 'next/navigation';

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function CategoryRedirectPage({ params }: Props) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug.toLowerCase();
  
  if (slug.includes('flower') || slug.includes('rose') || slug.includes('lily') || slug.includes('orchid') || slug.includes('carnation')) {
    const filter = slug.replace('-flowers', '').replace('-flower', '');
    redirect(`/flowers?subcategory=${filter}`);
  } else if (slug.includes('combo')) {
    redirect(`/combos?type=${slug}`);
  } else {
    // Treat as cake category
    // E.g., 'fathers-day-cakes' -> 'fathers-day'
    // 'birthday-cakes' -> 'birthday'
    const filter = slug.replace('-cakes', '').replace('-cake', '');
    redirect(`/cakes?subcategory=${filter}`);
  }
}
