-- AlterTable
ALTER TABLE "User" ADD COLUMN "bio" TEXT;

-- CreateTable
CREATE TABLE "AdminSettings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "updatedAt" DATETIME NOT NULL,
    "updatedBy" TEXT
);

-- CreateIndex
CREATE UNIQUE INDEX "AdminSettings_key_key" ON "AdminSettings"("key");

-- CreateIndex
CREATE INDEX "AdminSettings_key_idx" ON "AdminSettings"("key");
