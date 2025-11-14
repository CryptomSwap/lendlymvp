import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, CheckCircle2, AlertTriangle, Users, FileCheck, MessageSquare } from "lucide-react";
import { Link } from "@/i18n/routing";

export default function SafetyPage() {
  return (
    <div className="container mx-auto px-4 py-6 space-y-6 pb-24 max-w-4xl">
      <div className="text-center mb-8">
        <Shield className="h-16 w-16 mx-auto mb-4 text-[#009999]" />
        <h1 className="text-h1 mb-2">Safety & Trust</h1>
        <p className="text-muted-foreground">
          Learn about our safety measures and trust-building features
        </p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileCheck className="h-5 w-5 text-[#009999]" />
              Verification Process
            </CardTitle>
            <CardDescription>
              How we verify user identities and build trust
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  ID Verification
                </h3>
                <p className="text-sm text-muted-foreground">
                  All users who want to list items must verify their identity by uploading a government-issued ID. This helps ensure that everyone on the platform is who they claim to be.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  Email Verification
                </h3>
                <p className="text-sm text-muted-foreground">
                  All users must verify their email address when creating an account. This helps prevent fake accounts and ensures we can contact you about your bookings.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  Phone Verification (Coming Soon)
                </h3>
                <p className="text-sm text-muted-foreground">
                  We're working on adding phone number verification for an additional layer of security.
                </p>
              </div>
            </div>

            <div className="pt-4 border-t">
              <Link href="/verify-account">
                <button className="px-4 py-2 bg-[#009999] text-white rounded-lg hover:bg-[#007777] transition-colors text-sm">
                  Verify Your Account
                </button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-[#009999]" />
              Trust Scores
            </CardTitle>
            <CardDescription>
              How we calculate and display user trustworthiness
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <h3 className="font-semibold mb-2">What is a Trust Score?</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Your trust score is a numerical rating (0-100) that reflects your reliability and trustworthiness on the platform. It's calculated based on several factors:
                </p>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
                  <li>Completed bookings without issues</li>
                  <li>Positive reviews from other users</li>
                  <li>Account verification status</li>
                  <li>Response time to messages</li>
                  <li>On-time returns and pickups</li>
                  <li>Dispute history</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-2">How to Improve Your Trust Score</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Here are some ways to build and maintain a high trust score:
                </p>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
                  <li>Complete all bookings successfully</li>
                  <li>Return items on time and in good condition</li>
                  <li>Respond promptly to messages</li>
                  <li>Leave honest reviews after transactions</li>
                  <li>Verify your account</li>
                  <li>Avoid cancellations and disputes</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Why Trust Scores Matter</h3>
                <p className="text-sm text-muted-foreground">
                  Owners are more likely to approve bookings from users with higher trust scores. Similarly, renters prefer to book from owners with good trust scores. A high trust score can help you get more bookings and list more items.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-[#009999]" />
              Dispute Resolution
            </CardTitle>
            <CardDescription>
              How we handle conflicts and disputes between users
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <h3 className="font-semibold mb-2">What is a Dispute?</h3>
                <p className="text-sm text-muted-foreground">
                  A dispute occurs when there's a disagreement between a renter and owner, such as damage to an item, missing items, or payment issues. Both parties can file a dispute through the platform.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">How Disputes are Resolved</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Our support team reviews disputes by:
                </p>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
                  <li>Reviewing photos and evidence from both parties</li>
                  <li>Checking booking details and communication history</li>
                  <li>Considering the condition reports from pickup and return</li>
                  <li>Making a fair decision based on platform policies</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Dispute Outcomes</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Possible outcomes include:
                </p>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
                  <li>Full deposit refund to renter</li>
                  <li>Partial deposit deduction for repairs</li>
                  <li>Full deposit deduction for significant damage or loss</li>
                  <li>Additional charges if damage exceeds deposit amount</li>
                </ul>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-sm mb-1">Important</h4>
                    <p className="text-sm text-muted-foreground">
                      Always document the condition of items with photos at pickup and return. This evidence is crucial for resolving disputes fairly.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-[#009999]" />
              Safety Tips
            </CardTitle>
            <CardDescription>
              Best practices for safe renting and listing
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <h3 className="font-semibold mb-2">For Renters</h3>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
                  <li>Read item descriptions and reviews carefully before booking</li>
                  <li>Communicate with owners through the platform messaging system</li>
                  <li>Inspect items thoroughly at pickup and document any existing damage</li>
                  <li>Use items only as intended and follow any usage instructions</li>
                  <li>Return items on time and in the same condition</li>
                  <li>Report any issues immediately to the owner</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-2">For Owners</h3>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
                  <li>Provide accurate descriptions and clear photos of your items</li>
                  <li>Set realistic rental rates and availability</li>
                  <li>Respond promptly to booking requests and messages</li>
                  <li>Document item condition before and after each rental</li>
                  <li>Be available for pickup and return coordination</li>
                  <li>Leave honest reviews after completed rentals</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

