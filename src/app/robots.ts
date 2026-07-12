import type { MetadataRoute } from 'next'

import { absoluteURL } from '@/lib/seo/metadata'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/graphql', '/api/graphql-playground', '/api/rebuild-media'],
    },
    sitemap: absoluteURL('/sitemap.xml'),
    host: absoluteURL('/'),
  }
}
