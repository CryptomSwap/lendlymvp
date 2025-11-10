"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  getPendingListings, 
  approveListing, 
  rejectListing,
  getDisputes,
  resolveDispute,
  getAllUsers,
  getAdminMetrics,
  banUser,
} from "@/lib/actions/admin-moderation";
import { toast } from "sonner";
import { Loader2, CheckCircle2, XCircle, Shield, Users, BarChart3, Package } from "lucide-react";
import { format } from "date-fns";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AdminSettings } from "@/components/admin-settings";

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("metrics");
  const [isLoading, setIsLoading] = useState(false);
  const [listings, setListings] = useState<any[]>([]);
  const [disputes, setDisputes] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [metrics, setMetrics] = useState<any>(null);

  // Stub user ID - in real app, get from session
  const userId = "stub-user-id";

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      if (activeTab === "listings") {
        const data = await getPendingListings(userId);
        setListings(data);
      } else if (activeTab === "disputes") {
        const data = await getDisputes(userId);
        setDisputes(data);
      } else       if (activeTab === "users") {
        const data = await getAllUsers(userId);
        setUsers(data);
      } else if (activeTab === "metrics") {
        const data = await getAdminMetrics(userId);
        setMetrics(data);
      } else if (activeTab === "settings") {
        // Settings tab handles its own loading
        return;
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to load data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleApproveListing = async (listingId: string) => {
    try {
      await approveListing(listingId, userId);
      toast.success("Listing approved");
      loadData();
    } catch (error: any) {
      toast.error(error.message || "Failed to approve listing");
    }
  };

  const handleRejectListing = async (listingId: string, reason?: string) => {
    try {
      await rejectListing(listingId, userId, reason);
      toast.success("Listing rejected");
      loadData();
    } catch (error: any) {
      toast.error(error.message || "Failed to reject listing");
    }
  };

  const handleResolveDispute = async (
    disputeId: string,
    decision: "REFUND_OWNER" | "PARTIAL_REFUND" | "REJECT",
    refundAmount?: number,
    notes?: string
  ) => {
    try {
      await resolveDispute(disputeId, userId, decision, refundAmount, notes);
      toast.success("Dispute resolved");
      loadData();
    } catch (error: any) {
      toast.error(error.message || "Failed to resolve dispute");
    }
  };

  const handleBanUser = async (targetUserId: string, banned: boolean) => {
    try {
      await banUser(targetUserId, userId, banned);
      toast.success(banned ? "User banned" : "User unbanned");
      loadData();
    } catch (error: any) {
      toast.error(error.message || "Failed to update user");
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 space-y-6 pb-24">
      <h1 className="text-h1">Admin Dashboard</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="metrics">
            <BarChart3 className="h-4 w-4 mr-2" />
            Metrics
          </TabsTrigger>
          <TabsTrigger value="listings">
            <Package className="h-4 w-4 mr-2" />
            Listings
          </TabsTrigger>
          <TabsTrigger value="disputes">
            <Shield className="h-4 w-4 mr-2" />
            Disputes
          </TabsTrigger>
          <TabsTrigger value="users">
            <Users className="h-4 w-4 mr-2" />
            Users
          </TabsTrigger>
          <TabsTrigger value="settings">
            Settings
          </TabsTrigger>
        </TabsList>

        {/* Metrics Tab */}
        <TabsContent value="metrics" className="mt-6">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : metrics ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Total Listings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{metrics.totalListings}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {metrics.activeListings} active
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{metrics.totalBookings}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {metrics.completedBookings} completed
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{metrics.conversionRate}%</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {metrics.cancelledBookings} cancelled
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Disputes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{metrics.totalDisputes}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {metrics.openDisputes} open
                  </p>
                </CardContent>
              </Card>
            </div>
          ) : null}
        </TabsContent>

        {/* Listings Tab */}
        <TabsContent value="listings" className="mt-6">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <div className="space-y-4">
              {listings.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <p className="text-muted-foreground">No listings pending moderation</p>
                  </CardContent>
                </Card>
              ) : (
                listings.map((listing) => {
                  const photos = JSON.parse(listing.photos || "[]");
                  return (
                    <Card key={listing.id}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle>{listing.title}</CardTitle>
                            <CardDescription className="mt-1">
                              {listing.category} • ₪{listing.dailyRate}/day
                            </CardDescription>
                          </div>
                          <Badge variant="secondary">
                            {format(new Date(listing.createdAt), "PP")}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex gap-4">
                          {photos[0] && (
                            <div className="relative w-24 h-24 rounded-lg overflow-hidden">
                              <Image
                                src={photos[0]}
                                alt={listing.title}
                                fill
                                className="object-cover"
                              />
                            </div>
                          )}
                          <div className="flex-1">
                            <p className="text-sm text-muted-foreground line-clamp-3">
                              {listing.description}
                            </p>
                            <p className="text-xs text-muted-foreground mt-2">
                              Owner: {listing.owner.name} (Trust: {listing.owner.trustScore})
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleApproveListing(listing.id)}
                            size="sm"
                            className="flex-1"
                          >
                            <CheckCircle2 className="h-4 w-4 mr-2" />
                            Approve
                          </Button>
                          <RejectListingDialog
                            listingId={listing.id}
                            onReject={handleRejectListing}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>
          )}
        </TabsContent>

        {/* Disputes Tab */}
        <TabsContent value="disputes" className="mt-6">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <div className="space-y-4">
              {disputes.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <p className="text-muted-foreground">No disputes</p>
                  </CardContent>
                </Card>
              ) : (
                disputes.map((dispute) => {
                  const evidencePhotos = JSON.parse(dispute.evidencePhotos || "[]");
                  return (
                    <Card key={dispute.id}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle>{dispute.booking.listing.title}</CardTitle>
                            <CardDescription className="mt-1">
                              Type: {dispute.type} • Status: {dispute.status}
                            </CardDescription>
                          </div>
                          <Badge
                            variant={
                              dispute.status === "OPEN" ? "destructive" : "secondary"
                            }
                          >
                            {dispute.status}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <Label className="text-sm font-medium">Description</Label>
                          <p className="text-sm mt-1">{dispute.description}</p>
                        </div>
                        {evidencePhotos.length > 0 && (
                          <div>
                            <Label className="text-sm font-medium">Evidence Photos</Label>
                            <div className="grid grid-cols-3 gap-2 mt-2">
                              {evidencePhotos.map((photo: string, idx: number) => (
                                <div key={idx} className="relative aspect-square rounded-lg overflow-hidden">
                                  <Image
                                    src={photo}
                                    alt={`Evidence ${idx + 1}`}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="text-muted-foreground">Opened by:</span>{" "}
                            {dispute.openedBy.name}
                          </div>
                          <div>
                            <span className="text-muted-foreground">Renter:</span>{" "}
                            {dispute.booking.renter.name} (Trust: {dispute.booking.renter.trustScore})
                          </div>
                        </div>
                        {dispute.status === "OPEN" && (
                          <DisputeResolutionDialog
                            disputeId={dispute.id}
                            bookingId={dispute.bookingId}
                            onResolve={handleResolveDispute}
                            onBanUser={handleBanUser}
                            renterId={dispute.booking.renter.id}
                          />
                        )}
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>
          )}
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="mt-6">
          <AdminSettings />
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users" className="mt-6">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>All Users</CardTitle>
                <CardDescription>Manage users and verification status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Name</th>
                        <th className="text-left p-2">Email</th>
                        <th className="text-left p-2">Trust Score</th>
                        <th className="text-left p-2">Role</th>
                        <th className="text-left p-2">Joined</th>
                        <th className="text-left p-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user.id} className="border-b">
                          <td className="p-2">{user.name}</td>
                          <td className="p-2 text-sm text-muted-foreground">{user.email}</td>
                          <td className="p-2">
                            <Badge variant="secondary">{user.trustScore}</Badge>
                          </td>
                          <td className="p-2">
                            <Badge variant={user.role === "admin" ? "default" : "outline"}>
                              {user.role}
                            </Badge>
                          </td>
                          <td className="p-2 text-sm text-muted-foreground">
                            {format(new Date(user.createdAt), "PP")}
                          </td>
                          <td className="p-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleBanUser(user.id, true)}
                            >
                              Ban
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function RejectListingDialog({
  listingId,
  onReject,
}: {
  listingId: string;
  onReject: (id: string, reason?: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" size="sm" className="flex-1">
          <XCircle className="h-4 w-4 mr-2" />
          Reject
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reject Listing</DialogTitle>
          <DialogDescription>Provide a reason for rejection (optional)</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="reason">Reason</Label>
            <Textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Why is this listing being rejected?"
              className="mt-2"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setOpen(false)} className="flex-1">
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                onReject(listingId, reason);
                setOpen(false);
                setReason("");
              }}
              className="flex-1"
            >
              Reject
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function DisputeResolutionDialog({
  disputeId,
  bookingId,
  onResolve,
  onBanUser,
  renterId,
}: {
  disputeId: string;
  bookingId: string;
  onResolve: (
    id: string,
    decision: "REFUND_OWNER" | "PARTIAL_REFUND" | "REJECT",
    refundAmount?: number,
    notes?: string
  ) => void;
  onBanUser: (userId: string, banned: boolean) => void;
  renterId: string;
}) {
  const [open, setOpen] = useState(false);
  const [decision, setDecision] = useState<"REFUND_OWNER" | "PARTIAL_REFUND" | "REJECT">("REFUND_OWNER");
  const [refundAmount, setRefundAmount] = useState("");
  const [notes, setNotes] = useState("");
  const [banUser, setBanUser] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full">Resolve Dispute</Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Resolve Dispute</DialogTitle>
          <DialogDescription>Make a decision and add notes</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Decision</Label>
            <div className="flex gap-2 mt-2">
              <Button
                variant={decision === "REFUND_OWNER" ? "default" : "outline"}
                onClick={() => setDecision("REFUND_OWNER")}
                className="flex-1"
              >
                Full Refund
              </Button>
              <Button
                variant={decision === "PARTIAL_REFUND" ? "default" : "outline"}
                onClick={() => setDecision("PARTIAL_REFUND")}
                className="flex-1"
              >
                Partial Refund
              </Button>
              <Button
                variant={decision === "REJECT" ? "default" : "outline"}
                onClick={() => setDecision("REJECT")}
                className="flex-1"
              >
                Reject
              </Button>
            </div>
          </div>
          {decision === "PARTIAL_REFUND" && (
            <div>
              <Label htmlFor="refund-amount">Refund Amount (₪)</Label>
              <Input
                id="refund-amount"
                type="number"
                value={refundAmount}
                onChange={(e) => setRefundAmount(e.target.value)}
                placeholder="0.00"
                className="mt-2"
              />
            </div>
          )}
          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add resolution notes..."
              className="mt-2"
            />
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="ban-user"
              checked={banUser}
              onChange={(e) => setBanUser(e.target.checked)}
              className="rounded"
            />
            <Label htmlFor="ban-user" className="cursor-pointer">
              Ban user from platform
            </Label>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setOpen(false)} className="flex-1">
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (banUser) {
                  onBanUser(renterId, true);
                }
                onResolve(
                  disputeId,
                  decision,
                  refundAmount ? parseFloat(refundAmount) : undefined,
                  notes
                );
                setOpen(false);
                setDecision("REFUND_OWNER");
                setRefundAmount("");
                setNotes("");
                setBanUser(false);
              }}
              className="flex-1"
            >
              Resolve
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

