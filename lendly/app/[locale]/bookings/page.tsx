import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "@/i18n/routing";
import { Calendar, Clock } from "lucide-react";
import { format } from "date-fns";
import { getBookingsForUser } from "@/lib/actions/bookings";

export default async function BookingsPage() {
  // In a real app, get from session
  const userId = "stub-user-id";
  const bookings = await getBookingsForUser(userId);

  return (
    <div className="container mx-auto px-4 py-6 space-y-4 pb-24">
      <h1 className="text-h1">My Bookings</h1>

      {bookings.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">No bookings yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking: any) => {
            const statusMap: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
              DRAFT: { label: "Draft", variant: "outline" },
              RESERVED: { label: "Reserved", variant: "secondary" },
              CONFIRMED: { label: "Confirmed", variant: "default" },
              COMPLETED: { label: "Completed", variant: "default" },
              CANCELLED: { label: "Cancelled", variant: "destructive" },
              DISPUTED: { label: "Disputed", variant: "destructive" },
            };

            const status = statusMap[booking.status] || statusMap.DRAFT;
            const isExpiringSoon = booking.status === "RESERVED" && booking.expiresAt && new Date(booking.expiresAt) < new Date(Date.now() + 2 * 60 * 60 * 1000); // 2 hours

            return (
              <Link key={booking.id} href={`/bookings/${booking.id}`}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{booking.listing.title}</CardTitle>
                      <Badge variant={status.variant}>{status.label}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {format(new Date(booking.startDate), "PPP")} - {format(new Date(booking.endDate), "PPP")}
                      </span>
                    </div>
                    {booking.status === "RESERVED" && booking.expiresAt && (
                      <div className={`flex items-center gap-2 text-sm ${isExpiringSoon ? "text-warning" : "text-muted-foreground"}`}>
                        <Clock className="h-4 w-4" />
                        <span>
                          Expires: {format(new Date(booking.expiresAt), "PPp")}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center justify-between pt-2 border-t">
                      <span className="text-sm text-muted-foreground">Total</span>
                      <span className="font-semibold">
                        ₪{(booking.listing.dailyRate * Math.ceil((new Date(booking.endDate).getTime() - new Date(booking.startDate).getTime()) / (1000 * 60 * 60 * 24))).toFixed(2)}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
