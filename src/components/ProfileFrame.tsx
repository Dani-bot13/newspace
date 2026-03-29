"use client";

import { buildClassicSkeleton, CLASSIC_DEFAULT_CSS } from "@/lib/classic-skeleton";

interface ProfileFrameProps {
  html: string;
  css: string;
  mode: "classic" | "blank";
  displayName?: string;
  avatarUrl?: string;
  bio?: string;
  height?: number;
}

export default function ProfileFrame({
  html,
  css,
  mode,
  displayName = "",
  avatarUrl = "",
  bio = "",
  height = 600,
}: ProfileFrameProps) {
  let bodyContent: string;
  let styleContent: string;

  if (mode === "classic") {
    // Classic mode: render the MySpace skeleton, inject user CSS as overrides
    const skeleton = buildClassicSkeleton({
      displayName: displayName || "NewSpace User",
      avatarUrl: avatarUrl || "",
      bio: bio || "",
      userHtml: html,
    });
    bodyContent = skeleton;
    // Layer: base reset → classic defaults → user CSS overrides
    styleContent = `
      * { box-sizing: border-box; }
      img { max-width: 100%; }
      ${CLASSIC_DEFAULT_CSS}
      ${css}
    `;
  } else {
    // Blank canvas mode: user controls everything
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

  return (
    <iframe
      srcDoc={srcDoc}
      sandbox="allow-same-origin"
      style={{ width: "100%", height: `${height}px`, border: "none" }}
      title="Profile preview"
    />
  );
}
