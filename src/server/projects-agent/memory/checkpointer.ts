import { MemorySaver } from '@langchain/langgraph'

/**
 * Minimal in-memory checkpointer, only needed so LangGraph can pause/resume on
 * `interrupt` (MCP elicitation). Real conversation memory is handled by the
 * conversation persistence handler: a thread must only live in here while an
 * interrupt is pending (see chat.ts), otherwise the full history sent on each
 * turn would be appended again to the checkpointed messages.
 *
 * Single instance per server process: a resume request must hit the same one.
 */
export const checkpointer = new MemorySaver()

const PENDING_TTL_MS = 10 * 60 * 1000
const timers = new Map<string, NodeJS.Timeout>()

export async function clearThread(threadId: string) {
  const timer = timers.get(threadId)
  if (timer) clearTimeout(timer)
  timers.delete(threadId)
  await checkpointer.deleteThread(threadId)
}

/** Keep an interrupted thread for a limited time, then drop it. */
export function expireThreadLater(threadId: string) {
  const previous = timers.get(threadId)
  if (previous) clearTimeout(previous)
  const timer = setTimeout(() => {
    timers.delete(threadId)
    checkpointer.deleteThread(threadId).catch(() => {})
  }, PENDING_TTL_MS)
  timer.unref?.()
  timers.set(threadId, timer)
}
