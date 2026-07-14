import { getPayload, Payload } from 'payload'
import config from '@/payload.config'

import { afterAll, beforeAll, describe, expect, it } from 'vitest'

let payload: Payload
const authTestUser = {
  email: 'auth-config-test@example.com',
  password: 'test-admin-password',
}

describe('API', () => {
  beforeAll(async () => {
    const payloadConfig = await config
    payload = await getPayload({ config: payloadConfig })

    await payload.delete({
      collection: 'users',
      where: { email: { equals: authTestUser.email } },
    })

    await payload.create({
      collection: 'users',
      data: authTestUser,
    })
  })

  afterAll(async () => {
    await payload.delete({
      collection: 'users',
      where: { email: { equals: authTestUser.email } },
    })
  })

  it('fetches users', async () => {
    const users = await payload.find({
      collection: 'users',
    })
    expect(users).toBeDefined()
  })

  it('logs in with a password without exposing the auth token', async () => {
    const result = await payload.login({
      collection: 'users',
      data: authTestUser,
    })

    expect(result.user?.email).toBe(authTestUser.email)
    expect(result.token).toBeUndefined()
  })

  it('uses login throttling and session-backed auth', () => {
    const users = payload.config.collections.find(({ slug }) => slug === 'users')

    expect(users?.auth).toMatchObject({
      lockTime: 600_000,
      maxLoginAttempts: 5,
      removeTokenFromResponses: true,
      tokenExpiration: 7_200,
      useSessions: true,
    })
  })
})
