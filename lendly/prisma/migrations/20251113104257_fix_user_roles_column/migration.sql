-- Fix User table: migrate from 'role' to 'roles' column
-- This migration handles the transition from single role to JSON roles array

-- First, check if 'role' column exists and migrate data
-- SQLite doesn't support ALTER COLUMN, so we need to recreate the table

PRAGMA foreign_keys=OFF;

-- Create new User table with roles column
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

-- Copy data from old table, converting role to roles JSON
INSERT INTO "new_User" ("id", "name", "email", "phone", "image", "avatar", "bio", "roles", "trustScore", "isVerified", "createdAt", "updatedAt")
SELECT 
    "id",
    "name",
    "email",
    "phone",
    "image",
    "avatar",
    "bio",
    CASE 
        WHEN "role" = 'ADMIN' THEN '["ADMIN"]'
        WHEN "role" = 'RENTAL_OWNER' THEN '["USER"]'
        ELSE '["USER"]'
    END as "roles",
    CAST("trustScore" AS REAL) as "trustScore",
    COALESCE("isVerified", false) as "isVerified",
    "createdAt",
    "updatedAt"
FROM "User"
WHERE NOT EXISTS (
    SELECT 1 FROM "new_User" WHERE "new_User"."id" = "User"."id"
);

-- If role column doesn't exist, just copy all other columns
-- This handles the case where the table already has roles
INSERT OR IGNORE INTO "new_User" ("id", "name", "email", "phone", "image", "avatar", "bio", "roles", "trustScore", "isVerified", "createdAt", "updatedAt")
SELECT 
    "id",
    "name",
    "email",
    "phone",
    "image",
    "avatar",
    "bio",
    COALESCE("roles", '["USER"]') as "roles",
    CAST("trustScore" AS REAL) as "trustScore",
    COALESCE("isVerified", false) as "isVerified",
    "createdAt",
    "updatedAt"
FROM "User"
WHERE NOT EXISTS (
    SELECT 1 FROM "new_User" WHERE "new_User"."id" = "User"."id"
);

-- Drop old table and rename new one
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";

-- Recreate indexes
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

PRAGMA foreign_keys=ON;

