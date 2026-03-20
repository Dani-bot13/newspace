import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  const comments = await db.comment.findMany({
    where: { postId: id },
    orderBy: { createdAt: "asc" },
    include: {
      user: { select: { username: true, displayName: true, avatarUrl: true } },
    },
  });
  return NextResponse.json(comments);
}

export async function POST(req: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { content } = await req.json();
  if (!content?.trim()) return NextResponse.json({ error: "Comment cannot be empty" }, { status: 400 });

  const comment = await db.comment.create({
    data: { postId: id, userId: session.user.id, content: content.trim() },
    include: {
      user: { select: { username: true, displayName: true, avatarUrl: true } },
    },
  });

  return NextResponse.json(comment, { status: 201 });
}
