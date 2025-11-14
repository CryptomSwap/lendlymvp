"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
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
import { Loader2, MessageSquare, Image as ImageIcon } from "lucide-react";
import { getAdminDisputes, updateDisputeStatus } from "@/lib/actions/admin";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { format } from "date-fns";
import Image from "next/image";
import Link from "next/link";

const statusColumns = [
  { key: "OPEN", label: "Open" },
  { key: "IN_REVIEW", label: "In Review" },
  { key: "RESOLVED_OWNER", label: "Resolved (Owner)" },
  { key: "RESOLVED_RENTER", label: "Resolved (Renter)" },
  { key: "REFUND_PARTIAL", label: "Partial Refund" },
];

export function AdminDisputes() {
  const t = useTranslations("admin");
  const [disputes, setDisputes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDispute, setSelectedDispute] = useState<any>(null);
  const [resolutionNotes, setResolutionNotes] = useState("");

  useEffect(() => {
    loadDisputes();
  }, []);

  const loadDisputes = async () => {
    try {
      setIsLoading(true);
      const data = await getAdminDisputes();
      setDisputes(data);
    } catch (error: any) {
      toast.error(error.message || "Failed to load disputes");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (disputeId: string, status: string) => {
    try {
      await updateDisputeStatus(disputeId, status as any, resolutionNotes);
      toast.success("Dispute status updated");
      setSelectedDispute(null);
      setResolutionNotes("");
      loadDisputes();
    } catch (error: any) {
      toast.error(error.message || "Failed to update dispute");
    }
  };

  const getDisputesByStatus = (status: string) => {
    return disputes.filter((d) => d.status === status);
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
        <h1 className="text-3xl font-bold">{t("disputes.title")}</h1>
        <p className="text-muted-foreground mt-2">{t("disputes.description")}</p>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {statusColumns.map((column) => {
          const columnDisputes = getDisputesByStatus(column.key);
          return (
            <div key={column.key} className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">{column.label}</h3>
                <Badge variant="secondary">{columnDisputes.length}</Badge>
              </div>
              <div className="space-y-2">
                {columnDisputes.map((dispute) => {
                  const photos = JSON.parse(dispute.evidencePhotos || "[]");
                  const listingPhotos = JSON.parse(dispute.booking.listing.photos || "[]");
                  return (
                    <Card
                      key={dispute.id}
                      className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => setSelectedDispute(dispute)}
                    >
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm">{dispute.booking.listing.title}</CardTitle>
                        <CardDescription className="text-xs">
                          {format(new Date(dispute.createdAt), "PP")}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {dispute.description}
                        </p>
                        {photos.length > 0 && (
                          <div className="mt-2 flex gap-1">
                            <ImageIcon className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">{photos.length} photos</span>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Dispute Detail Dialog */}
      {selectedDispute && (
        <Dialog open={!!selectedDispute} onOpenChange={() => setSelectedDispute(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Dispute Details</DialogTitle>
              <DialogDescription>
                Booking: {selectedDispute.booking.listing.title}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Description</Label>
                <p className="text-sm mt-1">{selectedDispute.description}</p>
              </div>

              <div>
                <Label>Booking Info</Label>
                <div className="grid grid-cols-2 gap-4 mt-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Renter: </span>
                    {selectedDispute.booking.renter.name} (Trust: {selectedDispute.booking.renter.trustScore})
                  </div>
                  <div>
                    <span className="text-muted-foreground">Opened by: </span>
                    {selectedDispute.openedBy.name}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Dates: </span>
                    {format(new Date(selectedDispute.booking.startDate), "PP")} -{" "}
                    {format(new Date(selectedDispute.booking.endDate), "PP")}
                  </div>
                  <div>
                    <Link href={`/messages?booking=${selectedDispute.bookingId}`}>
                      <Button variant="outline" size="sm">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        View Messages
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>

              <div>
                <Label>Evidence Photos</Label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {JSON.parse(selectedDispute.evidencePhotos || "[]").map((photo: string, idx: number) => (
                    <div key={idx} className="relative aspect-square rounded-lg overflow-hidden">
                      <Image src={photo} alt={`Evidence ${idx + 1}`} fill className="object-cover" />
                    </div>
                  ))}
                </div>
              </div>

              {selectedDispute.ownerEvidence && (
                <div>
                  <Label>Owner Evidence</Label>
                  <pre className="text-xs mt-1 p-2 bg-muted rounded">
                    {JSON.stringify(JSON.parse(selectedDispute.ownerEvidence), null, 2)}
                  </pre>
                </div>
              )}

              {selectedDispute.renterEvidence && (
                <div>
                  <Label>Renter Evidence</Label>
                  <pre className="text-xs mt-1 p-2 bg-muted rounded">
                    {JSON.stringify(JSON.parse(selectedDispute.renterEvidence), null, 2)}
                  </pre>
                </div>
              )}

              <div>
                <Label>Resolution Notes</Label>
                <Textarea
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                  placeholder="Add resolution notes..."
                  className="mt-2"
                />
              </div>

              <div>
                <Label>Change Status</Label>
                <div className="flex gap-2 mt-2">
                  {statusColumns.map((col) => (
                    <Button
                      key={col.key}
                      variant={selectedDispute.status === col.key ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleStatusChange(selectedDispute.id, col.key)}
                    >
                      {col.label}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

