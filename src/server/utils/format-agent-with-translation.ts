import type { Agent, AgentTranslation } from '~~/prisma-chatbot-db/generated/prisma/client'

export default function formatAgentWithTranslation(agent: Agent, translations: AgentTranslation[]) {
  const translationObj = [...(translations || [])].reduce((acc, translation) => {
    acc[`${translation.fieldName}_${translation.lang}`] = translation.content
    acc[`${translation.fieldName}_detected_language`] = translation.detectedLang
    return acc
  }, {})
  return { ...agent, ...translationObj }
}
