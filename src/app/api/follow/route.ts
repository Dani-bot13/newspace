import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { targetUserId } = await req.json();
  if (targetUserId === session.user.id) {
    return NextResponse.json({ error: "Cannot follow yourself" }, { status: 400 });
  }

  try {
    await db.follow.create({
      data: { followerId: session.user.id, followingId: targetUserId },
    });
    return NextResponse.json({ following: true });
  } catch {
    return NextResponse.json({ error: "Already following" }, { status: 409 });
  }
}

export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { targetUserId } = await req.json();
  await db.follow.deleteMany({
    where: { followerId: session.user.id, followingId: targetUserId },
  });
  return NextResponse.json({ following: false });
}
