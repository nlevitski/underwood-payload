export type ContactSubmission = {
  name: string
  phone: string
  email?: string
  message: string
}

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

function normalizeField(value?: string) {
  const trimmed = value?.trim()
  return trimmed && trimmed.length > 0 ? trimmed : 'Не указан'
}

function normalizePhoneForLink(value: string) {
  return value.trim().replace(/[^\d+]/g, '')
}

export function formatContactTelegramMessage(input: ContactSubmission) {
  const submittedAt = new Intl.DateTimeFormat('ru-RU', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Europe/Minsk',
  }).format(new Date())

  const name = normalizeField(input.name)
  const phone = normalizeField(input.phone)
  const email = normalizeField(input.email)
  const message = normalizeField(input.message)
  const phoneLink = normalizePhoneForLink(phone)

  return [
    '📩 <b>Новая заявка с сайта Underwood</b>',
    '📝 <i>Контактная форма</i>',
    '',
    '<b>Контакты</b>',
    `👤 <b>Имя:</b> ${escapeHtml(name)}`,
    `📧 <b>Email:</b> <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a>`,
    `📱 <b>Телефон:</b> <a href="tel:${escapeHtml(phoneLink)}">${escapeHtml(phone)}</a>`,
    '',
    '💬 <b>Сообщение</b>',
    `<pre>${escapeHtml(message)}</pre>`,
    '',
    `🕒 <b>Отправлено:</b> ${escapeHtml(submittedAt)}`,
  ].join('\n')
}
