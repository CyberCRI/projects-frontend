import type { Agent } from '~~/prisma-chatbot-db/generated/prisma/client'
import type { InputField } from '@/server/translator'
import translationAgent from '@/server/translator'

export default async function translateFields(fieldsToTranslate: InputField[]) {
  const runtimeConfig = useRuntimeConfig()
  const {
    // appLangchainModelName,
    appLangchainModelApiKey,
    // appLangchainExtraModelApiKeys,
    // appLangchainTemperature,
  } = runtimeConfig

  if (!fieldsToTranslate?.length) return []
  const output = await translationAgent(
    fieldsToTranslate,
    ['french (fr)', 'english (en)', 'spanish (es)', 'german (de)', 'estonian (et)', 'dutch (nl)'], // TODO: restirct to used langs ?
    appLangchainModelApiKey,
    'openai:gpt-4o-mini' // TODO: use env and deafault langchain model
  )

  return output
}

export async function translateAgentFields(newAgent: Agent, oldAgent?: Agent | null) {
  const fieldsToTranslate: InputField[] = []
  // strict check against undefined cause an empty string is still something to save
  if (newAgent.title !== undefined && newAgent.title != oldAgent?.title)
    fieldsToTranslate.push({ fieldName: 'title', type: 'text', content: newAgent.title })
  if (newAgent.description !== undefined && newAgent.description != oldAgent?.description)
    fieldsToTranslate.push({
      fieldName: 'description',
      type: 'html',
      content: newAgent.description,
    })
  if (newAgent.startMessage !== undefined && newAgent.startMessage != oldAgent?.startMessage)
    fieldsToTranslate.push({
      fieldName: 'startMessage',
      type: 'markdown',
      content: newAgent.startMessage,
    })

  const translations = await translateFields(fieldsToTranslate)

  const output = await chatbotPrisma.$transaction(async (tx) => {
    if (oldAgent?.id)
      await tx.agentTranslation.deleteMany({
        where: {
          fieldName: { in: fieldsToTranslate.map((f) => f.fieldName) },
          agentId: oldAgent.id,
        },
      })
    return await tx.agentTranslation.createManyAndReturn({
      data: translations.map((f) => ({
        fieldName: f.fieldName,
        lang: f.lang,
        content: f.content,
        detectedLang: f.detectedLang,
        agentId: newAgent.id,
      })),
    })
  })

  return output
}
