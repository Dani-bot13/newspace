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
    ],
    ALLOWED_ATTR: [
      "src", "href", "style", "class", "id", "target",
      "width", "height", "alt", "controls", "autoplay", "loop",
      "muted", "poster", "type", "colspan", "rowspan",
      "align", "valign", "bgcolor", "border", "cellpadding", "cellspacing",
    ],
    FORBID_ATTR: [
      "onerror", "onload", "onclick", "onmouseover", "onmouseout",
      "onfocus", "onblur", "onchange", "onsubmit", "onkeydown",
      "onkeyup", "onkeypress", "oninput",
    ],
    FORCE_BODY: true,
  });
}

export function sanitizeProfileCss(css: string): string {
  // Strip any @import rules and url() with javascript:, data: URIs for non-image content
  return css
    .replace(/@import\s+[^;]+;/gi, "")
    .replace(/expression\s*\([^)]*\)/gi, "")
    .replace(/javascript:/gi, "")
    .replace(/behavior\s*:/gi, "")
    .replace(/-moz-binding\s*:/gi, "");
}
