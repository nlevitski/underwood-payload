import type { SiteSettingsData } from '@/globals/fetchers'

export type SocialLink = {
  platform: 'instagram' | 'tiktok'
  label: 'Instagram' | 'TikTok'
  url: string
}

const socialPlatforms = [
  { platform: 'instagram', label: 'Instagram', hosts: ['instagram.com', 'www.instagram.com'] },
  { platform: 'tiktok', label: 'TikTok', hosts: ['tiktok.com', 'www.tiktok.com'] },
] as const

export function getSocialLinks(settings: Pick<SiteSettingsData, 'socialLinks'>): SocialLink[] {
  return socialPlatforms.flatMap(({ platform, label, hosts }) => {
    const entry = settings.socialLinks?.find((link) => {
      try {
        const url = new URL(link.url.trim())
        return url.protocol === 'https:' && hosts.some((host) => host === url.hostname)
      } catch {
        return false
      }
    })

    return entry ? [{ platform, label, url: entry.url.trim() }] : []
  })
}
