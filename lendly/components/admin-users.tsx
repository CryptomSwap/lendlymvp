"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Loader2, Shield, Ban, CheckCircle2, TrendingUp, TrendingDown } from "lucide-react";
import {
  getAdminUsers,
  updateUserVerification,
  updateUserTrustScore,
  banUser,
} from "@/lib/actions/admin";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { format } from "date-fns";
import { parseRoles } from "@/lib/auth/roles";

export function AdminUsers() {
  const t = useTranslations("admin");
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [trustScoreAdjustment, setTrustScoreAdjustment] = useState("");

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setIsLoading(true);
      const data = await getAdminUsers({ page: 1, pageSize: 50 });
      setUsers(data.users);
    } catch (error: any) {
      toast.error(error.message || "Failed to load users");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async (userId: string, isVerified: boolean) => {
    try {
      await updateUserVerification(userId, isVerified);
      toast.success(`User ${isVerified ? "verified" : "unverified"}`);
      loadUsers();
    } catch (error: any) {
      toast.error(error.message || "Failed to update verification");
    }
  };

  const handleTrustScore = async (userId: string, adjustment: number) => {
    try {
      const user = users.find((u) => u.id === userId);
      if (!user) return;
      const newScore = user.trustScore + adjustment;
      await updateUserTrustScore(userId, newScore);
      toast.success("Trust score updated");
      setSelectedUser(null);
      setTrustScoreAdjustment("");
      loadUsers();
    } catch (error: any) {
      toast.error(error.message || "Failed to update trust score");
    }
  };

  const handleBan = async (userId: string, banned: boolean) => {
    try {
      await banUser(userId, banned);
      toast.success(`User ${banned ? "banned" : "unbanned"}`);
      loadUsers();
    } catch (error: any) {
      toast.error(error.message || "Failed to update user");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{t("users.title")}</h1>
        <p className="text-muted-foreground mt-2">{t("users.description")}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("users.allUsers")}</CardTitle>
          <CardDescription>{t("users.total")}: {users.length}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">{t("users.name")}</th>
                  <th className="text-left p-2">{t("users.email")}</th>
                  <th className="text-left p-2">{t("users.role")}</th>
                  <th className="text-left p-2">{t("users.trustScore")}</th>
                  <th className="text-left p-2">{t("users.verified")}</th>
                  <th className="text-left p-2">{t("users.incidents")}</th>
                  <th className="text-left p-2">{t("users.joined")}</th>
                  <th className="text-left p-2">{t("users.actions")}</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b">
                    <td className="p-2 font-medium">{user.name}</td>
                    <td className="p-2 text-sm text-muted-foreground">{user.email}</td>
                    <td className="p-2">
                      <div className="flex gap-1 flex-wrap">
                        {(() => {
                          const roles = typeof user.roles === "string" 
                            ? parseRoles(user.roles) 
                            : (user.roles || []);
                          return roles.length > 0 ? (
                            roles.map((role: string) => (
                              <Badge
                                key={role}
                                variant={role === "ADMIN" ? "default" : "outline"}
                              >
                                {role}
                              </Badge>
                            ))
                          ) : (
                            <Badge variant="outline">No roles</Badge>
                          );
                        })()}
                      </div>
                    </td>
                    <td className="p-2">
                      <Badge variant="secondary">{user.trustScore}</Badge>
                    </td>
                    <td className="p-2">
                      {user.isVerified ? (
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                      ) : (
                        <Shield className="h-4 w-4 text-muted-foreground" />
                      )}
                    </td>
                    <td className="p-2 text-sm">{user.incidentsCount || 0}</td>
                    <td className="p-2 text-sm text-muted-foreground">
                      {format(new Date(user.createdAt), "PP")}
                    </td>
                    <td className="p-2">
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleVerify(user.id, !user.isVerified)}
                        >
                          <Shield className="h-4 w-4" />
                        </Button>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedUser(user)}
                            >
                              <TrendingUp className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Adjust Trust Score</DialogTitle>
                              <DialogDescription>
                                Current score: {user.trustScore}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <Label>Adjustment (+/-)</Label>
                                <Input
                                  type="number"
                                  value={trustScoreAdjustment}
                                  onChange={(e) => setTrustScoreAdjustment(e.target.value)}
                                  placeholder="e.g., +10 or -5"
                                />
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  onClick={() => {
                                    const adj = parseInt(trustScoreAdjustment) || 0;
                                    handleTrustScore(user.id, adj);
                                  }}
                                >
                                  Apply
                                </Button>
                                <Button
                                  variant="outline"
                                  onClick={() => {
                                    setSelectedUser(null);
                                    setTrustScoreAdjustment("");
                                  }}
                                >
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const roles = typeof user.roles === "string" 
                              ? parseRoles(user.roles) 
                              : (user.roles || []);
                            handleBan(user.id, !roles.includes("BANNED" as any));
                          }}
                        >
                          <Ban className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

