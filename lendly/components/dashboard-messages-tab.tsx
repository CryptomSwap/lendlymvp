"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, MessageSquare } from "lucide-react";
import { useTranslations } from "next-intl";
import { format } from "date-fns";
import Link from "next/link";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";

interface Thread {
  id: string;
  booking: {
    id: string;
    listing: {
      title: string;
      photos: string;
    };
  };
  lastMessageAt: string;
  unreadCount: number;
  lastMessage?: {
    body: string;
    fromUser: { name: string };
  };
}

export function MessagesTab() {
  const t = useTranslations("dashboard.messages");
  const [threads, setThreads] = useState<Thread[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadThreads();
  }, []);

  const loadThreads = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/messages/threads");
      const data = await res.json();
      setThreads(data.threads || []);
    } catch (error) {
      console.error("Failed to load threads:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="flex gap-4">
                <Skeleton className="w-12 h-12 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (threads.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">{t("empty")}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {threads.map((thread) => {
        const photos = JSON.parse(thread.booking.listing.photos || "[]");
        return (
          <Link key={thread.id} href={`/messages?booking=${thread.booking.id}`}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4">
                <div className="flex gap-4 items-center">
                  {photos[0] && (
                    <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                      <Image
                        src={photos[0]}
                        alt={thread.booking.listing.title}
                        width={48}
                        height={48}
                        className="object-cover rounded-full"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold truncate">{thread.booking.listing.title}</h3>
                      {thread.unreadCount > 0 && (
                        <Badge variant="default">{thread.unreadCount}</Badge>
                      )}
                    </div>
                    {thread.lastMessage && (
                      <p className="text-sm text-muted-foreground truncate">
                        {thread.lastMessage.fromUser.name}: {thread.lastMessage.body}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      {format(new Date(thread.lastMessageAt), "PPp")}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}

