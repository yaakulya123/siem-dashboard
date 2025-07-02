import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { AIChatbot } from '@/components/layout/ai-chatbot';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <Sidebar />
      <div className="lg:pl-72 flex flex-col min-h-screen">
        <Header />
        <main className="py-10 flex-1">
          <div className="px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
        <Footer />
      </div>
      <AIChatbot />
    </div>
  );
} 