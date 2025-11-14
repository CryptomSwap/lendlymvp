import { getCurrentUser } from "@/lib/auth";
import { redirect } from "@/i18n/routing";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, UserX, Ban } from "lucide-react";

export default async function BlockedUsersPage() {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect("/auth/signin");
  }

  // TODO: Implement blocked users fetch from database
  const blockedUsers: any[] = [];

  return (
    <div className="container mx-auto px-4 py-6 space-y-6 pb-24">
      <div className="flex items-center gap-3 mb-6">
        <Users className="h-8 w-8 text-[#009999]" />
        <h1 className="text-h1">Blocked Users</h1>
      </div>

      {blockedUsers.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <UserX className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground mb-2">No blocked users</p>
            <p className="text-sm text-muted-foreground">
              Users you block will appear here
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Blocked Users ({blockedUsers.length})</CardTitle>
            <CardDescription>
              These users cannot contact you or see your listings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {blockedUsers.map((blockedUser) => (
                <div
                  key={blockedUser.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarImage src={blockedUser.avatar || undefined} />
                      <AvatarFallback>
                        {blockedUser.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{blockedUser.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Blocked on {new Date(blockedUser.blockedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      // TODO: Implement unblock functionality
                    }}
                  >
                    <Ban className="mr-2 h-4 w-4" />
                    Unblock
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

