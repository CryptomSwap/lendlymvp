import { RiskInputs, DepositQuote, PricingResult } from './schemas'
import { DEPOSIT_CONFIG, RISK_CATEGORIES, INSURANCE_TYPES } from './constants'

/**
 * Calculate dynamic deposit based on risk factors
 */
export function calculateDeposit(inputs: RiskInputs): DepositQuote {
  const { itemValue, rentalDuration, renterRating, itemCategory, locationRisk, seasonality } = inputs
  
  // Base deposit calculation
  const baseDeposit = Math.max(
    itemValue * DEPOSIT_CONFIG.basePercentage,
    DEPOSIT_CONFIG.minDeposit
  )
  
  // Risk adjustments
  const categoryRisk = getCategoryRisk(itemCategory)
  const riskMultiplier = DEPOSIT_CONFIG.riskMultipliers[categoryRisk]
  
  // Duration adjustment
  const durationMultiplier = getDurationMultiplier(rentalDuration)
  
  // Renter rating adjustment (if available)
  const renterMultiplier = renterRating ? getRenterMultiplier(renterRating) : 1.0
  
  // Location and seasonality adjustments
  const locationMultiplier = getLocationMultiplier(locationRisk)
  const seasonalityMultiplier = getSeasonalityMultiplier(seasonality)
  
  // Calculate final deposit
  const finalDeposit = Math.min(
    baseDeposit * riskMultiplier * durationMultiplier * renterMultiplier * locationMultiplier * seasonalityMultiplier,
    DEPOSIT_CONFIG.maxDeposit
  )
  
  return {
    baseDeposit: Math.round(baseDeposit),
    riskMultiplier,
    finalDeposit: Math.round(finalDeposit),
    breakdown: {
      baseAmount: Math.round(baseDeposit),
      riskAdjustment: Math.round(baseDeposit * (riskMultiplier - 1)),
      durationAdjustment: Math.round(baseDeposit * (durationMultiplier - 1)),
      categoryAdjustment: Math.round(baseDeposit * (categoryRisk === 'high' ? 0.3 : categoryRisk === 'medium' ? 0.1 : -0.1)),
    },
  }
}

/**
 * Calculate pricing for a booking
 */
export function calculatePricing(
  dailyRate: number,
  rentalDays: number,
  hasInsurance: boolean = false,
  insuranceType: 'basic' | 'premium' = 'basic'
): PricingResult {
  const baseAmount = dailyRate * rentalDays
  const insuranceAmount = hasInsurance ? INSURANCE_TYPES[insuranceType].dailyRate * rentalDays : 0
  const depositAmount = calculateDeposit({
    itemValue: dailyRate * 10, // Estimate item value as 10x daily rate
    rentalDuration: rentalDays,
    itemCategory: 'medium', // Default category
    locationRisk: 'medium',
    seasonality: 'medium',
  }).finalDeposit
  
  return {
    dailyRate,
    totalAmount: baseAmount + insuranceAmount,
    depositAmount,
    insuranceAmount: insuranceAmount || undefined,
    breakdown: {
      baseAmount,
      insuranceCost: insuranceAmount || undefined,
      depositCost: depositAmount,
    },
  }
}

/**
 * Format currency in Israeli Shekels
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('he-IL', {
    style: 'currency',
    currency: 'ILS',
  }).format(amount / 100) // Convert from agorot to shekels
}

/**
 * Format date in Hebrew locale
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('he-IL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(d)
}

/**
 * Format date range in Hebrew
 */
export function formatDateRange(startDate: Date | string, endDate: Date | string): string {
  const start = typeof startDate === 'string' ? new Date(startDate) : startDate
  const end = typeof endDate === 'string' ? new Date(endDate) : endDate
  
  const startFormatted = new Intl.DateTimeFormat('he-IL', {
    month: 'short',
    day: 'numeric',
  }).format(start)
  
  const endFormatted = new Intl.DateTimeFormat('he-IL', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(end)
  
  return `${startFormatted} - ${endFormatted}`
}

/**
 * Calculate distance between two coordinates (Haversine formula)
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371 // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  return R * c
}

// Helper functions
function getCategoryRisk(category: string): 'low' | 'medium' | 'high' {
  for (const [riskLevel, categories] of Object.entries(RISK_CATEGORIES)) {
    if (categories.includes(category)) {
      return riskLevel as 'low' | 'medium' | 'high'
    }
  }
  return 'medium'
}

function getDurationMultiplier(days: number): number {
  if (days <= 3) return DEPOSIT_CONFIG.durationMultipliers.short
  if (days <= 7) return DEPOSIT_CONFIG.durationMultipliers.medium
  return DEPOSIT_CONFIG.durationMultipliers.long
}

function getRenterMultiplier(rating: number): number {
  if (rating >= 4.5) return 0.8
  if (rating >= 4.0) return 0.9
  if (rating >= 3.5) return 1.0
  if (rating >= 3.0) return 1.1
  return 1.2
}

function getLocationMultiplier(risk: 'low' | 'medium' | 'high'): number {
  switch (risk) {
    case 'low': return 0.9
    case 'medium': return 1.0
    case 'high': return 1.1
  }
}

function getSeasonalityMultiplier(risk: 'low' | 'medium' | 'high'): number {
  switch (risk) {
    case 'low': return 0.9
    case 'medium': return 1.0
    case 'high': return 1.1
  }
}
