"use client";

import { useState } from "react";

interface Props {
  targetUserId: string;
  initialFollowing: boolean;
}

export default function FollowButton({ targetUserId, initialFollowing }: Props) {
  const [following, setFollowing] = useState(initialFollowing);
  const [loading, setLoading] = useState(false);

  async function toggle() {
    setLoading(true);
    try {
      const res = await fetch("/api/follow", {
        method: following ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetUserId }),
      });
      if (res.ok) setFollowing(!following);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 ${
        following
          ? "bg-white/10 hover:bg-red-500/20 text-white border border-white/20 hover:border-red-500/50 hover:text-red-300"
          : "bg-orange-500 hover:bg-orange-400 text-white"
      }`}
    >
      {following ? "Unfollow" : "Follow"}
    </button>
  );
}
