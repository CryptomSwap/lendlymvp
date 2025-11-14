"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Save } from "lucide-react";
import { getRules, updateRules } from "@/lib/actions/admin";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

export function AdminRules() {
  const t = useTranslations("admin");
  const [rules, setRules] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    baseDepositPct: 0.1,
    minDeposit: 100,
    maxDeposit: 10000,
    insuranceDaily: 50,
    incidentMultiplier: 1.5,
    ownerTrustMultiplier: 1.0,
    renterTrustMultiplier: 1.0,
  });

  // Preview calculation inputs
  const [previewInputs, setPreviewInputs] = useState({
    valueEstimate: 1000,
    ownerTrustScore: 50,
    renterTrustScore: 50,
    ownerFactor: 1,
    renterFactor: 1,
  });

  useEffect(() => {
    loadRules();
  }, []);

  const loadRules = async () => {
    try {
      setIsLoading(true);
      const data = await getRules();
      setRules(data);
      setFormData({
        baseDepositPct: data.baseDepositPct,
        minDeposit: data.minDeposit,
        maxDeposit: data.maxDeposit,
        insuranceDaily: data.insuranceDaily,
        incidentMultiplier: data.incidentMultiplier,
        ownerTrustMultiplier: data.ownerTrustMultiplier,
        renterTrustMultiplier: data.renterTrustMultiplier,
      });
    } catch (error: any) {
      toast.error(error.message || "Failed to load rules");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await updateRules(formData);
      toast.success("Rules saved successfully");
      loadRules();
    } catch (error: any) {
      toast.error(error.message || "Failed to save rules");
    } finally {
      setIsSaving(false);
    }
  };

  // Calculate deposit preview
  const calculateDeposit = () => {
    const { valueEstimate, ownerTrustScore, renterTrustScore, ownerFactor, renterFactor } =
      previewInputs;
    const { baseDepositPct, minDeposit, maxDeposit, ownerTrustMultiplier, renterTrustMultiplier } =
      formData;

    const base = valueEstimate * baseDepositPct;
    const ownerMultiplier = Math.pow(ownerTrustMultiplier, ownerFactor);
    const renterMultiplier = Math.pow(renterTrustMultiplier, renterFactor);
    const calculated = base * ownerMultiplier * renterMultiplier;

    return Math.max(minDeposit, Math.min(maxDeposit, calculated));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{t("rules.title")}</h1>
        <p className="text-muted-foreground mt-2">{t("rules.description")}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Rules Form */}
        <Card>
          <CardHeader>
            <CardTitle>{t("rules.settings")}</CardTitle>
            <CardDescription>{t("rules.settingsDescription")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Base Deposit Percentage</Label>
              <Input
                type="number"
                step="0.01"
                value={formData.baseDepositPct}
                onChange={(e) =>
                  setFormData({ ...formData, baseDepositPct: parseFloat(e.target.value) })
                }
              />
            </div>

            <div>
              <Label>Min Deposit (₪)</Label>
              <Input
                type="number"
                value={formData.minDeposit}
                onChange={(e) =>
                  setFormData({ ...formData, minDeposit: parseInt(e.target.value) })
                }
              />
            </div>

            <div>
              <Label>Max Deposit (₪)</Label>
              <Input
                type="number"
                value={formData.maxDeposit}
                onChange={(e) =>
                  setFormData({ ...formData, maxDeposit: parseInt(e.target.value) })
                }
              />
            </div>

            <div>
              <Label>Insurance Daily (₪)</Label>
              <Input
                type="number"
                value={formData.insuranceDaily}
                onChange={(e) =>
                  setFormData({ ...formData, insuranceDaily: parseInt(e.target.value) })
                }
              />
            </div>

            <div>
              <Label>Incident Multiplier</Label>
              <Input
                type="number"
                step="0.1"
                value={formData.incidentMultiplier}
                onChange={(e) =>
                  setFormData({ ...formData, incidentMultiplier: parseFloat(e.target.value) })
                }
              />
            </div>

            <div>
              <Label>Owner Trust Multiplier</Label>
              <Input
                type="number"
                step="0.1"
                value={formData.ownerTrustMultiplier}
                onChange={(e) =>
                  setFormData({ ...formData, ownerTrustMultiplier: parseFloat(e.target.value) })
                }
              />
            </div>

            <div>
              <Label>Renter Trust Multiplier</Label>
              <Input
                type="number"
                step="0.1"
                value={formData.renterTrustMultiplier}
                onChange={(e) =>
                  setFormData({ ...formData, renterTrustMultiplier: parseFloat(e.target.value) })
                }
              />
            </div>

            <Button onClick={handleSave} disabled={isSaving} className="w-full">
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save & Publish
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Deposit Calculator Preview */}
        <Card>
          <CardHeader>
            <CardTitle>{t("rules.depositCalculator")}</CardTitle>
            <CardDescription>{t("rules.calculatorDescription")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Value Estimate (₪)</Label>
              <Input
                type="number"
                value={previewInputs.valueEstimate}
                onChange={(e) =>
                  setPreviewInputs({
                    ...previewInputs,
                    valueEstimate: parseInt(e.target.value),
                  })
                }
              />
            </div>

            <div>
              <Label>Owner Trust Score</Label>
              <Input
                type="number"
                value={previewInputs.ownerTrustScore}
                onChange={(e) =>
                  setPreviewInputs({
                    ...previewInputs,
                    ownerTrustScore: parseInt(e.target.value),
                  })
                }
              />
            </div>

            <div>
              <Label>Renter Trust Score</Label>
              <Input
                type="number"
                value={previewInputs.renterTrustScore}
                onChange={(e) =>
                  setPreviewInputs({
                    ...previewInputs,
                    renterTrustScore: parseInt(e.target.value),
                  })
                }
              />
            </div>

            <div>
              <Label>Owner Factor</Label>
              <Input
                type="number"
                step="0.1"
                value={previewInputs.ownerFactor}
                onChange={(e) =>
                  setPreviewInputs({
                    ...previewInputs,
                    ownerFactor: parseFloat(e.target.value),
                  })
                }
              />
            </div>

            <div>
              <Label>Renter Factor</Label>
              <Input
                type="number"
                step="0.1"
                value={previewInputs.renterFactor}
                onChange={(e) =>
                  setPreviewInputs({
                    ...previewInputs,
                    renterFactor: parseFloat(e.target.value),
                  })
                }
              />
            </div>

            <div className="pt-4 border-t">
              <div className="text-sm text-muted-foreground mb-2">Calculated Deposit:</div>
              <div className="text-3xl font-bold">₪{calculateDeposit().toLocaleString()}</div>
              <div className="text-xs text-muted-foreground mt-2">
                Formula: clamp(valueEstimate × baseDepositPct × ownerMultiplier^ownerFactor ×
                renterMultiplier^renterFactor, minDeposit, maxDeposit)
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

