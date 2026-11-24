/**
 * Extra `initChatModel` options to get reasoning / thinking out of models known to support it.
 * Sending these to a model that doesn't support them makes the provider reject the request,
 * so only well-known reasoning models are matched. Anything else returns `{}`.
 */

const OPENAI_REASONING_MODEL = /^(o\d|gpt-5)(?!.*-chat)/
const ANTHROPIC_THINKING_MODEL =
  /^claude-(3-7-sonnet|(sonnet|opus|haiku)-[4-9]|[4-9](-\d+)?-(sonnet|opus|haiku))/

export interface ReasoningOptions {
  temperature?: number
  [key: string]: any
}

export function parseModelName(modelName: string): { provider: string; model: string } {
  const idx = modelName.indexOf(':')
  if (idx > -1) {
    return { provider: modelName.substring(0, idx), model: modelName.substring(idx + 1) }
  }
  // no prefix: langchain infers the provider from the model name
  let provider = ''
  if (/^(gpt-|o\d|chatgpt-)/.test(modelName)) provider = 'openai'
  else if (modelName.startsWith('claude')) provider = 'anthropic'
  return { provider, model: modelName }
}

export default function getReasoningOptions(modelName: string): ReasoningOptions {
  const { provider, model } = parseModelName(modelName)

  if (provider === 'openai' && OPENAI_REASONING_MODEL.test(model)) {
    return {
      useResponsesApi: true,
      // TODO: make the reasoning effort (and max output token budget) configurable in the agent configuration (agentData)
      reasoning: { effort: 'medium', summary: 'auto' },
      // reasoning models only accept temperature = 1
      temperature: 1,
    }
  }

  if (provider === 'anthropic' && ANTHROPIC_THINKING_MODEL.test(model)) {
    return {
      // TODO: make the thinking effort, thinking token budget (budget_tokens) and maxTokens configurable in the agent configuration (agentData)
      thinking: { type: 'enabled', budget_tokens: 2000 },
      // budget_tokens must be < max_tokens
      maxTokens: 8000,
      // extended thinking requires temperature = 1
      temperature: 1,
    }
  }

  // TODO: add reasoning support for other providers (groq, mistralai, ...)
  return {}
}
