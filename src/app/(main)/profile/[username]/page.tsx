import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import ProfileFrame from "@/components/ProfileFrame";
import PostCard from "@/components/PostCard";
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
          ...(session?.user?.id
            ? { likes: { where: { userId: session.user.id }, select: { userId: true } } }
            : {}),
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

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Profile Header */}
      <div className="bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-6 mb-6">
        <div className="flex items-start gap-5">
          <div className="relative w-24 h-24 rounded-full overflow-hidden bg-blue-700 flex-shrink-0">
            {user.avatarUrl ? (
              <Image src={user.avatarUrl} alt={user.username} fill className="object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-3xl text-white font-bold">
                {(user.displayName ?? user.username).charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <h1 className="text-2xl font-bold text-white">
                  {user.displayName ?? user.username}
                </h1>
                <p className="text-blue-300">@{user.username}</p>
              </div>
              <div className="flex gap-2">
                {isOwner ? (
                  <Link
                    href="/settings/profile"
                    className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-4 py-1.5 rounded-lg text-sm font-medium transition-colors"
                  >
                    Edit Profile
                  </Link>
                ) : session ? (
                  <FollowButton
                    targetUserId={user.id}
                    initialFollowing={isFollowing}
                  />
                ) : null}
              </div>
            </div>

            {user.bio && (
              <p className="text-blue-100 mt-3 text-sm">{user.bio}</p>
            )}

            <div className="flex gap-6 mt-4 text-sm">
              <span className="text-white">
                <strong>{user._count.posts}</strong>{" "}
                <span className="text-blue-300">posts</span>
              </span>
              <span className="text-white">
                <strong>{user._count.followers}</strong>{" "}
                <span className="text-blue-300">followers</span>
              </span>
              <span className="text-white">
                <strong>{user._count.following}</strong>{" "}
                <span className="text-blue-300">following</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Profile Section */}
      {(user.profileHtml || user.profileCss) && (
        <div className="bg-white rounded-2xl overflow-hidden mb-6 border border-white/20">
          <ProfileFrame
            html={user.profileHtml ?? ""}
            css={user.profileCss ?? ""}
            height={600}
          />
        </div>
      )}

      {/* Recent Posts */}
      {user.posts.length > 0 && (
        <div>
          <h2 className="text-white font-semibold text-lg mb-4">Recent Posts</h2>
          <div className="space-y-4">
            {user.posts.map((post) => (
              <PostCard
                key={post.id}
                post={{ ...post, likes: (post as unknown as { likes?: { userId: string }[] }).likes ?? [] }}
                currentUserId={session?.user?.id}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
