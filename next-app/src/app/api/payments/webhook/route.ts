import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { supabase } from '@/lib/supabase';
import { isSupabaseConfigured } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get('x-razorpay-signature');
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET || process.env.RAZORPAY_KEY_SECRET;

    if (!signature) {
      return NextResponse.json({ success: false, message: 'Missing webhook signature' }, { status: 400 });
    }

    if (!secret) {
      console.warn('RAZORPAY_WEBHOOK_SECRET not configured. Skipping webhook verification.');
      return NextResponse.json({ success: false, message: 'Webhook secret not configured' }, { status: 500 });
    }

    // Verify cryptographic HMAC signature from Razorpay
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(rawBody)
      .digest('hex');

    if (expectedSignature !== signature) {
      console.error('Invalid Razorpay webhook signature');
      return NextResponse.json({ success: false, message: 'Invalid webhook signature' }, { status: 400 });
    }

    const event = JSON.parse(rawBody);
    const eventType = event.event;
    console.log(`Received Razorpay webhook event: ${eventType}`);

    // Handle payment.captured or order.paid
    if (eventType === 'payment.captured' || eventType === 'order.paid') {
      const paymentEntity = event.payload?.payment?.entity;
      const orderEntity = event.payload?.order?.entity;

      const orderNumber = 
        paymentEntity?.notes?.order_number ||
        orderEntity?.receipt ||
        orderEntity?.notes?.order_number;

      const paymentId = paymentEntity?.id;
      const paymentMethod = paymentEntity?.method || 'online';

      if (orderNumber && isSupabaseConfigured()) {
        // 1. Update order payment status in Supabase
        const { error } = await supabase
          .from('orders')
          .update({
            payment_status: 'paid',
            payment_id: paymentId,
            payment_method: paymentMethod,
            updated_at: new Date().toISOString(),
          })
          .eq('order_number', orderNumber);

        if (error) {
          console.error(`Failed to update order ${orderNumber} from webhook:`, error);
        } else {
          console.log(`Successfully marked order ${orderNumber} as paid via webhook.`);
        }

        // 2. Trigger invoice / notification email dispatch if not already sent
        try {
          const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
          await fetch(`${siteUrl}/api/order/send-invoice`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              id: orderNumber,
              paymentStatus: 'Paid Online (Verified via Webhook)',
              paymentMethod: paymentMethod.toUpperCase(),
              customer: {
                name: paymentEntity?.notes?.customer_name || 'Customer',
                email: paymentEntity?.email,
                phone: paymentEntity?.contact,
              },
            }),
          });
        } catch (emailErr: any) {
          console.warn('Webhook invoice dispatch note:', emailErr.message);
        }
      }
    } else if (eventType === 'payment.failed') {
      const paymentEntity = event.payload?.payment?.entity;
      const orderNumber = paymentEntity?.notes?.order_number;

      if (orderNumber && isSupabaseConfigured()) {
        await supabase
          .from('orders')
          .update({
            payment_status: 'failed',
            updated_at: new Date().toISOString(),
          })
          .eq('order_number', orderNumber);
        console.log(`Marked order ${orderNumber} as payment failed via webhook.`);
      }
    }

    return NextResponse.json({ status: 'ok', received: true });
  } catch (error: any) {
    console.error('Webhook error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
