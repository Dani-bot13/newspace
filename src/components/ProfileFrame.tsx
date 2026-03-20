"use client";

interface ProfileFrameProps {
  html: string;
  css: string;
  height?: number;
}

export default function ProfileFrame({ html, css, height = 600 }: ProfileFrameProps) {
  const srcDoc = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      * { box-sizing: border-box; }
      body { margin: 0; font-family: sans-serif; min-height: 100vh; }
      img { max-width: 100%; }
      a { color: inherit; }
      ${css}
    </style>
  </head>
  <body>${html}</body>
</html>`;

  return (
    <iframe
      srcDoc={srcDoc}
      sandbox="allow-same-origin allow-popups allow-popups-to-escape-sandbox"
      style={{ width: "100%", height: `${height}px`, border: "none" }}
      title="Profile preview"
    />
  );
}
