import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    // For a real integration, this might be a webhook from a provider (Stripe/Yoco).
    // In that case, we would verify the webhook signature instead of cookies.
    // For this mock, we just proceed.
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    // Fetch the application
    const { data: app, error: appError } = await supabase
      .from('applications')
      .select('*')
      .eq('id', params.id)
      .single();

    if (appError || !app) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    if (app.status !== 'AWAITING_PAYMENT') {
      return NextResponse.json({ error: 'Application is not awaiting payment' }, { status: 400 });
    }

    // 1. Mark Application as APPROVED
    const { error: updateError } = await supabase
      .from('applications')
      .update({ status: 'APPROVED', updated_at: new Date().toISOString() })
      .eq('id', params.id);

    if (updateError) throw updateError;

    // 2. Automatically generate Members record
    const yearPrefix = new Date().getFullYear().toString().slice(2);
    // basic random member number generator e.g. "NPC-26-9481"
    const randomDigits = Math.floor(1000 + Math.random() * 9000); 
    const memberNumber = `NPC-${yearPrefix}-${randomDigits}`;

    const { error: memberError } = await supabase
      .from('members')
      .insert({
        user_id: app.user_id,
        application_id: app.id,
        member_number: memberNumber,
        status: 'ACTIVE'
      });

    if (memberError) {
      // Depending on severity, we might want to flag this. 
      // But we will just log it for now since the application was approved.
      console.error('Failed to create member record:', memberError);
    }

    return NextResponse.json({ success: true, member_number: memberNumber });

  } catch (error: any) {
    console.error('Payment processing error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
