"use client";

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import ProfileFrame from "./ProfileFrame";

// Lazy-load CodeMirror to avoid SSR issues
const CodeMirrorEditor = dynamic(() => import("./CodeMirrorEditor"), { ssr: false });

interface ProfileEditorProps {
  initialHtml: string;
  initialCss: string;
}

export default function ProfileEditor({ initialHtml, initialCss }: ProfileEditorProps) {
  const [html, setHtml] = useState(initialHtml);
  const [css, setCss] = useState(initialCss);
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
        body: JSON.stringify({ profileHtml: html, profileCss: css }),
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
  }, [html, css]);

  return (
    <div className="flex flex-col lg:flex-row gap-4 h-full">
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
            HTML
          </button>
          <button
            onClick={() => setActiveTab("css")}
            className={`px-4 py-1.5 rounded-t text-sm font-medium transition-colors ${
              activeTab === "css"
                ? "bg-blue-600 text-white"
                : "bg-white/10 text-blue-200 hover:bg-white/20"
            }`}
          >
            CSS
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
            <CodeMirrorEditor
              value={html}
              onChange={setHtml}
              language="html"
            />
          ) : (
            <CodeMirrorEditor
              value={css}
              onChange={setCss}
              language="css"
            />
          )}
        </div>
      </div>

      {/* Preview Panel */}
      <div className="lg:w-1/2 flex flex-col">
        <div className="text-blue-200 text-sm font-medium mb-2 flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          Live Preview
        </div>
        <div className="flex-1 rounded-lg overflow-hidden border border-white/20 bg-white min-h-[400px]">
          <ProfileFrame html={html} css={css} height={500} />
        </div>
      </div>
    </div>
  );
}
