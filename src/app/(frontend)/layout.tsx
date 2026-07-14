import React from 'react'
import type { Metadata } from 'next'
import Script from 'next/script'
import { ThemeProvider } from '@/components/theme-provider'
import './global.css'
import { Footer } from './Footer'
import { Header } from './Header'
import { JsonLd } from '@/components/JsonLd'
import { getSiteSettings } from '@/globals/fetchers'
import { resolveMediaURL, siteURL } from '@/lib/seo/metadata'
import { env } from '@/lib/env'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()

  return {
    metadataBase: new URL(siteURL),
    title: settings.siteName,
    description: settings.defaultDescription,
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
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings()
  const socialImage = resolveMediaURL(settings.defaultSocialImage)
  const sameAs = settings.socialLinks?.map(({ url }) => url).filter(Boolean) ?? []
  const localBusinessJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'GardenStore',
    name: settings.siteName,
    url: siteURL,
    logo: `${siteURL}/android-chrome-512x512.png`,
    ...(socialImage ? { image: socialImage } : {}),
    telephone: settings.phone,
    email: settings.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: settings.streetAddress,
      addressLocality: settings.addressLocality,
      addressRegion: settings.addressRegion,
      addressCountry: 'BY',
    },
    ...(sameAs.length > 0 ? { sameAs } : {}),
  }

  return (
    <html lang="ru" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body className="flex min-h-screen flex-col antialiased">
        {process.env.NODE_ENV === 'production' && env.GOOGLE_MEASUREMENT_ID ? (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${env.GOOGLE_MEASUREMENT_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${env.GOOGLE_MEASUREMENT_ID}');
              `}
            </Script>
          </>
        ) : null}
        <JsonLd data={localBusinessJsonLd} />
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          forcedTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <Header siteName={settings.siteName} />
          <main className="flex-1">{children}</main>
          <Footer settings={settings} />
        </ThemeProvider>
      </body>
    </html>
  )
}
