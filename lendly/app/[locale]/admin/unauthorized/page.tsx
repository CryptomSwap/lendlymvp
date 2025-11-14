import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ShieldX } from "lucide-react";
import { useTranslations } from "next-intl";

export default function UnauthorizedPage() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <ShieldX className="h-12 w-12 mx-auto mb-4 text-destructive" />
          <CardTitle>Access Denied</CardTitle>
          <CardDescription>
            You do not have permission to access this page. Admin access is required.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link href="/" className="block">
            <Button className="w-full">Go to Home</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}

