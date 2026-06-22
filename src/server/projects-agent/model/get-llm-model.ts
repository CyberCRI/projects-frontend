import traceLangchain from '@/server/projects-agent/tracers/trace-langchain'
import { initChatModel } from 'langchain/chat_models/universal'
import { safeParseFloat } from '@/functs/string'
// import { ChatOpenAI } from '@langchain/openai'

const runtimeConfig = useRuntimeConfig()
const {
  appLangchainModelName,
  appLangchainModelApiKey,
  appLangchainExtraModelApiKeys,
  appLangchainTemperature,
} = runtimeConfig

async function getLlmModel(agentData?: any) {
  // let model

  const _temperature = safeParseFloat(agentData?.modelTemperature || appLangchainTemperature, 0.7)
  const temperature = Math.max(0, Math.min(2.0, _temperature))

  const modelName = agentData?.modelName || appLangchainModelName
  // fix circular ref bug in state
  // see https://github.com/langchain-ai/langchainjs/issues/9572
  traceLangchain(`Using model ${modelName} with temperature ${temperature}`)

  let modelApiKey = appLangchainModelApiKey
  let providerPrefix = modelName
  const providerPrefixIndex = modelName.indexOf(':')
  if (providerPrefixIndex > -1) providerPrefix = modelName.substring(0, providerPrefixIndex)
  traceLangchain('providerPrefix', providerPrefix)
  try {
    // const extraApiKeys = JSON.parse((appLangchainExtraModelApiKeys as string) || '{}')
    const extraApiKeys = appLangchainExtraModelApiKeys || {}
    if (extraApiKeys[providerPrefix]) {
      modelApiKey = extraApiKeys[providerPrefix]
    } else {
      traceLangchain('No match in extra api key')
    }
  } catch (err) {
    traceLangchain('Error parsing extra model api keys', err)
  }

  // TODO: reasoning models like GPT 5 doesnt support temperature != 1

  // if (/^openai:/.test(modelName)) {
  //   model = new ChatOpenAI({
  //     model: modelName.replace(/^openai:/, ''),
  //     temperature,
  //     apiKey: modelApiKey,
  //   })
  // } else {
  // fallback for non openai models and keep for when circular ref bug is resolved
  const model = await initChatModel(modelName, {
    temperature,
    apiKey: modelApiKey,
  })
  // }
  return model
}

export default getLlmModel
