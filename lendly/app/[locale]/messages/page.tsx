import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "@/i18n/routing";
import { MessageSquare, Clock, CheckCircle2 } from "lucide-react";
import { format } from "date-fns";
import { getBookingsForUser } from "@/lib/actions/bookings";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function MessagesPage() {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect("/auth/signin");
  }
  
  const bookings = await getBookingsForUser(user.id);

  // Filter bookings that need owner action (RESERVED status for owner's listings)
  const pendingBookings = bookings.filter(
    (booking: any) =>
      booking.status === "RESERVED" && booking.listing.ownerId === user.id
  );

  return (
    <div className="container mx-auto px-4 py-6 space-y-6 pb-24">
      <h1 className="text-h1">Inbox</h1>

      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="pending">
            Pending Approvals
            {pendingBookings.length > 0 && (
              <Badge variant="destructive" className="ml-2">
                {pendingBookings.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {bookings.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No conversations yet</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {bookings.map((booking: any) => {
                const statusMap: Record<
                  string,
                  {
                    label: string;
                    variant:
                      | "default"
                      | "secondary"
                      | "destructive"
                      | "outline";
                  }
                > = {
                  DRAFT: { label: "Draft", variant: "outline" },
                  RESERVED: { label: "Reserved", variant: "secondary" },
                  CONFIRMED: { label: "Confirmed", variant: "default" },
                  COMPLETED: { label: "Completed", variant: "default" },
                  CANCELLED: { label: "Cancelled", variant: "destructive" },
                  DISPUTED: { label: "Disputed", variant: "destructive" },
                };

                const status = statusMap[booking.status] || statusMap.DRAFT;
                const isPending = booking.status === "RESERVED" && booking.listing.ownerId === userId;

                return (
                  <Link key={booking.id} href={`/bookings/${booking.id}`}>
                    <Card className={`hover:shadow-lg transition-shadow cursor-pointer ${isPending ? "border-warning/20" : ""}`}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg flex items-center gap-2">
                            {isPending && <Clock className="h-5 w-5 text-warning" />}
                            {booking.listing.title}
                          </CardTitle>
                          <Badge variant={status.variant}>{status.label}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                            <p className="text-sm text-muted-foreground">
                              {booking.listing.ownerId === user.id
                                ? `Renter: ${booking.renter?.name || "Unknown"}`
                                : `Owner: ${booking.listing.owner?.name || "Unknown"}`}
                            </p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                          <span>
                            {format(new Date(booking.startDate), "PPP")} -{" "}
                            {format(new Date(booking.endDate), "PPP")}
                          </span>
                        </div>
                        {isPending && booking.expiresAt && (
                          <div className="flex items-center gap-2 text-sm text-warning mt-2">
                            <Clock className="h-4 w-4" />
                            <span>
                              Expires: {format(new Date(booking.expiresAt), "PPp")}
                            </span>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          {pendingBookings.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <CheckCircle2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No pending approvals</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {pendingBookings.map((booking: any) => {
                const isExpiringSoon =
                  booking.expiresAt &&
                  new Date(booking.expiresAt) <
                    new Date(Date.now() + 2 * 60 * 60 * 1000); // 2 hours

                return (
                  <Link key={booking.id} href={`/bookings/${booking.id}`}>
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer border-warning/20">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg flex items-center gap-2">
                            <Clock className="h-5 w-5 text-warning" />
                            {booking.listing.title}
                          </CardTitle>
                          <Badge variant="secondary">Action Required</Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <p className="text-sm text-muted-foreground">
                          New reservation from {booking.renter?.name || "Guest"}
                        </p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>
                            {format(new Date(booking.startDate), "PPP")} -{" "}
                            {format(new Date(booking.endDate), "PPP")}
                          </span>
                        </div>
                        {booking.expiresAt && (
                          <div
                            className={`flex items-center gap-2 text-sm ${
                              isExpiringSoon ? "text-warning font-medium" : "text-muted-foreground"
                            }`}
                          >
                            <Clock className="h-4 w-4" />
                            <span>
                              Expires: {format(new Date(booking.expiresAt), "PPp")}
                            </span>
                          </div>
                        )}
                        <div className="flex gap-2 pt-2">
                          <div className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium">
                            <CheckCircle2 className="h-4 w-4" />
                            Review & Approve
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
