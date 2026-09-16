import { PrismaClient } from '~~/prisma-chatbot-db/generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const prismaClientSingleton = () => {
  const connectionString = process.env.NUXT_APP_CHATBOT_PROMPT_DB
  if (!connectionString) throw new Error('NUXT_APP_CHATBOT_PROMPT_DB is not set')
  const adapter = new PrismaPg({ connectionString })
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
