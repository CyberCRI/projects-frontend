import { extractReasoning } from '@/server/projects-agent/memory/helpers'
import { describe, it, expect } from 'vitest'

describe('extractReasoning', () => {
  it('reads standard reasoning blocks', () => {
    const msg = {
      contentBlocks: [
        { type: 'reasoning', reasoning: ' step 1 ' },
        { type: 'text', text: 'answer' },
        { type: 'reasoning', reasoning: 'step 2' },
      ],
    }
    expect(extractReasoning(msg)).toBe('step 1\n\nstep 2')
  })

  it('reads anthropic thinking blocks from raw content', () => {
    expect(extractReasoning({ content: [{ type: 'thinking', thinking: 'hmm' }] })).toBe('hmm')
  })

  it('reads openai summary blocks', () => {
    const msg = { content: [{ type: 'reasoning', summary: [{ text: 'a' }, { text: 'b' }] }] }
    expect(extractReasoning(msg)).toBe('a\nb')
  })

  it('returns null when there is no reasoning', () => {
    expect(extractReasoning({ content: 'plain' })).toBeNull()
    expect(extractReasoning({ contentBlocks: [{ type: 'text', text: 'x' }] })).toBeNull()
    expect(extractReasoning(undefined)).toBeNull()
  })
})
