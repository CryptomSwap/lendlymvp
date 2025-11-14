"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTranslations } from "next-intl";
import { AlertTriangle, Send, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export default function ReportIssuePage() {
  const t = useTranslations("menu");
  const [formData, setFormData] = useState({
    type: "",
    subject: "",
    description: "",
    email: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // TODO: Implement API call to submit issue
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      toast.success("Issue reported successfully! We'll get back to you soon.");
      setIsSubmitted(true);
      setFormData({ type: "", subject: "", description: "", email: "" });
    } catch (error) {
      toast.error("Failed to submit issue. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="container mx-auto px-4 py-6 space-y-6 pb-24">
        <Card>
          <CardContent className="p-12 text-center">
            <CheckCircle2 className="h-16 w-16 mx-auto mb-4 text-green-500" />
            <h2 className="text-h2 mb-2">Issue Reported</h2>
            <p className="text-muted-foreground mb-4">
              Thank you for reporting this issue. We'll review it and get back to you soon.
            </p>
            <Button onClick={() => setIsSubmitted(false)}>
              Report Another Issue
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 space-y-6 pb-24 max-w-2xl">
      <div className="text-center mb-8">
        <AlertTriangle className="h-16 w-16 mx-auto mb-4 text-[#009999]" />
        <h1 className="text-h1 mb-2">Report an Issue</h1>
        <p className="text-muted-foreground">
          Help us improve by reporting problems or concerns
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Issue Details</CardTitle>
          <CardDescription>
            Please provide as much detail as possible
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="type">Issue Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData({ ...formData, type: value })}
                required
              >
                <SelectTrigger id="type">
                  <SelectValue placeholder="Select issue type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bug">Bug or Technical Issue</SelectItem>
                  <SelectItem value="safety">Safety Concern</SelectItem>
                  <SelectItem value="payment">Payment Issue</SelectItem>
                  <SelectItem value="booking">Booking Problem</SelectItem>
                  <SelectItem value="user">User Behavior</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
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
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                placeholder="Brief description of the issue"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Please provide detailed information about the issue..."
                rows={6}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>Submitting...</>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Submit Report
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

