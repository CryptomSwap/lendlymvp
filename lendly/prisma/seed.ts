import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Create 3 users
  const user1 = await prisma.user.create({
    data: {
      name: "אלון כהן",
      email: "alon@example.com",
      phone: "+972-50-123-4567",
      avatar: "/placeholder-avatar-1.jpg",
      role: "user",
      trustScore: 85,
    },
  });

  const user2 = await prisma.user.create({
    data: {
      name: "שרה לוי",
      email: "sara@example.com",
      phone: "+972-50-234-5678",
      avatar: "/placeholder-avatar-2.jpg",
      role: "user",
      trustScore: 92,
    },
  });

  const user3 = await prisma.user.create({
    data: {
      name: "דוד ישראלי",
      email: "david@example.com",
      phone: "+972-50-345-6789",
      avatar: "/placeholder-avatar-3.jpg",
      role: "user",
      trustScore: 78,
    },
  });

  // Create 8 listings across categories
  const categories = [
    { name: "Cameras", he: "מצלמות" },
    { name: "Drones", he: "רחפנים" },
    { name: "Tools", he: "כלים" },
    { name: "DJ gear", he: "ציוד DJ" },
    { name: "Camping", he: "קמפינג" },
  ];

  const listings = [
    {
      ownerId: user1.id,
      title: "Canon EOS R5 - Professional Camera",
      titleHe: "קנון EOS R5 - מצלמה מקצועית",
      description: "High-end mirrorless camera perfect for professional photography. Includes 24-70mm lens.",
      descriptionHe: "מצלמה ללא מראה ברמה מקצועית, מושלמת לצילום מקצועי. כוללת עדשה 24-70 מ״מ.",
      category: "Cameras",
      dailyRate: 150,
      depositOverride: 2000,
      minDays: 2,
      photos: JSON.stringify([
        "/Cam.png",
        "/Cam.png",
      ]),
      locationText: "Tel Aviv, Israel",
      locationTextHe: "תל אביב, ישראל",
      lat: 32.0853,
      lng: 34.7818,
      instantBook: true,
      ratingAvg: 4.8,
      ratingCount: 12,
    },
    {
      ownerId: user1.id,
      title: "DJI Mavic 3 Pro Drone",
      titleHe: "רחפן DJI Mavic 3 Pro",
      description: "Latest DJI drone with 4K video and obstacle avoidance. Perfect for aerial photography.",
      descriptionHe: "רחפן DJI החדש ביותר עם וידאו 4K ומערכת הימנעות ממכשולים. מושלם לצילום אווירי.",
      category: "Drones",
      dailyRate: 200,
      depositOverride: 3000,
      minDays: 1,
      photos: JSON.stringify([
        "/drone.png",
        "/drone.png",
      ]),
      locationText: "Jerusalem, Israel",
      locationTextHe: "ירושלים, ישראל",
      lat: 31.7683,
      lng: 35.2137,
      instantBook: false,
      ratingAvg: 4.9,
      ratingCount: 8,
    },
    {
      ownerId: user2.id,
      title: "Professional Power Drill Set",
      titleHe: "ערכת מקדחה מקצועית",
      description: "Complete power tool set with drill, impact driver, and various bits. Great for home projects.",
      descriptionHe: "ערכת כלי עבודה מלאה עם מקדחה, מברגה וסיביות שונות. מצוין לפרויקטים ביתיים.",
      category: "Tools",
      dailyRate: 45,
      depositOverride: 500,
      minDays: 1,
      photos: JSON.stringify(["/drill.png"]),
      locationText: "Haifa, Israel",
      locationTextHe: "חיפה, ישראל",
      lat: 32.7940,
      lng: 34.9896,
      instantBook: true,
      ratingAvg: 4.6,
      ratingCount: 15,
    },
    {
      ownerId: user2.id,
      title: "Pioneer DJ Controller DDJ-1000",
      titleHe: "קונטרולר DJ פיוניר DDJ-1000",
      description: "Professional 4-channel DJ controller with full-size jog wheels. Perfect for events.",
      descriptionHe: "קונטרולר DJ מקצועי 4 ערוצים עם ג'וגים בגודל מלא. מושלם לאירועים.",
      category: "DJ gear",
      dailyRate: 120,
      depositOverride: 1500,
      minDays: 2,
      photos: JSON.stringify([
        "/drill.png",
        "/drill.png",
      ]),
      locationText: "Tel Aviv, Israel",
      locationTextHe: "תל אביב, ישראל",
      lat: 32.0853,
      lng: 34.7818,
      instantBook: false,
      ratingAvg: 4.7,
      ratingCount: 10,
    },
    {
      ownerId: user3.id,
      title: "4-Person Camping Tent",
      titleHe: "אוהל קמפינג ל-4 אנשים",
      description: "Spacious waterproof tent with rainfly. Easy setup, perfect for weekend camping trips.",
      descriptionHe: "אוהל רחב ידיים עמיד למים עם כיסוי גשם. התקנה קלה, מושלם לטיולי קמפינג בסופי שבוע.",
      category: "Camping",
      dailyRate: 60,
      depositOverride: 800,
      minDays: 2,
      photos: JSON.stringify([
        "/ladder.png",
        "/ladder.png",
      ]),
      locationText: "Eilat, Israel",
      locationTextHe: "אילת, ישראל",
      lat: 29.5577,
      lng: 34.9519,
      instantBook: true,
      ratingAvg: 4.5,
      ratingCount: 20,
    },
    {
      ownerId: user3.id,
      title: "Sony A7III Mirrorless Camera",
      titleHe: "מצלמה ללא מראה סוני A7III",
      description: "Full-frame mirrorless camera with excellent low-light performance. Includes 50mm lens.",
      descriptionHe: "מצלמה ללא מראה Full-frame עם ביצועים מעולים בתנאי תאורה נמוכה. כוללת עדשה 50 מ״מ.",
      category: "Cameras",
      dailyRate: 120,
      depositOverride: 1800,
      minDays: 1,
      photos: JSON.stringify(["/Cam.png"]),
      locationText: "Herzliya, Israel",
      locationTextHe: "הרצליה, ישראל",
      lat: 32.1624,
      lng: 34.8447,
      instantBook: true,
      ratingAvg: 4.9,
      ratingCount: 25,
    },
    {
      ownerId: user1.id,
      title: "DJI Mini 3 Drone",
      titleHe: "רחפן DJI Mini 3",
      description: "Compact and lightweight drone, perfect for travel. Great for beginners and professionals alike.",
      descriptionHe: "רחפן קומפקטי וקל, מושלם לנסיעות. מצוין למתחילים ולמקצוענים כאחד.",
      category: "Drones",
      dailyRate: 100,
      depositOverride: 1500,
      minDays: 1,
      photos: JSON.stringify(["/drone.png"]),
      locationText: "Netanya, Israel",
      locationTextHe: "נתניה, ישראל",
      lat: 32.3320,
      lng: 34.8599,
      instantBook: true,
      ratingAvg: 4.7,
      ratingCount: 18,
    },
    {
      ownerId: user2.id,
      title: "Complete Camping Gear Set",
      titleHe: "ערכת ציוד קמפינג מלאה",
      description: "Everything you need: tent, sleeping bags, camping stove, cooler, and more. Perfect for a week-long trip.",
      descriptionHe: "כל מה שצריך: אוהל, שקי שינה, תנור קמפינג, קולר ועוד. מושלם לטיול של שבוע.",
      category: "Camping",
      dailyRate: 80,
      depositOverride: 1000,
      minDays: 3,
      photos: JSON.stringify([
        "/ladder.png",
        "/shnork.png",
      ]),
      locationText: "Beer Sheva, Israel",
      locationTextHe: "באר שבע, ישראל",
      lat: 31.2530,
      lng: 34.7915,
      instantBook: false,
      ratingAvg: 4.6,
      ratingCount: 14,
    },
  ];

  for (const listing of listings) {
    await prisma.listings.create({
      data: {
        ownerId: listing.ownerId,
        title: listing.title,
        description: listing.description,
        category: listing.category,
        dailyRate: listing.dailyRate,
        depositOverride: listing.depositOverride,
        minDays: listing.minDays,
        photos: listing.photos,
        locationText: listing.locationText,
        lat: listing.lat,
        lng: listing.lng,
        instantBook: listing.instantBook,
        ratingAvg: listing.ratingAvg,
        ratingCount: listing.ratingCount,
      },
    });
  }

  console.log("Seed data created successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

