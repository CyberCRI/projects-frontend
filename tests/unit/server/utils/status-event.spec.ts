import {
  phaseFromToolName,
  statusKey,
  thinkingEvent,
  toolChunkToStatusEvent,
} from '~/server/projects-agent/utils/status-event'
import { describe, it, expect } from 'vitest'

describe('status-event', () => {
  it('maps tool names to phases', () => {
    expect(phaseFromToolName('pgvector_tool')).toBe('retrieval')
    expect(phaseFromToolName('load_skill')).toBe('skill')
    expect(phaseFromToolName('search_projects')).toBe('tool')
  })

  it('maps tool chunks to status events', () => {
    const e = toolChunkToStatusEvent({ event: 'on_tool_start', name: 'pgvector_tool' }, 'c1')
    expect(e).toMatchObject({
      role: 'meta',
      phase: 'retrieval',
      status: 'start',
      conversationId: 'c1',
    })
    expect(toolChunkToStatusEvent({ event: 'on_tool_error', name: 'x' }, 'c1')?.status).toBe(
      'error'
    )
    expect(toolChunkToStatusEvent({ event: 'on_tool_end', name: 'x' }, 'c1')?.status).toBe('end')
  })

  it('ignores intermediate tool events', () => {
    expect(toolChunkToStatusEvent({ event: 'on_tool_event', name: 'x' }, 'c1')).toBeNull()
  })

  it('builds distinct keys for dedupe', () => {
    const a = thinkingEvent('c1')
    const b = toolChunkToStatusEvent({ event: 'on_tool_start', name: 'x' }, 'c1')!
    expect(statusKey(a)).toBe(statusKey(thinkingEvent('c1')))
    expect(statusKey(a)).not.toBe(statusKey(b))
  })
})
