import { Card, CardContent } from "@/components/ui/card";
import { FileText } from "lucide-react";

export default function TermsOfServicePage() {
  return (
    <div className="container mx-auto px-4 py-6 space-y-6 pb-24 max-w-4xl">
      <div className="text-center mb-8">
        <FileText className="h-16 w-16 mx-auto mb-4 text-[#009999]" />
        <h1 className="text-h1 mb-2">Terms of Service</h1>
        <p className="text-muted-foreground">
          Last updated: {new Date().toLocaleDateString()}
        </p>
      </div>

      <Card>
        <CardContent className="p-8 space-y-6 prose prose-sm max-w-none">
          <section>
            <h2 className="text-h3 mb-4">1. Acceptance of Terms</h2>
            <p className="text-muted-foreground">
              By accessing and using Lendly, you accept and agree to be bound by the terms and provision of this agreement.
            </p>
          </section>

          <section>
            <h2 className="text-h3 mb-4">2. Use License</h2>
            <p className="text-muted-foreground mb-2">
              Permission is granted to temporarily use Lendly for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
            </p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
              <li>modify or copy the materials</li>
              <li>use the materials for any commercial purpose or for any public display</li>
              <li>attempt to reverse engineer any software contained on Lendly</li>
              <li>remove any copyright or other proprietary notations from the materials</li>
            </ul>
          </section>

          <section>
            <h2 className="text-h3 mb-4">3. User Responsibilities</h2>
            <p className="text-muted-foreground mb-2">
              As a user of Lendly, you agree to:
            </p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
              <li>Provide accurate and truthful information</li>
              <li>Maintain the security of your account</li>
              <li>Respect other users and their property</li>
              <li>Comply with all applicable laws and regulations</li>
              <li>Return rented items in the same condition as received</li>
            </ul>
          </section>

          <section>
            <h2 className="text-h3 mb-4">4. Rental Terms</h2>
            <p className="text-muted-foreground">
              All rentals are subject to the terms agreed upon between the renter and owner. Lendly acts as a platform to facilitate these transactions but is not a party to the rental agreement.
            </p>
          </section>

          <section>
            <h2 className="text-h3 mb-4">5. Security Deposits</h2>
            <p className="text-muted-foreground">
              Security deposits may be required for certain rentals. Deposits will be held until the item is returned in satisfactory condition. Refunds are subject to inspection and may take 3-5 business days.
            </p>
          </section>

          <section>
            <h2 className="text-h3 mb-4">6. Dispute Resolution</h2>
            <p className="text-muted-foreground">
              In case of disputes between users, Lendly may assist in resolution but is not responsible for the outcome. Users are encouraged to resolve issues amicably.
            </p>
          </section>

          <section>
            <h2 className="text-h3 mb-4">7. Limitation of Liability</h2>
            <p className="text-muted-foreground">
              Lendly shall not be liable for any damages arising from the use or inability to use the platform, including but not limited to direct, indirect, incidental, or consequential damages.
            </p>
          </section>

          <section>
            <h2 className="text-h3 mb-4">8. Modifications</h2>
            <p className="text-muted-foreground">
              Lendly reserves the right to revise these terms at any time. By continuing to use the platform after changes are made, you agree to be bound by the revised terms.
            </p>
          </section>

          <section>
            <h2 className="text-h3 mb-4">9. Contact Information</h2>
            <p className="text-muted-foreground">
              If you have any questions about these Terms of Service, please contact us at legal@lendly.com
            </p>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}

