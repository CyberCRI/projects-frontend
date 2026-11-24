import { HumanMessage, AIMessage } from '@langchain/core/messages'

// filtering is now done in db request
// TODO keeping for now
export function memoryFilter(msg) {
  // deliberatly ignore tool to mininimize context
  // TODO: if required, re-enable tool messages
  return (msg.role != 'tool' || msg.toolCallId?.startsWith('retriever_user_context')) && msg.content
}

export function memoryMapper(msg) {
  // langchanin doenst support tool message ithout correponding ai tool call
  // but we disguise user context as tool result
  // so revert back to a pseudo 'assistant' message
  // TODO: fix when context is done server side tool
  if (msg.role === 'tool' && msg.toolCallId?.startsWith('retriever_user_context')) {
    msg.role = 'assistant'
  }
  return msg.role === 'ai' || msg.role === 'assistant'
    ? new AIMessage(msg.content) // langchaine (and memory) use "content", deep-chat uses "text"
    : new HumanMessage(msg.content) // langchaine (and memory) use "content", deep-chat uses "text"
}

export function messageMapper(msg) {
  return msg.role === 'ai' || msg.role === 'assistant'
    ? new AIMessage(msg.text) // langchaine (and memory) use "content", deep-chat uses "text"
    : new HumanMessage(msg.text) // langchaine (and memory) use "content", deep-chat uses "text"
}

/**
 * Extract reasoning / thinking text from an AI message (LangChain standard
 * `contentBlocks` first, then raw provider `content` blocks).
 * Returns null when the model produced none.
 */
export function extractReasoning(message: any): string | null {
  const blocks = message?.contentBlocks ?? message?.content
  if (!Array.isArray(blocks)) return null

  const parts: string[] = []
  for (const block of blocks) {
    if (!block || typeof block !== 'object') continue
    if (block.type === 'reasoning') {
      if (typeof block.reasoning === 'string') parts.push(block.reasoning)
      // OpenAI raw format: summary: [{ type: 'summary_text', text }]
      else if (Array.isArray(block.summary))
        parts.push(block.summary.map((s: any) => s?.text ?? '').join('\n'))
    } else if (block.type === 'thinking' && typeof block.thinking === 'string') {
      parts.push(block.thinking)
    }
  }
  const reasoning = parts
    .map((p) => p.trim())
    .filter(Boolean)
    .join('\n\n')
  return reasoning || null
}
