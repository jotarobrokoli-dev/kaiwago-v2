import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { LearningProvider } from '@/lib/learning-context'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'KaiwaGo - Belajar Berbicara Bahasa Jepang',
  description: 'Media pembelajaran kaiwa bahasa Jepang untuk siswa SMA/SMK pemula. Belajar perkenalan diri dalam bahasa Jepang dengan mudah.',
  keywords: ['bahasa jepang', 'belajar jepang', 'kaiwa', 'jikoushokai', 'perkenalan diri', 'JLPT N5'],
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#ffffff',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="id" className="bg-background">
      <body className="font-sans antialiased min-h-screen">
        <LearningProvider>
          {children}
        </LearningProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
