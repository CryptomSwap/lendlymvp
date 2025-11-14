"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, CheckCircle2, XCircle, Pause, Edit, Search } from "lucide-react";
import { getAdminListings, updateListingStatus } from "@/lib/actions/admin";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { format } from "date-fns";
import Image from "next/image";

export function AdminListings() {
  const t = useTranslations("admin");
  const [listings, setListings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [filters, setFilters] = useState({
    status: "",
    category: "",
    ownerEmail: "",
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadListings();
  }, [page, filters]);

  const loadListings = async () => {
    try {
      setIsLoading(true);
      const data = await getAdminListings({ ...filters, page, pageSize: 20 });
      setListings(data.listings);
      setTotalPages(data.totalPages);
    } catch (error: any) {
      toast.error(error.message || "Failed to load listings");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (listingId: string, status: "APPROVED" | "REJECTED" | "PAUSED") => {
    try {
      await updateListingStatus(listingId, status);
      toast.success(`Listing ${status.toLowerCase()}`);
      loadListings();
    } catch (error: any) {
      toast.error(error.message || "Failed to update listing");
    }
  };

  const handleBulkAction = async (status: "APPROVED" | "REJECTED" | "PAUSED") => {
    try {
      await Promise.all(Array.from(selectedIds).map((id) => updateListingStatus(id, status)));
      toast.success(`Bulk ${status.toLowerCase()} completed`);
      setSelectedIds(new Set());
      loadListings();
    } catch (error: any) {
      toast.error(error.message || "Failed to update listings");
    }
  };

  const toggleSelect = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === listings.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(listings.map((l) => l.id)));
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{t("listings.title")}</h1>
        <p className="text-muted-foreground mt-2">{t("listings.description")}</p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>{t("listings.filters")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div>
              <Label>{t("listings.status")}</Label>
              <Select value={filters.status} onValueChange={(v) => setFilters({ ...filters, status: v })}>
                <SelectTrigger>
                  <SelectValue placeholder={t("listings.allStatuses")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">{t("listings.allStatuses")}</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="APPROVED">Approved</SelectItem>
                  <SelectItem value="REJECTED">Rejected</SelectItem>
                  <SelectItem value="PAUSED">Paused</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>{t("listings.category")}</Label>
              <Input
                placeholder={t("listings.categoryPlaceholder")}
                value={filters.category}
                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
              />
            </div>
            <div>
              <Label>{t("listings.ownerEmail")}</Label>
              <Input
                placeholder={t("listings.emailPlaceholder")}
                value={filters.ownerEmail}
                onChange={(e) => setFilters({ ...filters, ownerEmail: e.target.value })}
              />
            </div>
            <div className="flex items-end">
              <Button onClick={loadListings} className="w-full">
                <Search className="h-4 w-4 mr-2" />
                {t("common.search")}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedIds.size > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                {selectedIds.size} {t("listings.selected")}
              </span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkAction("APPROVED")}
                >
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  {t("listings.bulkApprove")}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkAction("REJECTED")}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  {t("listings.bulkReject")}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkAction("PAUSED")}
                >
                  <Pause className="h-4 w-4 mr-2" />
                  {t("listings.bulkPause")}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Listings Table */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>{t("listings.allListings")}</CardTitle>
            <CardDescription>{t("listings.total")}: {listings.length}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">
                      <Checkbox
                        checked={selectedIds.size === listings.length && listings.length > 0}
                        onCheckedChange={toggleSelectAll}
                      />
                    </th>
                    <th className="text-left p-2">{t("listings.title")}</th>
                    <th className="text-left p-2">{t("listings.owner")}</th>
                    <th className="text-left p-2">{t("listings.category")}</th>
                    <th className="text-left p-2">{t("listings.price")}</th>
                    <th className="text-left p-2">{t("listings.status")}</th>
                    <th className="text-left p-2">{t("listings.createdAt")}</th>
                    <th className="text-left p-2">{t("listings.actions")}</th>
                  </tr>
                </thead>
                <tbody>
                  {listings.map((listing) => {
                    const photos = JSON.parse(listing.photos || "[]");
                    const statusColors: Record<string, string> = {
                      PENDING: "bg-yellow-100 text-yellow-800",
                      APPROVED: "bg-green-100 text-green-800",
                      REJECTED: "bg-red-100 text-red-800",
                      PAUSED: "bg-gray-100 text-gray-800",
                    };
                    return (
                      <tr key={listing.id} className="border-b">
                        <td className="p-2">
                          <Checkbox
                            checked={selectedIds.has(listing.id)}
                            onCheckedChange={() => toggleSelect(listing.id)}
                          />
                        </td>
                        <td className="p-2">
                          <div className="flex items-center gap-2">
                            {photos[0] && (
                              <div className="relative w-10 h-10 rounded overflow-hidden">
                                <Image
                                  src={photos[0]}
                                  alt={listing.title}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            )}
                            <span className="font-medium">{listing.title}</span>
                          </div>
                        </td>
                        <td className="p-2 text-sm">{listing.owner.name}</td>
                        <td className="p-2 text-sm">{listing.category}</td>
                        <td className="p-2 text-sm">₪{listing.dailyRate}/day</td>
                        <td className="p-2">
                          <Badge className={statusColors[listing.status] || ""}>
                            {listing.status}
                          </Badge>
                        </td>
                        <td className="p-2 text-sm text-muted-foreground">
                          {format(new Date(listing.createdAt), "PP")}
                        </td>
                        <td className="p-2">
                          <div className="flex gap-1">
                            {listing.status === "PENDING" && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleStatusChange(listing.id, "APPROVED")}
                                >
                                  <CheckCircle2 className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleStatusChange(listing.id, "REJECTED")}
                                >
                                  <XCircle className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleStatusChange(listing.id, "PAUSED")}
                            >
                              <Pause className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-4">
                <Button
                  variant="outline"
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                >
                  Previous
                </Button>
                <span className="text-sm text-muted-foreground">
                  Page {page} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  disabled={page === totalPages}
                  onClick={() => setPage(page + 1)}
                >
                  Next
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

