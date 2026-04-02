import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import SidebarLayout from '@/components/SidebarLayout';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) redirect('/login');

  const { data: dbUser } = await supabase.from('users').select('role').eq('id', user.id).single();
  if (dbUser?.role !== 'ADMIN') {
    redirect('/dashboard');
  }

  return (
    <SidebarLayout 
      userEmail={user.email || 'Admin User'} 
      isAdmin={true}
    >
      {children}
    </SidebarLayout>
  );
}
