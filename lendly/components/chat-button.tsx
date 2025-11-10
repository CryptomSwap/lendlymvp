"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import { createDraftBookingWithMessage } from "@/lib/actions/messages";
import { toast } from "sonner";
import { useRouter } from "@/i18n/routing";
import { Loader2 } from "lucide-react";

interface ChatButtonProps {
  listingId: string;
  ownerId: string;
  ownerName: string;
}

export function ChatButton({ listingId, ownerId, ownerName }: ChatButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleChat = async () => {
    setIsLoading(true);
    try {
      // Get current user from session
      const response = await fetch("/api/auth/me");
      const data = await response.json();
      
      if (!data.user) {
        toast.error("Please sign in to start a conversation");
        router.push("/auth/signin");
        return;
      }
      
      const defaultMessage = `Hi ${ownerName}, I'm interested in this item. Can you tell me more about it?`;

      const { booking, message } = await createDraftBookingWithMessage(
        listingId,
        data.user.id,
        defaultMessage
      );

      toast.success("Conversation started!");
      
      // Navigate to messages page with the booking ID
      router.push(`/messages?booking=${booking.id}`);
    } catch (error) {
      toast.error("Failed to start conversation. Please try again.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="lg"
      onClick={handleChat}
      disabled={isLoading}
      className="flex items-center gap-2"
    >
      {isLoading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Starting...
        </>
      ) : (
        <>
          <MessageSquare className="h-4 w-4" />
          Chat
        </>
      )}
    </Button>
  );
}

