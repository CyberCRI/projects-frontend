/*
  Warnings:

  - Changed the type of `userId` on the `Conversation` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Conversation" DROP COLUMN "userId",
ADD COLUMN     "userId" INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX "Conversation_organizationCode_userId_idx" ON "Conversation"("organizationCode", "userId");

-- CreateIndex
CREATE INDEX "Conversation_agentId_userId_idx" ON "Conversation"("agentId", "userId");
