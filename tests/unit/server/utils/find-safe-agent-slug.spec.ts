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

type TxMock = {
  agentSlugAlias: {
    findFirst: ReturnType<typeof vi.fn>
    deleteMany: ReturnType<typeof vi.fn>
  }
  agent: {
    findFirst: ReturnType<typeof vi.fn>
  }
}

type AliasRecord = {
  slug: string
  agentId: number
  orgCode: string
}

/**
 * Build a typed transaction mock.
 *
 * - `aliases`  — full alias rows returned by agentSlugAlias.findFirst
 * - `agentHits`— set of slugs for which agent.findFirst returns a hit
 *                (the agent row always has a different id than AGENT_ID,
 *                 since the current agent is excluded via `id: { not: agentId }`)
 */
function makeTx({
  aliases = [] as AliasRecord[],
  agentHits = new Set<string>(),
}: {
  aliases?: AliasRecord[]
  agentHits?: Set<string>
} = {}): TxMock {
  return {
    agentSlugAlias: {
      findFirst: vi.fn(({ where }: { where: { slug: string } }) =>
        Promise.resolve(aliases.find((a) => a.slug === where.slug) ?? null)
      ),
      deleteMany: vi.fn().mockResolvedValue({}),
    },
    agent: {
      findFirst: vi.fn(({ where }: { where: { slug: string } }) =>
        Promise.resolve(agentHits.has(where.slug) ? { slug: where.slug } : null)
      ),
    },
  }
}

function asTx(mock: TxMock): PrismaClient | PrismaTx {
  return mock as unknown as PrismaTx
}

const AGENT_ID = 42 // number, matching updated signature
const OTHER_AGENT_ID = 99
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
    const result = await findSafeAgentSlug(asTx(tx), AGENT_ID, 'my-bot', ORG_CODE)
    expect(result).toBe('my-bot')
  })

  it('appends -1 when the base slug is taken by another agent', async () => {
    const tx = makeTx({ agentHits: new Set(['my-bot']) })
    const result = await findSafeAgentSlug(asTx(tx), AGENT_ID, 'my-bot', ORG_CODE)
    expect(result).toBe('my-bot-1')
  })

  it('increments the suffix until a free slug is found', async () => {
    const tx = makeTx({ agentHits: new Set(['my-bot', 'my-bot-1', 'my-bot-2']) })
    const result = await findSafeAgentSlug(asTx(tx), AGENT_ID, 'my-bot', ORG_CODE)
    expect(result).toBe('my-bot-3')
  })

  // ── Old-alias reuse (new branch) ──────────────────────────────────────────

  describe('when the slug matches an old alias belonging to the same agent', () => {
    it('returns the slug as-is (treats own alias as free)', async () => {
      const tx = makeTx({
        aliases: [{ slug: 'my-bot', agentId: AGENT_ID, orgCode: ORG_CODE }],
      })
      const result = await findSafeAgentSlug(asTx(tx), AGENT_ID, 'my-bot', ORG_CODE)
      expect(result).toBe('my-bot')
    })

    it('deletes the old alias record so it can be reused as the live slug', async () => {
      const tx = makeTx({
        aliases: [{ slug: 'my-bot', agentId: AGENT_ID, orgCode: ORG_CODE }],
      })
      await findSafeAgentSlug(asTx(tx), AGENT_ID, 'my-bot', ORG_CODE)

      expect(tx.agentSlugAlias.deleteMany).toHaveBeenCalledWith({
        where: { slug: 'my-bot', agentId: AGENT_ID, orgCode: ORG_CODE },
      })
    })

    it('deletes the alias exactly once', async () => {
      const tx = makeTx({
        aliases: [{ slug: 'my-bot', agentId: AGENT_ID, orgCode: ORG_CODE }],
      })
      await findSafeAgentSlug(asTx(tx), AGENT_ID, 'my-bot', ORG_CODE)
      expect(tx.agentSlugAlias.deleteMany).toHaveBeenCalledTimes(1)
    })

    it('does NOT increment the suffix when only the own alias blocks the slug', async () => {
      const tx = makeTx({
        aliases: [{ slug: 'my-bot', agentId: AGENT_ID, orgCode: ORG_CODE }],
      })
      const result = await findSafeAgentSlug(asTx(tx), AGENT_ID, 'my-bot', ORG_CODE)
      expect(result).not.toContain('-1')
    })
  })

  describe('when the slug matches an alias belonging to a DIFFERENT agent', () => {
    it('treats it as a conflict and appends -1', async () => {
      const tx = makeTx({
        aliases: [{ slug: 'my-bot', agentId: OTHER_AGENT_ID, orgCode: ORG_CODE }],
      })
      const result = await findSafeAgentSlug(asTx(tx), AGENT_ID, 'my-bot', ORG_CODE)
      expect(result).toBe('my-bot-1')
    })

    it("does NOT delete the other agent's alias", async () => {
      const tx = makeTx({
        aliases: [{ slug: 'my-bot', agentId: OTHER_AGENT_ID, orgCode: ORG_CODE }],
      })
      await findSafeAgentSlug(asTx(tx), AGENT_ID, 'my-bot', ORG_CODE)
      expect(tx.agentSlugAlias.deleteMany).not.toHaveBeenCalled()
    })
  })

  describe('when both an own alias and an agent collision exist for the same slug', () => {
    it('still treats the agent collision as blocking (own alias + other agent ⇒ conflict)', async () => {
      // agent.findFirst returns a hit AND alias belongs to AGENT_ID —
      // the branch checks `!agent` first, so if another agent owns that slug
      // the collision wins and a suffix is added.
      const tx = makeTx({
        aliases: [{ slug: 'my-bot', agentId: AGENT_ID, orgCode: ORG_CODE }],
        agentHits: new Set(['my-bot']),
      })
      const result = await findSafeAgentSlug(asTx(tx), AGENT_ID, 'my-bot', ORG_CODE)
      expect(result).toBe('my-bot-1')
    })

    it('does NOT delete the alias when an agent collision also exists', async () => {
      const tx = makeTx({
        aliases: [{ slug: 'my-bot', agentId: AGENT_ID, orgCode: ORG_CODE }],
        agentHits: new Set(['my-bot']),
      })
      await findSafeAgentSlug(asTx(tx), AGENT_ID, 'my-bot', ORG_CODE)
      expect(tx.agentSlugAlias.deleteMany).not.toHaveBeenCalled()
    })
  })

  // ── OrgCode isolation ─────────────────────────────────────────────────────

  it('passes the orgCode to both findFirst queries', async () => {
    const tx = makeTx()
    await findSafeAgentSlug(asTx(tx), AGENT_ID, 'bot', ORG_CODE)

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
    await findSafeAgentSlug(asTx(tx), AGENT_ID, 'bot', ORG_CODE)

    expect(tx.agent.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ id: { not: AGENT_ID } }),
      })
    )
  })

  // ── Query count ───────────────────────────────────────────────────────────

  it('makes exactly 2 DB calls when the base slug is free', async () => {
    const tx = makeTx()
    await findSafeAgentSlug(asTx(tx), AGENT_ID, 'bot', ORG_CODE)

    expect(tx.agentSlugAlias.findFirst).toHaveBeenCalledTimes(1)
    expect(tx.agent.findFirst).toHaveBeenCalledTimes(1)
  })

  it('makes 4 DB calls when base slug is taken and -1 is free', async () => {
    const tx = makeTx({ agentHits: new Set(['bot']) })
    await findSafeAgentSlug(asTx(tx), AGENT_ID, 'bot', ORG_CODE)

    expect(tx.agentSlugAlias.findFirst).toHaveBeenCalledTimes(2)
    expect(tx.agent.findFirst).toHaveBeenCalledTimes(2)
  })

  it('makes 2 DB calls + 1 delete when own alias matches (single round)', async () => {
    const tx = makeTx({
      aliases: [{ slug: 'bot', agentId: AGENT_ID, orgCode: ORG_CODE }],
    })
    await findSafeAgentSlug(asTx(tx), AGENT_ID, 'bot', ORG_CODE)

    expect(tx.agentSlugAlias.findFirst).toHaveBeenCalledTimes(1)
    expect(tx.agent.findFirst).toHaveBeenCalledTimes(1)
    expect(tx.agentSlugAlias.deleteMany).toHaveBeenCalledTimes(1)
  })

  // ── Edge cases ────────────────────────────────────────────────────────────

  it('handles slugs with special characters without altering them', async () => {
    const tx = makeTx()
    const result = await findSafeAgentSlug(asTx(tx), AGENT_ID, 'bot_v2.0', ORG_CODE)
    expect(result).toBe('bot_v2.0')
  })

  it('handles a slug that already ends in a numeric suffix', async () => {
    const tx = makeTx({ agentHits: new Set(['bot-5']) })
    const result = await findSafeAgentSlug(asTx(tx), AGENT_ID, 'bot-5', ORG_CODE)
    expect(result).toBe('bot-5-1')
  })
})
