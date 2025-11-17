/**
 * Insurance & Risk Engine
 * 
 * Main export point for the insurance calculation module.
 * This module provides risk assessment and insurance quote calculation
 * for P2P rental bookings.
 */

export {
  calculateInsuranceQuote,
  riskConfig,
  type RiskBand,
  type ItemCategory,
  type InsuranceInput,
  type InsuranceQuote,
} from "./riskEngine";

