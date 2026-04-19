import React from 'react'
import type { Metadata } from 'next'
import { ThemeProvider } from '@/components/theme-provider'
import './global.css'
import { Footer } from './Footer'
import { Header } from './Header'

export const metadata: Metadata = {
  description: 'A blank template using Payload in a Next.js app.',
  title: 'Payload Blank Template',
  manifest: '/site.webmanifest',
  icons: {
    icon: [
      { rel: 'icon', type: 'image/x-icon', url: '/favicon.ico' },
      { rel: 'icon', type: 'image/png', sizes: '16x16', url: '/favicon-16x16.png' },
      { rel: 'icon', type: 'image/png', sizes: '32x32', url: '/favicon-32x32.png' },
      { rel: 'icon', type: 'image/png', sizes: '48x48', url: '/favicon-48x48.png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
    other: [{ rel: 'mask-icon', url: '/safari-pinned-tab.svg', color: '#2E7D32' }],
  },
  other: {
    'msapplication-config': '/browserconfig.xml',
    'msapplication-TileColor': '#2E7D32',
  },
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body className="flex min-h-screen flex-col antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          forcedTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
}
