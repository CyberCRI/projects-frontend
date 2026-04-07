import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@/../prisma-chatbot-db/generated/prisma/client'

const prismaClientSingleton = () => {
  const adapter = new PrismaPg({
    connectionString: process.env.NUXT_APP_CHATBOT_PROMPT_DB!,
  })
  return new PrismaClient({ adapter })
}

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>

const globalForPrisma = globalThis as unknown as {
  chatbotPrisma: PrismaClientSingleton | undefined
}

export const chatbotPrisma = globalForPrisma.chatbotPrisma ?? prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.chatbotPrisma = chatbotPrisma
}
