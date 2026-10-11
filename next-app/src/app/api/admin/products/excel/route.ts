import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { isSupabaseConfigured } from '@/lib/db';
import {
  getMergedProductsList,
  saveProductUpdate,
} from '@/lib/serverProductStore';
import * as XLSX from 'xlsx';

function getVariantPrice(p: any, weightTarget: string): number | string {
  const variations = p.product_variations || p.product_variants || p.variants || [];
  const targetNorm = weightTarget.toLowerCase().trim();
  const found = variations.find((v: any) => {
    const w = (v.weight || '').toLowerCase().trim();
    if (targetNorm === '1.5kg') return w === '1.5kg' || w.includes('1.5');
    if (targetNorm === '1kg') return w === '1kg' || w === '1 kg';
    return w === targetNorm || w.includes(targetNorm);
  });
  return found ? (Number(found.price) || 0) : '';
}

// ── GET: Export Live Excel (.xlsx) or JSON for Live Grid ──────────────
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format') || 'xlsx';

    let productsList: any[] = [];

    if (isSupabaseConfigured()) {
      try {
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Supabase timeout')), 2000)
        );
        const queryPromise = supabase
          .from('products')
          .select('*, product_variations:product_variants(*)')
          .order('created_at', { ascending: false });

        const { data, error }: any = await Promise.race([queryPromise, timeoutPromise]);
        if (!error && data && data.length > 0) {
          productsList = data;
        }
      } catch {
        // Fallback to merged list
      }
    }

    if (productsList.length === 0) {
      productsList = getMergedProductsList();
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

    worksheet['!cols'] = [
      { wch: 6 },   // Index
      { wch: 38 },  // Product ID
      { wch: 45 },  // Product Photo URL
      { wch: 35 },  // Product Name
      { wch: 12 },  // Category
      { wch: 30 },  // Subcategories
      { wch: 15 },  // Flavour
      { wch: 15 },  // 250g Price
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
      const photoUrl = row['Product Photo URL'] || row.photoUrl;
      const category = row['Category'] || row.category;
      const inStockRaw = row['In Stock'] ?? row.inStock ?? row.isAvailable;
      const isAvailable = inStockRaw !== undefined
        ? (inStockRaw === 'YES' || inStockRaw === true || inStockRaw === 1 || inStockRaw === 'true')
        : undefined;

      try {
        const result = await saveProductUpdate({
          productId: productId || productName,
          name: productName,
          isAvailable,
          photoUrl,
          price250g,
          price500g,
          price1kg,
          price1_5kg,
          price2kg,
          category,
        });

        if (result.success) {
          updatedCount++;
        } else {
          errors.push(`Failed to update ${productId}: ${result.error}`);
        }
      } catch (err: any) {
        errors.push(`Error updating ${productId}: ${err.message}`);
      }
    }

    if (updatedCount === 0 && errors.length > 0) {
      return NextResponse.json({
        success: false,
        updatedCount: 0,
        errors,
        message: errors.join(', '),
      }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      updatedCount,
      totalReceived: updates.length,
      errors: errors.length > 0 ? errors : undefined,
      message: `Successfully synchronized and permanently saved ${updatedCount} products!`,
    });
  } catch (error: any) {
    console.error('Excel Sync error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
