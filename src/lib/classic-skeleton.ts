/**
 * Classic MySpace profile HTML skeleton.
 *
 * Simplified version: profile photo, About Me, music player,
 * and background photo support. Friends list, interests, and
 * Tom removed per user request.
 *
 * Placeholders replaced at render time:
 *   displayName — user's display name
 *   avatarUrl   — user's avatar (or default)
 *   bio         — user's bio text
 *   userHtml    — user's custom HTML goes here
 */

export interface SkeletonPost {
  content: string | null;
  createdAt: string; // pre-formatted date string
  likeCount: number;
  commentCount: number;
}

export function buildClassicSkeleton(opts: {
  displayName: string;
  avatarUrl: string;
  bio: string;
  userHtml: string;
  posts?: SkeletonPost[];
}) {
  const { displayName, avatarUrl, bio, userHtml, posts = [] } = opts;

  const avatar = avatarUrl || "";
  const avatarImg = avatar
    ? `<img src="${escapeHtml(avatar)}" alt="${escapeHtml(displayName)}" style="max-width:250px;" />`
    : `<div style="width:150px;height:150px;background:#336699;display:flex;align-items:center;justify-content:center;font-size:48px;color:#fff;border-radius:4px;">${escapeHtml(displayName.charAt(0).toUpperCase())}</div>`;

  return `
<div class="bodyContent">

<!-- ====== MAIN PROFILE TABLE ====== -->
<table id="profileV1main" width="800" cellspacing="0" cellpadding="0" align="center" border="0">
<tr>

<!-- ====== LEFT COLUMN — Sidebar ====== -->
<td id="profileLeftColumn" width="275" valign="top">

  <!-- Profile Info -->
  <table class="profileInfo" width="100%" cellspacing="0" cellpadding="3" border="0">
    <tr>
      <td>
        <span class="nametext">${escapeHtml(displayName)}</span>
      </td>
    </tr>
    <tr>
      <td align="center" valign="top">
        <table><tr><td>
          ${avatarImg}
        </td></tr></table>
      </td>
    </tr>
    <tr>
      <td>
        <span class="lightbluetext8">"${escapeHtml(bio || "Your status here...")}"</span>
      </td>
    </tr>
    <tr>
      <td>
        <span class="text">
          Online Now!<br/>
          <span class="btext">${escapeHtml(displayName)}</span> is in your extended network
        </span>
      </td>
    </tr>
  </table>

  <!-- Contact Table -->
  <table class="contactTable" width="275" cellspacing="3" cellpadding="3" border="0">
    <tr>
      <td>
        <table width="100%" cellspacing="0" cellpadding="0" border="0" bgcolor="#003366" style="background-color:#003366;">
          <tr>
            <td align="center" style="padding:4px;">
              <span class="whitetext12">Contacting <span class="nametext" style="color:#fff;">${escapeHtml(displayName)}</span></span>
            </td>
          </tr>
        </table>
        <table class="contactTable" width="100%" cellspacing="0" cellpadding="2" border="0">
          <tr>
            <td align="center"><a href="#" class="contactTableLink">Send Message</a></td>
            <td align="center"><a href="#" class="contactTableLink">Add to Friends</a></td>
          </tr>
          <tr>
            <td align="center"><a href="#" class="contactTableLink">Instant Message</a></td>
            <td align="center"><a href="#" class="contactTableLink">Block User</a></td>
          </tr>
        </table>
      </td>
    </tr>
  </table>

  <!-- Music Player -->
  <table class="musicPlayer" width="100%" cellspacing="3" cellpadding="3" border="0">
    <tr>
      <td>
        <span class="orangetext15"><b>${escapeHtml(displayName)}'s Music</b></span>
      </td>
    </tr>
    <tr>
      <td class="text">
        <div class="profileMusic">
          <p class="musicPlaceholder">Add a song to your profile!</p>
          <audio class="profileAudioPlayer" controls preload="none" style="width:100%;"></audio>
        </div>
      </td>
    </tr>
  </table>

</td>

<!-- ====== RIGHT COLUMN — Main Content ====== -->
<td id="profileRightColumn" valign="top">

  <!-- Extended Network -->
  <table class="extendedNetwork" width="100%" cellspacing="0" cellpadding="3" border="0">
    <tr>
      <td>
        <table width="100%" cellspacing="0" cellpadding="0" border="0">
          <tr>
            <td class="blacktext12" align="center">
              <b>${escapeHtml(displayName)}'s Latest Blog Entry</b>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>

  <!-- Blurbs Module -->
  <div class="blurbsModule">
    <table width="100%" cellspacing="0" cellpadding="0" border="0">
      <tr>
        <td>
          <table class="blurbs" width="100%" cellspacing="3" cellpadding="3" border="0">
            <tr>
              <td>
                <span class="orangetext15"><b>About Me</b></span>
              </td>
            </tr>
            <tr>
              <td class="text">
                <div class="blurbAboutMe">
                  ${userHtml || "<p>Edit your profile to add content here!</p>"}
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </div>

  <!-- Posts / Status Updates -->
  ${posts.length > 0 ? `
  <table class="profilePosts" width="100%" cellspacing="3" cellpadding="3" border="0">
    <tr>
      <td>
        <span class="orangetext15"><b>${escapeHtml(displayName)}'s Posts</b></span>
      </td>
    </tr>
    ${posts.map((post) => `
    <tr>
      <td class="text">
        <div class="postEntry">
          <div class="postContent">${escapeHtml(post.content || "")}</div>
          <div class="postMeta">
            <span class="postDate">${escapeHtml(post.createdAt)}</span>
            <span class="postStats">♥ ${post.likeCount} · 💬 ${post.commentCount}</span>
          </div>
        </div>
      </td>
    </tr>
    `).join("")}
  </table>
  ` : ""}

</td>
</tr>
</table>

</div><!-- .bodyContent -->
`;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Default CSS for the classic skeleton (before user overrides) */
export const CLASSIC_DEFAULT_CSS = `
/* === Classic MySpace Default Styles === */
body {
  background-color: #cfe7fa;
  margin: 0;
  padding: 20px 0;
  font-family: Verdana, Arial, sans-serif;
  font-size: 10pt;
  color: #000;
}
.bodyContent {
  max-width: 850px;
  margin: 0 auto;
}
#profileV1main {
  border-collapse: collapse;
}
#profileLeftColumn {
  padding-right: 10px;
}
#profileRightColumn {
  padding-left: 5px;
}

/* Name */
.nametext {
  color: #003366;
  font-size: 14pt;
  font-weight: bold;
  font-family: Georgia, serif;
}

/* Section headers */
.orangetext15 {
  color: #ff6600;
  font-size: 11pt;
  font-family: Georgia, serif;
}

/* Labels */
.whitetext12 {
  color: #fff;
  font-size: 10pt;
  font-family: Georgia, serif;
}

/* Body text */
.text, .btext {
  color: #000;
  font-size: 10pt;
  font-family: Verdana, Arial, sans-serif;
}
.btext { font-weight: bold; }

/* Small text classes */
.blacktext12 { color: #000; font-size: 11pt; font-family: Georgia, serif; }
.blacktext10 { color: #000; font-size: 9pt; font-family: monospace; }
.lightbluetext8 { color: #336699; font-size: 9pt; font-weight: bold; }
.redtext { color: #cc0000; font-size: 9pt; }
.redbtext { color: #cc0000; font-weight: bold; }

/* Contact table */
.contactTable {
  background-color: #bde0fc;
  border: 1px solid #8db3d8;
  margin-bottom: 8px;
}
.contactTable td[bgcolor], .contactTable [bgcolor] {
  background-color: #003366;
}
.contactTable a, .contactTableLink {
  color: #003366;
  text-decoration: none;
  font-size: 9pt;
  display: block;
  padding: 4px 8px;
}
.contactTable a:hover {
  text-decoration: underline;
}

/* Music player */
.musicPlayer {
  background-color: #fff;
  border: 1px solid #b5d2ec;
  margin-bottom: 8px;
}
.profileMusic {
  padding: 4px 0;
}
.profileMusic .musicPlaceholder {
  color: #666;
  font-style: italic;
  font-size: 9pt;
  margin: 0 0 6px 0;
}
.profileAudioPlayer {
  border-radius: 4px;
}

/* Posts */
.profilePosts {
  background-color: #fff;
  border: 1px solid #b5d2ec;
  margin-top: 8px;
}
.postEntry {
  padding: 8px 4px;
  border-bottom: 1px solid #e8f0f8;
}
.postEntry:last-child {
  border-bottom: none;
}
.postContent {
  white-space: pre-wrap;
  word-wrap: break-word;
  margin-bottom: 4px;
}
.postMeta {
  display: flex;
  justify-content: space-between;
  font-size: 8pt;
  color: #999;
}
.postDate {
  color: #999;
}
.postStats {
  color: #666;
}

/* Links */
a:link, a:visited { color: #003366; }
a:hover { color: #ff6600; }

/* Section boxes */
.profileInfo {
  background-color: #fff;
  border: 1px solid #b5d2ec;
  margin-bottom: 8px;
}
.extendedNetwork {
  background-color: #fff;
  border: 1px solid #b5d2ec;
  margin-bottom: 8px;
}
.blurbs {
  background-color: #fff;
  border: 1px solid #b5d2ec;
  margin-bottom: 8px;
}
.blurbsModule {
  margin-bottom: 8px;
}
`;
