import { Card, CardContent } from "@/components/ui/card";
import { Shield } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-6 space-y-6 pb-24 max-w-4xl">
      <div className="text-center mb-8">
        <Shield className="h-16 w-16 mx-auto mb-4 text-[#009999]" />
        <h1 className="text-h1 mb-2">Privacy Policy</h1>
        <p className="text-muted-foreground">
          Last updated: {new Date().toLocaleDateString()}
        </p>
      </div>

      <Card>
        <CardContent className="p-8 space-y-6 prose prose-sm max-w-none">
          <section>
            <h2 className="text-h3 mb-4">1. Information We Collect</h2>
            <p className="text-muted-foreground mb-2">
              We collect information that you provide directly to us, including:
            </p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
              <li>Name, email address, and contact information</li>
              <li>Profile information and photos</li>
              <li>Payment information (processed securely through third-party providers)</li>
              <li>ID verification documents (for verified users)</li>
              <li>Listing information and photos</li>
              <li>Messages and communications with other users</li>
            </ul>
          </section>

          <section>
            <h2 className="text-h3 mb-4">2. How We Use Your Information</h2>
            <p className="text-muted-foreground mb-2">
              We use the information we collect to:
            </p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
              <li>Provide, maintain, and improve our services</li>
              <li>Process transactions and send related information</li>
              <li>Send you technical notices and support messages</li>
              <li>Respond to your comments and questions</li>
              <li>Monitor and analyze trends and usage</li>
              <li>Detect, prevent, and address technical issues</li>
            </ul>
          </section>

          <section>
            <h2 className="text-h3 mb-4">3. Information Sharing</h2>
            <p className="text-muted-foreground">
              We do not sell your personal information. We may share your information only in the following circumstances:
            </p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4 mt-2">
              <li>With other users as necessary to facilitate rentals (e.g., contact information for bookings)</li>
              <li>With service providers who assist us in operating our platform</li>
              <li>When required by law or to protect our rights</li>
              <li>In connection with a business transfer or merger</li>
            </ul>
          </section>

          <section>
            <h2 className="text-h3 mb-4">4. Data Security</h2>
            <p className="text-muted-foreground">
              We implement appropriate technical and organizational measures to protect your personal information. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-h3 mb-4">5. Your Rights</h2>
            <p className="text-muted-foreground mb-2">
              You have the right to:
            </p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
              <li>Access and receive a copy of your personal data</li>
              <li>Rectify inaccurate or incomplete data</li>
              <li>Request deletion of your personal data</li>
              <li>Object to processing of your personal data</li>
              <li>Request restriction of processing</li>
              <li>Data portability</li>
            </ul>
          </section>

          <section>
            <h2 className="text-h3 mb-4">6. Cookies and Tracking</h2>
            <p className="text-muted-foreground">
              We use cookies and similar tracking technologies to track activity on our platform and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
            </p>
          </section>

          <section>
            <h2 className="text-h3 mb-4">7. Third-Party Links</h2>
            <p className="text-muted-foreground">
              Our platform may contain links to third-party websites. We are not responsible for the privacy practices of these external sites.
            </p>
          </section>

          <section>
            <h2 className="text-h3 mb-4">8. Children's Privacy</h2>
            <p className="text-muted-foreground">
              Our services are not intended for individuals under the age of 18. We do not knowingly collect personal information from children.
            </p>
          </section>

          <section>
            <h2 className="text-h3 mb-4">9. Changes to This Policy</h2>
            <p className="text-muted-foreground">
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date.
            </p>
          </section>

          <section>
            <h2 className="text-h3 mb-4">10. Contact Us</h2>
            <p className="text-muted-foreground">
              If you have any questions about this Privacy Policy, please contact us at privacy@lendly.com
            </p>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}

