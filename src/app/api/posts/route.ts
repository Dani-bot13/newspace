import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

// GET /api/posts?cursor=...&type=feed|profile&userId=...
export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const cursor = searchParams.get("cursor") ?? undefined;
  const type = searchParams.get("type") ?? "feed";
  const userId = searchParams.get("userId") ?? undefined;
  const limit = 20;

  let where: Record<string, unknown> = {};

  if (type === "feed") {
    // Get IDs of users this person follows + their own
    const following = await db.follow.findMany({
      where: { followerId: session.user.id },
      select: { followingId: true },
    });
    const ids = [session.user.id, ...following.map((f) => f.followingId)];
    where = { userId: { in: ids } };
  } else if (type === "profile" && userId) {
    where = { userId };
  }

  const posts = await db.post.findMany({
    where,
    take: limit + 1,
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { username: true, displayName: true, avatarUrl: true } },
      _count: { select: { likes: true, comments: true } },
      likes: {
        where: { userId: session.user.id },
        select: { userId: true },
      },
    },
  });

  const hasMore = posts.length > limit;
  const data = hasMore ? posts.slice(0, limit) : posts;
  const nextCursor = hasMore ? data[data.length - 1].id : null;

  return NextResponse.json({ posts: data, nextCursor });
}

// POST /api/posts
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { content, mediaUrl, mediaType } = await req.json();

  if (!content?.trim() && !mediaUrl) {
    return NextResponse.json({ error: "Post must have content or media" }, { status: 400 });
  }

  const post = await db.post.create({
    data: {
      userId: session.user.id,
      content: content?.trim() ?? null,
      mediaUrl: mediaUrl ?? null,
      mediaType: mediaType ?? null,
    },
    include: {
      user: { select: { username: true, displayName: true, avatarUrl: true } },
      _count: { select: { likes: true, comments: true } },
      likes: { where: { userId: session.user.id }, select: { userId: true } },
    },
  });

  return NextResponse.json(post, { status: 201 });
}
