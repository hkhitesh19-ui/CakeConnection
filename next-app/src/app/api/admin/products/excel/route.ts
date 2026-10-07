import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { isSupabaseConfigured } from '@/lib/db';
import { allProducts } from '@/data/products';
import * as XLSX from 'xlsx';

function getVariantPrice(p: any, weightTarget: string): number | string {
  const variations = p.product_variations || p.product_variants || p.variants || [];
  const targetNorm = weightTarget.toLowerCase().trim();
  const found = variations.find((v: any) => {
    const w = (v.weight || '').toLowerCase().trim();
    return w === targetNorm || w.includes(targetNorm);
  });
  return found ? (Number(found.price) || 0) : '';
}

function getVariantComparePrice(p: any, weightTarget: string): number | string {
  const variations = p.product_variations || p.product_variants || p.variants || [];
  const targetNorm = weightTarget.toLowerCase().trim();
  const found = variations.find((v: any) => {
    const w = (v.weight || '').toLowerCase().trim();
    return w === targetNorm || w.includes(targetNorm);
  });
  return found ? (Number(found.compare_at_price || found.compareAtPrice) || '') : '';
}

// ── GET: Export Live Excel (.xlsx) or JSON for Live Grid ──────────────
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format') || 'xlsx';

    let productsList: any[] = [];

    if (!isSupabaseConfigured()) {
      productsList = allProducts.map((p) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        category: p.category,
        subcategory: p.subcategory,
        images: p.images,
        flavour: p.flavour,
        is_available: p.isAvailable,
        product_variations: p.variants.map((v) => ({
          weight: v.weight,
          price: v.price,
          compare_at_price: v.compareAtPrice,
          sku: v.sku,
          stock: v.stock,
        })),
      }));
    } else {
      const { data, error } = await supabase
        .from('products')
        .select('*, product_variations:product_variants(*)')
        .order('created_at', { ascending: false });

      if (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
      }
      productsList = data || [];
    }

    // Format rows for Excel
    const rows = productsList.map((p, idx) => {
      const imgUrl = Array.isArray(p.images) && p.images.length > 0
        ? (typeof p.images[0] === 'string' ? p.images[0] : p.images[0]?.url || '')
        : '';

      const variations = p.product_variations || p.product_variants || p.variants || [];
      const varSummary = variations
        .map((v: any) => `${v.weight}: ₹${v.price}`)
        .join(' | ');

      return {
        'Index': idx + 1,
        'Product ID': p.id,
        'Product Photo URL': imgUrl,
        'Product Name': p.name || '',
        'Category': p.category || '',
        'Subcategories': p.subcategory || '',
        'Flavour': p.flavour || '',
        '250g Price (₹)': getVariantPrice(p, '250g'),
        '500g Price (₹)': getVariantPrice(p, '500g'),
        '1kg Price (₹)': getVariantPrice(p, '1kg'),
        '1.5kg Price (₹)': getVariantPrice(p, '1.5kg'),
        '2kg Price (₹)': getVariantPrice(p, '2kg'),
        'In Stock': (p.is_available ?? p.isAvailable) ? 'YES' : 'NO',
        'All Variants': varSummary,
      };
    });

    if (format === 'json') {
      return NextResponse.json({ success: true, count: rows.length, data: rows });
    }

    // Generate real .xlsx file
    const worksheet = XLSX.utils.json_to_sheet(rows);

    // Style column widths
    worksheet['!cols'] = [
      { wch: 6 },   // Index
      { wch: 38 },  // Product ID
      { wch: 45 },  // Product Photo URL
      { wch: 35 },  // Product Name
      { wch: 12 },  // Category
      { wch: 30 },  // Subcategories
      { wch: 15 },  // Flavour
      { wch: 15 },  // 500g Price
      { wch: 15 },  // 1kg Price
      { wch: 15 },  // 1.5kg Price
      { wch: 15 },  // 2kg Price
      { wch: 10 },  // In Stock
      { wch: 40 },  // All Variants
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Products_Live_Prices');

    const excelBuffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    return new NextResponse(excelBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="CakeConnection_Products_Live_${new Date().toISOString().split('T')[0]}.xlsx"`,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
  } catch (error: any) {
    console.error('Excel Export error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// ── POST: Sync/Import Updates from Excel file or Live Spreadsheet Grid ──
export async function POST(request: Request) {
  try {
    const contentType = request.headers.get('content-type') || '';
    let updates: any[] = [];

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      const file = formData.get('file') as File | null;

      if (!file) {
        return NextResponse.json({ success: false, message: 'No Excel file provided' }, { status: 400 });
      }

      const buffer = Buffer.from(await file.arrayBuffer());
      const workbook = XLSX.read(buffer, { type: 'buffer' });
      const firstSheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[firstSheetName];
      updates = XLSX.utils.sheet_to_json(sheet);
    } else {
      const body = await request.json();
      updates = body.updates || body.products || [];
    }

    if (!Array.isArray(updates) || updates.length === 0) {
      return NextResponse.json({ success: false, message: 'No valid product rows to sync' }, { status: 400 });
    }

    let updatedCount = 0;
    const errors: string[] = [];

    for (const row of updates) {
      const productId = row['Product ID'] || row.productId || row.id;
      const productName = row['Product Name'] || row.productName || row.name;

      if (!productId && !productName) continue;

      const price250g = row['250g Price (₹)'] ?? row.price250g;
      const price500g = row['500g Price (₹)'] ?? row.price500g;
      const price1kg = row['1kg Price (₹)'] ?? row.price1kg;
      const price1_5kg = row['1.5kg Price (₹)'] ?? row.price1_5kg;
      const price2kg = row['2kg Price (₹)'] ?? row.price2kg;
      const inStockRaw = row['In Stock'] ?? row.inStock;
      const isAvailable = inStockRaw === 'YES' || inStockRaw === true || inStockRaw === 1 || inStockRaw === 'true';

      if (isSupabaseConfigured()) {
        try {
          // 1. Fetch current product & existing variants
          let query = supabase.from('products').select('*, product_variants(*)');
          if (productId) {
            query = query.eq('id', productId);
          } else {
            query = query.eq('name', productName);
          }

          const { data: existing, error: findError } = await query.single();
          if (findError || !existing) {
            errors.push(`Product not found: ${productId || productName}`);
            continue;
          }

          // 2. Update basic product info if provided
          const pUpdates: any = {
            is_available: isAvailable,
            updated_at: new Date().toISOString(),
          };
          if (productName && productName !== existing.name) {
            pUpdates.name = productName;
          }
          if (row['Category'] || row.category) {
            pUpdates.category = row['Category'] || row.category;
          }
          if (row['Product Photo URL'] || row.photoUrl) {
            const photo = row['Product Photo URL'] || row.photoUrl;
            pUpdates.images = [{ url: photo, alt: productName || existing.name }];
          }

          await supabase.from('products').update(pUpdates).eq('id', existing.id);

          // 3. Update or recreate variants with the updated prices
          const existingVariants = existing.product_variants || [];
          const updatedVariants: any[] = [];

          // Standard weight mapping
          const weightPriceMap: Record<string, any> = {};
          if (price250g !== undefined && price250g !== '') weightPriceMap['250g'] = parseFloat(String(price250g));
          if (price500g !== undefined && price500g !== '') weightPriceMap['500g'] = parseFloat(String(price500g));
          if (price1kg !== undefined && price1kg !== '') weightPriceMap['1kg'] = parseFloat(String(price1kg));
          if (price1_5kg !== undefined && price1_5kg !== '') weightPriceMap['1.5kg'] = parseFloat(String(price1_5kg));
          if (price2kg !== undefined && price2kg !== '') weightPriceMap['2kg'] = parseFloat(String(price2kg));

          if (existingVariants.length > 0) {
            let has250g = false;
            for (const v of existingVariants) {
              const wNorm = (v.weight || '').toLowerCase().trim();
              let newPrice = v.price;

              if (wNorm.includes('250g')) {
                has250g = true;
                if (weightPriceMap['250g'] !== undefined) newPrice = weightPriceMap['250g'];
              } else if (wNorm.includes('500g') && weightPriceMap['500g'] !== undefined) {
                newPrice = weightPriceMap['500g'];
              } else if (wNorm === '1kg' && weightPriceMap['1kg'] !== undefined) {
                newPrice = weightPriceMap['1kg'];
              } else if (wNorm.includes('1.5kg') && weightPriceMap['1.5kg'] !== undefined) {
                newPrice = weightPriceMap['1.5kg'];
              } else if (wNorm.includes('2kg') && weightPriceMap['2kg'] !== undefined) {
                newPrice = weightPriceMap['2kg'];
              }

              updatedVariants.push({
                product_id: existing.id,
                weight: v.weight,
                price: newPrice,
                compare_at_price: v.compare_at_price,
                sku: v.sku,
                stock: v.stock ?? 100000,
              });
            }

            // If 250g price was provided but product didn't have 250g variant, add it
            if (!has250g && weightPriceMap['250g'] !== undefined && !isNaN(weightPriceMap['250g']) && weightPriceMap['250g'] > 0) {
              updatedVariants.unshift({
                product_id: existing.id,
                weight: '250g',
                price: weightPriceMap['250g'],
                compare_at_price: null,
                sku: `${existing.slug || 'cake'}-250G`,
                stock: 100000,
              });
            }
          } else {
            // If product has no variants yet, create standard set
            Object.entries(weightPriceMap).forEach(([weight, price]) => {
              if (!isNaN(price) && price > 0) {
                updatedVariants.push({
                  product_id: existing.id,
                  weight,
                  price,
                  sku: `${existing.slug || 'cake'}-${weight}`,
                  stock: 50,
                });
              }
            });
          }

          if (updatedVariants.length > 0) {
            await supabase.from('product_variants').delete().eq('product_id', existing.id);
            await supabase.from('product_variants').insert(updatedVariants);
          }

          updatedCount++;
        } catch (err: any) {
          errors.push(`Error updating ${productId}: ${err.message}`);
        }
      } else {
        // In mock mode
        const found = allProducts.find((p) => p.id === productId || p.name === productName);
        if (found) {
          if (productName) found.name = productName;
          found.isAvailable = isAvailable;
          if (price500g && found.variants[0]) found.variants[0].price = parseFloat(String(price500g));
          if (price1kg && found.variants[1]) found.variants[1].price = parseFloat(String(price1kg));
          if (price1_5kg && found.variants[2]) found.variants[2].price = parseFloat(String(price1_5kg));
          if (price2kg && found.variants[3]) found.variants[3].price = parseFloat(String(price2kg));
          updatedCount++;
        }
      }
    }

    return NextResponse.json({
      success: true,
      updatedCount,
      totalReceived: updates.length,
      errors: errors.length > 0 ? errors : undefined,
      message: `Successfully synchronized ${updatedCount} products with database!`,
    });
  } catch (error: any) {
    console.error('Excel Sync error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
