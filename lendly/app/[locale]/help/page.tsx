import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LifeBuoy, MessageSquare, Book, HelpCircle, Shield, Mail } from "lucide-react";
import { Link } from "@/i18n/routing";

export default async function HelpPage() {
  return (
    <div className="container mx-auto px-4 py-6 space-y-6 pb-24">
      <div className="text-center mb-8">
        <LifeBuoy className="h-16 w-16 mx-auto mb-4 text-[#009999]" />
        <h1 className="text-h1 mb-2">Help Center</h1>
        <p className="text-muted-foreground">
          Find answers to common questions and get support
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Book className="h-5 w-5" />
              Getting Started
            </CardTitle>
            <CardDescription>
              Learn how to use Lendly
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/help/getting-started" className="block text-sm text-[#009999] hover:underline">
              How to create a listing
            </Link>
            <Link href="/help/getting-started" className="block text-sm text-[#009999] hover:underline">
              How to book an item
            </Link>
            <Link href="/help/getting-started" className="block text-sm text-[#009999] hover:underline">
              Understanding deposits
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5" />
              Common Questions
            </CardTitle>
            <CardDescription>
              Frequently asked questions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/help/faq" className="block text-sm text-[#009999] hover:underline">
              What is the security deposit?
            </Link>
            <Link href="/help/faq" className="block text-sm text-[#009999] hover:underline">
              How does insurance work?
            </Link>
            <Link href="/help/faq" className="block text-sm text-[#009999] hover:underline">
              What if something breaks?
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Contact Support
            </CardTitle>
            <CardDescription>
              Need more help? Reach out to us
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link href="/report-issue">
              <Button variant="outline" className="w-full">
                Report an Issue
              </Button>
            </Link>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="h-4 w-4" />
              <span>support@lendly.com</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Safety & Trust
            </CardTitle>
            <CardDescription>
              Learn about our safety measures
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/help/safety" className="block text-sm text-[#009999] hover:underline">
              Verification process
            </Link>
            <Link href="/help/safety" className="block text-sm text-[#009999] hover:underline">
              Trust scores
            </Link>
            <Link href="/help/safety" className="block text-sm text-[#009999] hover:underline">
              Dispute resolution
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

