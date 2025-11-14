import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { requireAdmin } from "@/lib/utils/auth";
import { getAdminMetricsWithRange } from "@/lib/actions/admin";

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await requireAdmin(user.id);
    const searchParams = request.nextUrl.searchParams;
    const from = searchParams.get("from");
    const to = searchParams.get("to");

    if (!from || !to) {
      return NextResponse.json(
        { error: "from and to parameters are required" },
        { status: 400 }
      );
    }

    const fromDate = new Date(from);
    const toDate = new Date(to);
    toDate.setHours(23, 59, 59, 999);

    const result = await getAdminMetricsWithRange(fromDate, toDate);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch metrics" },
      { status: 500 }
    );
  }
}

