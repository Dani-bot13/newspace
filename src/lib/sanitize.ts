import { JSDOM } from "jsdom";
import DOMPurify from "dompurify";

const { window } = new JSDOM("");
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const purify = DOMPurify(window as any);

export function sanitizeProfileHtml(html: string): string {
  return purify.sanitize(html, {
    ALLOWED_TAGS: [
      "div", "p", "span", "h1", "h2", "h3", "h4", "h5", "h6",
      "img", "video", "audio", "a", "ul", "ol", "li",
      "table", "tr", "td", "th", "thead", "tbody",
      "strong", "em", "b", "i", "u", "s", "br", "hr",
      "marquee", "blink", "center", "blockquote", "pre", "code",
      "section", "article", "header", "footer", "nav", "figure", "figcaption",
    ],
    ALLOWED_ATTR: [
      "src", "href", "style", "class", "id", "target",
      "width", "height", "alt", "controls", "autoplay", "loop",
      "muted", "poster", "type", "colspan", "rowspan",
      "align", "valign", "bgcolor", "border", "cellpadding", "cellspacing",
    ],
    FORBID_TAGS: ["script", "style", "iframe", "object", "embed", "form", "input", "textarea", "select", "button"],
    FORBID_ATTR: [
      "onerror", "onload", "onclick", "onmouseover", "onmouseout",
      "onfocus", "onblur", "onchange", "onsubmit", "onkeydown",
      "onkeyup", "onkeypress", "oninput", "onanimationend",
      "ontransitionend", "onwheel", "onscroll",
    ],
    ALLOW_ARIA_ATTR: false,
    ALLOW_DATA_ATTR: false,
    FORCE_BODY: true,
  });
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
  /url\s*\(\s*["']?\s*data\s*:/i,   // block data: URIs in url()
];

export function sanitizeProfileCss(css: string): string {
  // Process line-by-line to remove dangerous declarations
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
