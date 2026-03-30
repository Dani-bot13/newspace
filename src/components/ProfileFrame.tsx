"use client";

import { useEffect, useRef, useCallback } from "react";
import { buildClassicSkeleton, CLASSIC_DEFAULT_CSS } from "@/lib/classic-skeleton";

interface ProfileFrameProps {
  html: string;
  css: string;
  mode: "classic" | "blank";
  displayName?: string;
  avatarUrl?: string;
  bio?: string;
  height?: number; // optional fixed height (used in editor preview)
}

export default function ProfileFrame({
  html,
  css,
  mode,
  displayName = "",
  avatarUrl = "",
  bio = "",
  height,
}: ProfileFrameProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  let bodyContent: string;
  let styleContent: string;

  if (mode === "classic") {
    const skeleton = buildClassicSkeleton({
      displayName: displayName || "NewSpace User",
      avatarUrl: avatarUrl || "",
      bio: bio || "",
      userHtml: html,
    });
    bodyContent = skeleton;
    styleContent = `
      * { box-sizing: border-box; }
      img { max-width: 100%; }
      ${CLASSIC_DEFAULT_CSS}
      ${css}
    `;
  } else {
    bodyContent = html;
    styleContent = `
      * { box-sizing: border-box; }
      body { margin: 0; font-family: sans-serif; min-height: 100vh; }
      img { max-width: 100%; }
      a { color: inherit; }
      ${css}
    `;
  }

  const srcDoc = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>${styleContent}</style>
  </head>
  <body>${bodyContent}</body>
</html>`;

  // Auto-resize iframe to content height (only when no fixed height)
  const resize = useCallback(() => {
    const iframe = iframeRef.current;
    if (!iframe || height) return;
    try {
      const doc = iframe.contentDocument;
      if (doc?.body) {
        const h = doc.body.scrollHeight;
        iframe.style.height = `${Math.max(h, 400)}px`;
      }
    } catch {
      // cross-origin or not ready
    }
  }, [height]);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe || height) return;
    iframe.addEventListener("load", resize);
    // Also poll briefly for late-loading images/fonts
    const t1 = setTimeout(resize, 500);
    const t2 = setTimeout(resize, 1500);
    return () => {
      iframe.removeEventListener("load", resize);
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [resize, height, srcDoc]);

  return (
    <iframe
      ref={iframeRef}
      srcDoc={srcDoc}
      sandbox="allow-same-origin"
      style={{
        width: "100%",
        height: height ? `${height}px` : "800px", // default before auto-resize
        border: "none",
        display: "block",
      }}
      title="Profile preview"
    />
  );
}
