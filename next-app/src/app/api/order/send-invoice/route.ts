import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
// @ts-ignore - pdfkit standalone build includes inlined AFM fonts (no fs.readFileSync needed)
import PDFDocument from 'pdfkit/js/pdfkit.standalone';

export const SYSTEM_DELIVERY_INSTRUCTIONS = [
  "After order placement, sender will get pickup-time product photo on WhatsApp.",
  "Once delivery is complete, WhatsApp update will be sent immediately.",
  "Due to weather or any external reason, delivery may get delayed — update for this will also be sent on WhatsApp.",
  "This is a Surprise Delivery, so sender's name is not shared with receiver until delivery is done.",
  "Once delivery person reaches the address with the product, sender's name is shared as per company rule.",
  "Please do not call for any query — we prefer WhatsApp message with Order Number and Delivery Date (+91 72038 24012)."
];

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://cakeconnection.in';

// Helper to construct absolute image URL for email clients
function getProductImageUrl(rawImage?: string): string {
  if (!rawImage) {
    return `${BASE_URL}/images/cakes/chocolate-truffle.jpeg`;
  }
  if (rawImage.startsWith('http://') || rawImage.startsWith('https://')) {
    return rawImage;
  }
  return `${BASE_URL}${rawImage.startsWith('/') ? '' : '/'}${rawImage}`;
}

// Helper to construct direct product page URL
function getProductUrl(item: any): string {
  const cat = item.category || 'cakes';
  if (item.slug) {
    return `${BASE_URL}/${cat}/${item.slug}`;
  }
  const autoSlug = (item.name || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
  return `${BASE_URL}/${cat}/${autoSlug || ''}`;
}

// Helpers for Plain Text Order Summary (WhatsApp / Delivery Boy format)
function formatDeliveryDate(dateStr?: string): string {
  if (!dateStr) return 'Scheduled Date';
  if (/\b\d{1,2}(st|nd|rd|th)\s+[a-zA-Z]+\s+\d{4}\b/i.test(dateStr)) {
    return dateStr;
  }
  const parsed = new Date(dateStr);
  if (!isNaN(parsed.getTime())) {
    const day = parsed.getDate();
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const month = months[parsed.getMonth()];
    const year = parsed.getFullYear();

    let suffix = 'th';
    if (day % 10 === 1 && day !== 11) suffix = 'st';
    else if (day % 10 === 2 && day !== 12) suffix = 'nd';
    else if (day % 10 === 3 && day !== 13) suffix = 'rd';

    return `${day}${suffix} ${month} ${year}`;
  }
  return dateStr;
}

function formatTimeSlotSummary(slot?: string): string {
  if (!slot) return 'Standard Delivery';
  let clean = slot.replace(/\(?\s*no fix time\s*\)?/gi, '').trim();

  // Match e.g. "03:00 PM - 06:00 PM" -> "3pm to 6pm"
  const m = clean.match(/^0?(\d{1,2})(?::00)?\s*(am|pm)\s*[-–—to]+\s*0?(\d{1,2})(?::00)?\s*(am|pm)$/i);
  if (m) {
    return `${m[1]}${m[2].toLowerCase()} to ${m[3]}${m[4].toLowerCase()}`;
  }
  clean = clean.replace(/\s*-\s*/g, ' to ');
  return clean;
}

function formatPhoneDisplay(rawPhone?: string): string {
  if (!rawPhone) return 'N/A';
  let clean = rawPhone.trim();
  if (clean.startsWith('+')) return clean;
  const digits = clean.replace(/[^0-9]/g, '');
  if (digits.length === 10) {
    return `+91 ${digits}`;
  }
  if (digits.length === 12 && digits.startsWith('91')) {
    return `+91 ${digits.slice(2)}`;
  }
  return clean;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function buildOrderPlainSummary(orderDetails: any): string {
  const deliveryDateFormatted = formatDeliveryDate(orderDetails.deliveryDate);
  const timeSlotFormatted = formatTimeSlotSummary(orderDetails.deliverySlot);

  const products = orderDetails.products || [];
  const productTextBlocks: string[] = [];

  products.forEach((item: any, idx: number) => {
    const isCake = item.category === 'cakes' || /cake/i.test(item.name || '');
    let itemLine = `(${idx + 1}) `;

    if (isCake) {
      const weight = item.variantName && !/default|standard/i.test(item.variantName)
        ? `${item.variantName.trim()} `
        : '';
      const eggless = /eggless/i.test(item.name || '') ? '' : ' (Eggless)';
      itemLine += `${weight}${item.name || 'Cake'}${eggless}`;
      if (item.quantity > 1) {
        itemLine += ` -${item.quantity} Quantity`;
      }
      if (item.customMessage && item.customMessage.trim()) {
        itemLine += `\n\nName On Cake : \n${item.customMessage.trim()}`;
      }
    } else {
      const qtySuffix = item.quantity > 1 ? ` -${item.quantity} Quantity` : '';
      itemLine += `${item.name || 'Item'}${qtySuffix}`;
    }

    productTextBlocks.push(itemLine);
  });

  const receiverName = orderDetails.receiver?.name || orderDetails.customer?.name || 'Customer';
  const receiverPhone = formatPhoneDisplay(orderDetails.receiver?.phone || orderDetails.customer?.phone);

  const addr1 = (orderDetails.receiver?.addressLine1 || orderDetails.customer?.address || 'Vadodara').trim();
  const addr2 = (orderDetails.receiver?.addressLine2 || '').trim();
  const area = (orderDetails.receiver?.deliveryArea || '').trim();
  const pincode = (orderDetails.receiver?.pincode || '390007').trim();

  const addressLines: string[] = [];
  if (addr1) {
    const parts = addr1.split(/[\r\n]+/).map((s: string) => s.trim()).filter(Boolean);
    parts.forEach((p: string) => {
      addressLines.push(p.endsWith(',') ? `${p} ` : `${p}, `);
    });
  }
  if (addr2) {
    const parts = addr2.split(/[\r\n]+/).map((s: string) => s.trim()).filter(Boolean);
    parts.forEach((p: string) => {
      addressLines.push(p);
    });
  }
  if (area) {
    const cleanArea = area.replace(/,\s*vadodara.*/i, '').trim();
    addressLines.push(cleanArea.endsWith(',') ? `${cleanArea} ` : `${cleanArea}, `);
  }
  addressLines.push(`Vadodara - ${pincode}`);

  const senderName = orderDetails.sender?.name || orderDetails.customer?.name || 'Customer';
  const senderPhone = formatPhoneDisplay(orderDetails.sender?.phone || orderDetails.sender?.whatsapp || orderDetails.customer?.phone);

  return [
    `Delivery : ${deliveryDateFormatted} `,
    `Time SLOT : ${timeSlotFormatted} `,
    ``,
    productTextBlocks.join('\n\n'),
    ``,
    `Delivery Address: `,
    `${receiverName} `,
    `M : ${receiverPhone} `,
    ``,
    ``,
    `Delivery Address: `,
    addressLines.join('\n'),
    ``,
    `Sender : `,
    `${senderName} `,
    `M : ${senderPhone} `
  ].join('\n');
}

// Helper to generate Normal PDF Invoice in memory and return a Buffer (STRICTLY NO TAX / NO GST)
function generatePDFBuffer(orderDetails: any): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 40, size: 'A4' });
      const buffers: Buffer[] = [];

      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => resolve(Buffer.concat(buffers)));
      doc.on('error', reject);

      // --- Header Branding ---
      doc
        .fillColor('#be123c')
        .fontSize(22)
        .font('Helvetica-Bold')
        .text('Cake Connection', 40, 40);

      doc
        .fillColor('#4b5563')
        .fontSize(9)
        .font('Helvetica')
        .text('Handcrafted Cakes, Flower Bouquets & Surprises', 40, 68)
        .text('Vadodara, Gujarat | Support WhatsApp: +91 72038 24012', 40, 80)
        .text('Official Orders: Order.CakeConnection@gmail.com', 40, 92);

      // Divider
      doc.strokeColor('#e5e7eb').lineWidth(1).moveTo(40, 108).lineTo(555, 108).stroke();

      // --- Invoice Meta (NORMAL INVOICE - NO TAX / NO GST) ---
      const metaTop = 120;
      doc.fillColor('#111827').fontSize(14).font('Helvetica-Bold').text('INVOICE', 40, metaTop);
      doc.fontSize(9).font('Helvetica').fillColor('#374151');
      doc.text(`Order / Invoice #: ${orderDetails.id || 'N/A'}`, 40, metaTop + 18);
      doc.text(`Date: ${new Date().toLocaleDateString('en-IN')}`, 40, metaTop + 30);
      doc.text(
        `Payment Mode: ${(orderDetails.paymentMethod || 'Online').toUpperCase()} (${orderDetails.paymentStatus || 'Confirmed'})`,
        40,
        metaTop + 42
      );

      // Right Column: Delivery Schedule
      doc.fillColor('#be123c').font('Helvetica-Bold').fontSize(10).text('DELIVERY SCHEDULE', 320, metaTop);
      doc.font('Helvetica').fontSize(9).fillColor('#374151');
      doc.text(`Scheduled Date: ${orderDetails.deliveryDate || 'Standard Delivery'}`, 320, metaTop + 18);
      doc.text(`Time Slot: ${orderDetails.deliverySlot || 'Standard (No Fix Time)'}`, 320, metaTop + 30);

      // --- Address Section ---
      const addressTop = 180;
      doc.strokeColor('#e5e7eb').lineWidth(1).moveTo(40, addressTop - 8).lineTo(555, addressTop - 8).stroke();

      // Bill To (Sender)
      doc.fillColor('#111827').fontSize(10).font('Helvetica-Bold').text('BILL TO (SENDER):', 40, addressTop);
      doc.font('Helvetica').fontSize(9).fillColor('#4b5563');
      doc.text(`Name: ${orderDetails.sender?.name || orderDetails.customer?.name || 'Customer'}`, 40, addressTop + 14);
      doc.text(`WhatsApp: ${orderDetails.sender?.whatsapp || orderDetails.customer?.phone || 'N/A'}`, 40, addressTop + 26);
      if (orderDetails.sender?.phone) {
        doc.text(`Calling Phone: ${orderDetails.sender.phone}`, 40, addressTop + 38);
      }
      doc.text(`Email: ${orderDetails.customer?.email || 'N/A'}`, 40, addressTop + (orderDetails.sender?.phone ? 50 : 38));

      // Ship To (Recipient)
      doc.fillColor('#111827').fontSize(10).font('Helvetica-Bold').text('DELIVER TO (RECIPIENT):', 320, addressTop);
      doc.font('Helvetica').fontSize(9).fillColor('#4b5563');
      doc.text(`Name: ${orderDetails.receiver?.name || orderDetails.customer?.name || 'Recipient'}`, 320, addressTop + 14);
      doc.text(`Calling Phone: ${orderDetails.receiver?.phone || orderDetails.customer?.phone || 'N/A'}`, 320, addressTop + 26);
      const deliveryAddress = orderDetails.receiver?.addressLine1 || orderDetails.customer?.address || 'Vadodara, Gujarat';
      doc.text(`Address: ${deliveryAddress}`, 320, addressTop + 38, { width: 230 });
      if (orderDetails.receiver?.deliveryArea) {
        doc.text(`Area: ${orderDetails.receiver.deliveryArea}, Vadodara - ${orderDetails.receiver.pincode || ''}`, 320, addressTop + 50, { width: 230 });
      }

      // --- Products Table ---
      const tableTop = 250;
      doc.rect(40, tableTop, 515, 20).fill('#f3f4f6');
      doc.fillColor('#111827').font('Helvetica-Bold').fontSize(9);
      doc.text('Item Description', 48, tableTop + 5);
      doc.text('Weight / Variant', 260, tableTop + 5);
      doc.text('Qty', 390, tableTop + 5);
      doc.text('Price (Rs.)', 440, tableTop + 5);
      doc.text('Total (Rs.)', 500, tableTop + 5);

      let yPos = tableTop + 24;
      const products = orderDetails.products || [];
      products.forEach((item: any) => {
        const itemTotal = (item.price || 0) * (item.quantity || 1);
        doc.fillColor('#1f2937').font('Helvetica').fontSize(9);
        doc.text(item.name || 'Product', 48, yPos, { width: 205 });
        doc.text(item.variantName || '-', 260, yPos, { width: 120 });
        doc.text(String(item.quantity || 1), 390, yPos);
        doc.text(`Rs. ${item.price || 0}`, 440, yPos);
        doc.text(`Rs. ${itemTotal}`, 500, yPos);

        yPos += 16;
        if (item.customMessage) {
          doc.fillColor('#be123c').font('Helvetica-Oblique').fontSize(8);
          doc.text(`Message on Cake: "${item.customMessage}"`, 55, yPos, { width: 200 });
          yPos += 14;
        }
      });

      doc.strokeColor('#e5e7eb').lineWidth(1).moveTo(40, yPos + 4).lineTo(555, yPos + 4).stroke();
      yPos += 12;

      // Totals
      doc.font('Helvetica').fontSize(9).fillColor('#4b5563');
      doc.text('Subtotal:', 400, yPos);
      doc.text(`Rs. ${orderDetails.subtotal || orderDetails.totalAmount || 0}`, 490, yPos);
      yPos += 14;

      if (orderDetails.deliveryCharge !== undefined) {
        doc.text('Delivery Fee:', 400, yPos);
        doc.text(orderDetails.deliveryCharge > 0 ? `Rs. ${orderDetails.deliveryCharge}` : 'FREE', 490, yPos);
        yPos += 14;
      }

      doc.strokeColor('#e5e7eb').lineWidth(1).moveTo(400, yPos).lineTo(555, yPos).stroke();
      yPos += 6;

      doc.font('Helvetica-Bold').fontSize(11).fillColor('#be123c');
      doc.text('Grand Total:', 400, yPos);
      doc.text(`Rs. ${orderDetails.totalAmount || 0}`, 490, yPos);
      yPos += 26;

      // Instructions Box
      doc.rect(40, yPos, 515, 118).fillAndStroke('#fff1f2', '#fda4af');
      doc.fillColor('#9f1239').font('Helvetica-Bold').fontSize(9.5);
      doc.text('IMPORTANT DELIVERY & SURPRISE POLICY INSTRUCTIONS:', 48, yPos + 8);

      doc.fillColor('#374151').font('Helvetica').fontSize(8).lineGap(3);
      let instY = yPos + 22;
      SYSTEM_DELIVERY_INSTRUCTIONS.forEach((inst, idx) => {
        doc.text(`${idx + 1}. ${inst}`, 48, instY, { width: 495 });
        instY += 14;
      });

      // Footer
      doc.fontSize(8).font('Helvetica-Oblique').fillColor('#9ca3af');
      doc.text('Thank you for choosing Cake Connection! We craft every celebration with fresh love.', 40, 770, { align: 'center', width: 515 });

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}

// Generate HTML Email Body for Customer (Matches Admin Email format and colors, 100% Mobile Responsive)
function generateCustomerEmailHTML(orderDetails: any) {
  const products = orderDetails.products || [];
  const senderWhatsAppClean = (orderDetails.sender?.whatsapp || orderDetails.customer?.phone || '').replace(/[^0-9]/g, '');
  const senderPhoneClean = (orderDetails.sender?.phone || orderDetails.customer?.phone || '').replace(/[^0-9]/g, '');
  const receiverPhoneClean = (orderDetails.receiver?.phone || orderDetails.customer?.phone || '').replace(/[^0-9]/g, '');

  const productsHtml = products.map((item: any) => {
    const itemTotal = (item.price || 0) * (item.quantity || 1);
    const imgUrl = getProductImageUrl(item.image);
    const itemUrl = getProductUrl(item);

    return `
      <tr style="border-bottom: 1px solid #e5e7eb;">
        <td style="padding: 10px 8px; vertical-align: top;">
          <table style="border-collapse: collapse; border: none; margin: 0; padding: 0; width: 100%;">
            <tr>
              <td style="width: 50px; vertical-align: top; padding: 0 10px 0 0;">
                <a href="${itemUrl}" target="_blank" style="text-decoration: none; display: block;">
                  <img src="${imgUrl}" alt="${escapeHtml(item.name || 'Product')}" width="46" height="46" style="width: 46px; height: 46px; object-fit: cover; border-radius: 8px; border: 1px solid #e5e7eb; display: block;" />
                </a>
              </td>
              <td style="vertical-align: top; padding: 0;">
                <a href="${itemUrl}" target="_blank" style="color: #111827; text-decoration: none; font-weight: 700; font-size: 13.5px; line-height: 1.3; display: block;">
                  ${escapeHtml(item.name || 'Product')}
                </a>
                ${item.variantName ? `<div style="font-size: 12px; color: #4b5563; margin-top: 2px;">Variant: <strong style="color: #1f2937;">${escapeHtml(item.variantName)}</strong></div>` : ''}
                <div style="margin-top: 3px;">
                  <a href="${itemUrl}" target="_blank" style="color: #be123c; text-decoration: underline; font-weight: 600; font-size: 11.5px; display: inline-block;">
                    View Product →
                  </a>
                </div>
                ${item.customMessage ? `<div style="margin-top: 5px; color: #be123c; font-size: 11.5px; font-style: italic; background: #fff1f2; padding: 3px 6px; border-radius: 4px; display: inline-block; border: 1px solid #fda4af; line-height: 1.3;">🎂 Message on Cake: "${escapeHtml(item.customMessage)}"</div>` : ''}
              </td>
            </tr>
          </table>
        </td>
        <td style="padding: 10px 6px; text-align: center; color: #111827; font-weight: 700; font-size: 13.5px; vertical-align: top; white-space: nowrap;">
          ${item.quantity || 1}
        </td>
        <td style="padding: 10px 8px; text-align: right; vertical-align: top; white-space: nowrap;">
          <div style="color: #111827; font-weight: 700; font-size: 13.5px;">₹${itemTotal}</div>
          ${(item.quantity > 1) ? `<div style="font-size: 11px; color: #6b7280; margin-top: 2px;">(₹${item.price} each)</div>` : ''}
        </td>
      </tr>
    `;
  }).join('');

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Order #${orderDetails.id || ''} Confirmed - Cake Connection</title>
  <style type="text/css">
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; outline: none; text-decoration: none; }
    body { margin: 0 !important; padding: 0 !important; width: 100% !important; background-color: #f3f4f6; }
    * { box-sizing: border-box; }

    @media only screen and (max-width: 600px) {
      .email-wrapper {
        width: 100% !important;
        max-width: 100% !important;
        margin: 0 !important;
        border-radius: 0 !important;
        border-left: none !important;
        border-right: none !important;
      }
      .email-content {
        padding: 14px 10px !important;
      }
      .header-padding {
        padding: 14px 12px !important;
      }
      .stack-col {
        display: block !important;
        width: 100% !important;
        max-width: 100% !important;
        padding: 0 !important;
        box-sizing: border-box !important;
        margin-bottom: 10px !important;
      }
      .order-title {
        font-size: 18px !important;
      }
      .total-title {
        font-size: 20px !important;
      }
      .wa-button {
        width: 100% !important;
        box-sizing: border-box !important;
        padding: 12px 14px !important;
        font-size: 13.5px !important;
      }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f3f4f6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <div style="background-color: #f3f4f6; padding: 12px 0;">
    <div class="email-wrapper" style="max-width: 620px; margin: 0 auto; background-color: #ffffff; border: 2px solid #be123c; border-radius: 14px; overflow: hidden; color: #1f2937; box-shadow: 0 4px 20px rgba(0,0,0,0.06);">
      
      <!-- Header -->
      <div class="header-padding" style="background-color: #111827; color: #ffffff; padding: 16px 20px; border-bottom: 4px solid #be123c;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="vertical-align: middle;">
              <span style="background-color: #be123c; color: #ffffff; font-size: 10.5px; font-weight: 800; padding: 3px 8px; border-radius: 4px; text-transform: uppercase; letter-spacing: 0.5px; display: inline-block;">ORDER CONFIRMED</span>
              <h1 class="order-title" style="margin: 6px 0 0; font-size: 20px; font-weight: 800; color: #ffffff; line-height: 1.2;">Order <span style="white-space: nowrap;">#${orderDetails.id || 'N/A'}</span></h1>
            </td>
            <td style="text-align: right; vertical-align: middle;">
              <div class="total-title" style="font-size: 22px; font-weight: 800; color: #fb7185; line-height: 1.2;">₹${orderDetails.totalAmount || 0}</div>
              <div style="font-size: 11px; color: #cbd5e1; text-transform: uppercase; margin-top: 3px; line-height: 1.3;">
                ${orderDetails.paymentMethod || 'Online'} • <span style="color: #4ade80; font-weight: bold;">${orderDetails.paymentStatus || 'Confirmed'}</span>
              </div>
            </td>
          </tr>
        </table>
      </div>

      <div class="email-content" style="padding: 18px 16px;">
        <!-- Scheduled Delivery Slot Highlight -->
        <div style="background-color: #fef2f2; border: 1.5px solid #fca5a5; border-radius: 10px; padding: 12px 14px; margin-bottom: 16px;">
          <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
            <tr>
              <td style="padding: 3px 0; color: #991b1b; font-weight: 600;">
                📅 <strong>Delivery Date:</strong> <span style="color: #be123c; font-weight: 700; font-size: 13.5px; margin-left: 4px;">${orderDetails.deliveryDate || 'Standard Date'}</span>
              </td>
            </tr>
            <tr>
              <td style="padding: 5px 0 2px; color: #991b1b; font-weight: 600; border-top: 1px dashed #fecaca;">
                ⏰ <strong>Time Slot:</strong> <span style="color: #be123c; font-weight: 700; font-size: 13.5px; margin-left: 4px;">${orderDetails.deliverySlot || 'Standard Delivery (No Fix Time)'}</span>
              </td>
            </tr>
          </table>
        </div>

        <!-- Recipient & Sender Cards (Side by side on desktop, stacked on mobile) -->
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 16px;">
          <tr>
            <td class="stack-col" style="width: 50%; vertical-align: top; padding: 0 5px 0 0;">
              <div style="background-color: #f9fafb; border: 1.5px solid #e5e7eb; border-radius: 10px; padding: 12px;">
                <h4 style="margin: 0 0 6px; font-size: 11px; font-weight: 800; text-transform: uppercase; color: #be123c; letter-spacing: 0.5px;">📍 RECIPIENT / DELIVERY</h4>
                <p style="margin: 0 0 4px; font-size: 14px; font-weight: bold; color: #111827;">${orderDetails.receiver?.name || orderDetails.customer?.name || 'Recipient'}</p>
                <p style="margin: 0 0 4px; font-size: 12.5px; color: #374151;">
                  <strong>Calling Phone:</strong> <a href="tel:${receiverPhoneClean}" style="color: #111827; font-weight: bold; text-decoration: none;">${orderDetails.receiver?.phone || orderDetails.customer?.phone || 'N/A'}</a>
                </p>
                <p style="margin: 0 0 4px; font-size: 12.5px; color: #374151; line-height: 1.4;">
                  <strong>Address:</strong> ${orderDetails.receiver?.addressLine1 || orderDetails.customer?.address || 'Vadodara'}${orderDetails.receiver?.addressLine2 ? ', ' + orderDetails.receiver.addressLine2 : ''}
                </p>
                <p style="margin: 0; font-size: 12.5px; color: #374151;">
                  <strong>Area & Pin:</strong> ${orderDetails.receiver?.deliveryArea || 'Vadodara'}, Vadodara ${orderDetails.receiver?.pincode ? '- ' + orderDetails.receiver.pincode : ''}
                </p>
              </div>
            </td>
            <td class="stack-col" style="width: 50%; vertical-align: top; padding: 0 0 0 5px;">
              <div style="background-color: #f9fafb; border: 1.5px solid #e5e7eb; border-radius: 10px; padding: 12px;">
                <h4 style="margin: 0 0 6px; font-size: 11px; font-weight: 800; text-transform: uppercase; color: #be123c; letter-spacing: 0.5px;">👤 SENDER / BUYER</h4>
                <p style="margin: 0 0 4px; font-size: 14px; font-weight: bold; color: #111827;">${orderDetails.sender?.name || orderDetails.customer?.name || 'Customer'}</p>
                <p style="margin: 0 0 4px; font-size: 12.5px; color: #374151;">
                  <strong>WhatsApp:</strong> <a href="https://wa.me/${senderWhatsAppClean}" style="color: #059669; font-weight: bold; text-decoration: underline;">${orderDetails.sender?.whatsapp || orderDetails.customer?.phone || 'N/A'}</a>
                </p>
                ${orderDetails.sender?.phone ? `<p style="margin: 0 0 4px; font-size: 12.5px; color: #374151;"><strong>Calling Phone:</strong> <a href="tel:${senderPhoneClean}" style="color: #374151; text-decoration: none;">${orderDetails.sender.phone}</a></p>` : ''}
                <p style="margin: 0; font-size: 12.5px; color: #374151; word-break: break-all;"><strong>Email:</strong> ${orderDetails.customer?.email || 'N/A'}</p>
              </div>
            </td>
          </tr>
        </table>

        <!-- Items Ordered Table (Responsive 3 Columns) -->
        <h4 style="margin: 0 0 8px; font-size: 13.5px; font-weight: 800; color: #111827;">🎂 Items Ordered</h4>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 16px; font-size: 13px;">
          <thead>
            <tr style="background-color: #111827; color: #ffffff;">
              <th style="padding: 9px 8px; text-align: left;">Product Details</th>
              <th style="padding: 9px 6px; text-align: center; width: 45px;">Qty</th>
              <th style="padding: 9px 8px; text-align: right; width: 75px;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${productsHtml}
          </tbody>
          <tfoot>
            <tr style="border-top: 1px solid #e5e7eb; background-color: #f9fafb;">
              <td colspan="2" style="padding: 8px 10px; text-align: right; font-weight: 600; color: #4b5563;">Subtotal:</td>
              <td style="padding: 8px 10px; text-align: right; font-weight: 600; color: #111827; white-space: nowrap;">₹${orderDetails.subtotal || orderDetails.totalAmount || 0}</td>
            </tr>
            <tr style="background-color: #f9fafb;">
              <td colspan="2" style="padding: 6px 10px; text-align: right; font-weight: 600; color: #4b5563;">Delivery Fee:</td>
              <td style="padding: 6px 10px; text-align: right; font-weight: 600; color: #059669; white-space: nowrap;">${orderDetails.deliveryCharge > 0 ? `₹${orderDetails.deliveryCharge}` : 'FREE'}</td>
            </tr>
            <tr style="border-top: 2px solid #111827; background-color: #f9fafb;">
              <td colspan="2" style="padding: 9px 10px; text-align: right; font-weight: 800; font-size: 14.5px; color: #111827;">Grand Total:</td>
              <td style="padding: 9px 10px; text-align: right; font-weight: 800; font-size: 16px; color: #be123c; white-space: nowrap;">₹${orderDetails.totalAmount || 0}</td>
            </tr>
          </tfoot>
        </table>

        <!-- IMPORTANT DELIVERY & SURPRISE POLICY INSTRUCTIONS -->
        <div style="background-color: #fff1f2; border: 1.5px solid #fda4af; border-radius: 10px; padding: 14px; margin: 18px 0;">
          <h3 style="margin: 0 0 8px; color: #9f1239; font-size: 13px; font-weight: 700;">
            📌 Important Delivery & Surprise Policy Instructions
          </h3>
          <ol style="margin: 0; padding-left: 18px; color: #374151; font-size: 12px; line-height: 1.55;">
            <li style="margin-bottom: 5px;"><strong>Pickup Photo on WhatsApp:</strong> After order placement, sender will get pickup-time product photo on WhatsApp.</li>
            <li style="margin-bottom: 5px;"><strong>Instant Delivery Update:</strong> Once delivery is complete, WhatsApp update will be sent immediately.</li>
            <li style="margin-bottom: 5px;"><strong>Delay Updates:</strong> Due to weather or any external reason, delivery may get delayed — update for this will also be sent on WhatsApp.</li>
            <li style="margin-bottom: 5px;"><strong>Surprise Delivery Policy:</strong> This is a Surprise Delivery, so sender's name is not shared with receiver until delivery is done.</li>
            <li style="margin-bottom: 5px;"><strong>Doorstep Rule:</strong> Once delivery person reaches the address with the product, sender's name is shared as per company rule.</li>
            <li><strong>WhatsApp Support Preferred:</strong> Please do not call for any query — we prefer WhatsApp message with Order Number and Delivery Date (+91 72038 24012).</li>
          </ol>
        </div>

        <!-- WhatsApp Support Button -->
        <div style="text-align: center; margin: 20px 0 10px;">
          <a class="wa-button" href="https://wa.me/917203824012?text=Hello%20Cake%20Connection,%20I%20have%20placed%20Order%20%23${orderDetails.id || ''}%20for%20delivery%20on%20${encodeURIComponent(orderDetails.deliveryDate || '')}"
             style="display: inline-block; background-color: #25D366; color: #ffffff; font-weight: 700; font-size: 13.5px; text-decoration: none; padding: 12px 24px; border-radius: 9999px; box-shadow: 0 4px 10px rgba(37,211,102,0.3);">
            💬 Connect on WhatsApp (+91 72038 24012)
          </a>
          <p style="margin: 8px 0 0; font-size: 11.5px; color: #6b7280;">Detailed Normal PDF Invoice is attached to this email.</p>
        </div>
      </div>

      <!-- Footer -->
      <div style="background-color: #111827; color: #9ca3af; padding: 14px 16px; text-align: center; font-size: 11.5px;">
        Cake Connection • Handcrafted Cakes & Flowers • Vadodara, Gujarat<br/>
        Official Support WhatsApp: +91 72038 24012 • Order.CakeConnection@gmail.com
      </div>
    </div>
  </div>
</body>
</html>
  `;
}

// Generate HTML Email Body for Admin Notification (Order.CakeConnection@gmail.com, 100% Mobile Responsive)
function generateAdminEmailHTML(orderDetails: any) {
  const products = orderDetails.products || [];
  const senderWhatsAppClean = (orderDetails.sender?.whatsapp || orderDetails.customer?.phone || '').replace(/[^0-9]/g, '');
  const senderPhoneClean = (orderDetails.sender?.phone || orderDetails.customer?.phone || '').replace(/[^0-9]/g, '');
  const receiverPhoneClean = (orderDetails.receiver?.phone || orderDetails.customer?.phone || '').replace(/[^0-9]/g, '');
  const plainSummaryText = buildOrderPlainSummary(orderDetails);

  const adminProductsHtml = products.map((item: any) => {
    const itemTotal = (item.price || 0) * (item.quantity || 1);
    const imgUrl = getProductImageUrl(item.image);
    const itemUrl = getProductUrl(item);

    return `
      <tr style="border-bottom: 1px solid #e5e7eb;">
        <td style="padding: 10px 8px; vertical-align: top;">
          <table style="border-collapse: collapse; border: none; margin: 0; padding: 0; width: 100%;">
            <tr>
              <td style="width: 50px; vertical-align: top; padding: 0 10px 0 0;">
                <a href="${itemUrl}" target="_blank" style="text-decoration: none; display: block;">
                  <img src="${imgUrl}" alt="${escapeHtml(item.name || 'Product')}" width="46" height="46" style="width: 46px; height: 46px; object-fit: cover; border-radius: 8px; border: 1px solid #e5e7eb; display: block;" />
                </a>
              </td>
              <td style="vertical-align: top; padding: 0;">
                <a href="${itemUrl}" target="_blank" style="color: #111827; text-decoration: none; font-weight: 700; font-size: 13.5px; line-height: 1.3; display: block;">
                  ${escapeHtml(item.name || 'Product')}
                </a>
                ${item.variantName ? `<div style="font-size: 12px; color: #4b5563; margin-top: 2px;">Variant: <strong style="color: #1f2937;">${escapeHtml(item.variantName)}</strong></div>` : ''}
                <div style="margin-top: 3px;">
                  <a href="${itemUrl}" target="_blank" style="color: #be123c; text-decoration: underline; font-weight: 600; font-size: 11.5px; display: inline-block;">
                    View Product →
                  </a>
                </div>
                ${item.customMessage ? `<div style="margin-top: 5px; color: #be123c; font-size: 11.5px; font-style: italic; background: #fff1f2; padding: 3px 6px; border-radius: 4px; display: inline-block; border: 1px solid #fda4af; line-height: 1.3;">🎂 Message on Cake: "${escapeHtml(item.customMessage)}"</div>` : ''}
              </td>
            </tr>
          </table>
        </td>
        <td style="padding: 10px 6px; text-align: center; color: #111827; font-weight: 700; font-size: 13.5px; vertical-align: top; white-space: nowrap;">
          ${item.quantity || 1}
        </td>
        <td style="padding: 10px 8px; text-align: right; vertical-align: top; white-space: nowrap;">
          <div style="color: #111827; font-weight: 700; font-size: 13.5px;">₹${itemTotal}</div>
          ${(item.quantity > 1) ? `<div style="font-size: 11px; color: #6b7280; margin-top: 2px;">(₹${item.price} each)</div>` : ''}
        </td>
      </tr>
    `;
  }).join('');

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>New Order #${orderDetails.id || ''} - Cake Connection</title>
  <style type="text/css">
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; outline: none; text-decoration: none; }
    body { margin: 0 !important; padding: 0 !important; width: 100% !important; background-color: #f3f4f6; }
    * { box-sizing: border-box; }

    @media only screen and (max-width: 600px) {
      .email-wrapper {
        width: 100% !important;
        max-width: 100% !important;
        margin: 0 !important;
        border-radius: 0 !important;
        border-left: none !important;
        border-right: none !important;
      }
      .email-content {
        padding: 14px 10px !important;
      }
      .header-padding {
        padding: 14px 12px !important;
      }
      .stack-col {
        display: block !important;
        width: 100% !important;
        max-width: 100% !important;
        padding: 0 !important;
        box-sizing: border-box !important;
        margin-bottom: 10px !important;
      }
      .order-title {
        font-size: 18px !important;
      }
      .total-title {
        font-size: 20px !important;
      }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f3f4f6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <div style="background-color: #f3f4f6; padding: 12px 0;">
    <div class="email-wrapper" style="max-width: 620px; margin: 0 auto; background-color: #ffffff; border: 2px solid #be123c; border-radius: 14px; overflow: hidden; color: #1f2937; box-shadow: 0 4px 20px rgba(0,0,0,0.06);">
      
      <!-- Admin Alert Header -->
      <div class="header-padding" style="background-color: #111827; color: #ffffff; padding: 16px 20px; border-bottom: 4px solid #be123c;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="vertical-align: middle;">
              <span style="background-color: #be123c; color: white; font-size: 10.5px; font-weight: 800; padding: 3px 8px; border-radius: 4px; text-transform: uppercase; letter-spacing: 0.5px; display: inline-block;">NEW ORDER RECEIVED</span>
              <h1 class="order-title" style="margin: 6px 0 0; font-size: 20px; font-weight: 800; color: #ffffff; line-height: 1.2;">Order <span style="white-space: nowrap;">#${orderDetails.id || 'N/A'}</span></h1>
            </td>
            <td style="text-align: right; vertical-align: middle;">
              <div class="total-title" style="font-size: 22px; font-weight: 800; color: #fb7185; line-height: 1.2;">₹${orderDetails.totalAmount || 0}</div>
              <div style="font-size: 11px; color: #cbd5e1; text-transform: uppercase; margin-top: 3px; line-height: 1.3;">
                ${orderDetails.paymentMethod || 'Online'} • <span style="color: #4ade80; font-weight: bold;">${orderDetails.paymentStatus || 'Confirmed'}</span>
              </div>
            </td>
          </tr>
        </table>
      </div>

      <div class="email-content" style="padding: 18px 16px;">
        <!-- Scheduled Delivery Slot Highlight -->
        <div style="background-color: #fef2f2; border: 1.5px solid #fca5a5; border-radius: 10px; padding: 12px 14px; margin-bottom: 16px;">
          <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
            <tr>
              <td style="padding: 3px 0; color: #991b1b; font-weight: 600;">
                📅 <strong>Delivery Date:</strong> <span style="color: #be123c; font-weight: 700; font-size: 13.5px; margin-left: 4px;">${orderDetails.deliveryDate || 'Standard Date'}</span>
              </td>
            </tr>
            <tr>
              <td style="padding: 5px 0 2px; color: #991b1b; font-weight: 600; border-top: 1px dashed #fecaca;">
                ⏰ <strong>Time Slot:</strong> <span style="color: #be123c; font-weight: 700; font-size: 13.5px; margin-left: 4px;">${orderDetails.deliverySlot || 'Standard Delivery (No Fix Time)'}</span>
              </td>
            </tr>
          </table>
        </div>

        <!-- Recipient & Sender Cards (Side by side on desktop, stacked on mobile) -->
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 16px;">
          <tr>
            <td class="stack-col" style="width: 50%; vertical-align: top; padding: 0 5px 0 0;">
              <div style="background-color: #f9fafb; border: 1.5px solid #e5e7eb; border-radius: 10px; padding: 12px;">
                <h4 style="margin: 0 0 6px; font-size: 11px; font-weight: 800; text-transform: uppercase; color: #be123c; letter-spacing: 0.5px;">📍 RECIPIENT / DELIVERY</h4>
                <p style="margin: 0 0 4px; font-size: 14px; font-weight: bold; color: #111827;">${orderDetails.receiver?.name || orderDetails.customer?.name || 'Recipient'}</p>
                <p style="margin: 0 0 4px; font-size: 12.5px; color: #374151;">
                  <strong>Calling Phone:</strong> <a href="tel:${receiverPhoneClean}" style="color: #111827; font-weight: bold; text-decoration: none;">${orderDetails.receiver?.phone || orderDetails.customer?.phone || 'N/A'}</a>
                </p>
                <p style="margin: 0 0 4px; font-size: 12.5px; color: #374151; line-height: 1.4;">
                  <strong>Address:</strong> ${orderDetails.receiver?.addressLine1 || orderDetails.customer?.address || 'Vadodara'}${orderDetails.receiver?.addressLine2 ? ', ' + orderDetails.receiver.addressLine2 : ''}
                </p>
                <p style="margin: 0; font-size: 12.5px; color: #374151;">
                  <strong>Area & Pin:</strong> ${orderDetails.receiver?.deliveryArea || 'Vadodara'}, Vadodara ${orderDetails.receiver?.pincode ? '- ' + orderDetails.receiver.pincode : ''}
                </p>
              </div>
            </td>
            <td class="stack-col" style="width: 50%; vertical-align: top; padding: 0 0 0 5px;">
              <div style="background-color: #f9fafb; border: 1.5px solid #e5e7eb; border-radius: 10px; padding: 12px;">
                <h4 style="margin: 0 0 6px; font-size: 11px; font-weight: 800; text-transform: uppercase; color: #be123c; letter-spacing: 0.5px;">👤 SENDER / BUYER</h4>
                <p style="margin: 0 0 4px; font-size: 14px; font-weight: bold; color: #111827;">${orderDetails.sender?.name || orderDetails.customer?.name || 'Customer'}</p>
                <p style="margin: 0 0 4px; font-size: 12.5px; color: #374151;">
                  <strong>WhatsApp:</strong> <a href="https://wa.me/${senderWhatsAppClean}" style="color: #059669; font-weight: bold; text-decoration: underline;">${orderDetails.sender?.whatsapp || orderDetails.customer?.phone || 'N/A'}</a>
                </p>
                ${orderDetails.sender?.phone ? `<p style="margin: 0 0 4px; font-size: 12.5px; color: #374151;"><strong>Calling Phone:</strong> <a href="tel:${senderPhoneClean}" style="color: #374151; text-decoration: none;">${orderDetails.sender.phone}</a></p>` : ''}
                <p style="margin: 0; font-size: 12.5px; color: #374151; word-break: break-all;"><strong>Email:</strong> ${orderDetails.customer?.email || 'N/A'}</p>
              </div>
            </td>
          </tr>
        </table>

        <!-- Items to Prepare Table (Responsive 3 Columns) -->
        <h4 style="margin: 0 0 8px; font-size: 13.5px; font-weight: 800; color: #111827;">🎂 Items to Prepare & Pack</h4>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 16px; font-size: 13px;">
          <thead>
            <tr style="background-color: #111827; color: #ffffff;">
              <th style="padding: 9px 8px; text-align: left;">Product Details</th>
              <th style="padding: 9px 6px; text-align: center; width: 45px;">Qty</th>
              <th style="padding: 9px 8px; text-align: right; width: 75px;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${adminProductsHtml}
          </tbody>
          <tfoot>
            <tr style="border-top: 1px solid #e5e7eb; background-color: #f9fafb;">
              <td colspan="2" style="padding: 8px 10px; text-align: right; font-weight: 600; color: #4b5563;">Subtotal:</td>
              <td style="padding: 8px 10px; text-align: right; font-weight: 600; color: #111827; white-space: nowrap;">₹${orderDetails.subtotal || orderDetails.totalAmount || 0}</td>
            </tr>
            <tr style="background-color: #f9fafb;">
              <td colspan="2" style="padding: 6px 10px; text-align: right; font-weight: 600; color: #4b5563;">Delivery Fee:</td>
              <td style="padding: 6px 10px; text-align: right; font-weight: 600; color: #059669; white-space: nowrap;">${orderDetails.deliveryCharge > 0 ? `₹${orderDetails.deliveryCharge}` : 'FREE'}</td>
            </tr>
            <tr style="border-top: 2px solid #111827; background-color: #f9fafb;">
              <td colspan="2" style="padding: 9px 10px; text-align: right; font-weight: 800; font-size: 14.5px; color: #111827;">Grand Total:</td>
              <td style="padding: 9px 10px; text-align: right; font-weight: 800; font-size: 16px; color: #be123c; white-space: nowrap;">₹${orderDetails.totalAmount || 0}</td>
            </tr>
          </tfoot>
        </table>

        <!-- Bakery Operations Checklist -->
        <div style="background-color: #f0fdf4; border: 1.5px solid #86efac; border-radius: 10px; padding: 14px; margin-bottom: 16px;">
          <h4 style="margin: 0 0 6px; font-size: 12px; font-weight: 800; text-transform: uppercase; color: #166534;">✅ Bakery & Delivery Boy SOP</h4>
          <ul style="margin: 0; padding-left: 18px; font-size: 12px; color: #166534; line-height: 1.55;">
            <li style="margin-bottom: 4px;"><strong>1. Pickup Photo:</strong> Send cake pickup-time photo to sender WhatsApp (${orderDetails.sender?.whatsapp || orderDetails.customer?.phone || 'N/A'}).</li>
            <li style="margin-bottom: 4px;"><strong>2. Surprise Delivery Policy:</strong> Sender's name is NOT shared with receiver until delivery is done.</li>
            <li style="margin-bottom: 4px;"><strong>3. Doorstep Name Sharing:</strong> Once delivery person reaches the address with the product, sender's name is shared.</li>
            <li><strong>4. Completion Update:</strong> Send immediate WhatsApp update once handover is complete.</li>
          </ul>
        </div>

        <!-- Plain Text Copy Summary for Delivery / WhatsApp -->
        <div style="background-color: #f8fafc; border: 2px dashed #cbd5e1; border-radius: 10px; padding: 14px; margin-top: 10px;">
          <div style="margin-bottom: 10px; padding-bottom: 8px; border-bottom: 1px solid #e2e8f0;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td class="stack-col" style="vertical-align: middle; padding-bottom: 4px;">
                  <strong style="font-size: 12px; text-transform: uppercase; color: #475569; letter-spacing: 0.5px; display: block;">
                    📋 Quick Copy Order Summary
                  </strong>
                  <span style="font-size: 11px; color: #64748b;">(Exact WhatsApp / Delivery Boy Text)</span>
                </td>
                <td class="stack-col" style="text-align: right; vertical-align: middle; padding-bottom: 4px; white-space: nowrap;">
                  <a href="${BASE_URL}/api/order/copy-summary?data=${Buffer.from(plainSummaryText).toString('base64url')}" 
                     target="_blank" 
                     style="display: inline-block; background-color: #be123c; color: #ffffff; font-size: 11.5px; font-weight: 800; text-decoration: none; padding: 6px 14px; border-radius: 6px; margin-right: 4px; box-shadow: 0 2px 4px rgba(190,18,60,0.25);">
                    📋 COPY
                  </a>
                  <a href="https://wa.me/?text=${encodeURIComponent(plainSummaryText)}" 
                     target="_blank" 
                     style="display: inline-block; background-color: #25D366; color: #ffffff; font-size: 11.5px; font-weight: 800; text-decoration: none; padding: 6px 12px; border-radius: 6px; box-shadow: 0 2px 4px rgba(37,211,102,0.25);">
                    📲 WhatsApp
                  </a>
                </td>
              </tr>
            </table>
          </div>
          <div style="font-family: monospace, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 13px; color: #0f172a; line-height: 1.55; white-space: pre-wrap; word-break: break-word; background: #ffffff; padding: 12px; border-radius: 6px; border: 1px solid #e2e8f0; user-select: all;">${escapeHtml(plainSummaryText)}</div>
          <div style="margin-top: 6px; font-size: 11px; color: #64748b; text-align: right;">
            👆 <em>Tip: Tap anywhere on text to select all • Click <strong>COPY</strong> or <strong>WhatsApp</strong></em>
          </div>
        </div>
      </div>

      <div style="background-color: #111827; color: #9ca3af; padding: 14px 16px; text-align: center; font-size: 11.5px;">
        Cake Connection Orders Dispatch Notification • System Generated for Order.CakeConnection@gmail.com
      </div>
    </div>
  </div>
</body>
</html>
  `;
}

export async function POST(req: Request) {
  try {
    const orderDetails = await req.json();

    if (!orderDetails || !orderDetails.customer?.email) {
      return NextResponse.json(
        { error: 'Invalid payload: Customer email is required.' },
        { status: 400 }
      );
    }

    // 1. Generate Normal PDF Invoice in memory (NO Tax / NO GST)
    let pdfBuffer: Buffer | null = null;
    try {
      pdfBuffer = await generatePDFBuffer(orderDetails);
    } catch (pdfErr: any) {
      console.warn('PDF generation deferred (using HTML email):', pdfErr.message);
    }

    // 2. Configure Nodemailer Transporter
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.warn('EMAIL_USER or EMAIL_PASS not configured. Simulated email dispatch completed.');
      return NextResponse.json(
        {
          success: true,
          message: 'Order received. (Email dispatch simulated; configure EMAIL_USER and EMAIL_PASS in .env.local to send live emails).',
          emailSent: false,
        },
        { status: 200 }
      );
    }

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    // 3. Generate HTML Content
    const customerHtml = generateCustomerEmailHTML(orderDetails);
    const adminHtml = generateAdminEmailHTML(orderDetails);

    // 4. Attachments — generate independent buffer copies for each email to avoid stream consumption issues
    const cleanId = (orderDetails.id || 'CC-ORDER').replace(/[^a-zA-Z0-9_-]/g, '');
    const getInvoiceAttachments = () => {
      if (!pdfBuffer || pdfBuffer.length === 0) return [];
      return [
        {
          filename: `Invoice_${cleanId}.pdf`,
          content: Buffer.from(pdfBuffer),
          contentType: 'application/pdf',
        },
      ];
    };

    // Customer Email Options
    const customerMailOptions: any = {
      from: `"Cake Connection Orders" <${process.env.EMAIL_USER}>`,
      to: orderDetails.customer.email,
      subject: `Order Confirmation - Invoice #${orderDetails.id || 'N/A'} | Cake Connection`,
      html: customerHtml,
      attachments: getInvoiceAttachments(),
    };

    // Dedicated Admin Email Options
    const adminMailOptions: any = {
      from: `"Cake Connection System" <${process.env.EMAIL_USER}>`,
      to: 'Order.CakeConnection@gmail.com',
      subject: `🚨 [NEW ORDER #${orderDetails.id}] ₹${orderDetails.totalAmount || 0} - ${orderDetails.receiver?.name || orderDetails.customer?.name} | Slot: ${orderDetails.deliverySlot || 'Standard'}`,
      html: adminHtml,
      attachments: getInvoiceAttachments(),
    };

    let customerSent = false;
    let adminSent = false;
    let emailError = null;

    // Send customer email first
    try {
      const custInfo = await transporter.sendMail(customerMailOptions);
      customerSent = true;
      console.log('Customer confirmation email sent:', custInfo.messageId);
    } catch (custErr: any) {
      console.error('Customer email failed:', custErr.message);
      emailError = custErr.message;
    }

    // Send admin email second
    try {
      const adminInfo = await transporter.sendMail(adminMailOptions);
      adminSent = true;
      console.log('Admin notification email sent:', adminInfo.messageId);
    } catch (adminErr: any) {
      console.error('Admin email failed:', adminErr.message);
      if (!emailError) emailError = adminErr.message;
    }

    return NextResponse.json(
      {
        success: true,
        message: customerSent && adminSent
          ? 'Normal Invoice generated; customer and admin emails dispatched successfully.'
          : 'Invoice processed with partial or simulated email dispatch.',
        customerSent,
        adminSent,
        warning: emailError,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error dispatching invoice (non-fatal):', error);
    return NextResponse.json(
      { success: true, warning: error.message || 'Invoice processing deferred' },
      { status: 200 }
    );
  }
}

