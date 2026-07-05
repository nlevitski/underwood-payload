'use server'

import { z } from 'zod'

import { sendContactToEmail } from '@/lib/contact-email'
import { sendContactToTelegram } from '@/lib/telegram'

const phonePattern = /^(?:\+?375\d{9}|80\d{9}|\+?7\d{10}|8\d{10})$/

function normalizePhone(value: string) {
  return value.trim().replace(/[^\d+]/g, '')
}

const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Имя должно содержать минимум 2 символа')
    .max(70, 'Имя должно содержать максимум 70 символов'),
  phone: z
    .string()
    .trim()
    .min(1, 'Телефон обязателен')
    .refine(
      (value) => phonePattern.test(normalizePhone(value)),
      {
        message: 'Введите телефон в формате Беларуси (+375...) или России (+7...)',
      },
    ),
  email: z
    .string()
    .trim()
    .min(1, 'Email обязателен')
    .email('Некорректный email'),
  message: z
    .string()
    .trim()
    .min(10, 'Сообщение должно быть не короче 10 символов')
    .max(2000, 'Сообщение должно быть не длиннее 2000 символов')
    .refine(
      (value) => !/ {4,}/.test(value),
      {
        message: 'В сообщении не должно быть больше трех пробелов подряд',
      },
    ),
})

export type ContactActionState = {
  status: 'idle' | 'success' | 'error'
  message: string
}

function getField(formData: FormData, key: string) {
  const value = formData.get(key)
  return typeof value === 'string' ? value : ''
}

function logDeliveryFailure(channel: 'email' | 'telegram', reason: unknown) {
  console.error(`Failed to deliver contact form via ${channel}`, reason)
}

function hasSuccessfulDelivery(results: PromiseSettledResult<unknown>[]) {
  return results.some((result) => result.status === 'fulfilled')
}

export async function sendContactAction(
  _: ContactActionState,
  formData: FormData,
): Promise<ContactActionState> {
  const parsed = contactSchema.safeParse({
    name: getField(formData, 'name'),
    phone: getField(formData, 'phone'),
    email: getField(formData, 'email'),
    message: getField(formData, 'message'),
  })

  if (!parsed.success) {
    const firstIssue =
      Object.values(parsed.error.flatten().fieldErrors).flat().find(Boolean) ??
      'Проверьте поля формы'

    return {
      status: 'error',
      message: firstIssue,
    }
  }

  const submission = {
    name: parsed.data.name,
    phone: parsed.data.phone,
    email: parsed.data.email,
    message: parsed.data.message,
  }

  const deliveryResults = await Promise.allSettled([
    sendContactToTelegram(submission),
    sendContactToEmail(submission),
  ])
  const deliveryChannels = ['telegram', 'email'] as const

  deliveryResults.forEach((result, index) => {
    if (result.status === 'rejected') {
      logDeliveryFailure(deliveryChannels[index], result.reason)
    }
  })

  if (hasSuccessfulDelivery(deliveryResults)) {
    return {
      status: 'success',
      message: 'Сообщение отправлено. Мы скоро ответим.',
    }
  }

  return {
    status: 'error',
    message: 'Не удалось отправить сообщение. Попробуйте позже.',
  }
}
