/**
 * Insurance Algorithm Test Script
 * 
 * This script tests the insurance/deposit calculation algorithm
 * with various scenarios to ensure it works correctly.
 * 
 * Run with: npx tsx scripts/test-insurance.ts
 */

import { calculateInsuranceQuote, type InsuranceInput } from "../lib/insurance/riskEngine";

interface TestCase {
  name: string;
  input: InsuranceInput;
  expectedRiskBand: "low" | "medium" | "high";
  expectedDepositRange: [number, number]; // min, max
  expectedInsuranceRange: [number, number]; // min, max
}

const testCases: TestCase[] = [
  {
    name: "Low Risk: Trusted user, cheap camping item",
    input: {
      itemId: "test-1",
      itemCategory: "camping",
      itemValue: 500,
      dailyPrice: 50,
      rentalDays: 3,
      renterTrustScore: 95,
      ownerTrustScore: 90,
      renterCompletedRentals: 20,
      renterIncidents: 0,
      itemIncidents: 0,
      locationRiskIndex: 0.1,
    },
    expectedRiskBand: "low",
    expectedDepositRange: [100, 200], // Should be low
    expectedInsuranceRange: [10, 20], // 3% of 500 = 15, rounded to 10
  },
  {
    name: "High Risk: New user, expensive drone",
    input: {
      itemId: "test-2",
      itemCategory: "drone",
      itemValue: 10000,
      dailyPrice: 500,
      rentalDays: 5,
      renterTrustScore: 30,
      ownerTrustScore: 60,
      renterCompletedRentals: 0,
      renterIncidents: 2,
      itemIncidents: 1,
      locationRiskIndex: 0.8,
    },
    expectedRiskBand: "high",
    expectedDepositRange: [3000, 8000], // Should be high (max 80% of item value)
    expectedInsuranceRange: [700, 900], // 8% of 10000 = 800, rounded to 800
  },
  {
    name: "Medium Risk: Average scenario",
    input: {
      itemId: "test-3",
      itemCategory: "tools",
      itemValue: 2000,
      dailyPrice: 150,
      rentalDays: 4,
      renterTrustScore: 65,
      ownerTrustScore: 70,
      renterCompletedRentals: 5,
      renterIncidents: 1,
      itemIncidents: 0,
    },
    expectedRiskBand: "medium",
    expectedDepositRange: [500, 1000], // Should be medium
    expectedInsuranceRange: [90, 110], // 5% of 2000 = 100, rounded to 100
  },
  {
    name: "Long Rental: 10 days",
    input: {
      itemId: "test-4",
      itemCategory: "camera",
      itemValue: 5000,
      dailyPrice: 200,
      rentalDays: 10, // > 7 days threshold
      renterTrustScore: 75,
      ownerTrustScore: 75,
      renterCompletedRentals: 10,
      renterIncidents: 0,
      itemIncidents: 0,
    },
    expectedRiskBand: "medium",
    expectedDepositRange: [1500, 2500], // Should include 15% extra for long rental
    expectedInsuranceRange: [240, 260], // 5% of 5000 = 250, rounded to 250
  },
  {
    name: "Minimum Deposit: Very cheap item",
    input: {
      itemId: "test-5",
      itemCategory: "camping",
      itemValue: 100,
      dailyPrice: 200, // High daily price relative to value
      rentalDays: 1,
      renterTrustScore: 95,
      ownerTrustScore: 95,
      renterCompletedRentals: 50,
      renterIncidents: 0,
      itemIncidents: 0,
    },
    expectedRiskBand: "low",
    expectedDepositRange: [400, 500], // Min should be 2 × dailyPrice = 400
    expectedInsuranceRange: [0, 10], // 3% of 100 = 3, rounded to 10
  },
  {
    name: "Maximum Deposit: Very expensive item",
    input: {
      itemId: "test-6",
      itemCategory: "drone",
      itemValue: 10000,
      dailyPrice: 10, // Very low daily price
      rentalDays: 30,
      renterTrustScore: 10,
      ownerTrustScore: 10,
      renterCompletedRentals: 0,
      renterIncidents: 10,
      itemIncidents: 10,
      locationRiskIndex: 1.0,
    },
    expectedRiskBand: "high",
    expectedDepositRange: [7000, 8000], // Max should be 80% of itemValue = 8000
    expectedInsuranceRange: [790, 810], // 8% of 10000 = 800, rounded to 800
  },
];

function runTests() {
  console.log("🧪 Testing Insurance Algorithm\n");
  console.log("=" .repeat(80));

  let passed = 0;
  let failed = 0;

  for (const testCase of testCases) {
    console.log(`\n📋 Test: ${testCase.name}`);
    console.log("-".repeat(80));

    try {
      const result = calculateInsuranceQuote(testCase.input);

      // Check risk band
      const riskBandMatch = result.riskBand === testCase.expectedRiskBand;
      if (!riskBandMatch) {
        console.log(`❌ Risk Band: Expected "${testCase.expectedRiskBand}", got "${result.riskBand}"`);
        failed++;
      } else {
        console.log(`✅ Risk Band: ${result.riskBand}`);
      }

      // Check deposit range
      const depositInRange =
        result.securityDeposit >= testCase.expectedDepositRange[0] &&
        result.securityDeposit <= testCase.expectedDepositRange[1];
      if (!depositInRange) {
        console.log(
          `❌ Deposit: Expected ${testCase.expectedDepositRange[0]}-${testCase.expectedDepositRange[1]}, got ${result.securityDeposit}`
        );
        failed++;
      } else {
        console.log(`✅ Deposit: ₪${result.securityDeposit} (within expected range)`);
      }

      // Check insurance fee range
      const insuranceInRange =
        result.protectionFee >= testCase.expectedInsuranceRange[0] &&
        result.protectionFee <= testCase.expectedInsuranceRange[1];
      if (!insuranceInRange) {
        console.log(
          `❌ Insurance Fee: Expected ${testCase.expectedInsuranceRange[0]}-${testCase.expectedInsuranceRange[1]}, got ${result.protectionFee}`
        );
        failed++;
      } else {
        console.log(`✅ Insurance Fee: ₪${result.protectionFee} (within expected range)`);
      }

      // Display full quote
      console.log(`\n   Full Quote:`);
      console.log(`   - Risk Band: ${result.riskBand}`);
      console.log(`   - Security Deposit: ₪${result.securityDeposit}`);
      console.log(`   - Protection Fee: ₪${result.protectionFee}`);
      console.log(`   - Max Coverage: ₪${result.maxCoverage}`);
      console.log(`   - Explanation: ${result.explanation}`);

      if (riskBandMatch && depositInRange && insuranceInRange) {
        passed++;
      }
    } catch (error) {
      console.log(`❌ Error: ${error instanceof Error ? error.message : String(error)}`);
      failed++;
    }
  }

  console.log("\n" + "=".repeat(80));
  console.log(`\n📊 Test Results:`);
  console.log(`   ✅ Passed: ${passed}/${testCases.length}`);
  console.log(`   ❌ Failed: ${failed}/${testCases.length}`);

  if (failed === 0) {
    console.log(`\n🎉 All tests passed!`);
    process.exit(0);
  } else {
    console.log(`\n⚠️  Some tests failed. Please review the output above.`);
    process.exit(1);
  }
}

// Run tests
runTests();

