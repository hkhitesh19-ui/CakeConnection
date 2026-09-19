const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabaseUrl = 'https://miuxrcsckygnuxhdhiam.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1pdXhyY3Nja3lnbnV4aGRoaWFtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA2Mjk5NDQsImV4cCI6MjA5NjIwNTk0NH0.PfSItZPmeA7t2n1eHek8IcFfMTJk1v3gGLePa7eBeho';
const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  console.log('Fetching products from DB...');
  const { data: dbProducts, error } = await supabase.from('products').select('id, slug, name');
  if (error) {
    console.error('Error fetching:', error);
    return;
  }

  // We will read the mock products to find the corresponding images.
  // Instead of importing typescript, we'll hardcode a few defaults based on category for existing items.
  // Since we know the slugs from the DB, we can just assign some default images to them!
  const updates = [];
  for (const p of dbProducts) {
    let images = [];
    if (p.slug.includes('combo') || p.slug.includes('date-night') || p.slug.includes('hamper') || p.slug.includes('teddy')) {
      images = [{ url: '/images/combo-gift.png', alt: p.name }];
    } else if (p.slug.includes('cake')) {
      images = [{ url: '/images/hero-cake.png', alt: p.name }];
    } else if (p.slug.includes('rose') || p.slug.includes('flower') || p.slug.includes('bouquet') || p.slug.includes('orchid')) {
      images = [{ url: '/images/hero-flowers.png', alt: p.name }];
    } else {
      images = [{ url: '/images/hero-cake.png', alt: p.name }];
    }

    const { error: updateErr } = await supabase
      .from('products')
      .update({ images: images })
      .eq('id', p.id);
      
    if (updateErr) {
      console.error('Failed to update', p.name, updateErr);
    } else {
      console.log('Updated images for', p.name);
    }
  }
  console.log('Done!');
}

main();
