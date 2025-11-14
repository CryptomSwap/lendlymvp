"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mail, Send, CheckCircle2, MessageSquare, Phone, MapPin } from "lucide-react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

export default function ContactPage() {
  const t = useTranslations("auth");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    category: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // TODO: Implement API call to submit contact form
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      toast.success("Message sent successfully! We'll get back to you soon.");
      setIsSubmitted(true);
      setFormData({ name: "", email: "", subject: "", category: "", message: "" });
    } catch (error) {
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="container mx-auto px-4 py-6 space-y-6 pb-24 max-w-2xl">
        <Card>
          <CardContent className="p-12 text-center">
            <CheckCircle2 className="h-16 w-16 mx-auto mb-4 text-green-500" />
            <h2 className="text-h2 mb-2">Message Sent!</h2>
            <p className="text-muted-foreground mb-4">
              Thank you for contacting us. We'll review your message and get back to you as soon as possible, usually within 24-48 hours.
            </p>
            <Button onClick={() => setIsSubmitted(false)}>
              Send Another Message
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 space-y-6 pb-24 max-w-4xl">
      <div className="text-center mb-8">
        <Mail className="h-16 w-16 mx-auto mb-4 text-[#009999]" />
        <h1 className="text-h1 mb-2">Contact Us</h1>
        <p className="text-muted-foreground">
          Have a question or need help? We're here for you.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Get in Touch</CardTitle>
            <CardDescription>
              Choose the best way to reach us
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-[#009999] mt-0.5" />
              <div>
                <h3 className="font-semibold mb-1">Email</h3>
                <p className="text-sm text-muted-foreground mb-1">support@lendly.com</p>
                <p className="text-xs text-muted-foreground">We typically respond within 24-48 hours</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MessageSquare className="h-5 w-5 text-[#009999] mt-0.5" />
              <div>
                <h3 className="font-semibold mb-1">Help Center</h3>
                <p className="text-sm text-muted-foreground mb-1">Browse our help articles</p>
                <Link href="/help" className="text-xs text-[#009999] hover:underline">
                  Visit Help Center →
                </Link>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="h-5 w-5 text-[#009999] mt-0.5" />
              <div>
                <h3 className="font-semibold mb-1">Phone Support</h3>
                <p className="text-sm text-muted-foreground">Coming soon</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-[#009999] mt-0.5" />
              <div>
                <h3 className="font-semibold mb-1">Office</h3>
                <p className="text-sm text-muted-foreground">Tel Aviv, Israel</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Send us a Message</CardTitle>
            <CardDescription>
              Fill out the form below and we'll get back to you
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Your Name</Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Your Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                  required
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General Inquiry</SelectItem>
                    <SelectItem value="technical">Technical Support</SelectItem>
                    <SelectItem value="billing">Billing Question</SelectItem>
                    <SelectItem value="safety">Safety Concern</SelectItem>
                    <SelectItem value="feedback">Feedback</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  placeholder="Brief description of your inquiry"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  placeholder="Please provide details about your inquiry..."
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>Sending...</>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Send Message
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gradient-to-br from-[#E8F6F6] to-white">
        <CardContent className="p-8">
          <h2 className="text-h2 mb-4 text-center">Common Questions</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h3 className="font-semibold mb-2">Account & Verification</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Questions about account setup, verification, or trust scores?
              </p>
              <Link href="/help/safety" className="text-sm text-[#009999] hover:underline">
                Visit Safety & Trust →
              </Link>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Bookings & Rentals</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Need help with booking items or managing your listings?
              </p>
              <Link href="/help/getting-started" className="text-sm text-[#009999] hover:underline">
                Visit Getting Started →
              </Link>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Payments & Deposits</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Questions about payments, deposits, or refunds?
              </p>
              <Link href="/help/faq" className="text-sm text-[#009999] hover:underline">
                Visit FAQ →
              </Link>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Report an Issue</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Need to report a bug, safety concern, or other issue?
              </p>
              <Link href="/report-issue" className="text-sm text-[#009999] hover:underline">
                Report Issue →
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

