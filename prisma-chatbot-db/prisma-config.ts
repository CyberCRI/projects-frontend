import { defineConfig, env } from 'prisma/config'
import 'dotenv/config'

export default defineConfig({
  schema: 'schema.prisma',
  migrations: { path: '../prisma-chatbot-db/migrations' },
  datasource: { url: process.env.NUXT_APP_CHATBOT_PROMPT_DB },
})
