import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { AIChatbot } from '@/components/layout/ai-chatbot';
import AuthGuard from '@/components/auth/AuthGuard';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard requiredRole="client">
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 flex flex-col">
        <Sidebar />
        <div className="lg:pl-72 flex flex-col min-h-screen">
          <Header />
          <main className="py-8 flex-1 animate-fade-in">
            <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
              {children}
            </div>
          </main>
          <Footer />
        </div>
        <AIChatbot />
      </div>
    </AuthGuard>
  );
}
