"use client";

import CodeMirror from "@uiw/react-codemirror";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import { oneDark } from "@codemirror/theme-one-dark";

interface CodeMirrorEditorProps {
  value: string;
  onChange: (value: string) => void;
  language: "html" | "css";
}

export default function CodeMirrorEditor({
  value,
  onChange,
  language,
}: CodeMirrorEditorProps) {
  const extensions = language === "html" ? [html()] : [css()];

  return (
    <CodeMirror
      value={value}
      extensions={extensions}
      theme={oneDark}
      onChange={onChange}
      height="100%"
      style={{ height: "100%", fontSize: "13px" }}
      basicSetup={{
        lineNumbers: true,
        foldGutter: true,
        autocompletion: true,
        syntaxHighlighting: true,
      }}
    />
  );
}
