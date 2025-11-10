"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";

interface OwnerCardProps {
  owner: {
    id: string;
    name: string;
    avatar?: string | null;
    trustScore: number;
  };
}

export function OwnerCard({ owner }: OwnerCardProps) {
  const initials = owner.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={owner.avatar || undefined} alt={owner.name} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="text-h4 font-semibold">{owner.name}</h3>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="secondary" className="flex items-center gap-1">
                <Star className="h-3 w-3 fill-warning text-warning" />
                <span>Trust Score: {owner.trustScore}</span>
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

