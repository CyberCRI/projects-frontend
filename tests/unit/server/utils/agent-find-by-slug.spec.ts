import type { PrismaClient } from '~~/prisma-chatbot-db/generated/prisma/client.ts'
import agentFindBySlug from '~/server/utils/agent-find-by-slug'
import { describe, it, expect, vi, beforeEach } from 'vitest'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

type PrismaTx = Omit<
  PrismaClient,
  '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
>

// Typed mock surface — only the methods our function actually calls.
// Using vi.fn() and asserting through the mock interface avoids the
// `.mock` property not existing on the strict Prisma types.
type TxMock = {
  agentSlugAlias: {
    findFirst: ReturnType<typeof vi.fn>
    updateMany: ReturnType<typeof vi.fn>
  }
  agent: {
    findFirst: ReturnType<typeof vi.fn>
  }
}

const SLUG = 'my-bot'
const ORG_CODE = 'org-abc'
const AGENT_FIELDS = { id: true, name: true, description: true }

const MOCK_AGENT = { id: 'agent-1', name: 'My Bot', description: 'A test bot' }
const MOCK_ALIAS = { slug: SLUG, orgCode: ORG_CODE, agent: MOCK_AGENT }

function makeTx({
  aliasResult = null as object | null,
  agentResult = null as object | null,
} = {}): TxMock {
  return {
    agentSlugAlias: {
      findFirst: vi.fn().mockResolvedValue(aliasResult),
      updateMany: vi.fn().mockResolvedValue({ count: 1 }),
    },
    agent: {
      findFirst: vi.fn().mockResolvedValue(agentResult),
    },
  }
}

// Cast a TxMock to the type expected by the function under test.
function asTx(mock: TxMock): PrismaClient | PrismaTx {
  return mock as unknown as PrismaTx
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('agentFindBySlug', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  // ── Alias path ────────────────────────────────────────────────────────────

  describe('when a slug alias exists', () => {
    it('returns the agent attached to the alias', async () => {
      const tx = makeTx({ aliasResult: MOCK_ALIAS })
      const result = await agentFindBySlug(asTx(tx), SLUG, ORG_CODE, AGENT_FIELDS)
      expect(result).toEqual(MOCK_AGENT)
    })

    it('queries the alias with the correct slug and orgCode', async () => {
      const tx = makeTx({ aliasResult: MOCK_ALIAS })
      await agentFindBySlug(asTx(tx), SLUG, ORG_CODE, AGENT_FIELDS)

      expect(tx.agentSlugAlias.findFirst).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { slug: SLUG, orgCode: ORG_CODE },
        })
      )
    })

    it('includes the agent with the requested field selection', async () => {
      const tx = makeTx({ aliasResult: MOCK_ALIAS })
      await agentFindBySlug(asTx(tx), SLUG, ORG_CODE, AGENT_FIELDS)

      expect(tx.agentSlugAlias.findFirst).toHaveBeenCalledWith(
        expect.objectContaining({
          include: { agent: { select: AGENT_FIELDS } },
        })
      )
    })

    it('updates lastAccess on the alias after a hit', async () => {
      const tx = makeTx({ aliasResult: MOCK_ALIAS })
      await agentFindBySlug(asTx(tx), SLUG, ORG_CODE, AGENT_FIELDS)

      expect(tx.agentSlugAlias.updateMany).toHaveBeenCalledWith({
        where: { slug: SLUG, orgCode: ORG_CODE },
        data: { lastAccess: expect.any(Date) },
      })
    })

    it('updates lastAccess with a recent timestamp', async () => {
      const before = Date.now()
      const tx = makeTx({ aliasResult: MOCK_ALIAS })
      await agentFindBySlug(asTx(tx), SLUG, ORG_CODE, AGENT_FIELDS)
      const after = Date.now()

      // Access .mock directly on the vi.fn() — no Prisma type conflict
      const { lastAccess } = tx.agentSlugAlias.updateMany.mock.calls[0][0].data
      expect(lastAccess.getTime()).toBeGreaterThanOrEqual(before)
      expect(lastAccess.getTime()).toBeLessThanOrEqual(after)
    })

    it('does NOT query tx.agent directly when an alias is found', async () => {
      const tx = makeTx({ aliasResult: MOCK_ALIAS })
      await agentFindBySlug(asTx(tx), SLUG, ORG_CODE, AGENT_FIELDS)
      expect(tx.agent.findFirst).not.toHaveBeenCalled()
    })
  })

  describe('when no alias exists (direct agent lookup)', () => {
    it('returns the agent found directly when no alias exists', async () => {
      const tx = makeTx({ aliasResult: null, agentResult: MOCK_AGENT })
      const result = await agentFindBySlug(asTx(tx), SLUG, ORG_CODE, AGENT_FIELDS)
      expect(result).toEqual(MOCK_AGENT)
    })

    it('queries tx.agent with correct slug, orgCode and field selection', async () => {
      const tx = makeTx({ aliasResult: null, agentResult: MOCK_AGENT })
      await agentFindBySlug(asTx(tx), SLUG, ORG_CODE, AGENT_FIELDS)

      expect(tx.agent.findFirst).toHaveBeenCalledWith({
        where: { slug: SLUG, orgCode: ORG_CODE },
        select: AGENT_FIELDS,
      })
    })

    it('returns null when neither alias nor agent exists', async () => {
      const tx = makeTx({ aliasResult: null, agentResult: null })
      const result = await agentFindBySlug(asTx(tx), SLUG, ORG_CODE, AGENT_FIELDS)
      expect(result).toBeNull()
    })

    it('does NOT call updateMany when no alias exists', async () => {
      const tx = makeTx({ aliasResult: null, agentResult: MOCK_AGENT })
      await agentFindBySlug(asTx(tx), SLUG, ORG_CODE, AGENT_FIELDS)
      expect(tx.agentSlugAlias.updateMany).not.toHaveBeenCalled()
    })
  })

  // ── Shared / cross-cutting ────────────────────────────────────────────────

  describe('shared behaviour', () => {
    it('always queries agentSlugAlias.findFirst first, regardless of outcome', async () => {
      const tx = makeTx({ aliasResult: MOCK_ALIAS })
      await agentFindBySlug(asTx(tx), SLUG, ORG_CODE, AGENT_FIELDS)
      expect(tx.agentSlugAlias.findFirst).toHaveBeenCalledTimes(1)
    })

    it('propagates errors thrown by agentSlugAlias.findFirst', async () => {
      const tx = makeTx()
      tx.agentSlugAlias.findFirst.mockRejectedValue(new Error('DB connection lost'))

      await expect(agentFindBySlug(asTx(tx), SLUG, ORG_CODE, AGENT_FIELDS)).rejects.toThrow(
        'DB connection lost'
      )
    })

    it('propagates errors thrown by agentSlugAlias.updateMany', async () => {
      const tx = makeTx({ aliasResult: MOCK_ALIAS })
      tx.agentSlugAlias.updateMany.mockRejectedValue(new Error('Update failed'))

      await expect(agentFindBySlug(asTx(tx), SLUG, ORG_CODE, AGENT_FIELDS)).rejects.toThrow(
        'Update failed'
      )
    })

    it('accepts an empty agentFields selection object', async () => {
      const tx = makeTx({ aliasResult: { ...MOCK_ALIAS, agent: {} } })
      const result = await agentFindBySlug(asTx(tx), SLUG, ORG_CODE, {})
      expect(result).toEqual({})
    })

    it('works without agentFields (optional parameter)', async () => {
      const tx = makeTx({ aliasResult: MOCK_ALIAS })
      const result = await agentFindBySlug(asTx(tx), SLUG, ORG_CODE)
      expect(result).toEqual(MOCK_AGENT)
    })
  })
})
