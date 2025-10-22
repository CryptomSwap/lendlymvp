# Lendly MVP - Peer-to-Peer Rental Marketplace

A complete Hebrew RTL mobile-first platform for renting gear (drones, cameras, tools, DJ gear, camping, etc.).

## Architecture

- **apps/server** - Next.js 14 API backend with Prisma + PostgreSQL
- **apps/mobile** - Expo React Native app with Hebrew RTL support
- **packages/shared** - Shared TypeScript types and utilities

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment:**
   ```bash
   cp apps/server/.env.example apps/server/.env
   # Fill in DATABASE_URL and JWT_SECRET
   ```

3. **Set up database:**
   ```bash
   npm run db:migrate
   npm run db:seed
   ```

4. **Start development:**
   ```bash
   npm run dev
   ```

5. **Open mobile app:**
   - Install Expo Go on your device
   - Scan QR code from terminal

## Features

- ✅ Hebrew RTL mobile-first design
- ✅ Dynamic deposit calculation
- ✅ Insurance options (basic/premium)
- ✅ Manual payment confirmation
- ✅ Pickup/return checklists
- ✅ Real-time chat
- ✅ Admin moderation tools
- ✅ Location-based search
- ✅ Category management

## Tech Stack

### Backend
- Next.js 14 (App Router)
- Prisma + PostgreSQL
- JWT Authentication
- Zod validation
- REST API

### Mobile
- Expo React Native
- Expo Router
- nativewind (Tailwind RN)
- React Query
- Zustand state management
- Hebrew RTL support

### Shared
- TypeScript
- Zod schemas
- Shared utilities

## Development

```bash
# Run all apps
npm run dev

# Run specific app
npm run dev --filter=server
npm run dev --filter=mobile

# Database operations
npm run db:migrate
npm run db:seed
npm run db:studio

# Build for production
npm run build
```

## Environment Variables

See `apps/server/.env.example` for required environment variables.

## License

Private - All rights reserved
