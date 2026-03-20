"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface PostUser {
  username: string;
  displayName: string | null;
  avatarUrl: string | null;
}

interface Post {
  id: string;
  content: string | null;
  mediaUrl: string | null;
  mediaType: string | null;
  createdAt: Date | string;
  user: PostUser;
  _count: { likes: number; comments: number };
  likes: { userId: string }[];
}

interface Props {
  post: Post;
  currentUserId?: string;
}

export default function PostCard({ post, currentUserId }: Props) {
  const [liked, setLiked] = useState(
    post.likes.some((l) => l.userId === currentUserId)
  );
  const [likeCount, setLikeCount] = useState(post._count.likes);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<
    { id: string; content: string; user: PostUser; createdAt: string }[]
  >([]);
  const [commentText, setCommentText] = useState("");
  const [loadingComments, setLoadingComments] = useState(false);

  async function toggleLike() {
    if (!currentUserId) return;
    const method = liked ? "DELETE" : "POST";
    const res = await fetch(`/api/posts/${post.id}/like`, { method });
    if (res.ok) {
      setLiked(!liked);
      setLikeCount((c) => c + (liked ? -1 : 1));
    }
  }

  async function loadComments() {
    if (loadingComments) return;
    setLoadingComments(true);
    const res = await fetch(`/api/posts/${post.id}/comments`);
    if (res.ok) setComments(await res.json());
    setLoadingComments(false);
    setShowComments(true);
  }

  async function submitComment(e: React.FormEvent) {
    e.preventDefault();
    if (!commentText.trim()) return;
    const res = await fetch(`/api/posts/${post.id}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: commentText }),
    });
    if (res.ok) {
      const c = await res.json();
      setComments((prev) => [...prev, c]);
      setCommentText("");
    }
  }

  const timeAgo = formatTimeAgo(new Date(post.createdAt));

  return (
    <div className="bg-white/10 backdrop-blur border border-white/20 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 p-4">
        <Link href={`/profile/${post.user.username}`} className="flex-shrink-0">
          <div className="w-10 h-10 rounded-full bg-blue-700 overflow-hidden flex items-center justify-center">
            {post.user.avatarUrl ? (
              <Image src={post.user.avatarUrl} alt={post.user.username} width={40} height={40} className="object-cover" />
            ) : (
              <span className="text-white font-bold text-sm">
                {(post.user.displayName ?? post.user.username).charAt(0).toUpperCase()}
              </span>
            )}
          </div>
        </Link>
        <div className="flex-1 min-w-0">
          <Link href={`/profile/${post.user.username}`} className="text-white font-medium hover:text-orange-300 transition-colors">
            {post.user.displayName ?? post.user.username}
          </Link>
          <p className="text-blue-300 text-xs">@{post.user.username} · {timeAgo}</p>
        </div>
      </div>

      {/* Content */}
      {post.content && (
        <div className="px-4 pb-3">
          <p className="text-white whitespace-pre-wrap break-words">{post.content}</p>
        </div>
      )}

      {/* Media */}
      {post.mediaUrl && post.mediaType === "photo" && (
        <div className="relative w-full aspect-video bg-black">
          <Image src={post.mediaUrl} alt="Post image" fill className="object-contain" />
        </div>
      )}
      {post.mediaUrl && post.mediaType === "video" && (
        <video src={post.mediaUrl} controls className="w-full max-h-96 bg-black" />
      )}

      {/* Actions */}
      <div className="flex items-center gap-4 px-4 py-3 border-t border-white/10">
        <button
          onClick={toggleLike}
          disabled={!currentUserId}
          className={`flex items-center gap-1.5 text-sm transition-colors disabled:cursor-default ${
            liked ? "text-red-400" : "text-blue-300 hover:text-red-400"
          }`}
        >
          <span>{liked ? "♥" : "♡"}</span>
          <span>{likeCount}</span>
        </button>
        <button
          onClick={showComments ? () => setShowComments(false) : loadComments}
          className="flex items-center gap-1.5 text-sm text-blue-300 hover:text-white transition-colors"
        >
          <span>💬</span>
          <span>{post._count.comments}</span>
        </button>
      </div>

      {/* Comments */}
      {showComments && (
        <div className="border-t border-white/10 px-4 py-3 space-y-3">
          {comments.map((c) => (
            <div key={c.id} className="flex gap-2">
              <div className="w-7 h-7 rounded-full bg-blue-700 flex items-center justify-center flex-shrink-0">
                <span className="text-white text-xs font-bold">
                  {(c.user.displayName ?? c.user.username).charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="bg-white/10 rounded-xl px-3 py-2 flex-1">
                <span className="text-white text-xs font-medium">{c.user.displayName ?? c.user.username} </span>
                <span className="text-blue-100 text-xs">{c.content}</span>
              </div>
            </div>
          ))}
          {currentUserId && (
            <form onSubmit={submitComment} className="flex gap-2">
              <input
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Add a comment…"
                className="flex-1 bg-white/10 border border-white/20 text-white text-sm placeholder-blue-300 rounded-lg px-3 py-2 focus:outline-none focus:border-orange-400"
              />
              <button
                type="submit"
                className="bg-orange-500 hover:bg-orange-400 text-white text-sm px-3 py-2 rounded-lg transition-colors"
              >
                Post
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}

function formatTimeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString();
}
