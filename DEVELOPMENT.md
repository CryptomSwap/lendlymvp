# Lendly MVP - Development Setup

## Prerequisites

- Node.js 18+ 
- npm 9+
- PostgreSQL database (or Neon account)
- Expo CLI (`npm install -g @expo/cli`)
- iOS Simulator (for iOS development) or Android Studio (for Android)

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

```bash
# Copy the example environment file
cp apps/server/env.example apps/server/.env

# Edit apps/server/.env and fill in:
# - DATABASE_URL (PostgreSQL connection string)
# - JWT_SECRET (random string for JWT signing)
# - JWT_REFRESH_SECRET (random string for refresh tokens)
```

### 3. Set Up Database

```bash
# Run database migrations
npm run db:migrate

# Seed the database with test data
npm run db:seed
```

### 4. Start Development Servers

```bash
# Start both backend and mobile app
npm run dev
```

This will start:
- Backend API server on http://localhost:3001
- Expo development server (scan QR code with Expo Go app)

### 5. Open Mobile App

- Install Expo Go on your phone
- Scan the QR code from the terminal
- Or use iOS Simulator/Android Emulator

## Project Structure

```
lendly-mvp/
├── apps/
│   ├── server/          # Next.js 14 API backend
│   │   ├── src/
│   │   │   ├── app/api/ # REST API endpoints
│   │   │   ├── lib/     # Utilities (Prisma, Auth)
│   │   │   └── middleware/ # Auth & validation middleware
│   │   └── prisma/      # Database schema & migrations
│   └── mobile/          # Expo React Native app
│       ├── app/          # Expo Router screens
│       ├── src/
│       │   ├── components/ # Reusable UI components
│       │   ├── hooks/      # Custom React hooks
│       │   ├── store/      # Zustand state management
│       │   └── utils/      # Utility functions
│       └── assets/         # Images, fonts, etc.
└── packages/
    └── shared/           # Shared TypeScript types & utilities
        ├── src/
        │   ├── schemas.ts    # Zod validation schemas
        │   ├── constants.ts  # App constants
        │   ├── utils.ts      # Utility functions
        │   └── i18n.ts       # Hebrew translations
        └── dist/            # Compiled TypeScript
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh access token

### Items
- `GET /api/items` - List items with filters
- `POST /api/items` - Create new item
- `GET /api/items/:id` - Get item details
- `PUT /api/items/:id` - Update item
- `DELETE /api/items/:id` - Delete item

### Bookings
- `GET /api/bookings` - List user bookings
- `POST /api/bookings` - Create new booking
- `GET /api/bookings/:id` - Get booking details
- `PUT /api/bookings/:id` - Update booking

### Other
- `POST /api/risk/deposit` - Calculate dynamic deposit
- `POST /api/payments/manual/confirm` - Confirm manual payment
- `POST /api/safety/report-issue` - Report safety issue
- `GET /api/categories` - List approved categories
- `POST /api/categories/request` - Request new category

## Features Implemented

### ✅ Backend
- Next.js 14 with App Router
- Prisma ORM with PostgreSQL
- JWT authentication (access + refresh tokens)
- Bcrypt password hashing
- Zod validation
- REST API endpoints
- Hebrew seed data

### ✅ Mobile App
- Expo React Native with Expo Router
- Hebrew RTL support
- nativewind (Tailwind CSS for RN)
- React Query for API calls
- Zustand for state management
- Glass morphism design
- Haptic feedback
- Form validation with react-hook-form

### ✅ Shared Package
- TypeScript types and schemas
- Hebrew translations
- Utility functions (deposit calculation, currency formatting)
- Constants (categories, API endpoints)

## Test Data

The seed script creates:
- Admin user: `admin@lendly.co.il` / `admin123`
- Test users with different roles
- Sample items in Hebrew (cameras, tools, DJ equipment, camping gear)
- Categories and reviews

## Development Commands

```bash
# Install dependencies
npm install

# Start development
npm run dev

# Database operations
npm run db:migrate    # Run migrations
npm run db:seed       # Seed database
npm run db:studio     # Open Prisma Studio

# Build for production
npm run build

# Linting and type checking
npm run lint
npm run type-check

# Clean build artifacts
npm run clean
```

## Mobile App Development

### Running on Device
1. Install Expo Go app
2. Run `npm run dev` in mobile directory
3. Scan QR code with Expo Go

### Running on Simulator
```bash
# iOS Simulator
npx expo start --ios

# Android Emulator  
npx expo start --android
```

## Database Schema

Key entities:
- **User** - Users with roles (RENTER, OWNER, ADMIN)
- **Item** - Rental items with pricing, location, images
- **Booking** - Rental bookings with status tracking
- **Message** - Chat messages between users
- **Review** - Item reviews and ratings
- **CategoryRequest** - User-requested categories

## Hebrew RTL Support

- All text is in Hebrew
- RTL layout enabled with `I18nManager.forceRTL(true)`
- Text alignment and icon flipping handled automatically
- Currency formatting in Israeli Shekels (₪)

## Next Steps

1. Add more screens and components
2. Implement real-time chat
3. Add push notifications
4. Integrate payment processing
5. Add image upload functionality
6. Implement location services
7. Add offline support
8. Performance optimizations

## Troubleshooting

### Common Issues

1. **Database connection errors**: Check DATABASE_URL in .env
2. **JWT errors**: Ensure JWT_SECRET is set
3. **Mobile app not loading**: Check if backend is running on port 3001
4. **Font loading issues**: Download fonts from Google Fonts

### Getting Help

- Check the console for error messages
- Use `npm run db:studio` to inspect database
- Check Expo logs for mobile app issues
