import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

const emailEnvSchema = z.object({
  SMTP_HOST: z.string().min(1),
  SMTP_USER: z.string().min(1),
  SMTP_EMAIL_PORT: z.coerce.number().int().min(1).max(65535),
  SMTP_API_KEY: z.string().min(1),
  SMTP_FROM_EMAIL: z.email(),
  SMTP_TARGET_EMAIL: z.email(),
})

const telegramEnvSchema = z.object({
  TELEGRAM_TOKEN: z.string().min(1),
  TELEGRAM_GROUP_CHAT_ID: z.string().min(1),
})

export const env = createEnv({
  server: {
    PAYLOAD_SECRET: z.string().min(1),
    DATABASE_URL: z.string(),
    CMS_SEED_ADMIN_EMAIL: z.email(),
    CMS_SEED_ADMIN_PASSWORD: z.string().min(8),
    SMTP_HOST: z.string().min(1).optional(),
    SMTP_USER: z.string().min(1).optional(),
    SMTP_EMAIL_PORT: z.coerce.number().int().min(1).max(65535).optional(),
    SMTP_API_KEY: z.string().min(1).optional(),
    SMTP_FROM_EMAIL: z.email().optional(),
    SMTP_TARGET_EMAIL: z.email().optional(),
    TELEGRAM_TOKEN: z.string().min(1).optional(),
    TELEGRAM_GROUP_CHAT_ID: z.string().min(1).optional(),
  },
  client: {},
  runtimeEnv: {
    PAYLOAD_SECRET: process.env.PAYLOAD_SECRET,
    DATABASE_URL: process.env.DATABASE_URL,
    CMS_SEED_ADMIN_EMAIL: process.env.CMS_SEED_ADMIN_EMAIL,
    CMS_SEED_ADMIN_PASSWORD: process.env.CMS_SEED_ADMIN_PASSWORD,
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_USER: process.env.SMTP_USER,
    SMTP_EMAIL_PORT: process.env.SMTP_EMAIL_PORT,
    SMTP_API_KEY: process.env.SMTP_API_KEY,
    SMTP_FROM_EMAIL: process.env.SMTP_FROM_EMAIL,
    SMTP_TARGET_EMAIL: process.env.SMTP_TARGET_EMAIL,
    TELEGRAM_TOKEN: process.env.TELEGRAM_TOKEN,
    TELEGRAM_GROUP_CHAT_ID: process.env.TELEGRAM_GROUP_CHAT_ID,
  },
})

function formatEnvError(channel: string, error: z.ZodError) {
  const variables = error.issues
    .map((issue) => issue.path.join('.'))
    .filter(Boolean)
    .join(', ')

  return `${channel} delivery is not configured correctly. Missing or invalid env: ${variables}`
}

export function getEmailEnv() {
  const parsed = emailEnvSchema.safeParse({
    SMTP_HOST: env.SMTP_HOST,
    SMTP_USER: env.SMTP_USER,
    SMTP_EMAIL_PORT: env.SMTP_EMAIL_PORT,
    SMTP_API_KEY: env.SMTP_API_KEY,
    SMTP_FROM_EMAIL: env.SMTP_FROM_EMAIL,
    SMTP_TARGET_EMAIL: env.SMTP_TARGET_EMAIL,
  })

  if (!parsed.success) {
    throw new Error(formatEnvError('Email', parsed.error))
  }

  return parsed.data
}

export function getEmailEnvIfConfigured() {
  const parsed = emailEnvSchema.safeParse({
    SMTP_HOST: env.SMTP_HOST,
    SMTP_USER: env.SMTP_USER,
    SMTP_EMAIL_PORT: env.SMTP_EMAIL_PORT,
    SMTP_API_KEY: env.SMTP_API_KEY,
    SMTP_FROM_EMAIL: env.SMTP_FROM_EMAIL,
    SMTP_TARGET_EMAIL: env.SMTP_TARGET_EMAIL,
  })

  return parsed.success ? parsed.data : null
}

export function getTelegramEnv() {
  const parsed = telegramEnvSchema.safeParse({
    TELEGRAM_TOKEN: env.TELEGRAM_TOKEN,
    TELEGRAM_GROUP_CHAT_ID: env.TELEGRAM_GROUP_CHAT_ID,
  })

  if (!parsed.success) {
    throw new Error(formatEnvError('Telegram', parsed.error))
  }

  return parsed.data
}
