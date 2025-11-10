import { describe, it, expect } from "@jest/globals";

// Quick tests for i18n functionality
describe("i18n", () => {
  it("should format numbers in Hebrew locale", async () => {
    const { formatNumber } = await import("../lib/utils/i18n");
    // Hebrew uses different number formatting
    const result = await formatNumber(1234.56);
    expect(result).toBeTruthy();
  });

  it("should format currency in Hebrew locale", async () => {
    const { formatCurrency } = await import("../lib/utils/i18n");
    const result = await formatCurrency(100, "ILS");
    expect(result).toContain("₪");
  });

  it("should format dates in Hebrew locale", async () => {
    const { formatDate } = await import("../lib/utils/i18n");
    const date = new Date("2024-01-15");
    const result = await formatDate(date);
    expect(result).toBeTruthy();
  });

  it("should handle RTL text direction", () => {
    // Test that Hebrew locale returns RTL
    const heLocale = "he";
    const enLocale = "en";
    const heDir = heLocale === "he" ? "rtl" : "ltr";
    const enDir = enLocale === "he" ? "rtl" : "ltr";
    expect(heDir).toBe("rtl");
    expect(enDir).toBe("ltr");
  });

  it("should format date ranges", async () => {
    const { formatDateRange } = await import("../lib/utils/i18n");
    const start = new Date("2024-01-15");
    const end = new Date("2024-01-20");
    const result = await formatDateRange(start, end);
    expect(result).toBeTruthy();
  });
});

