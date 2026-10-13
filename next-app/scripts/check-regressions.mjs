import fs from 'fs';
import path from 'path';

console.log('🔍 [Regression Guardrail] Checking codebase against Resolved_Errors.md rules...');

let errorsFound = 0;

// Rule 1: src/app/api/ me NEXT_PUBLIC_SITE_URL direct use nahi hona chahiye (Issue #5 in Resolved_Errors.md)
function checkApiEnvRules(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir, { recursive: true });
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isFile() && (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.js'))) {
      const content = fs.readFileSync(fullPath, 'utf8');
      if (content.includes('process.env.NEXT_PUBLIC_SITE_URL') && !content.includes('process.env.SITE_URL')) {
        console.error(`❌ REGRESSION VIOLATION in ${fullPath}:`);
        console.error(`   Found 'process.env.NEXT_PUBLIC_SITE_URL' without runtime 'process.env.SITE_URL'.`);
        console.error(`   👉 Refer to Resolved_Errors.md #5: Server API routes must use runtime SITE_URL to prevent localhost leaks.`);
        errorsFound++;
      }
    }
  }
}

// Rule 2: src/app/cakes/page.tsx me compareAtPrice ko direct mrp na banaya gaya ho (Issue #4 in Resolved_Errors.md)
function checkPricingRule() {
  const listingPage = path.join(process.cwd(), 'src/app/cakes/page.tsx');
  if (fs.existsSync(listingPage)) {
    const content = fs.readFileSync(listingPage, 'utf8');
    if (content.includes('const mrp = (v.compareAtPrice && v.compareAtPrice > 0) ? v.compareAtPrice : v.price;')) {
      console.error(`❌ REGRESSION VIOLATION in ${listingPage}:`);
      console.error(`   Detected compareAtPrice being used as selling price on listing card.`);
      console.error(`   👉 Refer to Resolved_Errors.md #4: Always display actual selling price (v.price).`);
      errorsFound++;
    }
  }
}

// Rule 3: Local images me ?v= cache busting query param nahi hona chahiye (Issue #2 in Resolved_Errors.md)
function checkImageQueryRules(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir, { recursive: true });
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isFile() && (file.endsWith('.tsx') || file.endsWith('.jsx'))) {
      const content = fs.readFileSync(fullPath, 'utf8');
      if (/src=["'][^"']+\.(png|jpg|webp)\?v=/i.test(content)) {
        console.error(`❌ REGRESSION VIOLATION in ${fullPath}:`);
        console.error(`   Found manual '?v=' cache busting query parameter on local image.`);
        console.error(`   👉 Refer to Resolved_Errors.md #2: Strip manual query strings on Next.js local images.`);
        errorsFound++;
      }
    }
  }
}

// Execute checks
checkApiEnvRules(path.join(process.cwd(), 'src/app/api'));
checkPricingRule();
checkImageQueryRules(path.join(process.cwd(), 'src/components'));

if (errorsFound > 0) {
  console.error(`\n🚨 Build stopped! ${errorsFound} regression violation(s) found. See Resolved_Errors.md to fix.`);
  process.exit(1);
} else {
  console.log('✅ [Regression Guardrail] All 5 Resolved_Errors.md checks passed successfully! Safe to build/deploy.\n');
}
