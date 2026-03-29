"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import PostCard from "./PostCard";
import ComposeBox from "./ComposeBox";

interface PostUser {
  username: string;
  displayName: string | null;
  avatarUrl: string | null;
}

export interface FeedPost {
  id: string;
  content: string | null;
  mediaUrl: string | null;
  mediaType: string | null;
  createdAt: string;
  user: PostUser;
  _count: { likes: number; comments: number };
  likes: { userId: string }[];
}

interface Props {
  currentUserId: string;
  currentUsername: string;
}

export default function Feed({ currentUserId, currentUsername }: Props) {
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const loadingRef = useRef(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const loadPosts = useCallback(async (cursorParam?: string) => {
    if (loadingRef.current) return;
    loadingRef.current = true;
    setLoading(true);
    setError("");
    try {
      const url = `/api/posts?type=feed${cursorParam ? `&cursor=${cursorParam}` : ""}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to load posts");
      const { posts: newPosts, nextCursor } = await res.json();
      setPosts((prev) => cursorParam ? [...prev, ...newPosts] : newPosts);
      setCursor(nextCursor);
      setHasMore(!!nextCursor);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  useEffect(() => {
    if (!hasMore || loading || !cursor) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadPosts(cursor);
        }
      },
      { rootMargin: "200px" }
    );

    const el = bottomRef.current;
    if (el) observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, [cursor, hasMore, loading, loadPosts]);

  function onNewPost(post: FeedPost) {
    setPosts((prev) => [post, ...prev]);
  }

  return (
    <div className="space-y-4">
      <ComposeBox currentUserId={currentUserId} currentUsername={currentUsername} onPost={onNewPost} />

      {error && (
        <div className="bg-red-500/20 border border-red-500/50 text-red-200 rounded-lg px-4 py-3 text-sm text-center">
          {error}
          <button onClick={() => loadPosts()} className="ml-2 underline">
            Retry
          </button>
        </div>
      )}

      {posts.map((post) => (
        <PostCard key={post.id} post={post} currentUserId={currentUserId} />
      ))}

      {loading && (
        <div className="text-center py-6 text-blue-300">Loading…</div>
      )}

      {!hasMore && posts.length > 0 && (
        <div className="text-center py-6 text-blue-400 text-sm">You&apos;ve reached the end</div>
      )}

      {!loading && !error && posts.length === 0 && (
        <div className="text-center py-12 text-blue-300">
          <p className="text-xl mb-2">Your feed is empty</p>
          <p className="text-sm">Follow some people to see their posts here.</p>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}
