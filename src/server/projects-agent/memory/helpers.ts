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
