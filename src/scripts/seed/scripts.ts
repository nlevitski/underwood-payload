import 'dotenv/config'
import { seedAdmin } from './seeders/admin.seeder'

process.env.PAYLOAD_MIGRATING ??= 'true'

async function main() {
  try {
    await seedAdmin()
    process.exit(0)
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}

void main()
