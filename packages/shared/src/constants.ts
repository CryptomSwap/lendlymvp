// Categories and subcategories for the platform
export const CATEGORIES = {
  'צילום ווידאו': {
    'מצלמות': ['DSLR', 'מצלמות מירורלס', 'מצלמות קומפקטיות', 'מצלמות אקשן'],
    'עדשות': ['עדשות רחבות', 'עדשות טלפוטו', 'עדשות מאקרו', 'עדשות פריים'],
    'ציוד תאורה': ['סטודיו', 'תאורת LED', 'פלאשים', 'רפלקטורים'],
    'ציוד וידאו': ['מצלמות וידאו', 'מיקרופונים', 'גימבלים', 'מוניטורים'],
  },
  'כלי עבודה': {
    'כלי חשמל': ['מקדחות', 'מסורים', 'משחזות', 'מברגות'],
    'כלי יד': ['פטישים', 'מפתחות', 'מלחציים', 'סכינים'],
    'ציוד בנייה': ['מפלסים', 'מדידות', 'פיגומים', 'בטון'],
  },
  'ציוד DJ': {
    'מיקסרים': ['דיגיטליים', 'אנלוגיים', 'USB', 'ניידים'],
    'רמקולים': ['פעילים', 'פסיביים', 'סאבוופרים', 'מוניטורים'],
    'ציוד נוסף': ['מיקרופונים', 'כבלים', 'סטנדים', 'תאורה'],
  },
  'קמפינג וטיולים': {
    'אוהלים': ['משפחתיים', 'אישיים', 'קשתות', 'דום'],
    'ציוד בישול': ['פרימוסים', 'גזיות', 'כלי בישול', 'קירור'],
    'ציוד שינה': ['שקי שינה', 'מזרונים', 'כריות', 'שמיכות'],
  },
  'ציוד ספורט': {
    'אופניים': ['כביש', 'הרים', 'אלקטרוניים', 'אביזרים'],
    'ציוד ימי': ['גלשנים', 'קיאקים', 'ציוד צלילה', 'מנועים'],
    'ציוד חורף': ['סקי', 'סנובורד', 'החלקה', 'ציוד הגנה'],
  },
  'ציוד מוזיקה': {
    'כלי נגינה': ['גיטרות', 'פסנתרים', 'תופים', 'כלי נשיפה'],
    'ציוד הגברה': ['מגברים', 'רמקולים', 'מיקסרים', 'מיקרופונים'],
    'ציוד הקלטה': ['אולפנים', 'מיקרופונים', 'ממשקים', 'מוניטורים'],
  },
} as const

// Risk categories for deposit calculation
export const RISK_CATEGORIES = {
  'low': ['ציוד ספורט', 'קמפינג וטיולים'],
  'medium': ['ציוד מוזיקה', 'כלי עבודה'],
  'high': ['צילום ווידאו', 'ציוד DJ'],
} as const

// Insurance types
export const INSURANCE_TYPES = {
  basic: {
    name: 'ביטוח בסיסי',
    description: 'כיסוי נזקים בסיסי עד 1,000 ₪',
    dailyRate: 15, // in agorot
    coverage: 100000, // in agorot
  },
  premium: {
    name: 'ביטוח פרימיום',
    description: 'כיסוי מלא עד 5,000 ₪ + הגנה מפני גניבה',
    dailyRate: 35, // in agorot
    coverage: 500000, // in agorot
  },
} as const

// Deposit calculation constants
export const DEPOSIT_CONFIG = {
  basePercentage: 0.3, // 30% of item value
  minDeposit: 50000, // 500 ₪ in agorot
  maxDeposit: 500000, // 5,000 ₪ in agorot
  riskMultipliers: {
    low: 0.8,
    medium: 1.0,
    high: 1.3,
  },
  durationMultipliers: {
    short: 0.9, // 1-3 days
    medium: 1.0, // 4-7 days
    long: 1.2, // 8+ days
  },
} as const

// Booking statuses in Hebrew
export const BOOKING_STATUS_LABELS = {
  PENDING: 'ממתין לאישור',
  CONFIRMED: 'מאושר',
  IN_PROGRESS: 'בתהליך',
  COMPLETED: 'הושלם',
  CANCELLED: 'בוטל',
  DISPUTED: 'במחלוקת',
} as const

// Payment methods in Hebrew
export const PAYMENT_METHOD_LABELS = {
  CASH: 'מזומן',
  BANK_TRANSFER: 'העברה בנקאית',
  MANUAL: 'תשלום ידני',
} as const

// User roles in Hebrew
export const USER_ROLE_LABELS = {
  RENTER: 'שוכר',
  OWNER: 'בעל ציוד',
  ADMIN: 'מנהל',
} as const

// Cities in Israel (for location selection)
export const CITIES = [
  'תל אביב-יפו',
  'ירושלים',
  'חיפה',
  'ראשון לציון',
  'פתח תקווה',
  'אשדוד',
  'נתניה',
  'באר שבע',
  'חולון',
  'רמת גן',
  'אשקלון',
  'רחובות',
  'הרצליה',
  'כפר סבא',
  'בת ים',
  'רמלה',
  'לוד',
  'נהריה',
  'אילת',
  'טבריה',
] as const

// API endpoints
export const API_ENDPOINTS = {
  auth: {
    register: '/api/auth/register',
    login: '/api/auth/login',
    refresh: '/api/auth/refresh',
    logout: '/api/auth/logout',
  },
  items: {
    list: '/api/items',
    create: '/api/items',
    get: (id: string) => `/api/items/${id}`,
    update: (id: string) => `/api/items/${id}`,
    delete: (id: string) => `/api/items/${id}`,
  },
  bookings: {
    list: '/api/bookings',
    create: '/api/bookings',
    get: (id: string) => `/api/bookings/${id}`,
    update: (id: string) => `/api/bookings/${id}`,
    expire: '/api/bookings/expire',
  },
  payments: {
    manualConfirm: '/api/payments/manual/confirm',
  },
  risk: {
    deposit: '/api/risk/deposit',
  },
  safety: {
    reportIssue: '/api/safety/report-issue',
  },
  categories: {
    list: '/api/categories',
    request: '/api/categories/request',
    update: (id: string) => `/api/categories/${id}`,
  },
} as const
