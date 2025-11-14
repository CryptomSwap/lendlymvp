import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Book, PlusCircle, Calendar, Shield, ArrowRight } from "lucide-react";
import { Link } from "@/i18n/routing";

export default function GettingStartedPage() {
  return (
    <div className="container mx-auto px-4 py-6 space-y-6 pb-24 max-w-4xl">
      <div className="text-center mb-8">
        <Book className="h-16 w-16 mx-auto mb-4 text-[#009999]" />
        <h1 className="text-h1 mb-2">Getting Started</h1>
        <p className="text-muted-foreground">
          Learn how to use Lendly to rent or list items
        </p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PlusCircle className="h-5 w-5 text-[#009999]" />
              How to Create a Listing
            </CardTitle>
            <CardDescription>
              Step-by-step guide to listing your items for rent
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#009999] text-white flex items-center justify-center font-semibold">
                  1
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Sign in to your account</h3>
                  <p className="text-sm text-muted-foreground">
                    Create an account or sign in if you already have one. You'll need to verify your identity to list items.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#009999] text-white flex items-center justify-center font-semibold">
                  2
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Click "List Item"</h3>
                  <p className="text-sm text-muted-foreground">
                    Navigate to the listings page and click the "List Item" or "List Your Gear" button.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#009999] text-white flex items-center justify-center font-semibold">
                  3
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Fill in item details</h3>
                  <p className="text-sm text-muted-foreground">
                    Provide information about your item including title, description, category, daily rate, and upload photos.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#009999] text-white flex items-center justify-center font-semibold">
                  4
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Set availability</h3>
                  <p className="text-sm text-muted-foreground">
                    Use the calendar to mark which dates your item is available for rent.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#009999] text-white flex items-center justify-center font-semibold">
                  5
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Submit for review</h3>
                  <p className="text-sm text-muted-foreground">
                    Once submitted, your listing will be reviewed by our team before going live. This usually takes 24-48 hours.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t">
              <Link href="/listings/new">
                <Button className="w-full sm:w-auto">
                  Create Your First Listing
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-[#009999]" />
              How to Book an Item
            </CardTitle>
            <CardDescription>
              Learn how to rent items from other users
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#009999] text-white flex items-center justify-center font-semibold">
                  1
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Browse available items</h3>
                  <p className="text-sm text-muted-foreground">
                    Use the search function or browse categories to find items you want to rent. Filter by location, price, and availability.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#009999] text-white flex items-center justify-center font-semibold">
                  2
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Select dates</h3>
                  <p className="text-sm text-muted-foreground">
                    Choose your rental start and end dates on the item's detail page. Make sure the item is available for your desired dates.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#009999] text-white flex items-center justify-center font-semibold">
                  3
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Review pricing</h3>
                  <p className="text-sm text-muted-foreground">
                    Check the total cost including daily rate, security deposit, and optional insurance. Deposits are refundable upon return.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#009999] text-white flex items-center justify-center font-semibold">
                  4
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Submit reservation request</h3>
                  <p className="text-sm text-muted-foreground">
                    Click "Reserve Now" to submit your request. The owner has 12 hours to approve or decline your reservation.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#009999] text-white flex items-center justify-center font-semibold">
                  5
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Pick up and return</h3>
                  <p className="text-sm text-muted-foreground">
                    Once approved, coordinate with the owner for pickup. Complete the pickup checklist, use the item, and return it in the same condition.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t">
              <Link href="/search">
                <Button className="w-full sm:w-auto" variant="outline">
                  Browse Available Items
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-[#009999]" />
              Understanding Deposits
            </CardTitle>
            <CardDescription>
              Learn how security deposits work on Lendly
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <h3 className="font-semibold mb-2">What is a security deposit?</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  A security deposit is a refundable amount held to cover potential damage or loss of the rented item. It's calculated based on the item's value and rental duration.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">When is the deposit charged?</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  The deposit is authorized (but not charged) when you make a reservation. It's only charged if the owner confirms your booking.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">When do I get my deposit back?</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Your deposit is fully refunded when you return the item in the same condition as received. Refunds typically process within 3-5 business days after return.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">What if there's damage?</h3>
                <p className="text-sm text-muted-foreground">
                  If the item is damaged or not returned, the owner can file a dispute. Our team will review the case and may deduct repair or replacement costs from your deposit.
                </p>
              </div>
            </div>

            <div className="pt-4 border-t">
              <Link href="/help/faq">
                <Button className="w-full sm:w-auto" variant="outline">
                  Read More FAQs
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

