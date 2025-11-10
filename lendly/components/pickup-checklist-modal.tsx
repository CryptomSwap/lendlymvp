"use client";

import { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { X, Upload, Camera } from "lucide-react";
import { createPickupChecklist } from "@/lib/actions/checklists";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import Image from "next/image";

interface PickupChecklistModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bookingId: string;
  ownerId: string;
  onSuccess: () => void;
}

export function PickupChecklistModal({
  open,
  onOpenChange,
  bookingId,
  ownerId,
  onSuccess,
}: PickupChecklistModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [photos, setPhotos] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    serial: "",
    conditionNotes: "",
    depositCollected: false,
  });
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handlePhotoUpload = (index: number, file: File | null) => {
    if (!file) return;

    if (file.type.startsWith("image/")) {
      const objectUrl = URL.createObjectURL(file);
      const placeholderPath = `/uploads/pickup-${Date.now()}-${index}-${file.name}`;
      
      const newPhotos = [...photos];
      newPhotos[index] = placeholderPath;
      setPhotos(newPhotos);
    }
  };

  const removePhoto = (index: number) => {
    const newPhotos = [...photos];
    newPhotos[index] = "";
    setPhotos(newPhotos);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (photos.filter((p) => p).length < 6) {
      toast.error("Please upload all 6 photos");
      return;
    }

    if (!formData.depositCollected) {
      toast.error("Please confirm deposit has been collected");
      return;
    }

    setIsLoading(true);
    try {
      await createPickupChecklist(bookingId, ownerId, {
        photos: photos.filter((p) => p),
        serial: formData.serial || undefined,
        conditionNotes: formData.conditionNotes || undefined,
        depositCollected: formData.depositCollected,
      });

      toast.success("Pickup checklist completed!");
      onOpenChange(false);
      onSuccess();
      
      // Reset form
      setPhotos([]);
      setFormData({
        serial: "",
        conditionNotes: "",
        depositCollected: false,
      });
    } catch (error) {
      toast.error("Failed to complete pickup checklist");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Pickup Checklist</DialogTitle>
          <DialogDescription>
            Document the item condition and collect deposit
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Photos - 6 required */}
          <div>
            <Label>Photos (6 required) *</Label>
            <div className="grid grid-cols-3 gap-4 mt-2">
              {[0, 1, 2, 3, 4, 5].map((index) => (
                <div key={index} className="relative aspect-square">
                  {photos[index] ? (
                    <div className="relative w-full h-full border rounded-lg overflow-hidden group">
                      <Image
                        src={photos[index]}
                        alt={`Photo ${index + 1}`}
                        fill
                        className="object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/placeholder-listing.jpg";
                        }}
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8"
                        onClick={() => removePhoto(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full h-full border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                      <input
                        ref={(el) => (fileInputRefs.current[index] = el)}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) =>
                          handlePhotoUpload(index, e.target.files?.[0] || null)
                        }
                      />
                      <Camera className="h-8 w-8 text-muted-foreground mb-2" />
                      <span className="text-xs text-muted-foreground text-center px-2">
                        Photo {index + 1}
                      </span>
                    </label>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Serial/Model */}
          <div>
            <Label htmlFor="serial">Serial Number / Model</Label>
            <Input
              id="serial"
              value={formData.serial}
              onChange={(e) =>
                setFormData({ ...formData, serial: e.target.value })
              }
              placeholder="e.g., SN123456 or Canon EOS R5"
              className="mt-2"
            />
          </div>

          {/* Condition Notes */}
          <div>
            <Label htmlFor="conditionNotes">Condition Notes</Label>
            <Textarea
              id="conditionNotes"
              value={formData.conditionNotes}
              onChange={(e) =>
                setFormData({ ...formData, conditionNotes: e.target.value })
              }
              placeholder="Note any existing scratches, dents, or issues..."
              className="mt-2 min-h-[100px]"
            />
          </div>

          {/* Deposit Collected */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="depositCollected"
              checked={formData.depositCollected}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, depositCollected: checked === true })
              }
              required
            />
            <Label htmlFor="depositCollected" className="cursor-pointer">
              I confirm the security deposit has been collected *
            </Label>
          </div>

          {/* Submit */}
          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || photos.filter((p) => p).length < 6}
              className="flex-1"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Mark as Picked Up"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

