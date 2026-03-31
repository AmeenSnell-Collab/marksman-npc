import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  
  // Verify User Session via Supabase
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await request.json();
    
    // Insert new application
    const { data: result, error } = await supabase
      .from('applications')
      .insert([
        {
          user_id: user.id,
          first_name: data.first_name,
          last_name: data.last_name,
          phone: data.phone,
          id_number: data.id_number,
          association_name: data.association_name,
          association_number: data.association_number,
        }
      ])
      .select('id, status')
      .single();

    if (error) throw error;

    console.log(`[EVENT] Application ${result.id} submitted. Sending email to Admins.`);

    return NextResponse.json({ 
      message: 'Application submitted successfully',
      applicationId: result.id
    }, { status: 201 });

  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal error' }, { status: 500 });
  }
}
