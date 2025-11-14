import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { requireAdmin } from "@/lib/utils/auth";
import { updateRules } from "@/lib/actions/admin";

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await requireAdmin(user.id);
    const body = await request.json();

    const result = await updateRules(body);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to update rules" },
      { status: 500 }
    );
  }
}

