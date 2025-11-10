import { notFound } from "next/navigation";
import { getListingById, updateListing } from "@/lib/actions/listings";
import { EditListingForm } from "@/components/edit-listing-form";

interface EditListingPageProps {
  params: Promise<{ id: string; locale: string }>;
}

export default async function EditListingPage({ params }: EditListingPageProps) {
  const { id } = await params;
  const listing = await getListingById(id);

  if (!listing) {
    notFound();
  }

  // In a real app, verify ownership
  const ownerId = "stub-user-id";
  if (listing.ownerId !== ownerId) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-6 pb-24">
      <h1 className="text-h1 mb-6">Edit Listing</h1>
      <EditListingForm listing={listing} />
    </div>
  );
}

