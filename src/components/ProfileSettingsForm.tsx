"use client";

import { useState } from "react";

interface Props {
  initialDisplayName: string;
  initialBio: string;
  initialAvatarUrl: string;
}

export default function ProfileSettingsForm({ initialDisplayName, initialBio, initialAvatarUrl }: Props) {
  const [displayName, setDisplayName] = useState(initialDisplayName);
  const [bio, setBio] = useState(initialBio);
  const [avatarUrl, setAvatarUrl] = useState(initialAvatarUrl);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ displayName, bio, avatarUrl }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Failed to save");
      } else {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }
    } catch {
      setError("Network error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSave} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-blue-200 text-sm mb-1">Display Name</label>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            maxLength={50}
            className="w-full bg-white/10 border border-white/20 text-white placeholder-blue-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400"
          />
        </div>
        <div>
          <label className="block text-blue-200 text-sm mb-1">Avatar URL</label>
          <input
            type="url"
            value={avatarUrl}
            onChange={(e) => setAvatarUrl(e.target.value)}
            className="w-full bg-white/10 border border-white/20 text-white placeholder-blue-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400"
            placeholder="https://example.com/avatar.jpg"
          />
        </div>
      </div>
      <div>
        <label className="block text-blue-200 text-sm mb-1">Bio</label>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          maxLength={500}
          rows={3}
          className="w-full bg-white/10 border border-white/20 text-white placeholder-blue-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400 resize-none"
          placeholder="Tell the world about yourself…"
        />
      </div>
      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={saving}
          className="bg-orange-500 hover:bg-orange-400 disabled:opacity-50 text-white font-medium px-5 py-2 rounded-lg transition-colors text-sm"
        >
          {saving ? "Saving…" : "Save Info"}
        </button>
        {saved && <span className="text-green-400 text-sm">Saved!</span>}
        {error && <span className="text-red-400 text-sm">{error}</span>}
      </div>
    </form>
  );
}
