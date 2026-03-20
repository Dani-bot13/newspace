"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import PostCard from "./PostCard";
import ComposeBox from "./ComposeBox";

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
  const [posts, setPosts] = useState<Post[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const loadPosts = useCallback(async (cursorParam?: string) => {
    if (loading) return;
    setLoading(true);
    try {
      const url = `/api/posts?type=feed${cursorParam ? `&cursor=${cursorParam}` : ""}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to load");
      const { posts: newPosts, nextCursor } = await res.json();
      setPosts((prev) => cursorParam ? [...prev, ...newPosts] : newPosts);
      setCursor(nextCursor);
      setHasMore(!!nextCursor);
    } finally {
      setLoading(false);
    }
  }, [loading]);

  useEffect(() => {
    loadPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!hasMore || loading) return;
    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && cursor) {
        loadPosts(cursor);
      }
    });
    if (bottomRef.current) observerRef.current.observe(bottomRef.current);
    return () => observerRef.current?.disconnect();
  }, [cursor, hasMore, loading, loadPosts]);

  function onNewPost(post: Post) {
    setPosts((prev) => [post, ...prev]);
  }

  return (
    <div className="space-y-4">
      <ComposeBox currentUserId={currentUserId} currentUsername={currentUsername} onPost={onNewPost} />

      {posts.map((post) => (
        <PostCard key={post.id} post={post} currentUserId={currentUserId} />
      ))}

      {loading && (
        <div className="text-center py-6 text-blue-300">Loading…</div>
      )}

      {!hasMore && posts.length > 0 && (
        <div className="text-center py-6 text-blue-400 text-sm">You&apos;ve reached the end ✨</div>
      )}

      {!loading && posts.length === 0 && (
        <div className="text-center py-12 text-blue-300">
          <p className="text-xl mb-2">Your feed is empty</p>
          <p className="text-sm">Follow some people to see their posts here.</p>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}
