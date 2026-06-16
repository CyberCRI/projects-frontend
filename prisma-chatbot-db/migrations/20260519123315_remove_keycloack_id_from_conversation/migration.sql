/*
  Warnings:

  - You are about to drop the column `keycloackId` on the `Conversation` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Conversation_agentId_keycloackId_idx";

-- DropIndex
DROP INDEX "Conversation_organizationCode_keycloackId_idx";

-- AlterTable
ALTER TABLE "Conversation" DROP COLUMN "keycloackId";
