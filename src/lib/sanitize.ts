import { JSDOM } from "jsdom";
import DOMPurify from "dompurify";

const { window } = new JSDOM("");
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const purify = DOMPurify(window as any);

export function sanitizeProfileHtml(html: string): string {
  // Step 1: Extract <style> blocks before DOMPurify strips them
  const styleBlocks: string[] = [];
  const htmlWithoutStyles = html.replace(
    /<style[^>]*>([\s\S]*?)<\/style>/gi,
    (_match, css: string) => {
      styleBlocks.push(css);
      return "";
    }
  );

  // Step 2: Sanitize the HTML (no <style> tags to worry about now)
  const cleanHtml = purify.sanitize(htmlWithoutStyles, {
    ALLOWED_TAGS: [
      // Structure
      "div", "p", "span", "section", "article", "header", "footer", "nav",
      "figure", "figcaption", "main", "aside",
      // Headings
      "h1", "h2", "h3", "h4", "h5", "h6",
      // Text formatting
      "strong", "em", "b", "i", "u", "s", "br", "hr",
      "blockquote", "pre", "code", "sub", "sup", "small",
      // Lists
      "ul", "ol", "li", "dl", "dt", "dd",
      // Tables
      "table", "tr", "td", "th", "thead", "tbody", "tfoot", "caption", "colgroup", "col",
      // Media
      "img", "video", "audio", "source", "picture",
      // Links
      "a",
      // Classic MySpace tags
      "marquee", "blink", "center", "font", "big",
    ],
    ALLOWED_ATTR: [
      "src", "href", "style", "class", "id", "target",
      "width", "height", "alt", "title",
      "controls", "autoplay", "loop", "muted", "poster", "type",
      "colspan", "rowspan", "span",
      "align", "valign", "bgcolor", "border", "cellpadding", "cellspacing",
      // Classic MySpace / <font> attributes
      "color", "size", "face",
      "background", "text", "link", "vlink", "alink",
      // Media queries in <source>
      "media", "srcset", "sizes",
    ],
    FORBID_TAGS: ["script", "iframe", "object", "embed", "form", "input",
                   "textarea", "select", "button", "meta", "link", "base"],
    FORBID_ATTR: [
      "onerror", "onload", "onclick", "onmouseover", "onmouseout",
      "onfocus", "onblur", "onchange", "onsubmit", "onkeydown",
      "onkeyup", "onkeypress", "oninput", "onanimationend",
      "ontransitionend", "onwheel", "onscroll", "onresize",
      "ondrag", "ondrop", "onpaste", "oncopy",
    ],
    ALLOW_ARIA_ATTR: false,
    ALLOW_DATA_ATTR: false,
    FORCE_BODY: true,
  });

  // Step 3: Sanitize extracted CSS and re-inject as <style> blocks
  if (styleBlocks.length === 0) return cleanHtml;

  const cleanCss = styleBlocks
    .map((block) => sanitizeProfileCss(block))
    .join("\n");

  return `<style>${cleanCss}</style>\n${cleanHtml}`;
}

// Dangerous CSS patterns — matched case-insensitively
const CSS_BLOCKLIST = [
  /@import\b/i,
  /@charset\b/i,
  /expression\s*\(/i,
  /javascript\s*:/i,
  /vbscript\s*:/i,
  /behavior\s*:/i,
  /-moz-binding\s*:/i,
  /-webkit-binding\s*:/i,
  /url\s*\(\s*["']?\s*data\s*:/i,
];

export function sanitizeProfileCss(css: string): string {
  const lines = css.split("\n");
  const cleaned = lines
    .map((line) => {
      for (const pattern of CSS_BLOCKLIST) {
        if (pattern.test(line)) return "/* blocked */";
      }
      return line;
    })
    .join("\n");

  return cleaned;
}
