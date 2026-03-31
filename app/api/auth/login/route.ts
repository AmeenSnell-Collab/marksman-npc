import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
    }

    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    // Authenticate user securely with Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    // Role could be retrieved from user metadata if configured
    const userRole = data.user?.user_metadata?.role || 'USER';

    return NextResponse.json({ 
      message: 'Login successful', 
      role: userRole,
      user: data.user
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal error' }, { status: 500 });
  }
}
