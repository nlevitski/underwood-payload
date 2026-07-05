import { env } from '@/lib/env'
import { formatContactTelegramMessage, type ContactSubmission } from '@/lib/telegram-message'

export async function sendContactToTelegram(input: ContactSubmission) {
  const response = await fetch(
    `https://api.telegram.org/bot${env.TELEGRAM_TOKEN}/sendMessage`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: env.TELEGRAM_GROUP_CHAT_ID,
        text: formatContactTelegramMessage(input),
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      }),
    },
  )

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Telegram API error: ${response.status} ${errorText}`)
  }
}
