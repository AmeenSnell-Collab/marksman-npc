import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { applicationId } = body;
    
    if (!applicationId) {
      return NextResponse.json({ error: 'Missing applicationId' }, { status: 400 });
    }

    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify application belongs to user and is approved
    const { data: application, error: appError } = await supabase
      .from('applications')
      .select('status, user_id')
      .eq('id', applicationId)
      .single();

    if (appError || !application || application.user_id !== user.id) {
      return NextResponse.json({ error: 'Application not found or unauthorized' }, { status: 404 });
    }
    
    if (application.status !== 'APPROVED') {
       return NextResponse.json({ error: 'Cannot pay for an unapproved application' }, { status: 400 });
    }

    // Generate a new unique 4-digit member number
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const memberNum = `NHT-${randomNum}`;

    // Create the active membership
    const { error: memberError } = await supabase
      .from('members')
      .insert({
        user_id: user.id,
        application_id: applicationId,
        member_number: memberNum,
        status: 'ACTIVE'
      });

    if (memberError) {
      // Postgres error code 23505 = unique constraint violation (they might already be a member)
      if (memberError.code === '23505') {
         return NextResponse.json({ success: true, message: 'Membership already active' });
      }
      throw memberError;
    }

    return NextResponse.json({ success: true, member_number: memberNum });
  } catch (error: any) {
    console.error('Payment activation error:', error);
    return NextResponse.json({ error: error.message || 'Internal error' }, { status: 500 });
  }
}
