import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ChatAssistant from '@/components/ChatAssistant'
import { AssistantProvider } from '@/contexts/AssistantContext'
import { Toaster } from 'sonner';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Fondation Horizons Nouveaux',
  description: 'Plateforme de gestion des dossiers médicaux et sociaux',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <AssistantProvider>
          <Header />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
          <ChatAssistant />
          <Toaster richColors position="top-center" />
        </AssistantProvider>
      </body>
    </html>
  )
}
