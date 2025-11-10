"use client";

import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { updateUserProfile } from "@/lib/actions/users";
import { toast } from "sonner";
import { Loader2, Upload, Star, CheckCircle2, XCircle } from "lucide-react";
import Image from "next/image";

interface ProfileFormProps {
  user: {
    id: string;
    name: string;
    email: string;
    bio?: string | null;
    avatar?: string | null;
    trustScore: number;
    role: string;
    // In a real app, add languages field
  };
}

export function ProfileForm({ user }: ProfileFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState(user.name);
  const [bio, setBio] = useState(user.bio || "");
  const [avatar, setAvatar] = useState(user.avatar || "");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarUpload = async (file: File) => {
    // Client-side stub: convert to data URL
    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result as string;
      setAvatar(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await updateUserProfile({
        name,
        bio: bio || undefined,
        avatar: avatar || undefined,
      });
      toast.success("Profile updated successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Profile</CardTitle>
        <CardDescription>Update your profile information</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Avatar Upload */}
          <div className="flex items-center gap-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src={avatar || undefined} alt={name} />
              <AvatarFallback>{name.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload Avatar
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    handleAvatarUpload(file);
                  }
                }}
              />
              <p className="text-xs text-muted-foreground mt-2">
                Local upload (stub)
              </p>
            </div>
          </div>

          {/* Display Name */}
          <div>
            <Label htmlFor="name">Display Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-2"
              required
            />
          </div>

          {/* Bio */}
          <div>
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us about yourself..."
              className="mt-2 min-h-[100px]"
            />
          </div>

          {/* Email (read-only) */}
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              value={user.email}
              disabled
              className="mt-2 bg-muted"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Email cannot be changed
            </p>
          </div>

          {/* Trust Score (read-only) */}
          <div>
            <Label>Trust Score</Label>
            <div className="mt-2 flex items-center gap-2">
              <Badge variant="secondary" className="text-lg px-3 py-1">
                {user.trustScore}
              </Badge>
              <span className="text-sm text-muted-foreground">
                Based on completed bookings and reviews
              </span>
            </div>
          </div>

          {/* Verification Status */}
          <div>
            <Label>Verification Status</Label>
            <div className="mt-2 flex items-center gap-2">
              <Badge variant="outline" className="flex items-center gap-1">
                <XCircle className="h-3 w-3" />
                Not Verified
              </Badge>
              <span className="text-xs text-muted-foreground">
                (Verification feature coming soon)
              </span>
            </div>
          </div>

          {/* Submit */}
          <Button type="submit" disabled={isLoading} className="w-full" size="lg">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

