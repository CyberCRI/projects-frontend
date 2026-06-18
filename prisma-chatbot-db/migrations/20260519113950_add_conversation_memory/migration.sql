-- CreateEnum
CREATE TYPE "ConversationTitleSource" AS ENUM ('pending', 'user', 'llm', 'fallback');

-- CreateEnum
CREATE TYPE "ConversationMessageRole" AS ENUM ('user', 'assistant', 'tool', 'system');

-- CreateTable
CREATE TABLE "Conversation" (
    "id" TEXT NOT NULL,
    "threadId" TEXT NOT NULL,
    "organizationCode" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "keycloackId" TEXT NOT NULL,
    "agentId" INTEGER NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastActiveAt" TIMESTAMP(3) NOT NULL,
    "archivedAt" TIMESTAMP(3),
    "title" TEXT NOT NULL,
    "titleSource" "ConversationTitleSource" NOT NULL DEFAULT 'fallback',
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Conversation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConversationMessage" (
    "id" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "role" "ConversationMessageRole" NOT NULL,
    "content" TEXT NOT NULL,
    "toolCalls" JSONB,
    "toolCallId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "position" INTEGER NOT NULL,

    CONSTRAINT "ConversationMessage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Conversation_threadId_key" ON "Conversation"("threadId");

-- CreateIndex
CREATE INDEX "Conversation_organizationCode_userId_idx" ON "Conversation"("organizationCode", "userId");

-- CreateIndex
CREATE INDEX "Conversation_organizationCode_keycloackId_idx" ON "Conversation"("organizationCode", "keycloackId");

-- CreateIndex
CREATE INDEX "Conversation_agentId_userId_idx" ON "Conversation"("agentId", "userId");

-- CreateIndex
CREATE INDEX "Conversation_agentId_keycloackId_idx" ON "Conversation"("agentId", "keycloackId");

-- CreateIndex
CREATE INDEX "Conversation_organizationCode_agentId_idx" ON "Conversation"("organizationCode", "agentId");

-- CreateIndex
CREATE INDEX "Conversation_deletedAt_idx" ON "Conversation"("deletedAt");

-- CreateIndex
CREATE INDEX "Conversation_archivedAt_idx" ON "Conversation"("archivedAt");

-- CreateIndex
CREATE INDEX "ConversationMessage_conversationId_idx" ON "ConversationMessage"("conversationId");

-- AddForeignKey
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "Agent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConversationMessage" ADD CONSTRAINT "ConversationMessage_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
