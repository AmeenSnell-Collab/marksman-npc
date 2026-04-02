import './globals.css';
import type { Metadata } from 'next';
import PublicNavbar from '@/components/PublicNavbar';

export const metadata: Metadata = {
  title: 'Marksman NPC | Members Portal',
  description: 'Manage your Marksman NPC membership application, status, and documents securely.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <PublicNavbar />
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}
