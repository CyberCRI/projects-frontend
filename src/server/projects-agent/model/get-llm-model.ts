import traceLangchain from '@/server/projects-agent/tracers/trace-langchain'
import { initChatModel } from 'langchain/chat_models/universal'
import { safeParseFloat } from '@/functs/string'
import { ChatOpenAI } from '@langchain/openai'

const runtimeConfig = useRuntimeConfig()
const { appLangchainModelName, appLangchainModelApiKey, appLangchainTemperature } = runtimeConfig

async function getLlmModel(agentData?: any) {
  let model

  const _temperature = safeParseFloat(agentData?.modelTemperature || appLangchainTemperature, 0.7)
  const temperature = Math.max(0, Math.min(2.0, _temperature))

  const modelName = agentData?.modelName || appLangchainModelName
  // fix circular ref bug in state
  // see https://github.com/langchain-ai/langchainjs/issues/9572
  traceLangchain(`Using model ${modelName} with temperature ${temperature}`)
  if (/^openai:/.test(modelName)) {
    model = new ChatOpenAI({
      model: modelName.replace(/^openai:/, ''),
      temperature,
      apiKey: appLangchainModelApiKey,
    })
  } else {
    // fallback for non openai models and keep for when circular ref bug is resolved
    model = await initChatModel(modelName, {
      temperature,
      apiKey: appLangchainModelApiKey,
    })
  }
  return model
}

export default getLlmModel
