import { describe, expect, it } from 'vitest'

import { getSocialLinks } from '@/lib/social-links'

describe('social links from Payload settings', () => {
  it('uses configured URLs in Instagram then TikTok order', () => {
    expect(
      getSocialLinks({
        socialLinks: [
          { label: 'TikTok', url: 'https://www.tiktok.com/@underwood.by' },
          { label: 'Instagram', url: 'https://www.instagram.com/underwood_by/' },
        ],
      }),
    ).toEqual([
      { platform: 'instagram', label: 'Instagram', url: 'https://www.instagram.com/underwood_by/' },
      { platform: 'tiktok', label: 'TikTok', url: 'https://www.tiktok.com/@underwood.by' },
    ])
  })

  it('hides empty, unsafe, and unrelated links', () => {
    expect(getSocialLinks({ socialLinks: null })).toEqual([])
    expect(
      getSocialLinks({
        socialLinks: [
          { label: 'Instagram', url: 'javascript:alert(1)' },
          { label: 'TikTok', url: 'https://tiktok.com.evil.example/profile' },
          { label: 'Other', url: 'https://example.com/' },
        ],
      }),
    ).toEqual([])
  })
})
