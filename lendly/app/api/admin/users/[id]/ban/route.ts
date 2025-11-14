import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { requireAdmin } from "@/lib/utils/auth";
import { banUser } from "@/lib/actions/admin";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await requireAdmin(user.id);
    const { id } = await params;
    const body = await request.json();
    const { banned } = body;

    const result = await banUser(id, banned);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to ban/unban user" },
      { status: 500 }
    );
  }
}

