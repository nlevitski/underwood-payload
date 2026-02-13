import config from '@/payload.config'
import { getPayload } from 'payload'
import { isDuplicateError } from '../../../lib/is-duplicate-error'

const email = process.env.CMS_SEED_ADMIN_EMAIL || ''
const password = process.env.CMS_SEED_ADMIN_PASSWORD || ''

export async function seedAdmin() {
  const payload = await getPayload({ config })
  try {
    const response = await payload.create({
      collection: 'users',
      data: {
        email,
        password,
      },
    })
    console.log('Admin seeded successfully:', response)
  } catch (error) {
    if (isDuplicateError(error, 'email')) {
      console.log('Admin user already exists')
      return
    } else {
      console.error('Error seeding admin:', JSON.stringify(error, null, 2))
    }
  }
}
