# Lendly MVP

A peer-to-peer equipment rental platform built with Next.js 14, TypeScript, and Prisma. Mobile-first design with Hebrew (RTL) and English (LTR) support.

## Features

- 🔐 **Magic Link Authentication** - Email-only authentication with dev-friendly flow
- 📱 **Mobile-First Design** - Responsive UI optimized for mobile devices
- 🌍 **i18n Support** - Hebrew (default, RTL) and English (LTR) locales
- 🎨 **Modern UI** - Built with shadcn/ui, Tailwind CSS, and Framer Motion
- 💰 **Smart Deposit Algorithm** - Dynamic deposit calculation based on trust scores and category risk
- 📊 **Admin Dashboard** - Listings moderation, dispute resolution, user management, and metrics
- ⭐ **Trust System** - User trust scores based on completed bookings and reviews
- 📸 **Photo Management** - Image uploads and carousels for listings
- 💬 **In-App Messaging** - Real-time chat for bookings
- ✅ **Checklist System** - Pickup and return checklists with photo documentation

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Database**: SQLite (development) / PostgreSQL (production-ready)
- **ORM**: Prisma
- **i18n**: next-intl
- **Animations**: Framer Motion
- **Package Manager**: pnpm

## Prerequisites

- Node.js 20 or higher
- pnpm (install with `npm install -g pnpm`)
- Docker (optional, for containerized deployment)

## Getting Started

### Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd lendly
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL="file:./prisma/dev.db"
   NODE_ENV="development"
   ```

4. **Set up the database**
   ```bash
   # Generate Prisma Client
   pnpm db:generate
   
   # Run migrations
   pnpm db:migrate
   
   # Seed the database
   pnpm db:seed
   ```

5. **Start the development server**
   ```bash
   pnpm dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Running Locally

The app will be available at:
- **Hebrew (default)**: http://localhost:3000/he
- **English**: http://localhost:3000/en

## Environment Variables

### Required

- `DATABASE_URL` - Database connection string
  - Development: `file:./prisma/dev.db` (SQLite)
  - Production: PostgreSQL connection string

### Optional

- `NODE_ENV` - Environment mode (`development` or `production`)
- `NEXT_TELEMETRY_DISABLED` - Disable Next.js telemetry (set to `1`)

## Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm db:generate` - Generate Prisma Client
- `pnpm db:migrate` - Run database migrations
- `pnpm db:seed` - Seed the database with demo data

## Docker Deployment

### Build the Docker image

```bash
docker build -t lendly .
```

### Run the container

```bash
docker run -p 3000:3000 \
  -e DATABASE_URL="file:./prisma/dev.db" \
  -e NODE_ENV="production" \
  -v $(pwd)/prisma:/app/prisma \
  lendly
```

The app will be available at http://localhost:3000

**Note**: Make sure to run database migrations before starting:
```bash
docker run --rm -v $(pwd)/prisma:/app/prisma lendly npx prisma migrate deploy
```

### Using Docker Compose (recommended for production)

The project includes a `docker-compose.yml` file. Run with:

```bash
docker-compose up -d
```

This will:
- Build the Docker image
- Start the container on port 3000
- Mount the prisma directory for database persistence

## CI/CD

The project includes a GitHub Actions workflow (`.github/workflows/ci.yml`) that runs:
- Type checking
- Linting
- Build verification

You can also run the CI script locally:
```bash
# On Unix/macOS
chmod +x ci.sh
./ci.sh

# On Windows (using Git Bash or WSL)
bash ci.sh
```

Or run the checks individually:
```bash
pnpm typecheck  # Type checking
pnpm lint       # Linting
pnpm build      # Build verification
```

## Project Structure

```
lendly/
├── app/                    # Next.js app directory
│   ├── [locale]/          # Internationalized routes
│   └── api/                # API routes
├── components/             # React components
│   └── ui/                 # shadcn/ui components
├── lib/                    # Utility functions and server actions
│   ├── actions/            # Server actions
│   └── utils/              # Helper functions
├── messages/               # i18n translation files
├── prisma/                 # Prisma schema and migrations
└── public/                 # Static assets
```

## Database Schema

The app uses Prisma with the following main models:
- **User** - User accounts with trust scores
- **Listings** - Equipment listings
- **Booking** - Rental bookings with status tracking
- **Message** - In-app messaging
- **Review** - User reviews and ratings
- **Dispute** - Dispute management
- **Checklist** - Pickup/return documentation

## Key Features Explained

### Magic Link Authentication
- Email-only authentication (no passwords)
- Dev mode: Magic link shown in toast notification
- Production-ready: Can be extended to send real emails

### Deposit Algorithm
- Dynamic calculation based on:
  - Item value (estimated from daily rate)
  - Owner trust score
  - Renter trust score
  - Category risk factors
- Configurable via admin dashboard

### Trust Score System
- Calculated from:
  - Completed bookings
  - User reviews
  - Late returns (penalty)
  - Damage reports (penalty)
- Affects deposit amounts and search ranking

## What's Next

### Phase 1: Core Enhancements
- [ ] **Payment Integration** - Stripe/PayPal integration for deposits and rental fees
- [ ] **Real Maps & Geocoding** - Google Maps/Mapbox integration for location search and display
- [ ] **KYC Verification** - Identity verification for users (ID upload, verification flow)
- [ ] **Real Email Provider** - Replace dev magic link with SendGrid/Resend for production emails

### Phase 2: Advanced Features
- [ ] **Push Notifications** - Real-time notifications for bookings, messages, and updates
- [ ] **Advanced Search** - Full-text search, filters, and sorting
- [ ] **Calendar Integration** - Sync availability with external calendars
- [ ] **Analytics Dashboard** - Owner analytics for listing performance

### Phase 3: Scale & Security
- [ ] **PostgreSQL Migration** - Move from SQLite to PostgreSQL for production
- [ ] **Redis Caching** - Implement caching for better performance
- [ ] **Rate Limiting** - API rate limiting and abuse prevention
- [ ] **Image CDN** - Cloudinary/AWS S3 for image storage and optimization

### Phase 4: Mobile Apps
- [ ] **React Native App** - Native mobile apps for iOS and Android
- [ ] **Push Notifications** - Native push notification support
- [ ] **Offline Support** - Offline-first architecture

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is private and proprietary.

## Support

For issues and questions, please open an issue in the repository.
