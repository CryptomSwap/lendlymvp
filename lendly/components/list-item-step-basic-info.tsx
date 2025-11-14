"use client";

import { useState, useRef } from "react";
import { ArrowRight, Camera, Drone, Wrench, Music, Tent, Dumbbell, Home, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useRouter } from "@/i18n/routing";

interface ListItemStepBasicInfoProps {
  formData: {
    title: string;
    description: string;
    category: string;
    tags?: string[];
  };
  onUpdate: (data: Partial<ListItemStepBasicInfoProps["formData"]>) => void;
  onNext: () => void;
  onSaveDraft?: () => void;
}

const categories = [
  { value: "Cameras", label: "מצלמות", icon: Camera },
  { value: "Drones", label: "רחפנים", icon: Drone },
  { value: "Tools", label: "כלים", icon: Wrench },
  { value: "DJ gear", label: "ציוד DJ", icon: Music },
  { value: "Camping", label: "קמפינג", icon: Tent },
  { value: "Sports", label: "ספורט", icon: Dumbbell },
  { value: "Household", label: "בית", icon: Home },
  { value: "Other", label: "אחר", icon: Package },
];

const suggestedTags = [
  "מצב חדש",
  "כולל תיק נשיאה",
  "קל לתפעול",
  "מתאים למתחילים",
  "מקצועי",
];

export function ListItemStepBasicInfo({
  formData,
  onUpdate,
  onNext,
  onSaveDraft,
}: ListItemStepBasicInfoProps) {
  const router = useRouter();
  const [errors, setErrors] = useState<{ [key: string]: boolean }>({});
  const [isShaking, setIsShaking] = useState(false);
  const titleInputRef = useRef<HTMLInputElement>(null);
  const descriptionTextareaRef = useRef<HTMLTextAreaElement>(null);
  const categoryRef = useRef<HTMLDivElement>(null);

  const MAX_TITLE_LENGTH = 60;
  const MAX_DESCRIPTION_LENGTH = 500;

  const handleNext = () => {
    const newErrors: { [key: string]: boolean } = {};
    
    if (!formData.title.trim()) {
      newErrors.title = true;
    }
    if (!formData.description.trim()) {
      newErrors.description = true;
    }
    if (!formData.category) {
      newErrors.category = true;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
      
      // Scroll to first error
      if (newErrors.title && titleInputRef.current) {
        titleInputRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
      } else if (newErrors.description && descriptionTextareaRef.current) {
        descriptionTextareaRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
      } else if (newErrors.category && categoryRef.current) {
        categoryRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    setErrors({});
    onNext();
  };

  const handleTagToggle = (tag: string) => {
    const currentTags = formData.tags || [];
    const newTags = currentTags.includes(tag)
      ? currentTags.filter((t) => t !== tag)
      : [...currentTags, tag];
    onUpdate({ tags: newTags });
  };

  // Calculate bottom spacing: bottom nav (~80px) + CTA bar (~75px) + safe area
  const bottomNavHeight = 80; // h-16 (64px) + py-2 (16px)
  const ctaBarHeight = 75; // button + padding + save draft

  return (
    <div
      className="h-screen w-full flex flex-col overflow-hidden relative"
      style={{
        background: "linear-gradient(to bottom, #F8FCFC 0%, #EEF7F7 100%)",
        backgroundAttachment: "fixed",
      }}
      dir="rtl"
    >
      {/* Sticky Header */}
      <div className="flex-shrink-0 bg-white/80 backdrop-blur-sm border-b border-[#E6F3F3] z-10">
        <div className="px-3 pt-2 pb-2">
          {/* Top row: Back button + Title */}
          <div className="flex items-center justify-between mb-1.5">
            <button
              onClick={() => router.back()}
              className="p-1.5 -mr-1.5 rounded-full hover:bg-[#F0F9F9] transition-colors"
              aria-label="חזור"
            >
              <ArrowRight className="h-4 w-4 text-[#14313A]" />
            </button>
            <h1 className="text-base font-bold text-[#14313A]">השכרת פריט חדש</h1>
            <div className="w-7" /> {/* Spacer for centering */}
          </div>

          {/* Step indicator */}
          <p className="text-xs text-[#00A3A3] mb-1.5 text-center">
            שלב 1 מתוך 3 – מידע בסיסי
          </p>

          {/* Progress bar */}
          <div className="h-1.5 bg-[#E6F3F3] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#00A3A3] rounded-full transition-all duration-300"
              style={{ width: "33.33%" }}
            />
          </div>
        </div>
      </div>

      {/* Main Content - Scrollable */}
      <div 
        className="flex-1 overflow-y-auto px-3 py-2"
        style={{
          WebkitOverflowScrolling: "touch",
          paddingBottom: `calc(${ctaBarHeight}px + 8px)`,
        }}
      >
        <div
          className="bg-white rounded-xl shadow-lg p-4 max-w-2xl mx-auto"
          style={{
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
          }}
        >
          {/* Section Title */}
          <div className="mb-3">
            <h2 className="text-base font-bold text-[#14313A] mb-0.5">
              מידע בסיסי על הפריט
            </h2>
            <p className="text-xs text-[#6B7B84]">
              ככל שתתאר טוב יותר – כך ישכרו אותו יותר מהר.
            </p>
          </div>

          {/* Title Field */}
          <div className="mb-3">
            <Label htmlFor="title" className="text-[#14313A] font-medium mb-1 block text-sm">
              כותרת *
            </Label>
            <Input
              id="title"
              ref={titleInputRef}
              value={formData.title}
              onChange={(e) => {
                const value = e.target.value.slice(0, MAX_TITLE_LENGTH);
                onUpdate({ title: value });
                if (errors.title) setErrors({ ...errors, title: false });
              }}
              placeholder="לדוגמה: מצלמת Canon מקצועית EOS R5"
              className={cn(
                "rounded-lg border-2 transition-all",
                errors.title
                  ? "border-red-500 animate-shake"
                  : "border-[#E6F3F3] focus:border-[#00A3A3]",
                isShaking && errors.title && "animate-shake"
              )}
              style={{
                padding: "8px 12px",
                fontSize: "14px",
              }}
            />
            <div className="flex items-center justify-between mt-1">
              <p className="text-[10px] text-[#6B7B84] leading-tight">
                כתוב כותרת קצרה וברורה (עד 60 תווים).
              </p>
              <span
                className={cn(
                  "text-[10px] font-medium",
                  formData.title.length > MAX_TITLE_LENGTH * 0.9
                    ? "text-orange-500"
                    : "text-[#6B7B84]"
                )}
              >
                {formData.title.length}/{MAX_TITLE_LENGTH}
              </span>
            </div>
          </div>

          {/* Category Selector */}
          <div className="mb-3" ref={categoryRef}>
            <Label className="text-[#14313A] font-medium mb-2 block text-sm">
              קטגוריה *
            </Label>
            <div
              className={cn(
                "grid grid-cols-4 gap-1.5 p-2 rounded-lg border-2 transition-all",
                errors.category
                  ? "border-red-500 animate-shake"
                  : "border-[#E6F3F3]",
                isShaking && errors.category && "animate-shake"
              )}
            >
              {categories.map((category) => {
                const Icon = category.icon;
                const isSelected = formData.category === category.value;
                return (
                  <button
                    key={category.value}
                    type="button"
                    onClick={() => {
                      onUpdate({ category: category.value });
                      if (errors.category) setErrors({ ...errors, category: false });
                    }}
                    className={cn(
                      "flex flex-col items-center justify-center gap-1 p-1.5 rounded-lg transition-all",
                      "hover:scale-105 active:scale-95",
                      isSelected
                        ? "bg-gradient-to-br from-[#00A3A3]/10 to-[#00A3A3]/5 border-2 border-[#00A3A3] shadow-md"
                        : "bg-[#F8FCFC] border-2 border-transparent hover:border-[#00A3A3]/30"
                    )}
                    style={{
                      minHeight: "60px",
                    }}
                  >
                    <div
                      className={cn(
                        "p-1 rounded-full transition-colors",
                        isSelected ? "bg-[#00A3A3]/10" : "bg-white"
                      )}
                    >
                      <Icon
                        className={cn(
                          "h-4 w-4",
                          isSelected ? "text-[#00A3A3]" : "text-[#6B7B84]"
                        )}
                      />
                    </div>
                    <span
                      className={cn(
                        "text-[10px] font-medium text-center leading-tight",
                        isSelected ? "text-[#00A3A3]" : "text-[#14313A]"
                      )}
                    >
                      {category.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Description Field */}
          <div className="mb-3">
            <Label htmlFor="description" className="text-[#14313A] font-medium mb-1 block text-sm">
              תיאור *
            </Label>
            <Textarea
              id="description"
              ref={descriptionTextareaRef}
              value={formData.description}
              onChange={(e) => {
                const value = e.target.value.slice(0, MAX_DESCRIPTION_LENGTH);
                onUpdate({ description: value });
                if (errors.description) setErrors({ ...errors, description: false });
              }}
              placeholder="תאר את מצב הפריט, מה כלול, למי הוא מתאים וכו'..."
              className={cn(
                "rounded-lg border-2 transition-all resize-none",
                errors.description
                  ? "border-red-500 animate-shake"
                  : "border-[#E6F3F3] focus:border-[#00A3A3]",
                isShaking && errors.description && "animate-shake"
              )}
              style={{
                padding: "8px 12px",
                fontSize: "14px",
                minHeight: "70px",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
              }}
              rows={3}
            />
            <div className="flex items-center justify-between mt-1">
              <p className="text-[10px] text-[#6B7B84] leading-tight">
                נסה לכלול מצב, שימושים, מותג, דגם וכל פרט חשוב נוסף.
              </p>
              <span
                className={cn(
                  "text-[10px] font-medium",
                  formData.description.length > MAX_DESCRIPTION_LENGTH * 0.9
                    ? "text-orange-500"
                    : "text-[#6B7B84]"
                )}
              >
                {formData.description.length}/{MAX_DESCRIPTION_LENGTH}
              </span>
            </div>
          </div>

          {/* Optional Tags */}
          <div className="mb-3">
            <Label className="text-[#14313A] font-medium mb-2 block text-sm">
              תגיות מומלצות
            </Label>
            <div className="flex flex-wrap gap-1.5">
              {suggestedTags.map((tag) => {
                const isSelected = formData.tags?.includes(tag) || false;
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleTagToggle(tag)}
                    className={cn(
                      "px-2.5 py-1 rounded-full text-[11px] font-medium transition-all",
                      "hover:scale-105 active:scale-95",
                      isSelected
                        ? "bg-[#00A3A3] text-white shadow-md"
                        : "bg-white text-[#00A3A3] border-2 border-[#00A3A3]"
                    )}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-[#E6F3F3] my-3" />

          {/* Footer Text */}
          <p className="text-[11px] text-[#6B7B84] text-right mb-0">
            תוכל להעלות תמונות ולבחור מחיר בשלב הבא.
          </p>
        </div>
      </div>

      {/* Fixed CTA Bar - positioned above bottom nav */}
      <div
        className="fixed left-0 right-0 z-40 px-3 py-2.5"
        style={{
          bottom: `calc(${bottomNavHeight}px + env(safe-area-inset-bottom, 0px))`,
          background: "linear-gradient(to top, rgba(255,255,255,0.98) 0%, rgba(255,255,255,0.95) 100%)",
          backdropFilter: "blur(10px)",
          borderTop: "1px solid #E6F3F3",
          boxShadow: "0 -2px 8px rgba(0, 0, 0, 0.05)",
        }}
        dir="rtl"
      >
        <div className="max-w-2xl mx-auto space-y-1.5">
          <Button
            onClick={handleNext}
            className="w-full h-10 rounded-lg font-semibold text-sm shadow-lg hover:shadow-xl transition-all active:scale-[0.98]"
            style={{
              background: "#00A3A3",
              color: "white",
            }}
          >
            המשך לשלב הבא
          </Button>
          {onSaveDraft && (
            <button
              onClick={onSaveDraft}
              className="w-full text-xs text-[#00A3A3] font-medium py-1 hover:underline transition-all"
            >
              שמור טיוטה
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

