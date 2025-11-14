"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Download } from "lucide-react";
import { getAdminMetricsWithRange } from "@/lib/actions/admin";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { format, subDays } from "date-fns";

export function AdminMetrics() {
  const t = useTranslations("admin");
  const [metrics, setMetrics] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    from: format(subDays(new Date(), 30), "yyyy-MM-dd"),
    to: format(new Date(), "yyyy-MM-dd"),
  });

  useEffect(() => {
    loadMetrics();
  }, [dateRange]);

  const loadMetrics = async () => {
    try {
      setIsLoading(true);
      const from = new Date(dateRange.from);
      const to = new Date(dateRange.to);
      to.setHours(23, 59, 59, 999); // End of day
      const data = await getAdminMetricsWithRange(from, to);
      setMetrics(data);
    } catch (error: any) {
      toast.error(error.message || "Failed to load metrics");
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = () => {
    if (!metrics) return;
    const csv = [
      ["Metric", "Value"],
      ["New Users", metrics.newUsers],
      ["Bookings", metrics.bookings],
      ["Completed Bookings", metrics.completedBookings],
      ["Completion Rate (%)", metrics.completionRate],
      ["Disputes", metrics.disputes],
      ["Disputes Rate (%)", metrics.disputesRate],
      ["Avg Trust Score", metrics.avgTrustScore],
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `metrics-${dateRange.from}-${dateRange.to}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t("metrics.title")}</h1>
          <p className="text-muted-foreground mt-2">{t("metrics.description")}</p>
        </div>
        <Button onClick={handleExport} variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Date Range Picker */}
      <Card>
        <CardHeader>
          <CardTitle>{t("metrics.dateRange")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <Label>From</Label>
              <Input
                type="date"
                value={dateRange.from}
                onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
              />
            </div>
            <div>
              <Label>To</Label>
              <Input
                type="date"
                value={dateRange.to}
                onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
              />
            </div>
            <div className="flex items-end">
              <Button onClick={loadMetrics} className="w-full">
                {t("common.search")}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Metrics Cards */}
      {metrics && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">{t("metrics.newUsers")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.newUsers || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">{t("metrics.bookings")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.bookings || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {metrics.completedBookings || 0} {t("metrics.completed")}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">{t("metrics.completionRate")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.completionRate || 0}%</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">{t("metrics.disputesRate")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.disputesRate || 0}%</div>
              <p className="text-xs text-muted-foreground mt-1">
                {metrics.disputes || 0} {t("metrics.totalDisputes")}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">{t("metrics.avgTrustScore")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.avgTrustScore || 0}</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Charts placeholder */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t("metrics.newUsersChart")}</CardTitle>
            <CardDescription>{t("metrics.usersOverTime")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] flex items-center justify-center text-muted-foreground">
              {t("metrics.chartPlaceholder")}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("metrics.bookingsChart")}</CardTitle>
            <CardDescription>{t("metrics.bookingsOverTime")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] flex items-center justify-center text-muted-foreground">
              {t("metrics.chartPlaceholder")}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

