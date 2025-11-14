# Fix for Dev Sign-In Not Working

## Issue
The error "The column `main.User.role` does not exist" occurs because the Prisma client is out of sync with the database schema.

## Solution

**You need to restart your development server** to reload the Prisma client with the updated schema.

### Steps:

1. **Stop the current dev server** (Ctrl+C in the terminal where it's running)

2. **Restart the dev server:**
   ```bash
   npm run dev
   ```

3. **Try the dev sign-in page again:**
   - Go to `/auth/dev-signin`
   - Or click "🧪 Dev Mode: Quick Sign In" on the sign-in page

## Why This Happens

The Prisma client is generated at build time and cached. When the database schema changes (like we did by removing the `role` column and adding `roles`), the running server still has the old client in memory. Restarting the server forces it to regenerate and use the new Prisma client.

## Verification

The database schema is correct - I verified it has the `roles` column. The issue is just that the running server needs to be restarted to pick up the changes.

