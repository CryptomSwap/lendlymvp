"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquare, Send } from "lucide-react";
import { sendMessage, getBookingMessages } from "@/lib/actions/messages";
import { toast } from "sonner";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";

interface BookingChatProps {
  booking: any;
  currentUserId?: string;
}

export function BookingChat({ booking, currentUserId: propCurrentUserId }: BookingChatProps) {
  const [messages, setMessages] = useState(booking.messages || []);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(propCurrentUserId || null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!propCurrentUserId) {
      fetch("/api/auth/me")
        .then((res) => res.json())
        .then((data) => {
          if (data.user) {
            setCurrentUserId(data.user.id);
          }
        })
        .catch(console.error);
    }
  }, [propCurrentUserId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    setIsLoading(true);
    try {
      if (!currentUserId) {
        toast.error("Please sign in to send messages");
        return;
      }
      const message = await sendMessage(booking.id, currentUserId, newMessage.trim());
      setMessages([...messages, message]);
      setNewMessage("");
      scrollToBottom();
    } catch (error) {
      toast.error("Failed to send message");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const isSystemMessage = (body: string) => {
    return body.startsWith("[SYSTEM]");
  };

  const getSystemEventType = (body: string) => {
    if (body.includes("approved")) return "approved";
    if (body.includes("declined")) return "declined";
    if (body.includes("expired")) return "expired";
    return "system";
  };

  const renderSystemEvent = (message: any) => {
    const eventType = getSystemEventType(message.body);
    const eventText = message.body.replace("[SYSTEM]", "").trim();

    return (
      <div className="flex items-center justify-center py-2">
        <div className="px-3 py-1.5 rounded-full bg-muted text-xs text-muted-foreground">
          {eventText}
        </div>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Messages
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {/* Messages List */}
        <div className="h-96 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <p>No messages yet. Start the conversation!</p>
            </div>
          ) : (
            messages.map((message: any) => {
              if (isSystemMessage(message.body)) {
                return <div key={message.id}>{renderSystemEvent(message)}</div>;
              }

              const isOwnMessage = message.fromUserId === currentUserId;
              const initials = message.fromUser.name
                .split(" ")
                .map((n: string) => n[0])
                .join("")
                .toUpperCase()
                .slice(0, 2);

              return (
                <div
                  key={message.id}
                  className={`flex gap-3 ${isOwnMessage ? "flex-row-reverse" : ""}`}
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={message.fromUser.avatar || undefined} />
                    <AvatarFallback className="text-xs">{initials}</AvatarFallback>
                  </Avatar>
                  <div className={`flex-1 ${isOwnMessage ? "flex flex-col items-end" : ""}`}>
                    <div
                      className={`inline-block max-w-[80%] rounded-lg px-4 py-2 ${
                        isOwnMessage
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.body}</p>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 px-1">
                      {format(new Date(message.createdAt), "PPp")}
                    </p>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Composer */}
        <div className="border-t p-4">
          <div className="flex gap-2">
            <Textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="min-h-[60px] resize-none"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!newMessage.trim() || isLoading}
              size="icon"
              className="h-[60px] w-[60px] shrink-0"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

