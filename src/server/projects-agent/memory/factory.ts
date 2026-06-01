import ConversationPersistenceHandler from '@/server/projects-agent/memory/conversation-persistence-handler'
import { traceAgentMemory } from '@/server/projects-agent/tracers/trace-agent-memory'
import contextWindowSize from '@/server/projects-agent/memory/context-window-size'

async function createConversationPersistenceHandler({
  threadId,
  organizationCode,
  agent,
  userId,
}: {
  threadId: string
  organizationCode: string
  agent: any
  userId: number
}): Promise<ConversationPersistenceHandler> {
  const agentId = agent.id
  const conversationData = {
    threadId,
    organizationCode,
    userId,
    agentId,
  }
  const date = new Date().toISOString()
  const defaultConversationTitle = agent.title + ' - ' + date

  const messagesOption: {
    where: any
    orderBy: { position: string }
    take?: number
  } = {
    where: {
      OR: [
        { role: { in: ['assistant', 'user'] as any[] }, content: { not: '' } },
        { toolCallId: { startsWith: 'retriever_user_context_' } },
      ],
    },
    orderBy: {
      position: 'desc',
    },
  }
  if (contextWindowSize) messagesOption.take = contextWindowSize

  let conversation:
    | (Awaited<ReturnType<typeof chatbotPrisma.conversation.findUnique>> & { messages: any[] })
    | null = null

  const found = await chatbotPrisma.conversation.findUnique({
    include: {
      messages: messagesOption as any,
    },
    where: conversationData,
  })

  if (found) {
    conversation = found as typeof conversation
  }

  if (!conversation) {
    traceAgentMemory('Create new conversation')
    const created = await chatbotPrisma.conversation.create({
      data: {
        ...conversationData,
        title: defaultConversationTitle,
        titleSource: 'fallback',
      },
    })
    conversation = { ...created, messages: [] }
  }

  conversation.messages = conversation.messages?.reverse() || []

  const persistenceHandler = new ConversationPersistenceHandler(conversation)
  await persistenceHandler.getLastMessage()
  return persistenceHandler
}

export default createConversationPersistenceHandler
