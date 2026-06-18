-- CreateTable
CREATE TABLE "AgentSlugAlias" (
    "slug" TEXT NOT NULL,
    "orgCode" TEXT NOT NULL,
    "agentId" INTEGER NOT NULL,
    "lastAccess" TIMESTAMP(3),

    CONSTRAINT "AgentSlugAlias_pkey" PRIMARY KEY ("slug","agentId","orgCode")
);

-- CreateIndex
CREATE UNIQUE INDEX "AgentSlugAlias_slug_orgCode_key" ON "AgentSlugAlias"("slug", "orgCode");

-- AddForeignKey
ALTER TABLE "AgentSlugAlias" ADD CONSTRAINT "AgentSlugAlias_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "Agent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
