import { hash } from 'bcryptjs'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const hashedPassword = await hash('admin123', 12)
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@seismicwatch.com' },
    update: {},
    create: {
      email: 'admin@seismicwatch.com',
      password: hashedPassword,
      name: 'Administrator',
      subscription: 'ENTERPRISE',
      preferences: {
        create: {
          minMagnitude: 0,
          maxDepth: 700,
          underwaterOnly: false,
          favoriteRegions: '[]',
        },
      },
    },
  })

  console.log('Admin user created:', admin.email)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
