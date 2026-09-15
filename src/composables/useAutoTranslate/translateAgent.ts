import { translateEntity } from '~/composables/useAutoTranslate/utils'
import { Agent } from '~~/prisma-chatbot-db/generated/prisma/browser'
import { TranslatedAgent } from '~/models/agent.model'

export const translateAgent = (data: Agent, locale: string): TranslatedAgent => {
  if (!data) {
    return null
  }

  return translateEntity<TranslatedAgent>(data, ['description', 'startMessage', 'title'], locale)
}
