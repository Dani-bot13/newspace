import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { sanitizeProfileHtml, sanitizeProfileCss } from "@/lib/sanitize";

const MAX_HTML_LENGTH = 50_000;
const MAX_CSS_LENGTH = 20_000;
const MAX_BIO_LENGTH = 500;

function isValidUrl(str: string): boolean {
  try {
    const url = new URL(str);
    return url.protocol === "https:";
  } catch {
    return false;
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { profileHtml, profileCss, displayName, bio, avatarUrl } = body;

    const updates: Record<string, string | null> = {};

    if (profileHtml !== undefined) {
      if (typeof profileHtml === "string" && profileHtml.length > MAX_HTML_LENGTH) {
        return NextResponse.json({ error: `HTML must be under ${MAX_HTML_LENGTH} characters` }, { status: 400 });
      }
      updates.profileHtml = sanitizeProfileHtml(profileHtml ?? "");
    }
    if (profileCss !== undefined) {
      if (typeof profileCss === "string" && profileCss.length > MAX_CSS_LENGTH) {
        return NextResponse.json({ error: `CSS must be under ${MAX_CSS_LENGTH} characters` }, { status: 400 });
      }
      updates.profileCss = sanitizeProfileCss(profileCss ?? "");
    }
    if (displayName !== undefined) {
      updates.displayName = typeof displayName === "string" ? displayName.slice(0, 50) : null;
    }
    if (bio !== undefined) {
      updates.bio = typeof bio === "string" ? bio.slice(0, MAX_BIO_LENGTH) : null;
    }
    if (avatarUrl !== undefined) {
      if (avatarUrl && !isValidUrl(avatarUrl)) {
        return NextResponse.json({ error: "Avatar URL must be a valid HTTPS URL" }, { status: 400 });
      }
      updates.avatarUrl = avatarUrl || null;
    }

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
  } catch (err) {
    console.error("Profile update error:", (err as Error).message);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
