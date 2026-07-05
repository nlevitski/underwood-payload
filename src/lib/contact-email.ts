import { env } from '@/lib/env'
import { getPayloadClient } from '@/lib/payload/client'
import type { ContactSubmission } from '@/lib/telegram-message'

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

function normalizePhoneForLink(value: string) {
  return value.trim().replace(/[^\d+]/g, '')
}

function formatDate() {
  return new Intl.DateTimeFormat('ru-RU', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Europe/Minsk',
  }).format(new Date())
}

function formatSubjectName(value: string) {
  return value.replace(/[\r\n]+/g, ' ').trim()
}

function formatContactEmailHtml(input: ContactSubmission) {
  const phoneLink = normalizePhoneForLink(input.phone)
  const submittedAt = formatDate()

  return `
    <h2>Новая заявка с сайта Underwood</h2>
    <p><strong>Имя:</strong> ${escapeHtml(input.name)}</p>
    <p><strong>Email:</strong> <a href="mailto:${escapeHtml(input.email ?? '')}">${escapeHtml(input.email ?? '')}</a></p>
    <p><strong>Телефон:</strong> <a href="tel:${escapeHtml(phoneLink)}">${escapeHtml(input.phone)}</a></p>
    <p><strong>Сообщение:</strong></p>
    <p style="white-space: pre-wrap;">${escapeHtml(input.message)}</p>
    <p><strong>Отправлено:</strong> ${escapeHtml(submittedAt)}</p>
  `
}

function formatContactEmailText(input: ContactSubmission) {
  return [
    'Новая заявка с сайта Underwood',
    '',
    `Имя: ${input.name}`,
    `Email: ${input.email ?? ''}`,
    `Телефон: ${input.phone}`,
    '',
    'Сообщение:',
    input.message,
    '',
    `Отправлено: ${formatDate()}`,
  ].join('\n')
}

export async function sendContactToEmail(input: ContactSubmission) {
  const payload = await getPayloadClient()

  await payload.sendEmail({
    to: env.SMTP_TARGET_EMAIL,
    replyTo: input.email,
    subject: `Новая заявка с сайта Underwood: ${formatSubjectName(input.name)}`,
    html: formatContactEmailHtml(input),
    text: formatContactEmailText(input),
  })
}
