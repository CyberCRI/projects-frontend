import getReasoningOptions from '@/server/projects-agent/model/reasoning-options'
import { describe, it, expect } from 'vitest'

describe('getReasoningOptions', () => {
  it.each(['openai:gpt-5-mini', 'openai:gpt-5', 'openai:o3', 'openai:o4-mini', 'gpt-5.1'])(
    'enables reasoning summary for openai reasoning model %s',
    (name) => {
      const opts = getReasoningOptions(name)
      expect(opts.useResponsesApi).toBe(true)
      expect(opts.reasoning).toEqual({ effort: 'medium', summary: 'auto' })
      expect(opts.temperature).toBe(1)
    }
  )

  it.each(['openai:gpt-4o-mini', 'openai:gpt-4.1', 'openai:gpt-5-chat-latest'])(
    'leaves non reasoning openai model %s untouched',
    (name) => {
      expect(getReasoningOptions(name)).toEqual({})
    }
  )

  it.each([
    'anthropic:claude-3-7-sonnet-latest',
    'anthropic:claude-sonnet-4-5',
    'anthropic:claude-opus-4-1',
    'claude-sonnet-5-5',
    'anthropic:claude-haiku-5-5',
  ])('enables thinking for anthropic model %s', (name) => {
    const opts = getReasoningOptions(name)
    expect(opts.thinking).toEqual({ type: 'enabled', budget_tokens: 2000 })
    expect(opts.temperature).toBe(1)
    expect(opts.maxTokens).toBeGreaterThan(opts.thinking.budget_tokens)
  })

  it.each(['anthropic:claude-3-5-sonnet-latest', 'anthropic:claude-3-haiku-20240307'])(
    'leaves older anthropic model %s untouched',
    (name) => {
      expect(getReasoningOptions(name)).toEqual({})
    }
  )

  it('returns nothing for other providers', () => {
    expect(getReasoningOptions('groq:llama-3.3-70b')).toEqual({})
    expect(getReasoningOptions('mistralai:mistral-large-latest')).toEqual({})
  })
})
