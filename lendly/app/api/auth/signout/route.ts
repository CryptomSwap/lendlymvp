import { signOut } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    await signOut();
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to sign out" },
      { status: 500 }
    );
  }
}

