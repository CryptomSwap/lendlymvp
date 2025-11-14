"use client";

import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Camera, Upload, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "@/i18n/routing";

export default function ScanIdPage() {
  const router = useRouter();
  const [isScanning, setIsScanning] = useState(false);
  const [scannedData, setScannedData] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsScanning(true);
      try {
        // TODO: Implement ID scanning logic (OCR)
        await new Promise((resolve) => setTimeout(resolve, 2000));
        
        // Mock scanned data
        setScannedData({
          name: "John Doe",
          idNumber: "123456789",
          dateOfBirth: "1990-01-01",
          expiryDate: "2030-01-01",
        });
        
        toast.success("ID scanned successfully!");
      } catch (error) {
        toast.error("Failed to scan ID. Please try again.");
      } finally {
        setIsScanning(false);
      }
    }
  };

  const handleStartCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsScanning(true);
      }
    } catch (error) {
      toast.error("Could not access camera. Please check permissions.");
    }
  };

  const handleCapture = async () => {
    // TODO: Implement capture and scan logic
    toast.info("Capture functionality coming soon");
  };

  return (
    <div className="container mx-auto px-4 py-6 space-y-6 pb-24 max-w-2xl">
      <div className="text-center mb-8">
        <Camera className="h-16 w-16 mx-auto mb-4 text-[#009999]" />
        <h1 className="text-h1 mb-2">Scan ID</h1>
        <p className="text-muted-foreground">
          Quickly scan your ID using your camera
        </p>
      </div>

      {scannedData ? (
        <Card>
          <CardHeader>
            <CardTitle>Scanned Information</CardTitle>
            <CardDescription>
              Please verify the information below
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm font-medium">Name</p>
              <p className="text-sm text-muted-foreground">{scannedData.name}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">ID Number</p>
              <p className="text-sm text-muted-foreground">{scannedData.idNumber}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Date of Birth</p>
              <p className="text-sm text-muted-foreground">{scannedData.dateOfBirth}</p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setScannedData(null)}
                className="flex-1"
              >
                Scan Again
              </Button>
              <Button
                onClick={() => router.push("/verify-account")}
                className="flex-1"
              >
                Use This ID
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Scan Options</CardTitle>
              <CardDescription>
                Choose how you want to scan your ID
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Button
                  variant="outline"
                  className="h-32 flex-col gap-2"
                  onClick={handleStartCamera}
                  disabled={isScanning}
                >
                  <Camera className="h-8 w-8" />
                  <span>Use Camera</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-32 flex-col gap-2"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isScanning}
                >
                  <Upload className="h-8 w-8" />
                  <span>Upload Photo</span>
                </Button>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileSelect}
              />
            </CardContent>
          </Card>

          {isScanning && (
            <Card>
              <CardContent className="p-8 text-center">
                <div className="space-y-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#009999] mx-auto" />
                  <p className="text-muted-foreground">
                    Scanning ID...
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                Tips for Best Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
                <li>Ensure good lighting</li>
                <li>Place ID on a flat surface</li>
                <li>Keep the camera steady</li>
                <li>Make sure all text is clearly visible</li>
                <li>Avoid glare and shadows</li>
              </ul>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}

