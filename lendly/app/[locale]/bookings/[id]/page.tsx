import { notFound, redirect } from "next/navigation";
import { getBookingById } from "@/lib/actions/bookings";
import { BookingDetail } from "@/components/booking-detail";
import { BookingChat } from "@/components/booking-chat";
import { canUserReview } from "@/lib/actions/reviews";
import { getCurrentUser } from "@/lib/auth";

interface BookingPageProps {
  params: Promise<{ id: string; locale: string }>;
}

export default async function BookingPage({ params }: BookingPageProps) {
  const { id } = await params;
  const booking = await getBookingById(id);

  if (!booking) {
    notFound();
  }

  const user = await getCurrentUser();
  
  if (!user) {
    redirect("/auth/signin");
  }
  
  // Determine who can review whom
  const isOwner = booking.listing.ownerId === user.id;
  const isRenter = booking.renterId === user.id;
  const canReview = await canUserReview(id, user.id);
  const otherPartyId = isOwner ? booking.renterId : booking.listing.ownerId;
  const otherPartyName = isOwner ? booking.renter.name : booking.listing.owner.name;

  return (
    <div className="w-full px-4 py-6 space-y-6 pb-24">
      <BookingDetail 
        booking={booking} 
        canReview={canReview}
        otherPartyId={otherPartyId}
        otherPartyName={otherPartyName}
      />
      <BookingChat booking={booking} currentUserId={user.id} />
    </div>
  );
}
