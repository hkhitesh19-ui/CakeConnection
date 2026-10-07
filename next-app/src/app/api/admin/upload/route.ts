import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const folder = (formData.get('folder') as string) || 'cakes';

    if (!file) {
      return NextResponse.json(
        { success: false, message: 'No image file uploaded' },
        { status: 400 }
      );
    }

    // Validate file type
    const mimeType = file.type || '';
    if (!mimeType.startsWith('image/')) {
      return NextResponse.json(
        { success: false, message: 'Only image files (JPG, PNG, WEBP, GIF) are allowed' },
        { status: 400 }
      );
    }

    // Maximum 10MB
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, message: 'Image size exceeds maximum limit of 10MB' },
        { status: 400 }
      );
    }

    // Safe sanitized filename
    const originalName = file.name || 'image.jpg';
    const ext = path.extname(originalName).toLowerCase() || '.jpg';
    const baseName = path
      .basename(originalName, ext)
      .toLowerCase()
      .replace(/[^a-z0-9_-]/g, '-')
      .replace(/-+/g, '-')
      .slice(0, 50);

    const uniqueSuffix = `${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const finalFileName = `${baseName || 'cake'}-${uniqueSuffix}${ext}`;

    // Target upload directory: public/images/<folder>
    const safeFolder = folder.replace(/[^a-z0-9_-]/gi, '') || 'cakes';
    const targetDir = path.join(process.cwd(), 'public', 'images', safeFolder);

    // Ensure directory exists
    await fs.mkdir(targetDir, { recursive: true });

    // Write file to disk
    const targetPath = path.join(targetDir, finalFileName);
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await fs.writeFile(targetPath, buffer);

    const publicUrl = `/images/${safeFolder}/${finalFileName}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      fileName: finalFileName,
      size: file.size,
      message: 'Image uploaded successfully!',
    });
  } catch (error: any) {
    console.error('Image upload error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to upload image' },
      { status: 500 }
    );
  }
}
