import { withPayload } from '@payloadcms/next/withPayload'
import withPlaiceholder from '@plaiceholder/next'

const isProduction = process.env.NODE_ENV === 'production'
const developmentPort = process.env.PORT ?? '3005'
const payloadServerURL =
  process.env.PAYLOAD_PUBLIC_SERVER_URL ??
  (isProduction ? 'https://underwood.by' : `http://localhost:${developmentPort}`)
const contentSecurityPolicy = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'self'",
  "form-action 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data: https:",
  "connect-src 'self' https: wss:",
  "frame-src 'self' https://www.google.com https://maps.google.com",
  ...(isProduction ? ['upgrade-insecure-requests'] : []),
].join('; ')

/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: process.env.NEXT_DIST_DIR ?? '.next',
  poweredByHeader: false,
  async redirects() {
    // Preserve the product URLs used before the catalog moved into Payload.
    // Destinations are the current sellable products in the production database.
    const legacyProductSlugs = {
      'blueberry-duke': 'berries-blueberry-duke',
      'lingonberry-koralle': 'berries-lingonberry-coral',
      'thuja-smaragd': 'conifers-thuja-smaragd',
      'blackberry-natchez': 'berries-blackberry-natchez',
      'cranberry-stevens': 'berries-cranberry-stevens',
      'raspberry-rubyfall': 'Rubyfall-everbearing',
      'juniper-prince-of-wales': 'conifers-juniper-prince-of-wales',
      'thuja-danica': 'conifers-thuja-danika',
      'juniper-wiltonii': 'conifers-juniper-wiltonii',
      'juniper-lime-glow': 'conifers-juniper-lime-glow',
      'blueberry-bluecrop': 'berries-blueberry-bluecrop',
      'juniper-bluearrow': 'conifers-juniper-blue-arrow',
    }

    return Object.entries(legacyProductSlugs).map(([source, destination]) => ({
      source: `/catalog/${source}`,
      destination: `/catalog/${destination}`,
      permanent: true,
    }))
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          ...(isProduction
            ? [
                {
                  key: 'Strict-Transport-Security',
                  value: 'max-age=31536000; includeSubDomains',
                },
              ]
            : []),
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          {
            key: 'Content-Security-Policy',
            value: contentSecurityPolicy,
          },
        ],
      },
    ]
  },
  ...(process.env.NEXT_OUTPUT_STANDALONE === 'true' ? { output: 'standalone' } : {}),
  images: {
    dangerouslyAllowLocalIP: !isProduction,
    qualities: [65, 70, 75],
    remotePatterns: [new URL('/api/media/file/**', payloadServerURL)],
  },
  outputFileTracingExcludes: {
    '*': ['./data/**/*', './media/**/*'],
  },
  // Your Next.js config here
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    return webpackConfig
  },
}

export default withPayload(withPlaiceholder(nextConfig), { devBundleServerPackages: false })
