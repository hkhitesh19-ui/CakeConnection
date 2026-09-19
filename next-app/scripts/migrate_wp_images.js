#!/usr/bin/env node
// ============================================================
// scripts/migrate_wp_images.js — CakeConnection
// Downloads all WP-legacy images into public/wp-content/uploads/
// Usage:  node scripts/migrate_wp_images.js
//         node scripts/migrate_wp_images.js --dry-run
// ============================================================

// Load .env.local without requiring dotenv package
(function loadEnv() {
  const envPath = require('path').join(__dirname, '..', '.env.local');
  if (!require('fs').existsSync(envPath)) return;
  require('fs').readFileSync(envPath, 'utf8').split(/\r?\n/).forEach(line => {
    const m = line.match(/^([^#=]+)=(.*)$/);
    if (m && !process.env[m[1].trim()]) process.env[m[1].trim()] = m[2].trim();
  });
})();

const https = require('https');
const http  = require('http');
const fs    = require('fs');
const path  = require('path');
const { createClient } = require('@supabase/supabase-js');

const DRY_RUN   = process.argv.includes('--dry-run');
const WP_ORIGIN = 'https://cakeconnection.in';
const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const CONCURRENCY = 5; // parallel downloads

// ── helpers ──────────────────────────────────────────────────
// Cloudflare/WP SSL cert may not chain correctly from Node's CA store
const httpsAgent = new https.Agent({ rejectUnauthorized: false });

function download(url, destPath) {
  return new Promise((resolve, reject) => {
    fs.mkdirSync(path.dirname(destPath), { recursive: true });
    const file = fs.createWriteStream(destPath);
    const isHttps = url.startsWith('https');
    const get = isHttps ? https.get : http.get;
    const opts = { timeout: 15000, ...(isHttps ? { agent: httpsAgent } : {}) };
    get(url, opts, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        file.close();
        try { fs.unlinkSync(destPath); } catch {}
        return download(res.headers.location, destPath).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        file.close();
        try { fs.unlinkSync(destPath); } catch {}
        return reject(new Error(`HTTP ${res.statusCode}`));
      }
      res.pipe(file);
      file.on('finish', () => file.close(resolve));
    }).on('error', (e) => { try { fs.unlinkSync(destPath); } catch {} reject(e); });
  });
}

function chunkArray(arr, size) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

function extractWpUrls(images) {
  if (!Array.isArray(images)) return [];
  return images
    .map(img => (typeof img === 'string' ? img : img?.url) || '')
    .filter(u => u.includes('/wp-content/uploads/'));
}

// ── collect URLs from local scraped data files ────────────────
function collectFromScrapedData() {
  const urls = new Set();
  const dataDir = path.join(__dirname, '..', 'src', 'data');
  const files = ['scrapedProductsData.ts', 'scrapedCakes.ts', 'scrapedFlowersData.ts', 'scrapedFlowers.ts'];
  for (const f of files) {
    const fpath = path.join(dataDir, f);
    if (!fs.existsSync(fpath)) continue;
    const content = fs.readFileSync(fpath, 'utf8');
    const matches = content.matchAll(/"url":\s*"(https:\/\/cakeconnection\.in\/wp-content\/uploads\/[^"]+)"/g);
    for (const m of matches) urls.add(m[1]);
  }
  return [...urls];
}

// ── collect from Supabase DB ──────────────────────────────────
async function collectFromSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || url.includes('placeholder')) { console.log('⚠  Supabase not configured — skipping DB scan'); return []; }

  const sb = createClient(url, key);
  const urls = new Set();
  let page = 0;
  const PAGE = 1000;
  while (true) {
    const { data, error } = await sb.from('products').select('images').range(page * PAGE, (page + 1) * PAGE - 1);
    if (error || !data?.length) break;
    data.forEach(r => extractWpUrls(r.images).forEach(u => urls.add(u)));
    if (data.length < PAGE) break;
    page++;
  }
  return [...urls];
}

// ── main ──────────────────────────────────────────────────────
async function main() {
  console.log(`\n🍰 CakeConnection — WP Image Migration${DRY_RUN ? ' [DRY RUN]' : ''}\n${'─'.repeat(50)}`);

  console.log('📂 Scanning local data files...');
  const localUrls = collectFromScrapedData();
  console.log(`   Found ${localUrls.length} unique WP image URLs in data files`);

  console.log('☁️  Scanning Supabase database...');
  const dbUrls = await collectFromSupabase();
  console.log(`   Found ${dbUrls.length} unique WP image URLs in DB`);

  const allUrls = [...new Set([...localUrls, ...dbUrls])];
  console.log(`\n📊 Total unique images to process: ${allUrls.length}`);

  if (allUrls.length === 0) { console.log('\n✅ Nothing to download!'); return; }
  if (DRY_RUN) {
    console.log('\n[DRY RUN] Would download:');
    allUrls.slice(0, 20).forEach(u => console.log('  ', u));
    if (allUrls.length > 20) console.log(`  ... and ${allUrls.length - 20} more`);
    return;
  }

  let ok = 0, skip = 0, fail = 0;
  const failures = [];

  const chunks = chunkArray(allUrls, CONCURRENCY);
  for (let ci = 0; ci < chunks.length; ci++) {
    const chunk = chunks[ci];
    await Promise.all(chunk.map(async (url) => {
      const relPath = url.slice(WP_ORIGIN.length); // /wp-content/uploads/...
      const destPath = path.join(PUBLIC_DIR, ...relPath.split('/'));
      if (fs.existsSync(destPath)) { skip++; return; }
      try {
        await download(url, destPath);
        ok++;
        process.stdout.write(`\r  ✅ ${ok} downloaded | ⏭  ${skip} skipped | ❌ ${fail} failed`);
      } catch (e) {
        fail++;
        failures.push({ url, error: e.message });
      }
    }));
    // progress
    const done = Math.min((ci + 1) * CONCURRENCY, allUrls.length);
    process.stdout.write(`\r  ✅ ${ok} downloaded | ⏭  ${skip} skipped | ❌ ${fail} failed  [${done}/${allUrls.length}]`);
  }

  console.log(`\n\n${'─'.repeat(50)}`);
  console.log(`✅ Downloaded : ${ok}`);
  console.log(`⏭  Skipped   : ${skip} (already exist)`);
  console.log(`❌ Failed     : ${fail}`);

  if (failures.length) {
    console.log('\nFailed URLs:');
    failures.forEach(f => console.log(`  ${f.error} → ${f.url}`));
  }

  console.log(`\n🎉 Done! Images saved to: public/wp-content/uploads/`);
  console.log(`   Repackage: tar -czf project.tar.gz --exclude=node_modules --exclude=.next .`);
  console.log(`   Redeploy : scp project.tar.gz ec2-user@13.127.205.139:~/`);
}

main().catch(console.error);
