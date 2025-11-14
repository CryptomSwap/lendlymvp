import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { requireAdmin } from "@/lib/utils/auth";
import { updateListingStatus } from "@/lib/actions/admin";

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

    const result = await updateListingStatus(id, "PAUSED");
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to pause listing" },
      { status: 500 }
    );
  }
}

