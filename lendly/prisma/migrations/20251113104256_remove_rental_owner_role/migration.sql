/*
  Warnings:

  - You are about to drop the `Listings` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `depositRequired` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `insuranceAdded` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `evidencePhotos` on the `Dispute` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `User` table. All the data in the column will be lost.
  - You are about to alter the column `trustScore` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Float`.
  - Added the required column `deposit` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `claim` to the `Dispute` table without a default value. This is not possible if the table is not empty.
  - Added the required column `evidence` to the `Dispute` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Listings_lat_lng_idx";

-- DropIndex
DROP INDEX "Listings_category_idx";

-- DropIndex
DROP INDEX "Listings_ownerId_idx";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Listings";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Listing" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "ownerId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT NOT NULL,
    "pricePerDay" INTEGER NOT NULL,
    "deposit" INTEGER,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "photos" TEXT NOT NULL,
    "locationText" TEXT,
    "lat" REAL,
    "lng" REAL,
    "instantBook" BOOLEAN NOT NULL DEFAULT false,
    "ratingAvg" REAL NOT NULL DEFAULT 0,
    "ratingCount" INTEGER NOT NULL DEFAULT 0,
    "availability" TEXT,
    "trustWeight" REAL NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Listing_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Thread" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "bookingId" TEXT NOT NULL,
    "lastMessageAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Thread_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Rules" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT '1',
    "baseDepositPct" REAL NOT NULL DEFAULT 0.1,
    "minDeposit" INTEGER NOT NULL DEFAULT 100,
    "maxDeposit" INTEGER NOT NULL DEFAULT 10000,
    "insuranceDaily" INTEGER NOT NULL DEFAULT 50,
    "incidentMultiplier" REAL NOT NULL DEFAULT 1.5,
    "ownerTrustMultiplier" REAL NOT NULL DEFAULT 1.0,
    "renterTrustMultiplier" REAL NOT NULL DEFAULT 1.0,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "actorId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "entity" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "data" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Booking" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "listingId" TEXT NOT NULL,
    "renterId" TEXT NOT NULL,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'RESERVED',
    "deposit" INTEGER NOT NULL,
    "insurance" BOOLEAN NOT NULL DEFAULT false,
    "expiresAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Booking_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Booking_renterId_fkey" FOREIGN KEY ("renterId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Booking" ("createdAt", "endDate", "expiresAt", "id", "listingId", "renterId", "startDate", "status", "updatedAt") SELECT "createdAt", "endDate", "expiresAt", "id", "listingId", "renterId", "startDate", "status", "updatedAt" FROM "Booking";
DROP TABLE "Booking";
ALTER TABLE "new_Booking" RENAME TO "Booking";
CREATE INDEX "Booking_listingId_idx" ON "Booking"("listingId");
CREATE INDEX "Booking_renterId_idx" ON "Booking"("renterId");
CREATE INDEX "Booking_status_idx" ON "Booking"("status");
CREATE TABLE "new_Dispute" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "bookingId" TEXT NOT NULL,
    "openedById" TEXT,
    "type" TEXT,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "claim" INTEGER NOT NULL,
    "evidence" TEXT NOT NULL,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Dispute_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Dispute_openedById_fkey" FOREIGN KEY ("openedById") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Dispute" ("bookingId", "createdAt", "description", "id", "openedById", "status", "type", "updatedAt") SELECT "bookingId", "createdAt", "description", "id", "openedById", "status", "type", "updatedAt" FROM "Dispute";
DROP TABLE "Dispute";
ALTER TABLE "new_Dispute" RENAME TO "Dispute";
CREATE INDEX "Dispute_bookingId_idx" ON "Dispute"("bookingId");
CREATE INDEX "Dispute_status_idx" ON "Dispute"("status");
CREATE TABLE "new_Message" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "threadId" TEXT,
    "bookingId" TEXT NOT NULL,
    "fromUserId" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "images" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Message_threadId_fkey" FOREIGN KEY ("threadId") REFERENCES "Thread" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Message_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Message_fromUserId_fkey" FOREIGN KEY ("fromUserId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Message" ("body", "bookingId", "createdAt", "fromUserId", "id") SELECT "body", "bookingId", "createdAt", "fromUserId", "id" FROM "Message";
DROP TABLE "Message";
ALTER TABLE "new_Message" RENAME TO "Message";
CREATE INDEX "Message_bookingId_idx" ON "Message"("bookingId");
CREATE INDEX "Message_threadId_idx" ON "Message"("threadId");
CREATE INDEX "Message_createdAt_idx" ON "Message"("createdAt");
CREATE TABLE "new_Review" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "listingId" TEXT NOT NULL,
    "fromUserId" TEXT NOT NULL,
    "toUserId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "text" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Review_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Review_fromUserId_fkey" FOREIGN KEY ("fromUserId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Review_toUserId_fkey" FOREIGN KEY ("toUserId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Review" ("createdAt", "fromUserId", "id", "listingId", "rating", "text", "toUserId") SELECT "createdAt", "fromUserId", "id", "listingId", "rating", "text", "toUserId" FROM "Review";
DROP TABLE "Review";
ALTER TABLE "new_Review" RENAME TO "Review";
CREATE INDEX "Review_listingId_idx" ON "Review"("listingId");
CREATE INDEX "Review_toUserId_idx" ON "Review"("toUserId");
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "image" TEXT,
    "avatar" TEXT,
    "bio" TEXT,
    "roles" TEXT NOT NULL DEFAULT '["USER"]',
    "trustScore" REAL NOT NULL DEFAULT 0,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_User" ("avatar", "bio", "createdAt", "email", "id", "name", "phone", "trustScore", "updatedAt") SELECT "avatar", "bio", "createdAt", "email", "id", "name", "phone", "trustScore", "updatedAt" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "Listing_ownerId_idx" ON "Listing"("ownerId");

-- CreateIndex
CREATE INDEX "Listing_category_idx" ON "Listing"("category");

-- CreateIndex
CREATE INDEX "Listing_lat_lng_idx" ON "Listing"("lat", "lng");

-- CreateIndex
CREATE INDEX "Listing_status_idx" ON "Listing"("status");

-- CreateIndex
CREATE UNIQUE INDEX "Thread_bookingId_key" ON "Thread"("bookingId");

-- CreateIndex
CREATE INDEX "Thread_bookingId_idx" ON "Thread"("bookingId");

-- CreateIndex
CREATE INDEX "Thread_lastMessageAt_idx" ON "Thread"("lastMessageAt");

-- CreateIndex
CREATE INDEX "AuditLog_actorId_idx" ON "AuditLog"("actorId");

-- CreateIndex
CREATE INDEX "AuditLog_entity_entityId_idx" ON "AuditLog"("entity", "entityId");

-- CreateIndex
CREATE INDEX "AuditLog_createdAt_idx" ON "AuditLog"("createdAt");
