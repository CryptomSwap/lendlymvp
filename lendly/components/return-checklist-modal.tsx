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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { X, Camera } from "lucide-react";
import { createReturnChecklist } from "@/lib/actions/checklists";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import Image from "next/image";

interface ReturnChecklistModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bookingId: string;
  ownerId: string;
  onSuccess: () => void;
}

export function ReturnChecklistModal({
  open,
  onOpenChange,
  bookingId,
  ownerId,
  onSuccess,
}: ReturnChecklistModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [photos, setPhotos] = useState<string[]>([]);
  const [conditionAssessment, setConditionAssessment] = useState<"Same" | "Minor" | "Major">("Same");
  const [conditionNotes, setConditionNotes] = useState("");
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handlePhotoUpload = (index: number, file: File | null) => {
    if (!file) return;

    if (file.type.startsWith("image/")) {
      const objectUrl = URL.createObjectURL(file);
      const placeholderPath = `/uploads/return-${Date.now()}-${index}-${file.name}`;
      
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

    if (photos.filter((p) => p).length === 0) {
      toast.error("Please upload at least one photo");
      return;
    }

    setIsLoading(true);
    try {
      const result = await createReturnChecklist(bookingId, ownerId, {
        photos: photos.filter((p) => p),
        conditionAssessment,
        conditionNotes: conditionNotes || undefined,
      });

      toast.success(
        `Item returned. Status: ${result.status === "COMPLETED" ? "Completed" : "Disputed"}`
      );
      onOpenChange(false);
      onSuccess();
      
      // Reset form
      setPhotos([]);
      setConditionAssessment("Same");
      setConditionNotes("");
    } catch (error) {
      toast.error("Failed to complete return checklist");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Return Checklist</DialogTitle>
          <DialogDescription>
            Document the item condition upon return
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Photos */}
          <div>
            <Label>Photos *</Label>
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
                        {index === 0 ? "Add Photo" : ""}
                      </span>
                    </label>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Condition Assessment */}
          <div>
            <Label>Condition Assessment *</Label>
            <RadioGroup
              value={conditionAssessment}
              onValueChange={(value) =>
                setConditionAssessment(value as "Same" | "Minor" | "Major")
              }
              className="mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Same" id="same" />
                <Label htmlFor="same" className="cursor-pointer font-normal">
                  Same as pickup
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Minor" id="minor" />
                <Label htmlFor="minor" className="cursor-pointer font-normal">
                  Minor wear/damage
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Major" id="major" />
                <Label htmlFor="major" className="cursor-pointer font-normal">
                  Major damage (will create dispute)
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Condition Notes */}
          <div>
            <Label htmlFor="conditionNotes">Condition Notes</Label>
            <Textarea
              id="conditionNotes"
              value={conditionNotes}
              onChange={(e) => setConditionNotes(e.target.value)}
              placeholder="Describe any changes in condition, damage, or issues..."
              className="mt-2 min-h-[100px]"
            />
          </div>

          {/* Warning for Major damage */}
          {conditionAssessment === "Major" && (
            <div className="p-4 bg-warning/10 border border-warning/20 rounded-lg">
              <p className="text-sm text-warning font-medium">
                ⚠️ Major damage detected. This will create a dispute and the booking status will be set to DISPUTED.
              </p>
            </div>
          )}

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
              disabled={isLoading || photos.filter((p) => p).length === 0}
              className="flex-1"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Complete Return"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

