-- AlterTable
ALTER TABLE "Agent" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "AgentTranslation" (
    "agentId" INTEGER NOT NULL,
    "fieldName" TEXT NOT NULL,
    "lang" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AgentTranslation_pkey" PRIMARY KEY ("agentId","fieldName","lang")
);

-- CreateIndex
CREATE INDEX "AgentTranslation_agentId_idx" ON "AgentTranslation"("agentId");

-- AddForeignKey
ALTER TABLE "AgentTranslation" ADD CONSTRAINT "AgentTranslation_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "Agent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
