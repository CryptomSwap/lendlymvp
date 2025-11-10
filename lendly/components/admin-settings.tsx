"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { getAdminSettings, updateAdminSettings, DepositSettings, InsuranceSettings } from "@/lib/actions/admin";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export function AdminSettings() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [depositSettings, setDepositSettings] = useState<DepositSettings>({
    baseMultiplier: 1.5,
    ownerTrustWeight: 0.1,
    renterTrustWeight: 0.2,
    categoryRiskFactors: {},
  });
  const [insuranceSettings, setInsuranceSettings] = useState<InsuranceSettings>({
    percentage: 10,
    minimum: 50,
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setIsLoading(true);
    try {
      const settings = await getAdminSettings();
      setDepositSettings(settings.deposit);
      setInsuranceSettings(settings.insurance);
    } catch (error) {
      toast.error("Failed to load settings");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateAdminSettings({
        deposit: depositSettings,
        insurance: insuranceSettings,
      });
      toast.success("Settings saved successfully!");
    } catch (error) {
      toast.error("Failed to save settings");
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const updateCategoryRisk = (category: string, value: number[]) => {
    setDepositSettings((prev) => ({
      ...prev,
      categoryRiskFactors: {
        ...prev.categoryRiskFactors,
        [category]: value[0],
      },
    }));
  };

  const categories = [
    "Cameras",
    "Drones",
    "Tools",
    "DJ gear",
    "Camping",
    "Vehicles",
    "Electronics",
    "Sports",
    "Other",
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Deposit Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Deposit Algorithm Settings</CardTitle>
          <CardDescription>
            Adjust multipliers and weights for deposit calculation
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Base Multiplier */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <Label>Base Multiplier</Label>
              <span className="text-sm font-medium">
                {depositSettings.baseMultiplier.toFixed(2)}x
              </span>
            </div>
            <Slider
              value={[depositSettings.baseMultiplier]}
              onValueChange={(value) =>
                setDepositSettings((prev) => ({ ...prev, baseMultiplier: value[0] }))
              }
              min={0.5}
              max={3.0}
              step={0.1}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Base multiplier applied to item value
            </p>
          </div>

          {/* Owner Trust Weight */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <Label>Owner Trust Weight</Label>
              <span className="text-sm font-medium">
                {depositSettings.ownerTrustWeight.toFixed(2)}
              </span>
            </div>
            <Slider
              value={[depositSettings.ownerTrustWeight]}
              onValueChange={(value) =>
                setDepositSettings((prev) => ({ ...prev, ownerTrustWeight: value[0] }))
              }
              min={0}
              max={0.5}
              step={0.01}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground mt-1">
              How much owner trust score affects deposit (higher = more impact)
            </p>
          </div>

          {/* Renter Trust Weight */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <Label>Renter Trust Weight</Label>
              <span className="text-sm font-medium">
                {depositSettings.renterTrustWeight.toFixed(2)}
              </span>
            </div>
            <Slider
              value={[depositSettings.renterTrustWeight]}
              onValueChange={(value) =>
                setDepositSettings((prev) => ({ ...prev, renterTrustWeight: value[0] }))
              }
              min={0}
              max={0.5}
              step={0.01}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground mt-1">
              How much renter trust score affects deposit (higher = more impact)
            </p>
          </div>

          {/* Category Risk Factors */}
          <div>
            <Label className="mb-4 block">Category Risk Factors</Label>
            <div className="space-y-4">
              {categories.map((category) => (
                <div key={category}>
                  <div className="flex justify-between items-center mb-2">
                    <Label className="text-sm">{category}</Label>
                    <span className="text-sm font-medium">
                      {(
                        depositSettings.categoryRiskFactors[category] || 1.0
                      ).toFixed(2)}x
                    </span>
                  </div>
                  <Slider
                    value={[
                      depositSettings.categoryRiskFactors[category] || 1.0,
                    ]}
                    onValueChange={(value) => updateCategoryRisk(category, value)}
                    min={0.5}
                    max={2.5}
                    step={0.1}
                    className="w-full"
                  />
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Insurance Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Insurance Settings</CardTitle>
          <CardDescription>
            Configure insurance fee calculation
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Insurance Percentage */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <Label>Insurance Percentage</Label>
              <span className="text-sm font-medium">
                {insuranceSettings.percentage}%
              </span>
            </div>
            <Slider
              value={[insuranceSettings.percentage]}
              onValueChange={(value) =>
                setInsuranceSettings((prev) => ({ ...prev, percentage: value[0] }))
              }
              min={0}
              max={30}
              step={0.5}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Percentage of item value charged for insurance
            </p>
          </div>

          {/* Minimum Insurance Fee */}
          <div>
            <Label htmlFor="insurance-minimum">Minimum Insurance Fee (₪)</Label>
            <Input
              id="insurance-minimum"
              type="number"
              value={insuranceSettings.minimum}
              onChange={(e) =>
                setInsuranceSettings((prev) => ({
                  ...prev,
                  minimum: parseFloat(e.target.value) || 0,
                }))
              }
              min={0}
              step={10}
              className="mt-2"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Minimum insurance fee regardless of percentage
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isSaving} size="lg">
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Settings"
          )}
        </Button>
      </div>
    </div>
  );
}

