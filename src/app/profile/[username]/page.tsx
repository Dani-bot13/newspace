import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import ProfileFrame from "@/components/ProfileFrame";
import FollowButton from "@/components/FollowButton";

interface Props {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { username } = await params;
  const user = await db.user.findUnique({ where: { username } });
  if (!user) return { title: "Not Found" };
  return { title: `${user.displayName ?? user.username} — NewSpace` };
}

export default async function ProfilePage({ params }: Props) {
  const { username } = await params;
  const session = await auth();

  const user = await db.user.findUnique({
    where: { username },
    include: {
      posts: {
        orderBy: { createdAt: "desc" },
        take: 9,
        include: {
          user: { select: { username: true, displayName: true, avatarUrl: true } },
          _count: { select: { likes: true, comments: true } },
        },
      },
      _count: {
        select: { followers: true, following: true, posts: true },
      },
    },
  });

  if (!user) notFound();

  const isOwner = session?.user?.id === user.id;

  let isFollowing = false;
  if (session?.user?.id && !isOwner) {
    const follow = await db.follow.findUnique({
      where: { followerId_followingId: { followerId: session.user.id, followingId: user.id } },
    });
    isFollowing = !!follow;
  }

  const hasCustomProfile = user.profileHtml || user.profileCss || user.profileMode === "classic";

  // Format posts for the classic skeleton (static HTML, no JS needed)
  const skeletonPosts = user.posts.map((post) => ({
    content: post.content,
    createdAt: formatDate(post.createdAt),
    likeCount: post._count.likes,
    commentCount: post._count.comments,
  }));

  return (
    <div>
      {/* ── Profile iframe (full width, IS the page) ── */}
      {hasCustomProfile ? (
        <div className="w-full bg-white">
          <ProfileFrame
            html={user.profileHtml ?? ""}
            css={user.profileCss ?? ""}
            mode={(user.profileMode === "blank" ? "blank" : "classic") as "classic" | "blank"}
            displayName={user.displayName ?? user.username}
            avatarUrl={user.avatarUrl ?? ""}
            bio={user.bio ?? ""}
            posts={skeletonPosts}
          />
        </div>
      ) : (
        /* No custom profile — show a default hero */
        <div className="flex items-center justify-center py-24 px-4">
          <div className="text-center">
            <div className="relative w-28 h-28 rounded-full overflow-hidden bg-blue-700 mx-auto mb-4">
              {user.avatarUrl ? (
                <Image src={user.avatarUrl} alt={user.username} fill className="object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-4xl text-white font-bold">
                  {(user.displayName ?? user.username).charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <h1 className="text-3xl font-bold text-white mb-1">
              {user.displayName ?? user.username}
            </h1>
            <p className="text-blue-300 mb-3">@{user.username}</p>
            {user.bio && <p className="text-blue-100 text-sm max-w-md mx-auto">{user.bio}</p>}
          </div>
        </div>
      )}

      {/* ── Profile info bar (below the profile, not blocking it) ── */}
      <div className="max-w-2xl mx-auto px-4 pt-6 pb-2 flex items-center gap-3 flex-wrap">
        <div className="relative w-10 h-10 rounded-full overflow-hidden bg-blue-700 flex-shrink-0">
          {user.avatarUrl ? (
            <Image src={user.avatarUrl} alt={user.username} fill className="object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-sm text-white font-bold">
              {(user.displayName ?? user.username).charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <span className="text-white font-semibold text-sm">{user.displayName ?? user.username}</span>
          <span className="text-blue-400 text-xs ml-2">@{user.username}</span>
          <div className="flex gap-4 text-xs text-blue-300 mt-0.5">
            <span><strong className="text-white">{user._count.posts}</strong> posts</span>
            <span><strong className="text-white">{user._count.followers}</strong> followers</span>
            <span><strong className="text-white">{user._count.following}</strong> following</span>
          </div>
        </div>
        {isOwner ? (
          <Link
            href="/settings/profile"
            className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
          >
            Edit Profile
          </Link>
        ) : session ? (
          <FollowButton targetUserId={user.id} initialFollowing={isFollowing} />
        ) : null}
      </div>

    </div>
  );
}

function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
