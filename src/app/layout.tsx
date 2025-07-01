import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { Toaster } from 'react-hot-toast'
import { Sidebar } from '@/components/layout/sidebar'
import { Header } from '@/components/layout/header'
import { AIChatbot } from '@/components/layout/ai-chatbot'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Codec Net | AI Based SIEM Dashboard',
  description: 'Professional AI-powered SIEM Dashboard for comprehensive security monitoring and incident management',
  keywords: ['SIEM', 'Security', 'Monitoring', 'AI', 'Dashboard', 'Cybersecurity', 'Codec Net'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <Sidebar />
            <div className="lg:pl-72">
              <Header />
              <main className="py-10">
                <div className="px-4 sm:px-6 lg:px-8">
                  {children}
                </div>
              </main>
            </div>
          </div>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: 'var(--background)',
                color: 'var(--foreground)',
              },
            }}
          />
          <AIChatbot />
        </ThemeProvider>
      </body>
    </html>
  )
} 