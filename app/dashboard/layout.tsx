import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import SidebarLayout from '@/components/SidebarLayout';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  // Get authenticated user
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) redirect('/login');

  // Fetch roles & membership
  const { data: dbUser } = await supabase.from('users').select('role').eq('id', user.id).single();
  const { data: membership } = await supabase.from('members').select('member_number').eq('user_id', user.id).single();

  const isAdmin = dbUser?.role === 'ADMIN';

  return (
    <SidebarLayout 
      userEmail={user.email || 'User'} 
      isAdmin={isAdmin}
      memberNumber={membership?.member_number}
    >
      {children}
    </SidebarLayout>
  );
}
