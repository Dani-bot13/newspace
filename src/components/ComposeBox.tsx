"use client";

import { useState } from "react";

interface Props {
  currentUserId: string;
  currentUsername: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onPost: (post: any) => void;
}

export default function ComposeBox({ onPost }: Props) {
  const [content, setContent] = useState("");
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim()) return;
    setPosting(true);
    setError("");
    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Failed to post");
        return;
      }
      const post = await res.json();
      onPost(post);
      setContent("");
    } catch {
      setError("Network error");
    } finally {
      setPosting(false);
    }
  }

  return (
    <div className="bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-4">
      <form onSubmit={handleSubmit}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's on your mind?"
          rows={3}
          maxLength={1000}
          className="w-full bg-white/10 border border-white/20 text-white placeholder-blue-300 rounded-xl px-4 py-3 focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400 resize-none"
        />
        <div className="flex items-center justify-between mt-3">
          <span className="text-blue-300 text-xs">{content.length}/1000</span>
          <div className="flex items-center gap-2">
            {error && <span className="text-red-400 text-xs">{error}</span>}
            <button
              type="submit"
              disabled={posting || !content.trim()}
              className="bg-orange-500 hover:bg-orange-400 disabled:opacity-50 text-white font-medium px-5 py-2 rounded-lg transition-colors text-sm"
            >
              {posting ? "Posting…" : "Post"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
