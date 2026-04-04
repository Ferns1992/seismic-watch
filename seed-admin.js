const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  const hashedPassword = await bcrypt.hash('admin', 10)
  
  await prisma.user.upsert({
    where: { email: 'admin@seismicwatch.com' },
    update: {},
    create: {
      email: 'admin@seismicwatch.com',
      password: hashedPassword,
      name: 'Administrator',
      subscription: 'ENTERPRISE',
    },
  })

  console.log('Admin user created: admin@seismicwatch.com / admin')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
