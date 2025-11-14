import { Card, CardContent } from "@/components/ui/card";
import { Shield } from "lucide-react";

export default function InsuranceTermsPage() {
  return (
    <div className="container mx-auto px-4 py-6 space-y-6 pb-24 max-w-4xl">
      <div className="text-center mb-8">
        <Shield className="h-16 w-16 mx-auto mb-4 text-[#009999]" />
        <h1 className="text-h1 mb-2">Insurance Terms</h1>
        <p className="text-muted-foreground">
          Last updated: {new Date().toLocaleDateString()}
        </p>
      </div>

      <Card>
        <CardContent className="p-8 space-y-6 prose prose-sm max-w-none">
          <section>
            <h2 className="text-h3 mb-4">1. Coverage Overview</h2>
            <p className="text-muted-foreground">
              Lendly offers optional insurance coverage for rented items. This coverage provides protection against damage, loss, or theft during the rental period.
            </p>
          </section>

          <section>
            <h2 className="text-h3 mb-4">2. What's Covered</h2>
            <p className="text-muted-foreground mb-2">
              Insurance coverage includes:
            </p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
              <li>Accidental damage to the rented item</li>
              <li>Theft of the rented item (with police report)</li>
              <li>Loss of the rented item</li>
              <li>Repair costs up to the item's declared value</li>
            </ul>
          </section>

          <section>
            <h2 className="text-h3 mb-4">3. What's Not Covered</h2>
            <p className="text-muted-foreground mb-2">
              Insurance does not cover:
            </p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
              <li>Normal wear and tear</li>
              <li>Intentional damage or misuse</li>
              <li>Damage from use outside of intended purpose</li>
              <li>Pre-existing damage not reported at pickup</li>
              <li>Damage from unauthorized users</li>
              <li>Consequential or indirect damages</li>
            </ul>
          </section>

          <section>
            <h2 className="text-h3 mb-4">4. Coverage Limits</h2>
            <p className="text-muted-foreground">
              Coverage is limited to the item's declared value at the time of listing. The maximum coverage amount is determined by the item owner and cannot exceed the item's market value.
            </p>
          </section>

          <section>
            <h2 className="text-h3 mb-4">5. Deductible</h2>
            <p className="text-muted-foreground">
              A deductible may apply to insurance claims. The deductible amount will be clearly stated at the time of booking and will be deducted from any claim payout.
            </p>
          </section>

          <section>
            <h2 className="text-h3 mb-4">6. Making a Claim</h2>
            <p className="text-muted-foreground mb-2">
              To file an insurance claim:
            </p>
            <ol className="list-decimal list-inside space-y-1 text-muted-foreground ml-4">
              <li>Report the incident immediately through the Lendly platform</li>
              <li>Provide photos and detailed description of the damage</li>
              <li>For theft, provide a police report</li>
              <li>Cooperate with the claims investigation process</li>
              <li>Allow inspection of the item if requested</li>
            </ol>
          </section>

          <section>
            <h2 className="text-h3 mb-4">7. Claim Processing</h2>
            <p className="text-muted-foreground">
              Claims are typically processed within 5-10 business days. We may require additional documentation or information to process your claim. Approved claims will be paid out according to the coverage terms.
            </p>
          </section>

          <section>
            <h2 className="text-h3 mb-4">8. Owner Responsibilities</h2>
            <p className="text-muted-foreground">
              Item owners must accurately declare the value of their items and report any pre-existing damage. Owners are responsible for maintaining their items in good condition and providing accurate descriptions.
            </p>
          </section>

          <section>
            <h2 className="text-h3 mb-4">9. Renter Responsibilities</h2>
            <p className="text-muted-foreground">
              Renters must use items only for their intended purpose and in accordance with the owner's instructions. Renters must report any damage immediately and cooperate with the claims process.
            </p>
          </section>

          <section>
            <h2 className="text-h3 mb-4">10. Disputes</h2>
            <p className="text-muted-foreground">
              Disputes regarding insurance claims will be reviewed by Lendly's dispute resolution team. Decisions are made based on the evidence provided and the terms of this policy.
            </p>
          </section>

          <section>
            <h2 className="text-h3 mb-4">11. Policy Changes</h2>
            <p className="text-muted-foreground">
              Lendly reserves the right to modify these insurance terms. Changes will be communicated to users and will apply to bookings made after the effective date of the changes.
            </p>
          </section>

          <section>
            <h2 className="text-h3 mb-4">12. Contact</h2>
            <p className="text-muted-foreground">
              For questions about insurance coverage or to file a claim, please contact us at insurance@lendly.com
            </p>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}

