import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { sanitizeProfileHtml, sanitizeProfileCss } from "@/lib/sanitize";

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { profileHtml, profileCss, displayName, bio, avatarUrl } = body;

  const updates: Record<string, string | null> = {};

  if (profileHtml !== undefined) {
    updates.profileHtml = sanitizeProfileHtml(profileHtml ?? "");
  }
  if (profileCss !== undefined) {
    updates.profileCss = sanitizeProfileCss(profileCss ?? "");
  }
  if (displayName !== undefined) updates.displayName = displayName;
  if (bio !== undefined) updates.bio = bio;
  if (avatarUrl !== undefined) updates.avatarUrl = avatarUrl;

  const user = await db.user.update({
    where: { id: session.user.id },
    data: updates,
  });

  return NextResponse.json({
    id: user.id,
    username: user.username,
    displayName: user.displayName,
    bio: user.bio,
    avatarUrl: user.avatarUrl,
  });
}
