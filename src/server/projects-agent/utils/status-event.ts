export type StatusPhase = 'thinking' | 'retrieval' | 'skill' | 'tool'
export type StatusState = 'start' | 'end' | 'error'

export type StatusEvent = {
  role: 'meta'
  phase: StatusPhase
  status: StatusState
  toolName?: string
  // legacy field, kept for clients that only know about translated keys
  text: string
  is_done: false
  conversationId: string
}

const RETRIEVER_TOOL_NAME = 'pgvector_tool'
const SKILL_TOOL_NAME = 'load_skill'

export function phaseFromToolName(name?: string): StatusPhase {
  if (name === RETRIEVER_TOOL_NAME) return 'retrieval'
  if (name === SKILL_TOOL_NAME) return 'skill'
  return 'tool'
}

export function thinkingEvent(conversationId: string): StatusEvent {
  return {
    role: 'meta',
    phase: 'thinking',
    status: 'start',
    text: 'reasoning',
    is_done: false,
    conversationId,
  }
}

// Map a langgraph "tools" stream chunk to a status event (null if it should not be shown)
export function toolChunkToStatusEvent(chunk: any, conversationId: string): StatusEvent | null {
  let status: StatusState
  switch (chunk?.event) {
    case 'on_tool_start':
      status = 'start'
      break
    case 'on_tool_end':
      status = 'end'
      break
    case 'on_tool_error':
      status = 'error'
      break
    default:
      // on_tool_event (intermediate progress) is not worth a UI update
      return null
  }
  return {
    role: 'meta',
    phase: phaseFromToolName(chunk.name),
    status,
    toolName: chunk.name,
    text: 'fetching_data',
    is_done: false,
    conversationId,
  }
}

// Key used to skip consecutive identical events
export function statusKey(e: StatusEvent) {
  return `${e.phase}:${e.status}:${e.toolName ?? ''}`
}
