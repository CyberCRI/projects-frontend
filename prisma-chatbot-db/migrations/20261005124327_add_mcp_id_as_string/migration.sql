/*
  Warnings:

  - The primary key for the `Mcp` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `apiKey` on the `Mcp` table. All the data in the column will be lost.
  - The primary key for the `_AgentToMcp` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "_AgentToMcp" DROP CONSTRAINT "_AgentToMcp_B_fkey";

-- AlterTable
ALTER TABLE "Mcp" DROP CONSTRAINT "Mcp_pkey",
DROP COLUMN "apiKey",
ADD COLUMN     "apiKeyCiphertext" BYTEA,
ADD COLUMN     "apiKeyLast4" TEXT,
ADD COLUMN     "apiKeyVersion" INTEGER,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Mcp_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Mcp_id_seq";

-- AlterTable
ALTER TABLE "_AgentToMcp" DROP CONSTRAINT "_AgentToMcp_AB_pkey",
ALTER COLUMN "B" SET DATA TYPE TEXT,
ADD CONSTRAINT "_AgentToMcp_AB_pkey" PRIMARY KEY ("A", "B");

-- AddForeignKey
ALTER TABLE "_AgentToMcp" ADD CONSTRAINT "_AgentToMcp_B_fkey" FOREIGN KEY ("B") REFERENCES "Mcp"("id") ON DELETE CASCADE ON UPDATE CASCADE;
