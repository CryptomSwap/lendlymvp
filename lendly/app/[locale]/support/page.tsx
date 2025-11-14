"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LifeBuoy, MessageSquare, Book, HelpCircle, Mail, ArrowRight } from "lucide-react";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";

export default function SupportPage() {
  const t = useTranslations("auth");

  return (
    <div className="container mx-auto px-4 py-6 space-y-6 pb-24">
      <div className="text-center mb-8">
        <LifeBuoy className="h-16 w-16 mx-auto mb-4 text-[#009999]" />
        <h1 className="text-h1 mb-2">Support Center</h1>
        <p className="text-muted-foreground">
          We're here to help you with any questions or issues
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Book className="h-5 w-5 text-[#009999]" />
              Help Center
            </CardTitle>
            <CardDescription>
              Browse our help articles and guides
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/help">
              <Button variant="outline" className="w-full">
                Visit Help Center
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-[#009999]" />
              Contact Us
            </CardTitle>
            <CardDescription>
              Get in touch with our support team
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link href="/contact">
              <Button variant="outline" className="w-full">
                Contact Support
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="h-4 w-4" />
              <span>support@lendly.com</span>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-[#009999]" />
              Report an Issue
            </CardTitle>
            <CardDescription>
              Report bugs, safety concerns, or other issues
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/report-issue">
              <Button variant="outline" className="w-full">
                Report Issue
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LifeBuoy className="h-5 w-5 text-[#009999]" />
              Quick Links
            </CardTitle>
            <CardDescription>
              Common support resources
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/help/getting-started" className="block text-sm text-[#009999] hover:underline">
              Getting Started Guide
            </Link>
            <Link href="/help/faq" className="block text-sm text-[#009999] hover:underline">
              Frequently Asked Questions
            </Link>
            <Link href="/help/safety" className="block text-sm text-[#009999] hover:underline">
              Safety & Trust
            </Link>
            <Link href="/terms-of-service" className="block text-sm text-[#009999] hover:underline">
              Terms of Service
            </Link>
            <Link href="/privacy-policy" className="block text-sm text-[#009999] hover:underline">
              Privacy Policy
            </Link>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-8 bg-gradient-to-br from-[#E8F6F6] to-white">
        <CardContent className="p-8 text-center">
          <h2 className="text-h2 mb-4">Still need help?</h2>
          <p className="text-muted-foreground mb-6">
            Our support team is available to assist you. Reach out and we'll get back to you as soon as possible.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button size="lg" className="bg-[#009999] hover:bg-[#007777]">
                <Mail className="mr-2 h-5 w-5" />
                Contact Support
              </Button>
            </Link>
            <Link href="/report-issue">
              <Button size="lg" variant="outline">
                Report an Issue
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

