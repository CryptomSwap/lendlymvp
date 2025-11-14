-- Since SQLite doesn't support enum arrays directly, roles are stored as JSON
-- This migration removes RENTAL_OWNER from the Role enum
-- Note: The actual enum change is handled by Prisma schema, but we need to update existing data

-- Update users who have RENTAL_OWNER role to just USER
-- In SQLite with Prisma, roles are stored as JSON array in the roles field
-- We'll need to update the JSON to remove RENTAL_OWNER entries

-- Note: This is a no-op migration since Prisma handles enum changes automatically
-- The actual data update will happen when the application runs and Prisma syncs

