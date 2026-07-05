import { describe, expect, it } from 'vitest'

import { formatContactTelegramMessage } from '@/lib/telegram-message'

describe('Telegram contact message', () => {
  it('escapes user input and formats the payload', () => {
    const message = formatContactTelegramMessage({
      name: 'Иван <Admin>',
      phone: '+375 29 123-45-67',
      email: 'ivan@example.com',
      message: 'Нужны <туи> & "сосны"',
    })

    expect(message).toContain('<b>Новая заявка с сайта Underwood</b>')
    expect(message).toContain('Иван &lt;Admin&gt;')
    expect(message).toContain('Нужны &lt;туи&gt; &amp; &quot;сосны&quot;')
  })
})
