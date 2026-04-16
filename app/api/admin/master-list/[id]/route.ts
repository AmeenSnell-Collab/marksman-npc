import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { data: dbUser } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    if (dbUser?.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const body = await request.json();
    const { action, reason } = body;

    let targetStatus = null;
    let auditActionType = '';

    if (action === 'CANCEL') {
      targetStatus = 'REJECTED';
      auditActionType = 'MEMBERSHIP_CANCELLED';
    } else if (action === 'CHANGE') {
      // General status edit, perhaps INFO_REQUESTED
      targetStatus = 'INFO_REQUESTED';
      auditActionType = 'MEMBER_STATUS_CHANGED';
    } else {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    // 1. Log to Audit Trace
    const { error: auditError } = await supabase
      .from('audit_logs')
      .insert({
        application_id: params.id,
        admin_id: user.id,
        action_type: auditActionType,
        reason: reason
      });

    if (auditError) throw auditError;

    // 2. Update Application Table
    const { error: updateError } = await supabase
      .from('applications')
      .update({ status: targetStatus, updated_at: new Date().toISOString() })
      .eq('id', params.id);

    if (updateError) throw updateError;
    
    // 3. Optional: Sync to members table (if cancelled)
    if (action === 'CANCEL') {
        const { data: memberData } = await supabase.from('members').select('id').eq('application_id', params.id).single();
        if (memberData) {
            await supabase.from('members').update({ status: 'SUSPENDED' }).eq('id', memberData.id);
        }
    }

    return NextResponse.json({ success: true, message: 'Audit logged successfully' });
  } catch (error: any) {
    console.error('Audit action error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
