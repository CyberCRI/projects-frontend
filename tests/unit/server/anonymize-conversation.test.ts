// @vitest-environment node
import {
  REDACTED_USER_DATA,
  anonymizeConversation,
  extractUserNames,
  redactNames,
  redactPii,
  userAlias,
} from '../../../src/server/utils/anonymize-conversation'
import { describe, expect, it } from 'vitest'

const context = {
  id: 'm0',
  role: 'tool',
  toolCallId: 'retriever_user_context_1',
  content: '# info\n    - Name: Dupont Marie-Claire\n    - Job: dev',
}
const conv = (over = {}) => ({
  userId: 42,
  title: 'Help for Marie Dupont',
  lastActiveAt: '2026-01-01T10:11:12.000Z',
  messages: [
    {
      id: 'm2',
      role: 'assistant',
      content: 'Hi marie!',
      reasoning: 'user is DUPONT',
      toolCalls: [{ args: { q: 'claire@x.org' } }],
    },
    {
      id: 'm1',
      role: 'user',
      content:
        'Mail me at marie.dupont@example.com or +33 6 12 34 56 78, IBAN FR76 3000 6000 0112 3456 7890 189. Dupontel is a name.',
    },
    context,
  ],
  ...over,
})

describe('anonymizeConversation', () => {
  it('returns own conversation untouched', () => {
    const r = anonymizeConversation(conv(), 42)
    expect(r.isOwn).toBe(true)
    expect(r.userId).toBe(42)
    expect(r.messages[2].content).toBe(context.content)
  })

  it('drops userId and aliases other users', () => {
    const r: any = anonymizeConversation(conv(), 1, { salt: 's' })
    expect(r.isOwn).toBe(false)
    expect('userId' in r).toBe(false)
    expect(r.userAlias).toBe(userAlias(42, 's'))
    expect(userAlias(42, 's')).not.toBe(userAlias(43, 's'))
    expect(r.lastActiveAt).toBe('2026-01-01T10:11:12.000Z')
  })

  it('replaces user context and masks names/pii everywhere', () => {
    const r: any = anonymizeConversation(conv(), 1)
    const [a, u, c] = r.messages
    expect(c.content).toBe(REDACTED_USER_DATA)
    expect(r.title).toBe('Help for [NAME] [NAME]')
    expect(a.content).toBe('Hi [NAME]!')
    expect(a.reasoning).toBe('user is [NAME]')
    expect(a.toolCalls[0].args.q).toBe('[EMAIL]')
    expect(u.content).toContain('[EMAIL]')
    expect(u.content).toContain('[PHONE]')
    expect(u.content).toContain('[IBAN]')
    expect(u.content).toContain('[NAME]el')
    expect(JSON.stringify(r)).not.toContain('Claire')
  })

  it('uses context from outside the page (paginated)', () => {
    const c = conv({ messages: [{ id: 'm2', role: 'user', content: 'I am Dupont' }] })
    const r: any = anonymizeConversation(c, 1, { userContextContent: context.content })
    expect(r.messages[0].content).toBe('I am [NAME]')
  })

  it('still applies regex redaction without context message', () => {
    const c = conv({ messages: [{ id: 'm', role: 'user', content: 'a@b.fr, Dupont' }] })
    const r: any = anonymizeConversation(c, 1)
    expect(r.messages[0].content).toBe('[EMAIL], Dupont')
  })
})

describe('several context messages', () => {
  const pageContext = {
    id: 'p',
    role: 'tool',
    toolCallId: 'retriever_user_context_2',
    content: '# page\nsome text',
  }
  it('finds the name when the first context message has none (messages)', () => {
    const c = conv({
      messages: [pageContext, { id: 'a', role: 'user', content: 'I am Marie' }, context],
    })
    const r: any = anonymizeConversation(c, 1)
    expect(r.messages[1].content).toBe('I am [NAME]')
  })
  it('collects names from several out-of-page contexts', () => {
    const c = conv({ messages: [{ id: 'a', role: 'user', content: 'I am Claire' }] })
    const r: any = anonymizeConversation(c, 1, {
      userContextContent: [pageContext.content, context.content],
    })
    expect(r.messages[0].content).toBe('I am [NAME]')
  })
})

describe('helpers', () => {
  it('extractUserNames', () => {
    expect(extractUserNames(context.content)).toEqual(
      expect.arrayContaining(['Dupont', 'Marie', 'Claire'])
    )
    expect(extractUserNames('- Name: undefined undefined')).toEqual([])
    expect(extractUserNames('no name here')).toEqual([])
  })
  it('redactNames replaces each name, case-insensitively', () => {
    expect(redactNames('marie-claire DUPONT / Dupontel', ['Dupont', 'Marie', 'Claire'])).toBe(
      '[NAME]-[NAME] [NAME] / [NAME]el'
    )
  })
  it('handles multi-word first/last names', () => {
    const names = extractUserNames('- Name: de la Cruz Jean Pierre')
    expect(redactNames('jean pierre de la cruz', names)).toBe('[NAME] [NAME] [NAME] [NAME] [NAME]')
  })
  it('redactPii leaves dates, versions and short numbers', () => {
    const t = 'On 2026-01-01 and 01/02/2026 v1.2.3 call 112 or 12345'
    expect(redactPii(t)).toBe(t)
  })
})
