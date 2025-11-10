"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Package, ArrowRight, CheckCircle2, XCircle } from "lucide-react";
import { format } from "date-fns";
import Image from "next/image";

interface BookingTimelineProps {
  booking: any;
}

export function BookingTimeline({ booking }: BookingTimelineProps) {
  const checklists = booking.checklists || [];
  const pickupChecklist = checklists.find((c: any) => c.phase === "PICKUP");
  const returnChecklist = checklists.find((c: any) => c.phase === "RETURN");

  const timelineItems = [
    {
      type: "created",
      label: "Booking Created",
      timestamp: booking.createdAt,
      icon: Clock,
      status: "completed" as const,
    },
    {
      type: "approved",
      label: "Booking Approved",
      timestamp: (booking.status === "CONFIRMED" || booking.status === "COMPLETED" || booking.status === "DISPUTED") 
        ? booking.updatedAt 
        : null,
      icon: CheckCircle2,
      status: (booking.status === "RESERVED" ? "pending" : "completed") as const,
    },
    {
      type: "pickup",
      label: "Item Picked Up",
      timestamp: pickupChecklist ? (pickupChecklist.signedAt || pickupChecklist.createdAt) : null,
      icon: Package,
      status: (pickupChecklist ? "completed" : "pending") as const,
      checklist: pickupChecklist,
    },
    {
      type: "return",
      label: "Item Returned",
      timestamp: returnChecklist ? (returnChecklist.signedAt || returnChecklist.createdAt) : null,
      icon: ArrowRight,
      status: (returnChecklist ? "completed" : "pending") as const,
      checklist: returnChecklist,
    },
  ].filter((item) => item.timestamp || item.status === "pending");

  if (timelineItems.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Booking Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {timelineItems.map((item, index) => {
            const Icon = item.icon;
            const isLast = index === timelineItems.length - 1;
            const photos = item.checklist
              ? JSON.parse(item.checklist.photos || "[]")
              : [];

            return (
              <div key={item.type} className="relative">
                {/* Timeline line */}
                {!isLast && (
                  <div
                    className={`absolute left-5 top-10 w-0.5 h-full ${
                      item.status === "completed" ? "bg-primary" : "bg-muted"
                    }`}
                  />
                )}

                <div className="flex gap-4">
                  {/* Icon */}
                  <div
                    className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full ${
                      item.status === "completed"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 pb-6">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium">{item.label}</p>
                      <Badge
                        variant={
                          item.status === "completed" ? "default" : "outline"
                        }
                      >
                        {item.status === "completed" ? "Completed" : "Pending"}
                      </Badge>
                    </div>
                    {item.timestamp && (
                      <p className="text-sm text-muted-foreground mb-2">
                        {format(
                          item.timestamp instanceof Date 
                            ? item.timestamp 
                            : new Date(item.timestamp), 
                          "PPp"
                        )}
                      </p>
                    )}

                    {/* Checklist Details */}
                    {item.checklist && (
                      <div className="mt-3 space-y-3 p-4 bg-muted/50 rounded-lg">
                        {item.checklist.serial && (
                          <div>
                            <p className="text-xs text-muted-foreground">
                              Serial/Model
                            </p>
                            <p className="text-sm font-medium">
                              {item.checklist.serial}
                            </p>
                          </div>
                        )}

                        {item.checklist.conditionNotes && (
                          <div>
                            <p className="text-xs text-muted-foreground">
                              Condition Notes
                            </p>
                            <p className="text-sm">{item.checklist.conditionNotes}</p>
                          </div>
                        )}

                        {photos.length > 0 && (
                          <div>
                            <p className="text-xs text-muted-foreground mb-2">
                              Photos ({photos.length})
                            </p>
                            <div className="grid grid-cols-3 gap-2">
                              {photos.slice(0, 6).map((photo: string, idx: number) => (
                                <div
                                  key={idx}
                                  className="relative aspect-square rounded-lg overflow-hidden border"
                                >
                                  <Image
                                    src={photo}
                                    alt={`${item.type} photo ${idx + 1}`}
                                    fill
                                    className="object-cover"
                                    onError={(e) => {
                                      (e.target as HTMLImageElement).src =
                                        "/placeholder-listing.jpg";
                                    }}
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {item.type === "return" && item.checklist.conditionNotes && (
                          <div>
                            <p className="text-xs text-muted-foreground">
                              Final Status
                            </p>
                            <Badge
                              variant={
                                booking.status === "DISPUTED"
                                  ? "destructive"
                                  : "default"
                              }
                            >
                              {booking.status}
                            </Badge>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

