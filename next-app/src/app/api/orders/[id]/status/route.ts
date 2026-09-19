import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { isSupabaseConfigured } from '@/lib/db';

export async function PATCH(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params;
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Order ID is required' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { order_status, payment_status } = body;

    if (!order_status && !payment_status) {
      return NextResponse.json(
        { success: false, message: 'No valid status fields provided to update' },
        { status: 400 }
      );
    }

    const updates: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };

    if (order_status) updates.order_status = order_status;
    if (payment_status) updates.payment_status = payment_status;

    if (!isSupabaseConfigured()) {
      return NextResponse.json({
        success: true,
        message: 'Order status updated (mock mode)',
        data: { id, ...updates },
      });
    }

    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
    let query = supabase.from('orders').update(updates);

    if (isUuid) {
      query = query.eq('id', id);
    } else {
      query = query.eq('order_number', id);
    }

    const { data, error } = await query.select().single();

    if (error) {
      console.error('Error updating order status in Supabase:', error);
      return NextResponse.json(
        { success: false, message: error.message || 'Database update failed' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Order status updated successfully',
      data,
    });
  } catch (error: any) {
    console.error('PATCH /api/orders/[id]/status error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
