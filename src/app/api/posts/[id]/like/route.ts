import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

interface Params {
  params: Promise<{ id: string }>;
}

export async function POST(_req: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  try {
    await db.like.create({ data: { postId: id, userId: session.user.id } });
    return NextResponse.json({ liked: true });
  } catch {
    return NextResponse.json({ error: "Already liked" }, { status: 409 });
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await db.like.deleteMany({ where: { postId: id, userId: session.user.id } });
  return NextResponse.json({ liked: false });
}
