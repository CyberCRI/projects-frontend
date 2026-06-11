import { traceAgentMemory } from '@/server/projects-agent/tracers/trace-agent-memory'
import contextWindowSize from '@/server/projects-agent/memory/context-window-size'
import { BaseCallbackHandler } from '@langchain/core/callbacks/base'
import type { DocumentInterface } from '@langchain/core/documents'
import * as helpers from '@/server/projects-agent/memory/helpers'
import type { HumanMessage, ContentBlock } from 'langchain'
import { v4 as uuidv4 } from 'uuid'

function isEmptyHumanMessage(msg: HumanMessage): boolean {
  const c = msg.content
  if (typeof c === 'string') {
    return c.trim() === ''
  }
  // content is an array of content blocks
  if (Array.isArray(c)) {
    if (c.length === 0) return true
    return c.every((block: string | ContentBlock) => {
      if (typeof block === 'string') return block.trim() === ''
      if (block.type === 'text') return !block.text || block.text.trim() === ''
      return false // image/other blocks count as non-empty
    })
  }
  return true
}

export default class ConversationPersistenceHandler extends BaseCallbackHandler {
  name = 'ConversationPersistenceHandler'

  conversation: {
    id: string
    messages?: any[]
    [key: string]: any
  } | null = null
  lastMessage: { position: number } | null = null
  messages: any[] = []

  constructor(conversation: any) {
    super()
    this.conversation = conversation
    this.messages = conversation.messages ?? []
  }

  // async getFilteredMessages() {
  //   return (this.messages || []).filter(
  //     (message) => !(message instanceof HumanMessage && isEmptyHumanMessage(message)
  //   )
  // }

  // TODO: also update this.conversation ? test this for side effects...
  async updateConversation(tx: any, newTitle: string = '') {
    const data: { title?: string } = {}
    if (this.conversation!.titleSource === 'fallback' && newTitle) {
      data.title = newTitle
    }
    await tx.conversation.update({
      where: { id: this.conversation!.id },
      data,
    })
  }

  async getLastMessage(tx?: any) {
    const lastMessage = await (tx || chatbotPrisma).conversationMessage.findFirst({
      where: { conversationId: this.conversation!.id },
      orderBy: { position: 'desc' },
      select: { position: true },
    })
    this.lastMessage = lastMessage
  }

  async getNextPosition(tx: any) {
    await this.getLastMessage(tx)
    return (this.lastMessage?.position ?? -1) + 1
  }

  async handleUserMessage(message: any) {
    traceAgentMemory('handle user message')
    if (!this.conversation?.id) {
      traceAgentMemory('No conversation set')
      return
    }

    // TODO: move this to to updateCOnversation ?
    // Keep only Unicode letters, digits, underscore, and spaces
    const newTitle = message.content
      .replace(/[^\p{L}\p{N}_\s]/gu, '')
      .replace(/\s+/, ' ')
      .trim()
      .slice(0, 50)
    await chatbotPrisma.$transaction(async (tx) => {
      const position = await this.getNextPosition(tx)
      await tx.conversationMessage.create({
        data: {
          conversationId: this.conversation!.id,
          role: 'user',
          content: message.content,
          position,
        },
      })
      await this.updateConversation(tx, newTitle)
    })
  }

  async handleAssistantMessage(message: any) {
    await chatbotPrisma.$transaction(async (tx) => {
      const position = await this.getNextPosition(tx)
      await tx.conversationMessage.create({
        data: {
          conversationId: this.conversation!.id,
          role: 'assistant',
          content: message.text, //message.content || message.text
          toolCalls: message.tool_calls ?? null,
          position,
        },
      })
      await this.updateConversation(tx)
    })
  }

  override async handleLLMEnd(output: any) {
    traceAgentMemory('handle model end')
    if (!this.conversation?.id) {
      traceAgentMemory('No conversation set')
      return
    }
    // console.log(JSON.stringify(output.generations[0][0], null, 2))
    // const message = output.generations[0][0].message
    const message = output.generations[0][0]
    await this.handleAssistantMessage(message)
  }

  override async handleToolEnd(
    output: any,
    _runId: string,
    _parentRunId?: string,
    _tags?: string[],
    metadata?: any
  ) {
    traceAgentMemory('handle tool end')
    if (!this.conversation?.id) {
      traceAgentMemory('No conversation set')
      return
    }
    await chatbotPrisma.$transaction(async (tx) => {
      const position = await this.getNextPosition(tx)
      await tx.conversationMessage.create({
        data: {
          conversationId: this.conversation!.id,
          role: 'tool',
          content:
            typeof output === 'string' ? output : (output?.content ?? JSON.stringify(output)),
          toolCallId: metadata?.tool_call_id ?? null,
          position,
        },
      })
      await this.updateConversation(tx)
    })
  }

  async handleRetrieverMessage(content: string, runId: string) {
    if (!content) return

    await chatbotPrisma.$transaction(async (tx) => {
      const position = await this.getNextPosition(tx)
      await tx.conversationMessage.create({
        data: {
          conversationId: this.conversation!.id,
          role: 'tool',
          content,
          toolCallId: `retriever_${runId}`,
          position,
        },
      })
      await this.updateConversation(tx)
    })
  }

  override async handleRetrieverEnd(
    documents: DocumentInterface[],
    runId: string,
    _parentRunId?: string,
    _tags?: string[]
  ) {
    traceAgentMemory('handle retriever end')
    if (!this.conversation?.id) {
      traceAgentMemory('No conversation set')
      return
    }

    const content = documents
      .map((doc, i) => {
        const source = doc.metadata?.source ?? doc.metadata?.id ?? `doc_${i}`
        return `[${source}]\n${doc.pageContent}`
      })
      .join('\n\n---\n\n')
    await this.handleRetrieverMessage(content, runId)
  }

  async handleIncomingMessages(incomingMessages) {
    for (const message of incomingMessages) {
      if (message.role === 'user') {
        traceAgentMemory('Saving last human message:', message.text)
        if (message.text) await this.handleUserMessage({ content: message.text })
      } else if (message.role === 'assistant') {
        traceAgentMemory('Saving last assistant message:', message.text)
        if (message.text) await this.handleAssistantMessage({ content: message.text })
      } else if (message.role === 'retriever') {
        // handle "user profile" stuffed. TODO: make a real server side tool
        traceAgentMemory('Saving last retriever message:', message.text)
        if (message.text)
          await this.handleRetrieverMessage(message.text, `user_context_${uuidv4()}`)
      }
    }
    return [
      ...(this.messages || [])
        .filter(helpers.memoryFilter)
        .slice(-contextWindowSize)
        .map(helpers.memoryMapper),
      // provider like anthropic choke on empty human messages...
      ...incomingMessages.map(helpers.messageMapper).filter((msg) => !isEmptyHumanMessage(msg)),
    ]
  }
}
