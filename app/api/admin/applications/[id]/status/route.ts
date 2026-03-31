import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  // Verify User is authenticated
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // NOTE: Role-based admin access should ideally be checked via RLS or User metadata
  const userRole = user.user_metadata?.role || 'USER';
  if (userRole !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized Admin Access' }, { status: 403 });
  }

  try {
    const { status, admin_notes } = await request.json();
    const id = params.id;

    // 1. Update application status
    const { data: app, error } = await supabase
      .from('applications')
      .update({ status, admin_notes, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error || !app) {
      return NextResponse.json({ error: 'Application not found or error updating' }, { status: 404 });
    }

    // 2. Perform Workflow Events
    if (status === 'APPROVED') {
      await supabase.from('members').insert([
        { user_id: app.user_id, application_id: app.id, member_number: `NPC-${Math.floor(Math.random() * 10000)}` }
      ]);
      console.log(`[EMAIL EVENT] Approved email sent to user ${app.user_id}.`);
    } else if (status === 'REJECTED') {
      console.log(`[EMAIL EVENT] Rejection email sent to user ${app.user_id}. Reason: ${admin_notes}`);
    } else if (status === 'INFO_REQUESTED') {
      console.log(`[EMAIL EVENT] Info Required email sent to user ${app.user_id}.`);
    }

    return NextResponse.json({ message: `Application ${status}`, application: app });

  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal error' }, { status: 500 });
  }
}
