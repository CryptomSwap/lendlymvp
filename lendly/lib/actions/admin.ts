"use server";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
});

export interface DepositSettings {
  baseMultiplier: number; // Base deposit multiplier
  ownerTrustWeight: number; // How much owner trust affects deposit
  renterTrustWeight: number; // How much renter trust affects deposit
  categoryRiskFactors: Record<string, number>; // Risk factor per category
}

export interface InsuranceSettings {
  percentage: number; // Insurance fee as percentage of item value
  minimum: number; // Minimum insurance fee
}

export interface AdminSettings {
  deposit: DepositSettings;
  insurance: InsuranceSettings;
}

const DEFAULT_DEPOSIT_SETTINGS: DepositSettings = {
  baseMultiplier: 1.5,
  ownerTrustWeight: 0.1,
  renterTrustWeight: 0.2,
  categoryRiskFactors: {
    "Cameras": 1.2,
    "Drones": 1.5,
    "Tools": 1.1,
    "DJ gear": 1.3,
    "Camping": 1.0,
    "Vehicles": 2.0,
    "Electronics": 1.2,
    "Sports": 1.1,
    "Other": 1.0,
  },
};

const DEFAULT_INSURANCE_SETTINGS: InsuranceSettings = {
  percentage: 10, // 10% of item value
  minimum: 50, // Minimum 50 ILS
};

export async function getAdminSettings(): Promise<AdminSettings> {
  try {
    const depositSettings = await prisma.adminSettings.findUnique({
      where: { key: "deposit" },
    });

    const insuranceSettings = await prisma.adminSettings.findUnique({
      where: { key: "insurance" },
    });

    return {
      deposit: depositSettings
        ? (JSON.parse(depositSettings.value) as DepositSettings)
        : DEFAULT_DEPOSIT_SETTINGS,
      insurance: insuranceSettings
        ? (JSON.parse(insuranceSettings.value) as InsuranceSettings)
        : DEFAULT_INSURANCE_SETTINGS,
    };
  } catch (error) {
    console.error("Error fetching admin settings:", error);
    return {
      deposit: DEFAULT_DEPOSIT_SETTINGS,
      insurance: DEFAULT_INSURANCE_SETTINGS,
    };
  }
}

export async function updateAdminSettings(
  settings: Partial<AdminSettings>,
  userId?: string
) {
  try {
    if (settings.deposit) {
      await prisma.adminSettings.upsert({
        where: { key: "deposit" },
        update: {
          value: JSON.stringify(settings.deposit),
          updatedBy: userId || null,
        },
        create: {
          key: "deposit",
          value: JSON.stringify(settings.deposit),
          updatedBy: userId || null,
        },
      });
    }

    if (settings.insurance) {
      await prisma.adminSettings.upsert({
        where: { key: "insurance" },
        update: {
          value: JSON.stringify(settings.insurance),
          updatedBy: userId || null,
        },
        create: {
          key: "insurance",
          value: JSON.stringify(settings.insurance),
          updatedBy: userId || null,
        },
      });
    }

    return { success: true };
  } catch (error) {
    console.error("Error updating admin settings:", error);
    throw error;
  }
}

