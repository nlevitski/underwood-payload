import type { Payload } from 'payload'

import { env } from '@/lib/env'

import { isDuplicateError } from '../lib/is-duplicate-error'

export async function seedAdmin(payload: Payload) {
  const email = env.CMS_SEED_ADMIN_EMAIL
  const password = env.CMS_SEED_ADMIN_PASSWORD

  if (!email || !password) {
    throw new Error(
      'Admin seed credentials are missing. Set CMS_SEED_ADMIN_EMAIL and CMS_SEED_ADMIN_PASSWORD.',
    )
  }

  try {
    await payload.create({
      collection: 'users',
      data: {
        email,
        password,
      },
    })
    payload.logger.info('Admin user seeded successfully')
  } catch (error) {
    if (isDuplicateError(error, 'email')) {
      payload.logger.info('Admin user already exists')
      return
    }

    payload.logger.error({ err: error, msg: 'Unable to seed admin user' })
    throw error
  }
}
