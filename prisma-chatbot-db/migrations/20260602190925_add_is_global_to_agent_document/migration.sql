/*
  Warnings:

  - The primary key for the `AgentDocument` table will be changed. If it partially fails, the table could be left without primary key constraint.

  ---> manual mmigration here
*/
-- Step 1: Add the column as nullable first (no default yet on PK columns)
ALTER TABLE "AgentDocument" ADD COLUMN "isGlobal" BOOLEAN;

-- Step 2: Backfill existing rows
UPDATE "AgentDocument" SET "isGlobal" = false;

-- Step 3: Make it NOT NULL with default now that all rows are filled
ALTER TABLE "AgentDocument" ALTER COLUMN "isGlobal" SET NOT NULL;
ALTER TABLE "AgentDocument" ALTER COLUMN "isGlobal" SET DEFAULT false;

-- Step 4: Drop old primary key
ALTER TABLE "AgentDocument" DROP CONSTRAINT "AgentDocument_pkey";

-- Step 5: Add new primary key
ALTER TABLE "AgentDocument" ADD CONSTRAINT "AgentDocument_pkey"
  PRIMARY KEY ("vectorStoreKey", "documentTitle", "agentId", "isGlobal");
