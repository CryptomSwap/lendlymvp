import { getAdminSettings, DepositSettings, InsuranceSettings } from "@/lib/actions/admin";

export interface DepositCalculationInputs {
  dailyRate: number;
  days: number;
  category: string;
  ownerTrustScore: number;
  renterTrustScore: number;
  depositOverride?: number | null;
}

export interface DepositCalculationResult {
  deposit: number;
  insuranceFee: number;
  itemValue: number;
}

/**
 * Calculate deposit amount based on item value, trust scores, and risk factors
 */
export async function calculateDeposit(
  inputs: DepositCalculationInputs
): Promise<DepositCalculationResult> {
  const settings = await getAdminSettings();
  const depositSettings = settings.deposit;

  // If deposit override is provided, use it
  if (inputs.depositOverride) {
    const itemValue = inputs.dailyRate * 20; // Approximate item value
    const insuranceFee = calculateInsuranceFee(itemValue, settings.insurance);
    return {
      deposit: inputs.depositOverride,
      insuranceFee,
      itemValue,
    };
  }

  // Calculate item value (approximate from daily rate * 20)
  const itemValue = inputs.dailyRate * 20;

  // Get category risk factor (default to 1.0 if not found)
  const categoryRiskFactor =
    depositSettings.categoryRiskFactors[inputs.category] || 1.0;

  // Calculate trust score adjustments
  // Higher owner trust = lower deposit (owner is more trustworthy)
  // Lower renter trust = higher deposit (renter is less trustworthy)
  const ownerTrustAdjustment =
    1 - (inputs.ownerTrustScore / 100) * depositSettings.ownerTrustWeight;
  const renterTrustAdjustment =
    1 + ((100 - inputs.renterTrustScore) / 100) * depositSettings.renterTrustWeight;

  // Calculate base deposit
  const baseDeposit = itemValue * depositSettings.baseMultiplier;

  // Apply adjustments
  const adjustedDeposit =
    baseDeposit * categoryRiskFactor * ownerTrustAdjustment * renterTrustAdjustment;

  // Minimum deposit of 500
  const deposit = Math.max(adjustedDeposit, 500);

  // Calculate insurance fee
  const insuranceFee = calculateInsuranceFee(itemValue, settings.insurance);

  return {
    deposit: Math.round(deposit),
    insuranceFee: Math.round(insuranceFee),
    itemValue: Math.round(itemValue),
  };
}

/**
 * Calculate insurance fee (flat percentage with minimum)
 */
function calculateInsuranceFee(
  itemValue: number,
  insuranceSettings: InsuranceSettings
): number {
  const percentageFee = (itemValue * insuranceSettings.percentage) / 100;
  return Math.max(percentageFee, insuranceSettings.minimum);
}

