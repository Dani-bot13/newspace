"use client";

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import ProfileFrame from "./ProfileFrame";

const CodeMirrorEditor = dynamic(() => import("./CodeMirrorEditor"), { ssr: false });

interface ProfileEditorProps {
  initialHtml: string;
  initialCss: string;
  initialMode: "classic" | "blank";
  displayName: string;
  avatarUrl: string;
  bio: string;
}

export default function ProfileEditor({
  initialHtml,
  initialCss,
  initialMode,
  displayName,
  avatarUrl,
  bio,
}: ProfileEditorProps) {
  const [html, setHtml] = useState(initialHtml);
  const [css, setCss] = useState(initialCss);
  const [mode, setMode] = useState<"classic" | "blank">(initialMode);
  const [activeTab, setActiveTab] = useState<"html" | "css">("html");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const handleSave = useCallback(async () => {
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profileHtml: html, profileCss: css, profileMode: mode }),
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
  }, [html, css, mode]);

  return (
    <div className="flex flex-col gap-4">
      {/* Mode Selector */}
      <div className="flex items-center gap-3">
        <span className="text-blue-200 text-sm">Mode:</span>
        <button
          onClick={() => setMode("classic")}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            mode === "classic"
              ? "bg-orange-500 text-white"
              : "bg-white/10 text-blue-200 hover:bg-white/20"
          }`}
        >
          Classic MySpace
        </button>
        <button
          onClick={() => setMode("blank")}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            mode === "blank"
              ? "bg-orange-500 text-white"
              : "bg-white/10 text-blue-200 hover:bg-white/20"
          }`}
        >
          Blank Canvas
        </button>
        <span className="text-blue-400 text-xs ml-2">
          {mode === "classic"
            ? "Paste old MySpace layout codes here — they just work"
            : "Full control: write your own HTML + CSS from scratch"}
        </span>
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        {/* Editor Panel */}
        <div className="lg:w-1/2 flex flex-col">
          <div className="flex items-center gap-2 mb-2">
            <button
              onClick={() => setActiveTab("html")}
              className={`px-4 py-1.5 rounded-t text-sm font-medium transition-colors ${
                activeTab === "html"
                  ? "bg-blue-600 text-white"
                  : "bg-white/10 text-blue-200 hover:bg-white/20"
              }`}
            >
              {mode === "classic" ? "HTML (About Me)" : "HTML"}
            </button>
            <button
              onClick={() => setActiveTab("css")}
              className={`px-4 py-1.5 rounded-t text-sm font-medium transition-colors ${
                activeTab === "css"
                  ? "bg-blue-600 text-white"
                  : "bg-white/10 text-blue-200 hover:bg-white/20"
              }`}
            >
              CSS {mode === "classic" ? "(Layout Override)" : ""}
            </button>
            <div className="ml-auto flex items-center gap-2">
              {error && <span className="text-red-400 text-xs">{error}</span>}
              {saved && <span className="text-green-400 text-xs">Saved!</span>}
              <button
                onClick={handleSave}
                disabled={saving}
                className="bg-orange-500 hover:bg-orange-400 disabled:opacity-50 text-white text-sm font-medium px-4 py-1.5 rounded transition-colors"
              >
                {saving ? "Saving…" : "Save Profile"}
              </button>
            </div>
          </div>

          <div className="flex-1 rounded-lg overflow-hidden border border-white/20 min-h-[400px]">
            {activeTab === "html" ? (
              <CodeMirrorEditor value={html} onChange={setHtml} language="html" />
            ) : (
              <CodeMirrorEditor value={css} onChange={setCss} language="css" />
            )}
          </div>

          {mode === "classic" && (
            <p className="text-blue-400 text-xs mt-2">
              Tip: Paste a full MySpace layout code (with &lt;style&gt; tags) into the HTML tab.
              The CSS will be extracted automatically.
            </p>
          )}
        </div>

        {/* Preview Panel */}
        <div className="lg:w-1/2 flex flex-col">
          <div className="text-blue-200 text-sm font-medium mb-2 flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            Live Preview
          </div>
          <div className="flex-1 rounded-lg overflow-hidden border border-white/20 bg-white min-h-[400px]">
            <ProfileFrame
              html={html}
              css={css}
              mode={mode}
              displayName={displayName}
              avatarUrl={avatarUrl}
              bio={bio}
              height={500}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
