#!/usr/bin/env node
// ============================================================
// scripts/sync_cake_photos.js
// 1. Copies all 91 cleaned cake photos from F:\HITESH\WEBSITE\Website Cake  Photos
//    to next-app/public/images/cakes/ with clean URL-safe filenames.
// 2. Maps each cake in Supabase database to its best matching photo.
// 3. Updates the Supabase products table with real image paths!
// ============================================================

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// 1. Read environment variables from .env.local
const envPath = path.join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const envVars = {};
envContent.split(/\r?\n/).forEach(line => {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match) {
    let val = match[2].trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    envVars[match[1].trim()] = val;
  }
});

const supabase = createClient(envVars.NEXT_PUBLIC_SUPABASE_URL, envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY);

const sourceDir = 'F:/HITESH/WEBSITE/Website Cake  Photos';
const destDir = path.join(__dirname, '..', 'public', 'images', 'cakes');

// Helper to convert filename to clean URL-safe slug
function toSlugFilename(filename) {
  const ext = path.extname(filename).toLowerCase();
  const base = path.basename(filename, ext);
  const slug = base
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return `${slug}${ext}`;
}

// Ensure destination directory exists
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

// Step 1: Copy files to public/images/cakes
console.log('--- STEP 1: Copying photos to public/images/cakes ---');
const sourceFiles = fs.readdirSync(sourceDir).filter(f => fs.statSync(path.join(sourceDir, f)).isFile());

const catalog = []; // { originalName, slugName, relativeUrl, keywords }

sourceFiles.forEach(file => {
  const slugName = toSlugFilename(file);
  const srcPath = path.join(sourceDir, file);
  const dstPath = path.join(destDir, slugName);

  fs.copyFileSync(srcPath, dstPath);

  const cleanBase = path.basename(file, path.extname(file)).toLowerCase();
  const keywords = cleanBase.replace(/[^a-z0-9]/g, ' ').split(/\s+/).filter(k => k.length > 1);

  catalog.push({
    originalName: file,
    slugName,
    url: `/images/cakes/${slugName}`,
    rawName: cleanBase,
    keywords: new Set(keywords)
  });
});

console.log(`Successfully copied ${catalog.length} photos into ${destDir}!\n`);

// Helper to normalize strings for matching
function clean(str) {
  return (str || '')
    .toLowerCase()
    .replace(/eggless/gi, '')
    .replace(/cake/gi, '')
    .replace(/flavour/gi, '')
    .replace(/[^a-z0-9]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Function to find best matching photo for a cake
function findBestPhoto(product) {
  const pName = clean(product.name);
  const pSlug = clean(product.slug);
  const pText = `${pName} ${pSlug} ${clean(product.subcategory)} ${clean(product.flavour)}`;
  const pTokens = pText.split(' ').filter(t => t.length > 2);

  let bestMatch = null;
  let highestScore = 0;

  for (const item of catalog) {
    let score = 0;

    // Direct name containment
    if (pName.includes(item.rawName) || item.rawName.includes(pName)) {
      score += 50;
    }

    // Token overlap
    pTokens.forEach(token => {
      if (item.keywords.has(token)) {
        score += 5;
      }
    });

    if (score > highestScore) {
      highestScore = score;
      bestMatch = item;
    }
  }

  // If score is decent, return match
  if (bestMatch && highestScore >= 10) {
    return bestMatch.url;
  }

  // Fallback by flavour / subcategory keywords
  if (pText.includes('blackforest') || pText.includes('black forest')) {
    const bf = catalog.filter(c => c.rawName.includes('blackforest') || c.rawName.includes('black forest'));
    if (bf.length) return bf[Math.floor(Math.random() * bf.length)].url;
  }
  if (pText.includes('red velvet') || pText.includes('redvelvet')) {
    const rv = catalog.filter(c => c.rawName.includes('red velvet') || c.rawName.includes('red rose'));
    if (rv.length) return rv[Math.floor(Math.random() * rv.length)].url;
  }
  if (pText.includes('pineapple') || pText.includes('pineaple')) {
    const pa = catalog.filter(c => c.rawName.includes('pineapple') || c.rawName.includes('pineaple'));
    if (pa.length) return pa[Math.floor(Math.random() * pa.length)].url;
  }
  if (pText.includes('butterscotch')) {
    const bs = catalog.filter(c => c.rawName.includes('butterscotch'));
    if (bs.length) return bs[Math.floor(Math.random() * bs.length)].url;
  }
  if (pText.includes('strawberry')) {
    const sb = catalog.filter(c => c.rawName.includes('strawberry'));
    if (sb.length) return sb[Math.floor(Math.random() * sb.length)].url;
  }
  if (pText.includes('fruit')) {
    const fr = catalog.filter(c => c.rawName.includes('fruit'));
    if (fr.length) return fr[Math.floor(Math.random() * fr.length)].url;
  }
  if (pText.includes('kitkat') || pText.includes('kit kat')) {
    const kk = catalog.filter(c => c.rawName.includes('kitkat'));
    if (kk.length) return kk[Math.floor(Math.random() * kk.length)].url;
  }
  if (pText.includes('oreo')) {
    const or = catalog.filter(c => c.rawName.includes('oreo'));
    if (or.length) return or[Math.floor(Math.random() * or.length)].url;
  }
  if (pText.includes('rasmalai') || pText.includes('ras malai')) {
    const rm = catalog.filter(c => c.rawName.includes('rasmalai'));
    if (rm.length) return rm[Math.floor(Math.random() * rm.length)].url;
  }
  if (pText.includes('truffle') || pText.includes('dutch')) {
    const tf = catalog.filter(c => c.rawName.includes('truffle'));
    if (tf.length) return tf[Math.floor(Math.random() * tf.length)].url;
  }
  if (pText.includes('chocolate') || pText.includes('choco')) {
    const ch = catalog.filter(c => c.rawName.includes('chocolate') || c.rawName.includes('choco'));
    if (ch.length) return ch[Math.floor(Math.random() * ch.length)].url;
  }
  if (pText.includes('mom') || pText.includes('mother') || pText.includes('maa')) {
    const mom = catalog.filter(c => c.rawName.includes('mom') || c.rawName.includes('maa'));
    if (mom.length) return mom[0].url;
  }
  if (pText.includes('dad') || pText.includes('father') || pText.includes('papa')) {
    const dad = catalog.filter(c => c.rawName.includes('dad') || c.rawName.includes('papa'));
    if (dad.length) return dad[0].url;
  }
  if (pText.includes('anniversary') || pText.includes('love')) {
    const ann = catalog.filter(c => c.rawName.includes('anniversary') || c.rawName.includes('love'));
    if (ann.length) return ann[0].url;
  }

  // Default to best match or first photo
  return bestMatch ? bestMatch.url : catalog[0].url;
}

// Step 2: Fetch products from Supabase and update
async function updateSupabase() {
  console.log('--- STEP 2: Updating Cake Products in Supabase ---');
  const { data: products, error } = await supabase
    .from('products')
    .select('id, name, slug, category, subcategory, flavour, images');

  if (error) {
    console.error('Error fetching products from Supabase:', error);
    return;
  }

  const cakes = products.filter(p => p.category === 'cakes' || !p.category);
  console.log(`Found ${cakes.length} cakes to update.`);

  let updatedCount = 0;
  for (const cake of cakes) {
    const photoUrl = findBestPhoto(cake);
    const newImages = [
      { url: photoUrl, alt: cake.name }
    ];

    const { error: updateError } = await supabase
      .from('products')
      .update({ images: newImages })
      .eq('id', cake.id);

    if (updateError) {
      console.error(`Failed to update cake "${cake.name}":`, updateError.message);
    } else {
      updatedCount++;
    }
  }

  console.log(`\n========================================`);
  console.log(`SYNC COMPLETE:`);
  console.log(`- Photos copied: ${catalog.length}`);
  console.log(`- Cakes updated in Supabase: ${updatedCount} / ${cakes.length}`);
  console.log(`========================================`);
}

updateSupabase();
