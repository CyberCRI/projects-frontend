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
    ['fr', 'en', 'sp', 'de', 'es', 'nl'], // TODO: restirct to used langs ?
    appLangchainModelApiKey,
    'openai:gpt-4o-mini' // TODO: use env and deafault langchain model
  )

  return output
}
