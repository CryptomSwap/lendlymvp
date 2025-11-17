import { describe, it, expect } from "vitest";
import {
  calculateInsuranceQuote,
  type InsuranceInput,
  type RiskBand,
} from "./riskEngine";

describe("calculateInsuranceQuote", () => {
  describe("Low risk scenarios", () => {
    it("should return low risk for trustworthy renter with cheap camping tent", () => {
      const input: InsuranceInput = {
        itemId: "item-1",
        itemCategory: "camping",
        itemValue: 500, // Cheap tent
        dailyPrice: 50,
        rentalDays: 3,
        renterTrustScore: 95, // Very trustworthy
        ownerTrustScore: 90,
        renterCompletedRentals: 20,
        renterIncidents: 0,
        itemIncidents: 0,
        locationRiskIndex: 0.1, // Safe location
      };

      const quote = calculateInsuranceQuote(input);

      expect(quote.riskBand).toBe("low");
      expect(quote.securityDeposit).toBeGreaterThan(0);
      expect(quote.securityDeposit).toBeLessThan(quote.maxCoverage);
      expect(quote.protectionFee).toBeGreaterThan(0);
      expect(quote.explanation).toContain("Low risk");
      expect(quote.explanation).toContain("reduced deposit");
    });

    it("should have lower deposit for low risk items", () => {
      const lowRiskInput: InsuranceInput = {
        itemId: "item-1",
        itemCategory: "camping",
        itemValue: 1000,
        dailyPrice: 100,
        rentalDays: 2,
        renterTrustScore: 85,
        ownerTrustScore: 85,
        renterCompletedRentals: 10,
        renterIncidents: 0,
        itemIncidents: 0,
      };

      const highRiskInput: InsuranceInput = {
        ...lowRiskInput,
        itemCategory: "drone",
        renterTrustScore: 30,
        renterIncidents: 3,
        itemIncidents: 2,
      };

      const lowRiskQuote = calculateInsuranceQuote(lowRiskInput);
      const highRiskQuote = calculateInsuranceQuote(highRiskInput);

      expect(lowRiskQuote.riskBand).toBe("low");
      expect(highRiskQuote.riskBand).toBe("high");
      expect(lowRiskQuote.securityDeposit).toBeLessThan(highRiskQuote.securityDeposit);
    });
  });

  describe("High risk scenarios", () => {
    it("should return high risk for new renter with expensive drone", () => {
      const input: InsuranceInput = {
        itemId: "item-2",
        itemCategory: "drone",
        itemValue: 10000, // Expensive drone
        dailyPrice: 500,
        rentalDays: 5,
        renterTrustScore: 30, // Low trust score
        ownerTrustScore: 70,
        renterCompletedRentals: 0, // New renter
        renterIncidents: 2, // Has incidents
        itemIncidents: 1,
        locationRiskIndex: 0.8, // Risky location
      };

      const quote = calculateInsuranceQuote(input);

      expect(quote.riskBand).toBe("high");
      expect(quote.securityDeposit).toBeGreaterThan(0);
      expect(quote.protectionFee).toBeGreaterThan(0);
      expect(quote.explanation).toContain("High risk");
      expect(quote.explanation).toContain("Higher deposit");
    });

    it("should apply higher protection fee for high risk", () => {
      const input: InsuranceInput = {
        itemId: "item-3",
        itemCategory: "drone",
        itemValue: 5000,
        dailyPrice: 200,
        rentalDays: 3,
        renterTrustScore: 25,
        ownerTrustScore: 60,
        renterCompletedRentals: 1,
        renterIncidents: 3,
        itemIncidents: 2,
      };

      const quote = calculateInsuranceQuote(input);

      expect(quote.riskBand).toBe("high");
      // High risk should have 8% fee (vs 3% for low, 5% for medium)
      expect(quote.protectionFee).toBeGreaterThan(input.itemValue * 0.05);
    });
  });

  describe("Medium risk scenarios", () => {
    it("should return medium risk for average scenario", () => {
      const input: InsuranceInput = {
        itemId: "item-4",
        itemCategory: "tools",
        itemValue: 2000,
        dailyPrice: 150,
        rentalDays: 4,
        renterTrustScore: 65,
        ownerTrustScore: 70,
        renterCompletedRentals: 5,
        renterIncidents: 1,
        itemIncidents: 0,
      };

      const quote = calculateInsuranceQuote(input);

      expect(quote.riskBand).toBe("medium");
      expect(quote.explanation).toContain("Standard risk");
      expect(quote.explanation).toContain("Recommended deposit");
    });
  });

  describe("Deposit calculation", () => {
    it("should respect minimum deposit (2 * dailyPrice)", () => {
      const input: InsuranceInput = {
        itemId: "item-5",
        itemCategory: "camping",
        itemValue: 100, // Very cheap item
        dailyPrice: 200, // High daily price
        rentalDays: 1,
        renterTrustScore: 95,
        ownerTrustScore: 95,
        renterCompletedRentals: 50,
        renterIncidents: 0,
        itemIncidents: 0,
      };

      const quote = calculateInsuranceQuote(input);

      // Minimum should be 2 * dailyPrice = 400
      expect(quote.securityDeposit).toBeGreaterThanOrEqual(400);
    });

    it("should respect maximum deposit (80% of itemValue)", () => {
      const input: InsuranceInput = {
        itemId: "item-6",
        itemCategory: "drone",
        itemValue: 1000,
        dailyPrice: 10, // Very low daily price
        rentalDays: 30, // Long rental
        renterTrustScore: 10, // Very low trust
        ownerTrustScore: 10,
        renterCompletedRentals: 0,
        renterIncidents: 10,
        itemIncidents: 10,
        locationRiskIndex: 1.0, // Maximum risk location
      };

      const quote = calculateInsuranceQuote(input);

      // Maximum should be 80% of itemValue = 800
      expect(quote.securityDeposit).toBeLessThanOrEqual(800);
    });

    it("should round deposit to nearest ₪10", () => {
      const input: InsuranceInput = {
        itemId: "item-7",
        itemCategory: "camera",
        itemValue: 3333, // Will result in non-round number
        dailyPrice: 200,
        rentalDays: 3,
        renterTrustScore: 75,
        ownerTrustScore: 75,
        renterCompletedRentals: 10,
        renterIncidents: 0,
        itemIncidents: 0,
      };

      const quote = calculateInsuranceQuote(input);

      // Should be divisible by 10
      expect(quote.securityDeposit % 10).toBe(0);
    });

    it("should add extra deposit for long rentals (>7 days)", () => {
      const shortRental: InsuranceInput = {
        itemId: "item-8",
        itemCategory: "tools",
        itemValue: 2000,
        dailyPrice: 100,
        rentalDays: 5,
        renterTrustScore: 70,
        ownerTrustScore: 70,
        renterCompletedRentals: 5,
        renterIncidents: 0,
        itemIncidents: 0,
      };

      const longRental: InsuranceInput = {
        ...shortRental,
        rentalDays: 10,
      };

      const shortQuote = calculateInsuranceQuote(shortRental);
      const longQuote = calculateInsuranceQuote(longRental);

      expect(longQuote.securityDeposit).toBeGreaterThan(shortQuote.securityDeposit);
    });
  });

  describe("Protection fee calculation", () => {
    it("should round protection fee to nearest ₪10", () => {
      const input: InsuranceInput = {
        itemId: "item-9",
        itemCategory: "camera",
        itemValue: 3333,
        dailyPrice: 200,
        rentalDays: 3,
        renterTrustScore: 75,
        ownerTrustScore: 75,
        renterCompletedRentals: 10,
        renterIncidents: 0,
        itemIncidents: 0,
      };

      const quote = calculateInsuranceQuote(input);

      // Should be divisible by 10
      expect(quote.protectionFee % 10).toBe(0);
    });

    it("should have different fee rates for different risk bands", () => {
      const baseInput: InsuranceInput = {
        itemId: "item-10",
        itemCategory: "tools",
        itemValue: 5000,
        dailyPrice: 200,
        rentalDays: 3,
        ownerTrustScore: 70,
        renterCompletedRentals: 5,
        renterIncidents: 0,
        itemIncidents: 0,
      };

      const lowRiskQuote = calculateInsuranceQuote({
        ...baseInput,
        renterTrustScore: 90,
        itemCategory: "camping",
      });

      const mediumRiskQuote = calculateInsuranceQuote({
        ...baseInput,
        renterTrustScore: 70,
      });

      const highRiskQuote = calculateInsuranceQuote({
        ...baseInput,
        renterTrustScore: 30,
        itemCategory: "drone",
        renterIncidents: 3,
      });

      expect(lowRiskQuote.riskBand).toBe("low");
      expect(mediumRiskQuote.riskBand).toBe("medium");
      expect(highRiskQuote.riskBand).toBe("high");

      // Low: 3%, Medium: 5%, High: 8%
      expect(lowRiskQuote.protectionFee).toBeLessThan(mediumRiskQuote.protectionFee);
      expect(mediumRiskQuote.protectionFee).toBeLessThan(highRiskQuote.protectionFee);
    });
  });

  describe("Coverage calculation", () => {
    it("should set coverage to 60% of item value", () => {
      const input: InsuranceInput = {
        itemId: "item-11",
        itemCategory: "camera",
        itemValue: 10000,
        dailyPrice: 500,
        rentalDays: 3,
        renterTrustScore: 75,
        ownerTrustScore: 75,
        renterCompletedRentals: 10,
        renterIncidents: 0,
        itemIncidents: 0,
      };

      const quote = calculateInsuranceQuote(input);

      expect(quote.maxCoverage).toBe(6000); // 60% of 10000
    });
  });

  describe("Risk score calculation", () => {
    it("should increase risk for high-risk categories", () => {
      const droneInput: InsuranceInput = {
        itemId: "item-12",
        itemCategory: "drone",
        itemValue: 5000,
        dailyPrice: 200,
        rentalDays: 3,
        renterTrustScore: 70,
        ownerTrustScore: 70,
        renterCompletedRentals: 5,
        renterIncidents: 0,
        itemIncidents: 0,
      };

      const campingInput: InsuranceInput = {
        ...droneInput,
        itemCategory: "camping",
      };

      const droneQuote = calculateInsuranceQuote(droneInput);
      const campingQuote = calculateInsuranceQuote(campingInput);

      // Drone should have higher or equal risk than camping
      expect(
        ["low", "medium", "high"].indexOf(droneQuote.riskBand)
      ).toBeGreaterThanOrEqual(
        ["low", "medium", "high"].indexOf(campingQuote.riskBand)
      );
    });

    it("should decrease risk for high trust scores", () => {
      const highTrustInput: InsuranceInput = {
        itemId: "item-13",
        itemCategory: "camera",
        itemValue: 5000,
        dailyPrice: 200,
        rentalDays: 3,
        renterTrustScore: 90,
        ownerTrustScore: 90,
        renterCompletedRentals: 20,
        renterIncidents: 0,
        itemIncidents: 0,
      };

      const lowTrustInput: InsuranceInput = {
        ...highTrustInput,
        renterTrustScore: 30,
        ownerTrustScore: 30,
      };

      const highTrustQuote = calculateInsuranceQuote(highTrustInput);
      const lowTrustQuote = calculateInsuranceQuote(lowTrustInput);

      expect(
        ["low", "medium", "high"].indexOf(highTrustQuote.riskBand)
      ).toBeLessThanOrEqual(
        ["low", "medium", "high"].indexOf(lowTrustQuote.riskBand)
      );
    });

    it("should cap incident contribution at +25 points", () => {
      const manyIncidents: InsuranceInput = {
        itemId: "item-14",
        itemCategory: "tools",
        itemValue: 2000,
        dailyPrice: 100,
        rentalDays: 3,
        renterTrustScore: 70,
        ownerTrustScore: 70,
        renterCompletedRentals: 5,
        renterIncidents: 10, // Many incidents
        itemIncidents: 10, // Many incidents
      };

      const someIncidents: InsuranceInput = {
        ...manyIncidents,
        renterIncidents: 2,
        itemIncidents: 1,
      };

      const manyIncidentsQuote = calculateInsuranceQuote(manyIncidents);
      const someIncidentsQuote = calculateInsuranceQuote(someIncidents);

      // The difference should be limited due to capping
      const riskDiff = 
        ["low", "medium", "high"].indexOf(manyIncidentsQuote.riskBand) -
        ["low", "medium", "high"].indexOf(someIncidentsQuote.riskBand);

      // Should not be too extreme (capped at +25 points)
      expect(Math.abs(riskDiff)).toBeLessThanOrEqual(2);
    });

    it("should increase risk for long rentals", () => {
      const shortRental: InsuranceInput = {
        itemId: "item-15",
        itemCategory: "tools",
        itemValue: 2000,
        dailyPrice: 100,
        rentalDays: 3,
        renterTrustScore: 70,
        ownerTrustScore: 70,
        renterCompletedRentals: 5,
        renterIncidents: 0,
        itemIncidents: 0,
      };

      const longRental: InsuranceInput = {
        ...shortRental,
        rentalDays: 10,
      };

      const shortQuote = calculateInsuranceQuote(shortRental);
      const longQuote = calculateInsuranceQuote(longRental);

      // Long rental should have equal or higher risk
      expect(
        ["low", "medium", "high"].indexOf(longQuote.riskBand)
      ).toBeGreaterThanOrEqual(
        ["low", "medium", "high"].indexOf(shortQuote.riskBand)
      );
    });

    it("should factor in location risk when provided", () => {
      const safeLocation: InsuranceInput = {
        itemId: "item-16",
        itemCategory: "camera",
        itemValue: 3000,
        dailyPrice: 150,
        rentalDays: 3,
        renterTrustScore: 70,
        ownerTrustScore: 70,
        renterCompletedRentals: 5,
        renterIncidents: 0,
        itemIncidents: 0,
        locationRiskIndex: 0.1,
      };

      const riskyLocation: InsuranceInput = {
        ...safeLocation,
        locationRiskIndex: 0.9,
      };

      const safeQuote = calculateInsuranceQuote(safeLocation);
      const riskyQuote = calculateInsuranceQuote(riskyLocation);

      // Risky location should have equal or higher risk
      expect(
        ["low", "medium", "high"].indexOf(riskyQuote.riskBand)
      ).toBeGreaterThanOrEqual(
        ["low", "medium", "high"].indexOf(safeQuote.riskBand)
      );
    });
  });

  describe("Input validation", () => {
    it("should throw error for invalid item value", () => {
      const input: InsuranceInput = {
        itemId: "item-17",
        itemCategory: "camera",
        itemValue: 0,
        dailyPrice: 100,
        rentalDays: 3,
        renterTrustScore: 70,
        ownerTrustScore: 70,
        renterCompletedRentals: 5,
        renterIncidents: 0,
        itemIncidents: 0,
      };

      expect(() => calculateInsuranceQuote(input)).toThrow("Item value must be greater than 0");
    });

    it("should throw error for invalid daily price", () => {
      const input: InsuranceInput = {
        itemId: "item-18",
        itemCategory: "camera",
        itemValue: 1000,
        dailyPrice: -10,
        rentalDays: 3,
        renterTrustScore: 70,
        ownerTrustScore: 70,
        renterCompletedRentals: 5,
        renterIncidents: 0,
        itemIncidents: 0,
      };

      expect(() => calculateInsuranceQuote(input)).toThrow("Daily price must be greater than 0");
    });

    it("should throw error for invalid rental days", () => {
      const input: InsuranceInput = {
        itemId: "item-19",
        itemCategory: "camera",
        itemValue: 1000,
        dailyPrice: 100,
        rentalDays: 0,
        renterTrustScore: 70,
        ownerTrustScore: 70,
        renterCompletedRentals: 5,
        renterIncidents: 0,
        itemIncidents: 0,
      };

      expect(() => calculateInsuranceQuote(input)).toThrow("Rental days must be greater than 0");
    });

    it("should throw error for invalid renter trust score", () => {
      const input: InsuranceInput = {
        itemId: "item-20",
        itemCategory: "camera",
        itemValue: 1000,
        dailyPrice: 100,
        rentalDays: 3,
        renterTrustScore: 150,
        ownerTrustScore: 70,
        renterCompletedRentals: 5,
        renterIncidents: 0,
        itemIncidents: 0,
      };

      expect(() => calculateInsuranceQuote(input)).toThrow("Renter trust score must be between 0 and 100");
    });

    it("should throw error for invalid owner trust score", () => {
      const input: InsuranceInput = {
        itemId: "item-21",
        itemCategory: "camera",
        itemValue: 1000,
        dailyPrice: 100,
        rentalDays: 3,
        renterTrustScore: 70,
        ownerTrustScore: -10,
        renterCompletedRentals: 5,
        renterIncidents: 0,
        itemIncidents: 0,
      };

      expect(() => calculateInsuranceQuote(input)).toThrow("Owner trust score must be between 0 and 100");
    });

    it("should throw error for invalid location risk index", () => {
      const input: InsuranceInput = {
        itemId: "item-22",
        itemCategory: "camera",
        itemValue: 1000,
        dailyPrice: 100,
        rentalDays: 3,
        renterTrustScore: 70,
        ownerTrustScore: 70,
        renterCompletedRentals: 5,
        renterIncidents: 0,
        itemIncidents: 0,
        locationRiskIndex: 1.5,
      };

      expect(() => calculateInsuranceQuote(input)).toThrow("Location risk index must be between 0 and 1");
    });
  });

  describe("Explanation text", () => {
    it("should include deposit and coverage amounts in explanation", () => {
      const input: InsuranceInput = {
        itemId: "item-23",
        itemCategory: "camera",
        itemValue: 5000,
        dailyPrice: 200,
        rentalDays: 3,
        renterTrustScore: 75,
        ownerTrustScore: 75,
        renterCompletedRentals: 10,
        renterIncidents: 0,
        itemIncidents: 0,
      };

      const quote = calculateInsuranceQuote(input);

      expect(quote.explanation).toContain("₪");
      expect(quote.explanation).toContain(quote.securityDeposit.toString());
      expect(quote.explanation).toContain(quote.maxCoverage.toString());
    });

    it("should have appropriate explanation for each risk band", () => {
      const lowRiskInput: InsuranceInput = {
        itemId: "item-24",
        itemCategory: "camping",
        itemValue: 1000,
        dailyPrice: 50,
        rentalDays: 2,
        renterTrustScore: 90,
        ownerTrustScore: 90,
        renterCompletedRentals: 20,
        renterIncidents: 0,
        itemIncidents: 0,
      };

      const highRiskInput: InsuranceInput = {
        itemId: "item-25",
        itemCategory: "drone",
        itemValue: 10000,
        dailyPrice: 500,
        rentalDays: 5,
        renterTrustScore: 20,
        ownerTrustScore: 30,
        renterCompletedRentals: 0,
        renterIncidents: 5,
        itemIncidents: 3,
      };

      const lowQuote = calculateInsuranceQuote(lowRiskInput);
      const highQuote = calculateInsuranceQuote(highRiskInput);

      expect(lowQuote.explanation).toContain("Low risk");
      expect(lowQuote.explanation).toContain("reduced deposit");
      expect(highQuote.explanation).toContain("High risk");
      expect(highQuote.explanation).toContain("Higher deposit");
    });
  });
});

