"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Package, AlertTriangle, TrendingUp, Users } from "lucide-react";
import { getAdminMetrics } from "@/lib/actions/admin";
import { useTranslations } from "next-intl";
import { format } from "date-fns";

export function AdminOverview() {
  const t = useTranslations("admin");
  const [metrics, setMetrics] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadMetrics();
  }, []);

  const loadMetrics = async () => {
    try {
      setIsLoading(true);
      const data = await getAdminMetrics();
      setMetrics(data);
    } catch (error) {
      console.error("Failed to load metrics:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!metrics) {
    return <div className="text-center text-muted-foreground">{t("overview.noData")}</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{t("overview.title")}</h1>
        <p className="text-muted-foreground mt-2">{t("overview.description")}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("overview.activeListings")}</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.activeListings || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {metrics.pendingApprovals || 0} {t("overview.pending")}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("overview.openDisputes")}</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.openDisputes || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {metrics.totalDisputes || 0} {t("overview.total")}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("overview.gmv")}</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₪{metrics.gmv?.toLocaleString() || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {t("overview.totalRevenue")}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("overview.conversion")}</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.conversionRate || 0}%</div>
            <p className="text-xs text-muted-foreground mt-1">
              {t("overview.completionRate")}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts section - simplified for now, can add Recharts later */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t("overview.bookingsChart")}</CardTitle>
            <CardDescription>{t("overview.bookingsPerWeek")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] flex items-center justify-center text-muted-foreground">
              {t("overview.chartPlaceholder")}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("overview.approvalsChart")}</CardTitle>
            <CardDescription>{t("overview.approvalsVsRejections")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] flex items-center justify-center text-muted-foreground">
              {t("overview.chartPlaceholder")}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

