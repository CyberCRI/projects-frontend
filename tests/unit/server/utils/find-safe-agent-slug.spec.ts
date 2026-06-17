import type { PrismaClient } from '~~/prisma-chatbot-db/generated/prisma/client.ts'
import findSafeAgentSlug from '~/server/utils/find-safe-agent-slug'
import { describe, it, expect, vi, beforeEach } from 'vitest'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

type PrismaTx = Omit<
  PrismaClient,
  '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
>

/**
 * Build a typed Prisma transaction mock.
 * `aliasHits` / `agentHits` are sets of slugs that should appear "taken".
 * Note: both findFirst calls are now issued concurrently via Promise.all,
 * so the mock must handle parallel invocations correctly — vi.fn() does.
 */
function makeTx({
  aliasHits = new Set<string>(),
  agentHits = new Set<string>(),
}: {
  aliasHits?: Set<string>
  agentHits?: Set<string>
} = {}): PrismaTx {
  return {
    agentSlugAlias: {
      findFirst: vi.fn(({ where }: { where: { slug: string } }) =>
        Promise.resolve(aliasHits.has(where.slug) ? { slug: where.slug } : null)
      ),
    },
    agent: {
      findFirst: vi.fn(({ where }: { where: { slug: string } }) =>
        Promise.resolve(agentHits.has(where.slug) ? { slug: where.slug } : null)
      ),
    },
  } as unknown as PrismaTx
}

const AGENT_ID = 3
const ORG_CODE = 'org-abc'

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('findSafeAgentSlug', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  // ── Happy path ────────────────────────────────────────────────────────────

  it('returns the slug unchanged when it is not used by any alias or agent', async () => {
    const tx = makeTx()
    const result = await findSafeAgentSlug(tx, AGENT_ID, 'my-bot', ORG_CODE)
    expect(result).toBe('my-bot')
  })

  it('appends -1 when the base slug is already taken', async () => {
    const tx = makeTx({ agentHits: new Set(['my-bot']) })
    const result = await findSafeAgentSlug(tx, AGENT_ID, 'my-bot', ORG_CODE)
    expect(result).toBe('my-bot-1')
  })

  it('increments the suffix until a free slug is found', async () => {
    const tx = makeTx({ agentHits: new Set(['my-bot', 'my-bot-1', 'my-bot-2']) })
    const result = await findSafeAgentSlug(tx, AGENT_ID, 'my-bot', ORG_CODE)
    expect(result).toBe('my-bot-3')
  })

  // ── Alias collision ───────────────────────────────────────────────────────

  it('treats an alias hit as a conflict and tries the next suffix', async () => {
    const tx = makeTx({ aliasHits: new Set(['my-bot']) })
    const result = await findSafeAgentSlug(tx, AGENT_ID, 'my-bot', ORG_CODE)
    expect(result).toBe('my-bot-1')
  })

  it('resolves when the base slug is blocked by an alias but -1 is free', async () => {
    const tx = makeTx({ aliasHits: new Set(['my-bot', 'my-bot-1']) })
    const result = await findSafeAgentSlug(tx, AGENT_ID, 'my-bot', ORG_CODE)
    expect(result).toBe('my-bot-2')
  })

  // ── OrgCode isolation ─────────────────────────────────────────────────────

  it('passes the orgCode to both findFirst queries', async () => {
    const tx = makeTx()
    await findSafeAgentSlug(tx, AGENT_ID, 'bot', ORG_CODE)

    expect(tx.agentSlugAlias.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({ where: expect.objectContaining({ orgCode: ORG_CODE }) })
    )
    expect(tx.agent.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({ where: expect.objectContaining({ orgCode: ORG_CODE }) })
    )
  })

  // ── Self-exclusion ────────────────────────────────────────────────────────

  it('excludes the current agentId from the agent collision check', async () => {
    const tx = makeTx()
    await findSafeAgentSlug(tx, AGENT_ID, 'bot', ORG_CODE)

    expect(tx.agent.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ id: { not: AGENT_ID } }),
      })
    )
  })

  it('does not treat the agent itself as a conflict (same id excluded)', async () => {
    const tx = makeTx()
    const result = await findSafeAgentSlug(tx, AGENT_ID, 'bot', ORG_CODE)
    expect(result).toBe('bot')
  })

  // ── Query count (Promise.all → both called per round) ────────────────────

  it('makes exactly 2 DB calls when the base slug is free', async () => {
    const tx = makeTx()
    await findSafeAgentSlug(tx, AGENT_ID, 'bot', ORG_CODE)

    expect(tx.agentSlugAlias.findFirst).toHaveBeenCalledTimes(1)
    expect(tx.agent.findFirst).toHaveBeenCalledTimes(1)
  })

  it('makes 4 DB calls when the base slug is taken and -1 is free', async () => {
    const tx = makeTx({ agentHits: new Set(['bot']) })
    await findSafeAgentSlug(tx, AGENT_ID, 'bot', ORG_CODE)

    // round 1: 'bot' (taken) + round 2: 'bot-1' (free) = 2 × 2 parallel calls
    expect(tx.agentSlugAlias.findFirst).toHaveBeenCalledTimes(2)
    expect(tx.agent.findFirst).toHaveBeenCalledTimes(2)
  })

  // ── Edge cases ────────────────────────────────────────────────────────────

  it('handles slugs with special characters without altering them', async () => {
    const tx = makeTx()
    const result = await findSafeAgentSlug(tx, AGENT_ID, 'bot_v2.0', ORG_CODE)
    expect(result).toBe('bot_v2.0')
  })

  it('handles a slug that already ends in a numeric suffix', async () => {
    // 'bot-5' is taken → should produce 'bot-5-1', not 'bot-6'
    const tx = makeTx({ agentHits: new Set(['bot-5']) })
    const result = await findSafeAgentSlug(tx, AGENT_ID, 'bot-5', ORG_CODE)
    expect(result).toBe('bot-5-1')
  })
})
