import { PrismaClient } from '@prisma/client'
import { hashPassword } from '../src/lib/auth'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')

  // Create admin user
  const adminPassword = await hashPassword('admin123')
  const admin = await prisma.user.upsert({
    where: { email: 'admin@lendly.co.il' },
    update: {},
    create: {
      email: 'admin@lendly.co.il',
      firstName: 'מנהל',
      lastName: 'המערכת',
      password: adminPassword,
      role: 'ADMIN',
      isVerified: true,
      city: 'תל אביב-יפו',
    },
  })

  // Create test users
  const userPassword = await hashPassword('user123')
  const users = await Promise.all([
    prisma.user.upsert({
      where: { email: 'david@example.com' },
      update: {},
      create: {
        email: 'david@example.com',
        firstName: 'דוד',
        lastName: 'כהן',
        phone: '+972501234567',
        password: userPassword,
        role: 'OWNER',
        isVerified: true,
        city: 'תל אביב-יפו',
        latitude: 32.0853,
        longitude: 34.7818,
      },
    }),
    prisma.user.upsert({
      where: { email: 'sarah@example.com' },
      update: {},
      create: {
        email: 'sarah@example.com',
        firstName: 'שרה',
        lastName: 'לוי',
        phone: '+972501234568',
        password: userPassword,
        role: 'OWNER',
        isVerified: true,
        city: 'תל אביב-יפו',
        latitude: 32.0753,
        longitude: 34.7718,
      },
    }),
    prisma.user.upsert({
      where: { email: 'moshe@example.com' },
      update: {},
      create: {
        email: 'moshe@example.com',
        firstName: 'משה',
        lastName: 'ישראל',
        phone: '+972501234569',
        password: userPassword,
        role: 'RENTER',
        isVerified: true,
        city: 'תל אביב-יפו',
        latitude: 32.0953,
        longitude: 34.7918,
      },
    }),
  ])

  // Create categories
  const categories = await Promise.all([
    prisma.categoryRequest.create({
      data: {
        name: 'צילום ווידאו',
        description: 'מצלמות, עדשות, ציוד תאורה וציוד וידאו',
        status: 'APPROVED',
        requesterId: admin.id,
      },
    }),
    prisma.categoryRequest.create({
      data: {
        name: 'כלי עבודה',
        description: 'כלי חשמל, כלי יד וציוד בנייה',
        status: 'APPROVED',
        requesterId: admin.id,
      },
    }),
    prisma.categoryRequest.create({
      data: {
        name: 'ציוד DJ',
        description: 'מיקסרים, רמקולים וציוד DJ',
        status: 'APPROVED',
        requesterId: admin.id,
      },
    }),
    prisma.categoryRequest.create({
      data: {
        name: 'קמפינג וטיולים',
        description: 'אוהלים, ציוד בישול וציוד שינה',
        status: 'APPROVED',
        requesterId: admin.id,
      },
    }),
  ])

  // Create items
  const items = await Promise.all([
    // Photography items
    prisma.item.create({
      data: {
        title: 'מצלמת DSLR קנון EOS R5',
        description: 'מצלמה מקצועית עם חיישן 45MP, מצלמת וידאו 8K, מצב צילום מהיר עד 20 FPS. מצוינת לצילום ספורט, חיות בר וצילום מסחרי.',
        category: 'צילום ווידאו',
        subcategory: 'מצלמות',
        dailyRate: 15000, // 150 ₪
        weeklyRate: 90000, // 900 ₪
        monthlyRate: 300000, // 3000 ₪
        city: 'תל אביב-יפו',
        latitude: 32.0853,
        longitude: 34.7818,
        address: 'רחוב דיזנגוף 100, תל אביב',
        minRentalDays: 1,
        maxRentalDays: 30,
        hasBasicInsurance: true,
        hasPremiumInsurance: true,
        insuranceDailyRate: 500, // 5 ₪
        images: [
          'https://example.com/camera1.jpg',
          'https://example.com/camera2.jpg',
        ],
        isActive: true,
        isApproved: true,
        ownerId: users[0].id,
      },
    }),
    prisma.item.create({
      data: {
        title: 'עדשת טלפוטו 70-200mm f/2.8',
        description: 'עדשה מקצועית לצילום ספורט ופורטרטים. איכות זכוכית מעולה, מייצב תמונה מובנה, עמידה למים ואבק.',
        category: 'צילום ווידאו',
        subcategory: 'עדשות',
        dailyRate: 8000, // 80 ₪
        weeklyRate: 45000, // 450 ₪
        monthlyRate: 150000, // 1500 ₪
        city: 'תל אביב-יפו',
        latitude: 32.0753,
        longitude: 34.7718,
        address: 'רחוב אלנבי 50, תל אביב',
        minRentalDays: 1,
        maxRentalDays: 14,
        hasBasicInsurance: true,
        hasPremiumInsurance: true,
        insuranceDailyRate: 300, // 3 ₪
        images: [
          'https://example.com/lens1.jpg',
        ],
        isActive: true,
        isApproved: true,
        ownerId: users[1].id,
      },
    }),
    // Tools
    prisma.item.create({
      data: {
        title: 'מקדחה חשמלית דווקאית Bosch',
        description: 'מקדחה מקצועית עם סוללה ליתיום, מהירות משתנה, מצב פטיש. מתאימה לעבודה עם בטון, עץ ומתכת.',
        category: 'כלי עבודה',
        subcategory: 'כלי חשמל',
        dailyRate: 3000, // 30 ₪
        weeklyRate: 15000, // 150 ₪
        monthlyRate: 50000, // 500 ₪
        city: 'תל אביב-יפו',
        latitude: 32.0953,
        longitude: 34.7918,
        address: 'רחוב הרצל 200, תל אביב',
        minRentalDays: 1,
        maxRentalDays: 7,
        hasBasicInsurance: false,
        hasPremiumInsurance: false,
        images: [
          'https://example.com/drill1.jpg',
        ],
        isActive: true,
        isApproved: true,
        ownerId: users[0].id,
      },
    }),
    // DJ Equipment
    prisma.item.create({
      data: {
        title: 'מיקסר DJ Pioneer DDJ-1000',
        description: 'מיקסר DJ מקצועי עם 4 ערוצים, תמיכה ב-Rekordbox, אפקטים מובנים וקונטרולר MIDI מלא.',
        category: 'ציוד DJ',
        subcategory: 'מיקסרים',
        dailyRate: 12000, // 120 ₪
        weeklyRate: 70000, // 700 ₪
        monthlyRate: 250000, // 2500 ₪
        city: 'תל אביב-יפו',
        latitude: 32.0853,
        longitude: 34.7818,
        address: 'רחוב רוטשילד 150, תל אביב',
        minRentalDays: 1,
        maxRentalDays: 14,
        hasBasicInsurance: true,
        hasPremiumInsurance: true,
        insuranceDailyRate: 400, // 4 ₪
        images: [
          'https://example.com/mixer1.jpg',
          'https://example.com/mixer2.jpg',
        ],
        isActive: true,
        isApproved: true,
        ownerId: users[1].id,
      },
    }),
    // Camping
    prisma.item.create({
      data: {
        title: 'אוהל משפחתי 6 אנשים',
        description: 'אוהל עמיד למים עם רצפה מובנית, חלונות עם רשת, עמיד לרוח עד 60 קמ"ש. מתאים למשפחות ולקבוצות.',
        category: 'קמפינג וטיולים',
        subcategory: 'אוהלים',
        dailyRate: 2000, // 20 ₪
        weeklyRate: 10000, // 100 ₪
        monthlyRate: 35000, // 350 ₪
        city: 'תל אביב-יפו',
        latitude: 32.0753,
        longitude: 34.7718,
        address: 'רחוב בן יהודה 80, תל אביב',
        minRentalDays: 2,
        maxRentalDays: 14,
        hasBasicInsurance: true,
        hasPremiumInsurance: false,
        insuranceDailyRate: 100, // 1 ₪
        images: [
          'https://example.com/tent1.jpg',
        ],
        isActive: true,
        isApproved: true,
        ownerId: users[0].id,
      },
    }),
  ])

  // Create some reviews
  await Promise.all([
    prisma.review.create({
      data: {
        itemId: items[0].id,
        reviewerId: users[2].id,
        rating: 5,
        comment: 'מצלמה מעולה! איכות תמונות מדהימה והבעלים מאוד מקצועי.',
      },
    }),
    prisma.review.create({
      data: {
        itemId: items[1].id,
        reviewerId: users[2].id,
        rating: 4,
        comment: 'עדשה איכותית, התמונות יצאו חדות ויפות.',
      },
    }),
  ])

  // Create some bookings
  const startDate = new Date()
  startDate.setDate(startDate.getDate() + 1)
  const endDate = new Date(startDate)
  endDate.setDate(endDate.getDate() + 3)

  await prisma.booking.create({
    data: {
      itemId: items[0].id,
      renterId: users[2].id,
      startDate,
      endDate,
      totalDays: 3,
      dailyRate: items[0].dailyRate,
      totalAmount: items[0].dailyRate * 3,
      depositAmount: 45000, // 450 ₪
      hasInsurance: true,
      insuranceType: 'basic',
      insuranceAmount: 1500, // 15 ₪
      renterNotes: 'אני צריך את המצלמה לצילום חתונה',
      paymentMethod: 'MANUAL',
      status: 'CONFIRMED',
      depositStatus: 'PAID',
    },
  })

  console.log('✅ Seed completed successfully!')
  console.log(`👤 Created ${users.length + 1} users`)
  console.log(`📦 Created ${items.length} items`)
  console.log(`📝 Created ${categories.length} categories`)
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
