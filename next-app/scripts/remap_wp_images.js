#!/usr/bin/env node
// ============================================================
// scripts/remap_wp_images.js — CakeConnection
// Replaces ALL WP legacy image URLs with smart local fallbacks
// based on product slug/name keyword matching.
//
// Usage:  node scripts/remap_wp_images.js          (patches files + DB)
//         node scripts/remap_wp_images.js --dry-run (preview only)
// ============================================================

// Load .env.local without dotenv package
(function loadEnv() {
  const envPath = require('path').join(__dirname, '..', '.env.local');
  if (!require('fs').existsSync(envPath)) return;
  require('fs').readFileSync(envPath, 'utf8').split(/\r?\n/).forEach(line => {
    const m = line.match(/^([^#=]+)=(.*)$/);
    if (m && !process.env[m[1].trim()]) process.env[m[1].trim()] = m[2].trim();
  });
})();

const fs   = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const DRY_RUN = process.argv.includes('--dry-run');

// ── Available local images ────────────────────────────────────
const CAKE_IMAGES = [
  '/images/hero-cake.png',
  '/images/black-forest-cake.png',
  '/images/red-velvet-cake.png',
  '/images/butterscotch-cake.png',
  '/images/strawberry-cake.png',
];
const FLOWER_IMAGES = [
  '/images/hero-flowers.png',
  '/images/birthday-bouquet.png',
  '/images/luxury-bouquet.png',
];
const COMBO_IMAGE  = '/images/combo-gift.png';
const FALLBACK     = '/images/hero-cake.png';

// Counter for round-robin cycling (variety per product)
const counters = { cake: 0, flower: 0 };

function pickImage(slug = '', name = '') {
  const t = (slug + ' ' + name).toLowerCase();
  if (t.includes('rose') || t.includes('orchid') || t.includes('flower') ||
      t.includes('bouquet') || t.includes('gerbera') || t.includes('lily') ||
      t.includes('tulip') || t.includes('carnation') || t.includes('vase') ||
      t.includes('basket') || t.includes('pink-rose') || t.includes('red-rose')) {
    return FLOWER_IMAGES[counters.flower++ % FLOWER_IMAGES.length];
  }
  if (t.includes('combo') || t.includes('hamper') || t.includes('gift-box') ||
      t.includes('date-night') || t.includes('teddy') || t.includes('date_night')) {
    return COMBO_IMAGE;
  }
  // Default: cake (with variety)
  return CAKE_IMAGES[counters.cake++ % CAKE_IMAGES.length];
}

function isWpUrl(url) {
  return typeof url === 'string' && url.includes('/wp-content/uploads/');
}

// ── Patch local TypeScript data files ────────────────────────
function patchDataFiles() {
  const dataDir = path.join(__dirname, '..', 'src', 'data');
  const files = [
    'scrapedProductsData.ts',
    'scrapedCakes.ts',
    'scrapedFlowersData.ts',
    'scrapedFlowers.ts',
  ];

  let totalReplaced = 0;

  for (const fname of files) {
    const fpath = path.join(dataDir, fname);
    if (!fs.existsSync(fpath)) continue;

    let content = fs.readFileSync(fpath, 'utf8');
    let fileCount = 0;

    // Find each product block to extract slug context for smart mapping
    // Strategy: replace WP URLs sequentially, cycling through local images
    // by scanning surrounding text for flower/combo/cake keywords
    content = content.replace(
      /("url":\s*")(https:\/\/cakeconnection\.in\/wp-content\/uploads\/[^"]+)(")/g,
      (match, prefix, wpUrl, suffix, offset) => {
        // Look back up to 500 chars for slug/name context
        const ctx = content.slice(Math.max(0, offset - 500), offset);
        const slugM = ctx.match(/"slug":\s*"([^"]+)"/);
        const nameM = ctx.match(/"name":\s*"([^"]+)"/);
        const local = pickImage(slugM?.[1] || '', nameM?.[1] || '');
        fileCount++;
        return prefix + local + suffix;
      }
    );

    totalReplaced += fileCount;

    if (!DRY_RUN) {
      fs.writeFileSync(fpath, content, 'utf8');
      console.log(`  ✅ Patched ${fileCount} URLs in ${fname}`);
    } else {
      console.log(`  [DRY] Would patch ${fileCount} URLs in ${fname}`);
    }
  }

  return totalReplaced;
}

// ── Patch Supabase DB ─────────────────────────────────────────
async function patchSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || url.includes('placeholder')) {
    console.log('⚠  Supabase not configured — skipping DB patch');
    return 0;
  }

  const sb = createClient(url, key);
  let page = 0, updated = 0;
  const PAGE = 1000;

  while (true) {
    const { data, error } = await sb
      .from('products')
      .select('id, slug, name, images')
      .range(page * PAGE, (page + 1) * PAGE - 1);

    if (error || !data?.length) break;

    for (const row of data) {
      if (!Array.isArray(row.images)) { page++; continue; }

      const hasWp = row.images.some(img => isWpUrl(img?.url));
      if (!hasWp) continue;

      const newImages = row.images.map((img, i) => ({
        ...img,
        url: isWpUrl(img?.url) ? pickImage(row.slug, row.name) : img.url,
      }));

      if (DRY_RUN) {
        console.log(`  [DRY] Would update DB row: ${row.name}`);
      } else {
        const { error: e } = await sb.from('products').update({ images: newImages }).eq('id', row.id);
        if (e) console.error(`  ❌ DB update failed for ${row.name}:`, e.message);
        else { updated++; process.stdout.write(`\r  ☁️  Updated ${updated} DB rows...`); }
      }
    }

    if (data.length < PAGE) break;
    page++;
  }

  return updated;
}

// ── main ──────────────────────────────────────────────────────
async function main() {
  console.log(`\n🍰 CakeConnection — WP Image Remapper${DRY_RUN ? ' [DRY RUN]' : ''}`);
  console.log('─'.repeat(50));

  console.log('\n📂 Patching local data files...');
  const fileCount = patchDataFiles();

  console.log('\n☁️  Patching Supabase database...');
  const dbCount = await patchSupabase();

  console.log('\n' + '─'.repeat(50));
  if (DRY_RUN) {
    console.log(`[DRY RUN] Would replace ${fileCount} URLs in data files`);
    console.log(`[DRY RUN] Would update ${dbCount} DB rows`);
  } else {
    console.log(`✅ Replaced ${fileCount} WP URLs in data files`);
    console.log(`✅ Updated  ${dbCount} rows in Supabase`);
    console.log(`\n🎉 Done! All product images now use local fallbacks.`);
    console.log(`   Next: npm run build  →  repackage  →  redeploy`);
  }
}

main().catch(console.error);
