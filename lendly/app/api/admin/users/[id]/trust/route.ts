import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { requireAdmin } from "@/lib/utils/auth";
import { updateUserTrustScore } from "@/lib/actions/admin";

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
    const { trustScore } = body;

    const result = await updateUserTrustScore(id, trustScore);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to update trust score" },
      { status: 500 }
    );
  }
}

