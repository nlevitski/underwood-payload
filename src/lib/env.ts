import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const env = createEnv({
  server: {
    PAYLOAD_SECRET: z.string().min(1),
    DATABASE_URL: z.string(),
    CMS_SEED_ADMIN_EMAIL: z.email(),
    CMS_SEED_ADMIN_PASSWORD: z.string().min(8),
  },
  client: {},
  runtimeEnv: {
    PAYLOAD_SECRET: process.env.PAYLOAD_SECRET,
    DATABASE_URL: process.env.DATABASE_URL,
    CMS_SEED_ADMIN_EMAIL: process.env.CMS_SEED_ADMIN_EMAIL,
    CMS_SEED_ADMIN_PASSWORD: process.env.CMS_SEED_ADMIN_PASSWORD,
  },
})
