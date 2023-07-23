// Prevents cache attempts
// Useful during Docker builds where running access to running DB may be limited
export const dynamic = "force-dynamic";

// Third party
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  // TODO: User profile page
  return NextResponse.json({});
}
