"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ShieldCheck, Upload, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export default function VerifyAccountPage() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [verificationStatus, setVerificationStatus] = useState<"none" | "pending" | "verified">("none");

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload an image file");
        return;
      }
      setUploadedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!uploadedFile) return;

    setIsUploading(true);
    try {
      // TODO: Implement API call to upload ID
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      toast.success("ID uploaded successfully! Verification is pending review.");
      setVerificationStatus("pending");
      setUploadedFile(null);
    } catch (error) {
      toast.error("Failed to upload ID. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 space-y-6 pb-24 max-w-2xl">
      <div className="text-center mb-8">
        <ShieldCheck className="h-16 w-16 mx-auto mb-4 text-[#009999]" />
        <h1 className="text-h1 mb-2">Verify Your Account</h1>
        <p className="text-muted-foreground">
          Verify your identity to build trust and unlock more features
        </p>
      </div>

      {verificationStatus === "verified" ? (
        <Card>
          <CardContent className="p-12 text-center">
            <CheckCircle2 className="h-16 w-16 mx-auto mb-4 text-green-500" />
            <h2 className="text-h2 mb-2">Account Verified</h2>
            <p className="text-muted-foreground">
              Your account has been successfully verified.
            </p>
          </CardContent>
        </Card>
      ) : verificationStatus === "pending" ? (
        <Card>
          <CardContent className="p-12 text-center">
            <AlertCircle className="h-16 w-16 mx-auto mb-4 text-yellow-500" />
            <h2 className="text-h2 mb-2">Verification Pending</h2>
            <p className="text-muted-foreground mb-4">
              Your ID is under review. We'll notify you once verification is complete.
            </p>
            <p className="text-sm text-muted-foreground">
              This usually takes 1-2 business days.
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Why Verify?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <p className="font-medium">Build Trust</p>
                  <p className="text-sm text-muted-foreground">
                    Verified users are more trusted by the community
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <p className="font-medium">Unlock Features</p>
                  <p className="text-sm text-muted-foreground">
                    Access to instant booking and premium features
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <p className="font-medium">Secure Platform</p>
                  <p className="text-sm text-muted-foreground">
                    Help us maintain a safe environment for everyone
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Upload Your ID</CardTitle>
              <CardDescription>
                Upload a clear photo of your government-issued ID
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                {uploadedFile ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-center gap-2 text-green-600">
                      <CheckCircle2 className="h-8 w-8" />
                      <span className="font-medium">{uploadedFile.name}</span>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => setUploadedFile(null)}
                    >
                      Remove
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Camera className="h-12 w-12 mx-auto text-muted-foreground" />
                    <div>
                      <Label htmlFor="id-upload" className="cursor-pointer">
                        <Button variant="outline" asChild>
                          <span>
                            <Upload className="mr-2 h-4 w-4" />
                            Choose File
                          </span>
                        </Button>
                      </Label>
                      <input
                        id="id-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileSelect}
                      />
                      <p className="text-sm text-muted-foreground mt-2">
                        Max file size: 5MB
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-900 font-medium mb-2">
                  What we accept:
                </p>
                <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                  <li>Government-issued ID card</li>
                  <li>Driver's license</li>
                  <li>Passport</li>
                </ul>
              </div>

              <Button
                className="w-full"
                onClick={handleUpload}
                disabled={!uploadedFile || isUploading}
              >
                {isUploading ? (
                  "Uploading..."
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload and Submit
                  </>
                )}
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                Your ID information is encrypted and securely stored. We only use it for verification purposes.
              </p>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}

