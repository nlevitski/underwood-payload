import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const env = createEnv({
  server: {
    PAYLOAD_SECRET: z.string().min(1),
    DATABASE_URL: z.string(),
    CMS_SEED_ADMIN_EMAIL: z.email(),
    CMS_SEED_ADMIN_PASSWORD: z.string().min(8),
    SMTP_HOST: z.string().min(1),
    SMTP_USER: z.string().min(1),
    SMTP_EMAIL_PORT: z.coerce.number().int().min(1).max(65535),
    SMTP_API_KEY: z.string().min(1),
    SMTP_FROM_EMAIL: z.email(),
    SMTP_TARGET_EMAIL: z.email(),
    TELEGRAM_TOKEN: z.string().min(1),
    TELEGRAM_GROUP_CHAT_ID: z.string().min(1),
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
