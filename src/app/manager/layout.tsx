import type { Metadata } from 'next';
import ManagerSidebar from '@/components/layout/manager-sidebar';
import ManagerHeader from '@/components/layout/manager-header';
import AuthGuard from '@/components/auth/AuthGuard';

export const metadata: Metadata = {
  title: 'SOC Manager Dashboard',
  description: 'Executive SIEM management interface',
};

export default function ManagerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard requiredRole="manager">
      <div className="flex h-screen bg-gray-900">
        <ManagerSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <ManagerHeader />
          <main className="flex-1 overflow-x-hidden overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
