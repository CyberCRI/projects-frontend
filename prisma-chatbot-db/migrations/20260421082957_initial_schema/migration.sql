-- CreateEnum
CREATE TYPE "TransportType" AS ENUM ('sse', 'stdio', 'http');

-- CreateTable
CREATE TABLE "Prompt" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "orgCode" TEXT NOT NULL,

    CONSTRAINT "Prompt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PromptContent" (
    "version" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "promptId" INTEGER NOT NULL,

    CONSTRAINT "PromptContent_pkey" PRIMARY KEY ("promptId","version")
);

-- CreateTable
CREATE TABLE "Skill" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "orgCode" TEXT NOT NULL,

    CONSTRAINT "Skill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SkillContent" (
    "version" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "skillId" INTEGER NOT NULL,

    CONSTRAINT "SkillContent_pkey" PRIMARY KEY ("skillId","version")
);

-- CreateTable
CREATE TABLE "Mcp" (
    "id" SERIAL NOT NULL,
    "orgCode" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "transport" "TransportType" NOT NULL,
    "url" TEXT NOT NULL,
    "command" TEXT NOT NULL,
    "args" TEXT NOT NULL,

    CONSTRAINT "Mcp_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Agent" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "orgCode" TEXT NOT NULL,
    "modelName" TEXT NOT NULL DEFAULT '',
    "modelTemperature" TEXT NOT NULL DEFAULT '0.7',
    "isEnabled" BOOLEAN NOT NULL DEFAULT false,
    "promptId" INTEGER NOT NULL,
    "promptVersion" INTEGER NOT NULL,
    "useProjectsMcp" BOOLEAN NOT NULL DEFAULT false,
    "useProfileData" BOOLEAN NOT NULL DEFAULT false,
    "useLatestPromptVersion" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Agent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AgentSkillContent" (
    "skillId" INTEGER NOT NULL,
    "skillVersion" INTEGER NOT NULL,
    "agentId" INTEGER NOT NULL,
    "useLatestSkillVersion" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "AgentSkillContent_pkey" PRIMARY KEY ("skillId","skillVersion","agentId")
);

-- CreateTable
CREATE TABLE "AgentDocument" (
    "vectorStoreKey" TEXT NOT NULL,
    "documentTitle" TEXT NOT NULL,
    "agentId" INTEGER NOT NULL,

    CONSTRAINT "AgentDocument_pkey" PRIMARY KEY ("vectorStoreKey","documentTitle","agentId")
);

-- CreateTable
CREATE TABLE "_AgentToMcp" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_AgentToMcp_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "Prompt_title_orgCode_idx" ON "Prompt"("title", "orgCode");

-- CreateIndex
CREATE UNIQUE INDEX "Prompt_title_orgCode_key" ON "Prompt"("title", "orgCode");

-- CreateIndex
CREATE INDEX "PromptContent_promptId_version_idx" ON "PromptContent"("promptId", "version");

-- CreateIndex
CREATE INDEX "Skill_title_orgCode_idx" ON "Skill"("title", "orgCode");

-- CreateIndex
CREATE UNIQUE INDEX "Skill_title_orgCode_key" ON "Skill"("title", "orgCode");

-- CreateIndex
CREATE INDEX "SkillContent_skillId_version_idx" ON "SkillContent"("skillId", "version");

-- CreateIndex
CREATE UNIQUE INDEX "Mcp_title_orgCode_key" ON "Mcp"("title", "orgCode");

-- CreateIndex
CREATE INDEX "Agent_title_orgCode_idx" ON "Agent"("title", "orgCode");

-- CreateIndex
CREATE INDEX "Agent_slug_orgCode_idx" ON "Agent"("slug", "orgCode");

-- CreateIndex
CREATE UNIQUE INDEX "Agent_title_orgCode_key" ON "Agent"("title", "orgCode");

-- CreateIndex
CREATE UNIQUE INDEX "Agent_slug_orgCode_key" ON "Agent"("slug", "orgCode");

-- CreateIndex
CREATE INDEX "_AgentToMcp_B_index" ON "_AgentToMcp"("B");

-- AddForeignKey
ALTER TABLE "PromptContent" ADD CONSTRAINT "PromptContent_promptId_fkey" FOREIGN KEY ("promptId") REFERENCES "Prompt"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SkillContent" ADD CONSTRAINT "SkillContent_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "Skill"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Agent" ADD CONSTRAINT "Agent_promptId_promptVersion_fkey" FOREIGN KEY ("promptId", "promptVersion") REFERENCES "PromptContent"("promptId", "version") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AgentSkillContent" ADD CONSTRAINT "AgentSkillContent_skillId_skillVersion_fkey" FOREIGN KEY ("skillId", "skillVersion") REFERENCES "SkillContent"("skillId", "version") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AgentSkillContent" ADD CONSTRAINT "AgentSkillContent_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "Agent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AgentDocument" ADD CONSTRAINT "AgentDocument_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "Agent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AgentToMcp" ADD CONSTRAINT "_AgentToMcp_A_fkey" FOREIGN KEY ("A") REFERENCES "Agent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AgentToMcp" ADD CONSTRAINT "_AgentToMcp_B_fkey" FOREIGN KEY ("B") REFERENCES "Mcp"("id") ON DELETE CASCADE ON UPDATE CASCADE;
