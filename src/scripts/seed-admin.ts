import 'dotenv/config'

import { getPayloadClient } from '@/lib/payload/client'
import { seedAdmin } from '@/scripts/seed/seeders/admin.seeder'

async function main() {
  const payload = await getPayloadClient()

  try {
    await seedAdmin(payload)
    process.exit(0)
  } catch (error) {
    payload.logger.error({ err: error, msg: 'Admin seed failed' })
    process.exit(1)
  }
}

void main()
