-- CreateTable
CREATE TABLE "SideAssistant" (
    "id" SERIAL NOT NULL,
    "orgCode" TEXT NOT NULL,
    "agentId" INTEGER NOT NULL,

    CONSTRAINT "SideAssistant_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SideAssistant" ADD CONSTRAINT "SideAssistant_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "Agent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
