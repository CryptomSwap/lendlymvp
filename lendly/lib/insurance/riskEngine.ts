/**
 * Risk & Insurance Calculation Engine
 * 
 * This module provides a configurable algorithm for calculating:
 * - Required security deposit
 * - Optional "Lendly Protection" fee (insurance-like add-on)
 * - Risk band (Low / Medium / High) with explanation
 * 
 * Designed to be easily swappable with external insurance APIs.
 */

export type RiskBand = "low" | "medium" | "high";

export type ItemCategory = "camera" | "drone" | "dj" | "tools" | "camping" | "sports" | "other";

export interface InsuranceInput {
  itemId: string;
  itemCategory: ItemCategory;
  itemValue: number;          // estimated replacement cost in ₪
  dailyPrice: number;         // rental price per day in ₪
  rentalDays: number;         // endDate - startDate in days
  renterTrustScore: number;   // 0–100 (100 = best)
  ownerTrustScore: number;    // 0–100
  renterCompletedRentals: number;
  renterIncidents: number;    // number of disputes / damages / late returns
  itemIncidents: number;      // incidents associated with this listing
  locationRiskIndex?: number; // 0–1, optional (0 = safest, 1 = riskiest)
}

export interface InsuranceQuote {
  riskBand: RiskBand;
  securityDeposit: number;   // ₪
  protectionFee: number;     // ₪ (optional add-on)
  maxCoverage: number;       // ₪ covered by Lendly Protection
  explanation: string;       // short human-readable text for UI
}

/**
 * Configurable risk parameters
 * Adjust these values to tweak the algorithm without changing logic
 */
const riskConfig = {
  categoryRiskFactor: {
    camera: 1.1,
    drone: 1.3,
    dj: 1.2,
    tools: 1.0,
    camping: 0.9,
    sports: 1.0,
    other: 1.0,
  } as const satisfies Record<ItemCategory, number>,

  baseDepositMultiplier: 0.35,       // % of itemValue
  minDepositDaysMultiplier: 2,       // at least 2 * dailyPrice
  maxDepositOfItemValue: 0.8,        // cap: 80% of itemValue
  longRentalThresholdDays: 7,
  longRentalExtraMultiplier: 0.15,   // +15% deposit for long rentals
  protectionFeeRateLow: 0.03,        // 3% of itemValue for low risk
  protectionFeeRateMedium: 0.05,     // 5% of itemValue
  protectionFeeRateHigh: 0.08,       // 8% of itemValue
  coverageMultiplier: 0.6,           // protection covers up to 60% of itemValue
} as const;

/**
 * Calculate risk score based on various factors
 * Returns a score between 0 and 100 (higher = riskier)
 */
function calculateRiskScore(input: InsuranceInput): number {
  let riskScore = 50; // Base risk score

  // Category factor
  const categoryFactor = riskConfig.categoryRiskFactor[input.itemCategory];
  riskScore += (categoryFactor - 1) * 40;

  // Renter trust
  if (input.renterTrustScore > 80) {
    riskScore -= 10;
  } else if (input.renterTrustScore < 50) {
    riskScore += 15;
  }

  // Owner trust
  if (input.ownerTrustScore > 80) {
    riskScore -= 5;
  } else if (input.ownerTrustScore < 50) {
    riskScore += 10;
  }

  // Incidents
  const renterIncidentPoints = input.renterIncidents * 8;
  const itemIncidentPoints = input.itemIncidents * 5;
  const totalIncidentPoints = renterIncidentPoints + itemIncidentPoints;
  riskScore += Math.min(totalIncidentPoints, 25); // Cap at +25

  // Rental length
  if (input.rentalDays > riskConfig.longRentalThresholdDays) {
    riskScore += 10;
  }

  // Location risk (if provided)
  if (input.locationRiskIndex !== undefined) {
    riskScore += input.locationRiskIndex * 10;
  }

  // Clamp between 0 and 100
  return Math.max(0, Math.min(100, riskScore));
}

/**
 * Map risk score to risk band
 */
function mapRiskScoreToBand(riskScore: number): RiskBand {
  if (riskScore < 40) {
    return "low";
  } else if (riskScore < 70) {
    return "medium";
  } else {
    return "high";
  }
}

/**
 * Calculate security deposit based on risk band and other factors
 */
function calculateSecurityDeposit(
  itemValue: number,
  dailyPrice: number,
  rentalDays: number,
  riskBand: RiskBand
): number {
  // Base deposit
  let deposit = itemValue * riskConfig.baseDepositMultiplier;

  // Risk adjustments
  switch (riskBand) {
    case "low":
      deposit *= 0.8;
      break;
    case "medium":
      deposit *= 1.0;
      break;
    case "high":
      deposit *= 1.3;
      break;
  }

  // Long rental adjustment
  if (rentalDays > riskConfig.longRentalThresholdDays) {
    deposit *= (1 + riskConfig.longRentalExtraMultiplier);
  }

  // Bounds
  const minDeposit = dailyPrice * riskConfig.minDepositDaysMultiplier;
  const maxDeposit = itemValue * riskConfig.maxDepositOfItemValue;
  deposit = Math.max(minDeposit, Math.min(deposit, maxDeposit));

  // Round to nearest ₪10
  return Math.round(deposit / 10) * 10;
}

/**
 * Calculate protection fee and coverage based on risk band
 */
function calculateProtectionFeeAndCoverage(
  itemValue: number,
  riskBand: RiskBand
): { fee: number; coverage: number } {
  let rate: number;
  switch (riskBand) {
    case "low":
      rate = riskConfig.protectionFeeRateLow;
      break;
    case "medium":
      rate = riskConfig.protectionFeeRateMedium;
      break;
    case "high":
      rate = riskConfig.protectionFeeRateHigh;
      break;
  }

  const fee = Math.round((itemValue * rate) / 10) * 10; // Round to 10₪
  const coverage = Math.round(itemValue * riskConfig.coverageMultiplier);

  return { fee, coverage };
}

/**
 * Generate explanation text for the quote
 */
function generateExplanation(
  riskBand: RiskBand,
  deposit: number,
  coverage: number
): string {
  const depositFormatted = deposit.toLocaleString("he-IL");
  const coverageFormatted = coverage.toLocaleString("he-IL");

  switch (riskBand) {
    case "low":
      return `Low risk booking. A reduced deposit of ₪${depositFormatted} and optional protection up to ₪${coverageFormatted}.`;
    case "medium":
      return `Standard risk booking. Recommended deposit of ₪${depositFormatted} and optional protection up to ₪${coverageFormatted}.`;
    case "high":
      return `High risk booking. Higher deposit of ₪${depositFormatted} and optional protection up to ₪${coverageFormatted} due to item value and user history.`;
  }
}

/**
 * Main function to calculate insurance quote
 * 
 * @param input - Insurance calculation inputs
 * @returns Insurance quote with risk band, deposit, protection fee, and explanation
 */
export function calculateInsuranceQuote(input: InsuranceInput): InsuranceQuote {
  // Validate inputs
  if (input.itemValue <= 0) {
    throw new Error("Item value must be greater than 0");
  }
  if (input.dailyPrice <= 0) {
    throw new Error("Daily price must be greater than 0");
  }
  if (input.rentalDays <= 0) {
    throw new Error("Rental days must be greater than 0");
  }
  if (input.renterTrustScore < 0 || input.renterTrustScore > 100) {
    throw new Error("Renter trust score must be between 0 and 100");
  }
  if (input.ownerTrustScore < 0 || input.ownerTrustScore > 100) {
    throw new Error("Owner trust score must be between 0 and 100");
  }
  if (input.locationRiskIndex !== undefined && (input.locationRiskIndex < 0 || input.locationRiskIndex > 1)) {
    throw new Error("Location risk index must be between 0 and 1");
  }

  // Calculate risk score and band
  const riskScore = calculateRiskScore(input);
  const riskBand = mapRiskScoreToBand(riskScore);

  // Calculate deposit
  const securityDeposit = calculateSecurityDeposit(
    input.itemValue,
    input.dailyPrice,
    input.rentalDays,
    riskBand
  );

  // Calculate protection fee and coverage
  const { fee: protectionFee, coverage: maxCoverage } = calculateProtectionFeeAndCoverage(
    input.itemValue,
    riskBand
  );

  // Generate explanation
  const explanation = generateExplanation(riskBand, securityDeposit, maxCoverage);

  return {
    riskBand,
    securityDeposit,
    protectionFee,
    maxCoverage,
    explanation,
  };
}

/**
 * Export config for external access if needed
 */
export { riskConfig };

