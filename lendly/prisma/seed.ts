/**
 * Lendly Mock Data Seed Script
 * 
 * This script generates comprehensive mock data for end-to-end testing of the Lendly app.
 * It creates realistic users, listings, bookings, reviews, and messages that simulate
 * a production-like environment.
 * 
 * HOW TO RUN:
 *   npm run db:seed
 *   or
 *   npx tsx prisma/seed.ts
 * 
 * DATA STRUCTURE:
 *   - 55 users (mix of renters and lenders, Hebrew + English names)
 *   - 95 listings (distributed across categories and cities, varied rating profiles)
 *   - 65 bookings (various statuses: upcoming, active, completed, disputed, cancelled)
 *   - 40 reviews (for completed bookings, mixed ratings)
 *   - 25 conversations with 3-10 messages each
 *   - Disputes for disputed bookings
 * 
 * COVERED FLOWS:
 *   - Renter dashboard: upcoming, in-progress, past rentals
 *   - Lender dashboard: active listings, items rented out, pending requests
 *   - Search: by city, category, price, rating
 *   - Listing detail: highly rated, few ratings, new listings
 *   - Booking flow: with/without insurance, high/low deposits
 *   - Reviews: user ratings and recent reviews
 *   - Chat: conversations before, during, and after rentals
 */

import { PrismaClient, BookingStatus, ListingStatus, Role, DisputeType, DisputeStatus } from "@prisma/client";
import { calculateInsuranceQuote, type ItemCategory } from "../lib/insurance/riskEngine";

const prisma = new PrismaClient();

// Helper to serialize roles for database
function serializeRoles(roles: Role[]): string {
  return JSON.stringify(roles);
}

// Helper to get random element from array
function randomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

// Helper to get random number in range
function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Helper to get random float in range
function randomFloat(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

// Helper to get random date in range
function randomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

// Helper to get date N days from now
function daysFromNow(days: number): Date {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
}

// Helper to get date N days ago
function daysAgo(days: number): Date {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
}

// Hebrew first names
const hebrewFirstNames = [
  "אלון", "שרה", "דוד", "מאיה", "תום", "נועה", "יואב", "מיכל", "עמית", "טל",
  "רונן", "יעל", "אור", "ליאור", "דני", "רותם", "איתי", "שירה", "אורן", "עדי",
  "רועי", "חן", "אליאור", "מור", "ארז", "ליה", "אורי", "ניב", "אליעזר", "רומי",
  "יונתן", "ענבל", "אליה", "מיקה", "איתן", "ליאן", "אלירן", "שי", "אלינור", "רינת"
];

// Hebrew last names
const hebrewLastNames = [
  "כהן", "לוי", "ישראלי", "אברהם", "רוזן", "דוד", "מזרחי", "בן דוד", "עזרא", "חדד",
  "שלום", "יעקב", "משה", "אליהו", "יוסף", "דניאל", "שמעון", "רחמים", "יצחק", "אהרון"
];

// English first names (for bilingual testing)
const englishFirstNames = [
  "Alex", "Sarah", "David", "Maya", "Tom", "Noa", "John", "Rachel", "Michael", "Emma"
];

// English last names
const englishLastNames = [
  "Cohen", "Levy", "Smith", "Johnson", "Brown", "Davis", "Miller", "Wilson", "Moore", "Taylor"
];

// Israeli cities with coordinates
const cities = [
  { name: "תל אביב", lat: 32.0853, lng: 34.7818 },
  { name: "ירושלים", lat: 31.7683, lng: 35.2137 },
  { name: "חיפה", lat: 32.7940, lng: 34.9896 },
  { name: "רמת גן", lat: 32.0820, lng: 34.8138 },
  { name: "גוש דן", lat: 32.0853, lng: 34.7818 },
  { name: "חולון", lat: 32.0103, lng: 34.7792 },
  { name: "באר שבע", lat: 31.2530, lng: 34.7915 },
  { name: "אשדוד", lat: 31.8044, lng: 34.6553 },
  { name: "נתניה", lat: 32.3320, lng: 34.8550 },
  { name: "הרצליה", lat: 32.1644, lng: 34.8447 }
];

// Categories
const categories = [
  "CAMERA", "DRONE", "TOOLS", "DJ_GEAR", "CAMPING", "SPORT", "MUSIC", "OTHER"
] as const;

// Category-specific item templates
const itemTemplates: Record<string, { titles: string[]; descriptions: string[]; priceRange: [number, number] }> = {
  CAMERA: {
    titles: [
      "מצלמת DSLR קנון 5D Mark IV",
      "מצלמת מירורלס סוני A7III",
      "מצלמת אקשן GoPro Hero 12",
      "מצלמת קומפקטית קנון G7X",
      "מצלמת וידאו Panasonic GH5"
    ],
    descriptions: [
      "מצלמה מקצועית עם חיישן full frame, מצוינת לצילומי פורטרטים ונופים",
      "מצלמה קומפקטית עם ביצועים מעולים, מתאימה לצילומי וידאו וצילום סטילס",
      "מצלמת אקשן עמידה למים, מושלמת לספורט אקסטרים וצילום תת-ימי",
      "מצלמה קומפקטית עם זום אופטי, נוחה לנשיאה ולצילומי יומיום",
      "מצלמת וידאו מקצועית עם צילום 4K, מתאימה ליצירת תוכן"
    ],
    priceRange: [150, 500]
  },
  DRONE: {
    titles: [
      "רחפן DJI Mini 3 Pro",
      "רחפן DJI Mavic Air 2",
      "רחפן DJI Phantom 4",
      "רחפן DJI Mini 2",
      "רחפן DJI FPV"
    ],
    descriptions: [
      "רחפן קומפקטי עם מצלמה 4K, מושלם לצילומי אוויר מקצועיים",
      "רחפן מתקדם עם טווח טיסה ארוך וצילום באיכות גבוהה",
      "רחפן מקצועי עם מצלמה משופרת, מתאים לצילומי קולנוע",
      "רחפן קל ונוח לשימוש, מושלם למתחילים",
      "רחפן FPV עם מצלמת VR, חווית טיסה מהנה"
    ],
    priceRange: [200, 600]
  },
  TOOLS: {
    titles: [
      "מקדחה אלחוטית Bosch",
      "מסור עגול Makita",
      "מברגה חשמלית DeWalt",
      "משחזת זוויתית Bosch",
      "מפלס לייזר Leica"
    ],
    descriptions: [
      "מקדחה חזקה עם סוללה נטענת, מתאימה לעבודות בית וגינה",
      "מסור מקצועי עם להב חד, מושלם לחיתוך עץ ומתכת",
      "מברגה קומפקטית עם מומנט גבוה, נוחה לעבודות שונות",
      "משחזת עם דיסקים להחלפה, מתאימה לשיוף וליטוש",
      "מפלס לייזר מדויק, מושלם לעבודות בנייה והתקנה"
    ],
    priceRange: [50, 200]
  },
  DJ_GEAR: {
    titles: [
      "מיקסר DJ Pioneer DDJ-1000",
      "רמקול JBL EON615",
      "מיקרופון Shure SM58",
      "קונסולת DJ Numark",
      "סאבוופר Yamaha"
    ],
    descriptions: [
      "מיקסר DJ מקצועי עם 4 ערוצים, מושלם לאירועים",
      "רמקול פעיל עם הספק גבוה, מתאים לאירועים חיצוניים",
      "מיקרופון דינמי איכותי, מתאים לשירה והופעות",
      "קונסולה מתקדמת עם אפקטים, נוחה לשימוש",
      "סאבוופר חזק עם בס עמוק, מושלם למסיבות"
    ],
    priceRange: [100, 400]
  },
  CAMPING: {
    titles: [
      "אוהל MSR Hubba Hubba",
      "שק שינה North Face",
      "פרימוס קמפינג",
      "כיסא קמפינג מתקפל",
      "קירור תרמי Coleman"
    ],
    descriptions: [
      "אוהל קל משקל לשתי אנשים, עמיד למים ונוח להקמה",
      "שק שינה חם ומבודד, מתאים לטמפרטורות נמוכות",
      "פרימוס גז קומפקטי, מושלם לבישול בקמפינג",
      "כיסא נוח וקומפקטי, מתקפל בקלות",
      "קירור מבודד תרמית, שומר על קור למשך ימים"
    ],
    priceRange: [30, 120]
  },
  SPORT: {
    titles: [
      "אופני הרים Trek",
      "גלשן גלים",
      "ציוד סקי",
      "מגלשיים Rollerblade",
      "ציוד יוגה"
    ],
    descriptions: [
      "אופני הרים איכותיים עם הילוכים, מושלמים לטיולים",
      "גלשן גלים מקצועי, מתאים לגולשים מתקדמים",
      "ציוד סקי מלא כולל מגלשיים ומקלות, במצב מעולה",
      "מגלשיים רולרבלייד נוחות, מתאימות לכל הגילאים",
      "ציוד יוגה מלא כולל מזרן, בלוקים וחגורה"
    ],
    priceRange: [40, 180]
  },
  MUSIC: {
    titles: [
      "גיטרה אקוסטית Yamaha",
      "קלידים Casio",
      "תופים אלקטרוניים Roland",
      "כינור",
      "סקסופון"
    ],
    descriptions: [
      "גיטרה אקוסטית איכותית עם צליל עשיר, במצב מעולה",
      "קלידים דיגיטליים עם 88 קלידים, מתאימים למתחילים ומתקדמים",
      "תופים אלקטרוניים עם חיישנים רגישים, כולל מטרונום",
      "כינור קלאסי איכותי, מתאים לנגינה מקצועית",
      "סקסופון טנור במצב מעולה, כולל תיק נשיאה"
    ],
    priceRange: [60, 250]
  },
  OTHER: {
    titles: [
      "מקרן BenQ",
      "מסך גדול 75 אינץ'",
      "מצלמת אבטחה",
      "מכונת קפה מקצועית",
      "מכשיר ניקוי קיטור"
    ],
    descriptions: [
      "מקרן Full HD עם בהירות גבוהה, מושלם להקרנות",
      "מסך טלוויזיה גדול עם רזולוציה 4K, במצב מעולה",
      "מצלמת אבטחה עם חיבור WiFi, כולל הקלטה",
      "מכונת אספרסו מקצועית, מושלמת לחובבי קפה",
      "מכשיר ניקוי קיטור רב עוצמה, מתאים לכל המשטחים"
    ],
    priceRange: [80, 300]
  }
};

// Review comments in Hebrew
const reviewComments = [
  "מוצר מעולה, בדיוק כמו שתואר. בעלים מקצועי ומסביר פנים.",
  "הכל עבד מצוין, מומלץ בחום!",
  "שירות מהיר ואמין, המוצר במצב מעולה.",
  "חוויה טובה, בעלים זמין ומועיל.",
  "מוצר איכותי, שירות מקצועי. אמליץ לחברים.",
  "הכל תקין, בעלים אדיב. תודה!",
  "מוצר מעולה במחיר הוגן, שירות מצוין.",
  "חוויה חיובית, בעלים מקצועי ואמין.",
  "מוצר במצב טוב, בעלים זמין ומועיל.",
  "שירות מהיר, מוצר איכותי. מומלץ!",
  "חוויה טובה, בעלים מקצועי ומסביר פנים.",
  "מוצר מעולה, בדיוק כמו שתואר. תודה!",
  "שירות מצוין, מוצר איכותי. אמליץ.",
  "הכל עבד מצוין, בעלים אדיב ומועיל.",
  "מוצר במצב מעולה, שירות מקצועי.",
  "חוויה חיובית, בעלים אמין וזמין.",
  "מוצר איכותי במחיר הוגן, שירות מצוין.",
  "הכל תקין, בעלים מקצועי. תודה!",
  "מוצר מעולה, שירות מהיר ואמין.",
  "חוויה טובה, בעלים מסביר פנים ומועיל."
];

// Message templates in Hebrew - categorized by conversation phase
const messageTemplates = {
  initial: [
    "שלום, אני מעוניין לשכור את {item}. מתי זה זמין?",
    "היי, מתי נוכל להיפגש לאיסוף?",
    "שלום, האם המוצר זמין לתאריכים {dates}?",
    "היי, יש לי שאלה לגבי {item} - האם הוא כולל...?",
    "שלום, אני מעוניין לשכור את {item} למשך {days} ימים."
  ],
  pickup: [
    "אני אגיע בעוד חצי שעה, זה בסדר?",
    "מושלם, נתראה מחר בשעה 10.",
    "איפה נוח לך שנפגש לאיסוף?",
    "אני בדרך, אהיה בעוד 20 דקות.",
    "תודה, נתראה בשעה 14:00."
  ],
  during: [
    "המוצר עובד מצוין, תודה רבה.",
    "יש לי שאלה קטנה - איך משתמשים ב...?",
    "הכל תקין, המוצר במצב מעולה.",
    "תודה על העזרה!",
    "המוצר עובד בדיוק כמו שציפיתי."
  ],
  return: [
    "הכל תקין, אחזיר מחר בבוקר.",
    "מתי נוח לך שאחזיר את המוצר?",
    "אני אחזיר את המוצר היום אחר הצהריים.",
    "תודה רבה! המוצר מעולה.",
    "המוצר במצב מעולה, אחזיר אותו היום."
  ],
  after: [
    "תודה על השירות המהיר!",
    "חוויה מעולה, אמליץ לחברים.",
    "תודה רבה, הכל היה מושלם.",
    "שירות מקצועי, תודה!",
    "מוצר מעולה, תודה על הכל."
  ]
};

/**
 * Calculate deposit and insurance using the risk engine
 */
function calculateDepositAndInsurance(
  listing: { pricePerDay: number; category: string },
  renter: { trustScore: number; totalRentalsAsRenter: number },
  owner: { trustScore: number },
  rentalDays: number
): { deposit: number; insuranceFee: number; insuranceAdded: boolean } {
  try {
    // Map category to ItemCategory type
    const categoryMap: Record<string, ItemCategory> = {
      CAMERA: "camera",
      DRONE: "drone",
      TOOLS: "tools",
      DJ_GEAR: "dj",
      CAMPING: "camping",
      SPORT: "sports",
      MUSIC: "other",
      OTHER: "other"
    };

    const itemCategory = categoryMap[listing.category] || "other";
    const itemValue = listing.pricePerDay * 20; // Estimate item value

    const quote = calculateInsuranceQuote({
      itemId: "seed",
      itemCategory,
      itemValue,
      dailyPrice: listing.pricePerDay,
      rentalDays,
      renterTrustScore: renter.trustScore,
      ownerTrustScore: owner.trustScore,
      renterCompletedRentals: renter.totalRentalsAsRenter,
      renterIncidents: 0,
      itemIncidents: 0,
      locationRiskIndex: randomFloat(0.1, 0.5)
    });

    // Randomly decide if insurance was added (70% chance)
    const insuranceAdded = Math.random() > 0.3;

    return {
      deposit: quote.securityDeposit,
      insuranceFee: insuranceAdded ? quote.protectionFee : 0,
      insuranceAdded
    };
  } catch (error) {
    // Fallback calculation if risk engine fails
    const baseDeposit = listing.pricePerDay * 2;
    const insuranceAdded = Math.random() > 0.3;
    return {
      deposit: Math.round(baseDeposit / 10) * 10,
      insuranceFee: insuranceAdded ? Math.round(listing.pricePerDay * 0.1) : 0,
      insuranceAdded
    };
  }
}

async function main() {
  console.log("🌱 Starting seed...");

  // Clear existing data
  console.log("🧹 Clearing existing data...");
  await prisma.message.deleteMany();
  await prisma.thread.deleteMany();
  await prisma.review.deleteMany();
  await prisma.checklist.deleteMany();
  await prisma.dispute.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.listing.deleteMany();
  await prisma.user.deleteMany();

  // Generate Users (55 users)
  console.log("👥 Creating users...");
  const users = [];
  for (let i = 0; i < 55; i++) {
    const isEnglish = i < 5; // First 5 users have English names
    const firstName = isEnglish
      ? randomElement(englishFirstNames)
      : randomElement(hebrewFirstNames);
    const lastName = isEnglish
      ? randomElement(englishLastNames)
      : randomElement(hebrewLastNames);
    const fullName = `${firstName} ${lastName}`;

    const city = randomElement(cities);
    const trustScore = randomInt(40, 100);
    const isVerified = trustScore > 70 || Math.random() > 0.3;
    const totalRentalsAsRenter = randomInt(0, 25);
    const totalRentalsAsLender = randomInt(0, 15);

    const user = await prisma.user.create({
      data: {
        name: fullName,
        email: `user${i + 1}@lendly.co.il`,
        phone: `+972-50-${randomInt(100, 999)}-${randomInt(1000, 9999)}`,
        avatar: "/person.png",
        roles: serializeRoles(["USER"]),
        trustScore,
        isVerified,
        createdAt: randomDate(daysAgo(180), daysAgo(1))
      }
    });

    users.push({
      ...user,
      totalRentalsAsRenter,
      totalRentalsAsLender,
      city: city.name,
      lat: city.lat,
      lng: city.lng
    });
  }

  // Generate Listings (95 listings) with varied rating profiles
  console.log("📦 Creating listings...");
  const listings = [];
  for (let i = 0; i < 95; i++) {
    const owner = randomElement(users);
    const category = randomElement(categories);
    const template = itemTemplates[category];
    const title = randomElement(template.titles);
    const description = randomElement(template.descriptions);
    const [minPrice, maxPrice] = template.priceRange;
    const pricePerDay = randomInt(minPrice, maxPrice);
    const city = randomElement(cities);
    
    // Create varied rating profiles:
    // - 30% highly rated (4.5-5.0, 10-30 reviews)
    // - 40% well-rated (4.0-4.5, 5-15 reviews)
    // - 20% new/few ratings (3.5-4.5, 0-5 reviews)
    // - 10% lower rated (3.0-4.0, 3-10 reviews)
    const ratingProfile = Math.random();
    let ratingAvg: number;
    let ratingCount: number;
    if (ratingProfile < 0.3) {
      ratingAvg = randomFloat(4.5, 5.0);
      ratingCount = randomInt(10, 30);
    } else if (ratingProfile < 0.7) {
      ratingAvg = randomFloat(4.0, 4.5);
      ratingCount = randomInt(5, 15);
    } else if (ratingProfile < 0.9) {
      ratingAvg = randomFloat(3.5, 4.5);
      ratingCount = randomInt(0, 5);
    } else {
      ratingAvg = randomFloat(3.0, 4.0);
      ratingCount = randomInt(3, 10);
    }
    
    const status = Math.random() > 0.1 ? ListingStatus.APPROVED : ListingStatus.PAUSED;
    const instantBook = Math.random() > 0.4;

    // Calculate deposit (simplified)
    const deposit = Math.round((pricePerDay * 20 * 0.35) / 10) * 10;

    const listing = await prisma.listing.create({
      data: {
        ownerId: owner.id,
        title,
        description,
        category,
        pricePerDay,
        deposit,
        status,
        photos: JSON.stringify(["/Cam.png", "/drone.png", "/drill.png"]),
        locationText: city.name,
        lat: city.lat + randomFloat(-0.05, 0.05),
        lng: city.lng + randomFloat(-0.05, 0.05),
        instantBook,
        ratingAvg,
        ratingCount,
        createdAt: randomDate(daysAgo(120), daysAgo(1))
      }
    });

    listings.push(listing);
  }

  // Generate Bookings (65 bookings)
  console.log("📅 Creating bookings...");
  const bookings = [];
  const now = new Date();
  
  // Status distribution: 15% reserved, 20% confirmed (includes active), 45% completed, 5% disputed, 10% cancelled, 5% draft
  const statusWeights: [BookingStatus, number][] = [
    [BookingStatus.RESERVED, 15],
    [BookingStatus.CONFIRMED, 20], // Includes "in use" bookings
    [BookingStatus.COMPLETED, 45],
    [BookingStatus.CANCELLED, 10],
    [BookingStatus.DRAFT, 5]
  ];

  for (let i = 0; i < 65; i++) {
    const listing = randomElement(listings);
    const owner = users.find(u => u.id === listing.ownerId)!;
    let renter: typeof users[0];
    do {
      renter = randomElement(users);
    } while (renter.id === owner.id);

    // Determine status (avoid DISPUTED for now as it requires additional setup)
    const rand = Math.random() * 100;
    let status: BookingStatus = BookingStatus.RESERVED;
    let cumulative = 0;
    for (const [stat, weight] of statusWeights) {
      cumulative += weight;
      if (rand <= cumulative) {
        status = stat;
        break;
      }
    }
    
    // Convert some CANCELLED to DISPUTED (5% of total = ~3 bookings)
    // We'll track this separately to ensure we get exactly 3 disputed bookings
    const shouldBeDisputed = status === BookingStatus.CANCELLED && Math.random() < 0.3;
    if (shouldBeDisputed) {
      status = BookingStatus.DISPUTED;
    }

    // Generate dates based on status
    let startDate: Date;
    let endDate: Date;
    const rentalDays = randomInt(1, 7);

    if (status === BookingStatus.COMPLETED) {
      // Past booking
      endDate = randomDate(daysAgo(30), daysAgo(1));
      startDate = new Date(endDate);
      startDate.setDate(startDate.getDate() - rentalDays);
    } else if (status === BookingStatus.CANCELLED) {
      // Cancelled booking (could be past or future)
      if (Math.random() > 0.5) {
        endDate = randomDate(daysAgo(20), daysAgo(1));
        startDate = new Date(endDate);
        startDate.setDate(startDate.getDate() - rentalDays);
      } else {
        startDate = randomDate(now, daysFromNow(30));
        endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + rentalDays);
      }
    } else if (status === BookingStatus.CONFIRMED) {
      // Active or upcoming booking
      if (Math.random() > 0.5) {
        // Active (started but not ended)
        startDate = randomDate(daysAgo(3), now);
        endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + rentalDays);
      } else {
        // Upcoming
        startDate = randomDate(now, daysFromNow(30));
        endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + rentalDays);
      }
    } else {
      // RESERVED or DRAFT - upcoming
      startDate = randomDate(now, daysFromNow(60));
      endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + rentalDays);
    }

    // Calculate deposit and insurance
    const { deposit, insuranceFee, insuranceAdded } = calculateDepositAndInsurance(
      listing,
      renter,
      owner,
      rentalDays
    );

    const totalPrice = listing.pricePerDay * rentalDays + (insuranceAdded ? insuranceFee : 0);

    const booking = await prisma.booking.create({
      data: {
        listingId: listing.id,
        renterId: renter.id,
        startDate,
        endDate,
        status,
        deposit,
        insurance: insuranceAdded,
        createdAt: randomDate(
          status === BookingStatus.COMPLETED ? daysAgo(60) : daysAgo(30),
          daysAgo(1)
        )
      }
    });

    bookings.push({ ...booking, ownerId: owner.id, totalPrice, insuranceFee });
  }

  // Generate Reviews (40 reviews for completed bookings)
  console.log("⭐ Creating reviews...");
  const completedBookings = bookings.filter(b => b.status === BookingStatus.COMPLETED);
  const reviewsToCreate = Math.min(40, completedBookings.length);
  const listingRatings: Record<string, { sum: number; count: number }> = {};

  for (let i = 0; i < reviewsToCreate; i++) {
    const booking = randomElement(completedBookings);
    const listing = listings.find(l => l.id === booking.listingId)!;
    const owner = users.find(u => u.id === listing.ownerId)!;
    const renter = users.find(u => u.id === booking.renterId)!;

    // Create review from renter to owner (this is a review of the listing/owner)
    const rating = Math.random() > 0.1 ? randomInt(4, 5) : randomInt(3, 4);
    const comment = randomElement(reviewComments);

    await prisma.review.create({
      data: {
        listingId: listing.id,
        fromUserId: renter.id,
        toUserId: owner.id,
        rating,
        text: comment,
        createdAt: randomDate(booking.endDate, now)
      }
    });

    // Track rating for listing
    if (!listingRatings[listing.id]) {
      listingRatings[listing.id] = { sum: 0, count: 0 };
    }
    listingRatings[listing.id].sum += rating;
    listingRatings[listing.id].count += 1;

    // Sometimes create review from owner to renter (30% chance)
    if (Math.random() > 0.7) {
      await prisma.review.create({
        data: {
          listingId: listing.id,
          fromUserId: owner.id,
          toUserId: renter.id,
          rating: randomInt(4, 5),
          text: randomElement(reviewComments),
          createdAt: randomDate(booking.endDate, now)
        }
      });
    }
  }

  // Update listing ratings based on reviews
  console.log("📊 Updating listing ratings...");
  for (const [listingId, ratings] of Object.entries(listingRatings)) {
    const avgRating = ratings.sum / ratings.count;
    await prisma.listing.update({
      where: { id: listingId },
      data: {
        ratingAvg: Math.round(avgRating * 10) / 10,
        ratingCount: ratings.count
      }
    });
  }

  // Generate Conversations and Messages (25 conversations)
  console.log("💬 Creating conversations and messages...");
  const bookingsForMessages = bookings.filter(
    b => b.status !== BookingStatus.CANCELLED && b.status !== BookingStatus.DRAFT
  );

  // Track which bookings already have conversations to avoid duplicates
  const bookingsWithConversations = new Set<string>();

  for (let i = 0; i < 25 && i < bookingsForMessages.length; i++) {
    // Get a booking that doesn't already have a conversation
    let booking = randomElement(bookingsForMessages);
    let attempts = 0;
    while (bookingsWithConversations.has(booking.id) && attempts < 50) {
      booking = randomElement(bookingsForMessages);
      attempts++;
    }
    if (bookingsWithConversations.has(booking.id)) continue;
    bookingsWithConversations.add(booking.id);

    const listing = listings.find(l => l.id === booking.listingId)!;
    const owner = users.find(u => u.id === listing.ownerId)!;
    const renter = users.find(u => u.id === booking.renterId)!;

    // Create thread
    const thread = await prisma.thread.create({
      data: {
        bookingId: booking.id,
        lastMessageAt: booking.createdAt,
        createdAt: booking.createdAt
      }
    });

    // Generate 3-10 messages with realistic conversation flow
    const messageCount = randomInt(3, 10);
    const messages: { senderId: string; text: string; createdAt: Date }[] = [];
    const rentalDays = Math.ceil((booking.endDate.getTime() - booking.startDate.getTime()) / (1000 * 60 * 60 * 24));

    for (let j = 0; j < messageCount; j++) {
      const isRenter = j % 2 === 0; // Alternate between renter and owner
      const sender = isRenter ? renter : owner;
      
      // Determine conversation phase based on message position and booking status
      let phase: keyof typeof messageTemplates;
      if (j === 0) {
        phase = "initial";
      } else if (j < messageCount * 0.3) {
        phase = "pickup";
      } else if (j < messageCount * 0.7) {
        phase = booking.status === BookingStatus.COMPLETED ? "during" : "pickup";
      } else if (j < messageCount * 0.9) {
        phase = "return";
      } else {
        phase = "after";
      }

      const template = randomElement(messageTemplates[phase]);
      let text = template
        .replace("{item}", listing.title)
        .replace("{days}", rentalDays.toString())
        .replace("{dates}", `${booking.startDate.toLocaleDateString("he-IL")} - ${booking.endDate.toLocaleDateString("he-IL")}`);

      // Create realistic message timing
      const messageDate = new Date(booking.createdAt);
      if (phase === "initial") {
        messageDate.setHours(messageDate.getHours() - randomInt(1, 24));
      } else if (phase === "pickup") {
        messageDate.setHours(messageDate.getHours() + randomInt(1, 48));
      } else if (phase === "during") {
        const midPoint = new Date((booking.startDate.getTime() + booking.endDate.getTime()) / 2);
        messageDate.setTime(midPoint.getTime() + randomInt(-12, 12) * 60 * 60 * 1000);
      } else if (phase === "return") {
        messageDate.setTime(booking.endDate.getTime() - randomInt(1, 24) * 60 * 60 * 1000);
      } else {
        messageDate.setTime(booking.endDate.getTime() + randomInt(1, 48) * 60 * 60 * 1000);
      }

      messages.push({
        senderId: sender.id,
        text,
        createdAt: messageDate
      });
    }

    // Sort messages by time
    messages.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

    // Create messages
    for (const msg of messages) {
      await prisma.message.create({
        data: {
          threadId: thread.id,
          bookingId: booking.id,
          fromUserId: msg.senderId,
          body: msg.text,
          createdAt: msg.createdAt
        }
      });
    }

    // Update thread last message time
    const lastMessage = messages[messages.length - 1];
    await prisma.thread.update({
      where: { id: thread.id },
      data: { lastMessageAt: lastMessage.createdAt }
    });
  }

  // Generate Disputes for DISPUTED bookings
  console.log("⚖️ Creating disputes...");
  const disputedBookings = bookings.filter(b => b.status === BookingStatus.DISPUTED);
  for (const booking of disputedBookings) {
    const listing = listings.find(l => l.id === booking.listingId)!;
    const owner = users.find(u => u.id === listing.ownerId)!;
    const renter = users.find(u => u.id === booking.renterId)!;
    
    // Randomly assign dispute opener (70% renter, 30% owner)
    const openedBy = Math.random() > 0.3 ? renter : owner;
    const disputeType = randomElement([DisputeType.DAMAGE, DisputeType.PAYMENT, DisputeType.OTHER]);
    
    const disputeDescriptions: Record<DisputeType, string> = {
      DAMAGE: "נזק קל למוצר במהלך השכרה",
      PAYMENT: "בעיה בהחזר הפיקדון",
      OTHER: "בעיה כללית בהשכרה"
    };

    await prisma.dispute.create({
      data: {
        bookingId: booking.id,
        openedById: openedBy.id,
        type: disputeType,
        description: disputeDescriptions[disputeType],
        status: DisputeStatus.OPEN,
        claim: Math.round(booking.deposit * randomFloat(0.1, 0.5)),
        evidence: JSON.stringify({
          photos: ["/dispute-photo-1.jpg"],
          description: disputeDescriptions[disputeType]
        }),
        createdAt: randomDate(booking.endDate, now)
      }
    });
  }

  console.log("✅ Seed completed successfully!");
  console.log(`   - ${users.length} users created`);
  console.log(`   - ${listings.length} listings created`);
  console.log(`   - ${bookings.length} bookings created`);
  console.log(`   - ${reviewsToCreate} reviews created`);
  console.log(`   - 25 conversations with messages created`);
  console.log(`   - ${disputedBookings.length} disputes created`);
  
  // Print summary statistics
  const statusCounts = bookings.reduce((acc, b) => {
    acc[b.status] = (acc[b.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  console.log("\n📊 Booking Status Distribution:");
  Object.entries(statusCounts).forEach(([status, count]) => {
    console.log(`   - ${status}: ${count}`);
  });
  
  const listingStatusCounts = listings.reduce((acc, l) => {
    acc[l.status] = (acc[l.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  console.log("\n📊 Listing Status Distribution:");
  Object.entries(listingStatusCounts).forEach(([status, count]) => {
    console.log(`   - ${status}: ${count}`);
  });
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
