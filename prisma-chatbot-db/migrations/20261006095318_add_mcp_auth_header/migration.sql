-- CreateEnum
CREATE TYPE "AuthHeaderType" AS ENUM ('bearer', 'xapi');

-- AlterTable
ALTER TABLE "Mcp" ADD COLUMN     "authHeader" "AuthHeaderType";
