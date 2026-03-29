/**
 * Classic MySpace profile HTML skeleton.
 *
 * This faithfully recreates the class names and nested table structure
 * of the original MySpace profile page so that old layout codes
 * (Pimp My Profile, etc.) can target the right elements.
 *
 * Placeholders replaced at render time:
 *   {{displayName}}  — user's display name
 *   {{avatarUrl}}    — user's avatar (or default)
 *   {{bio}}          — user's bio text
 *   {{age}}          — placeholder
 *   {{userContent}}  — user's custom HTML goes here
 */

export function buildClassicSkeleton(opts: {
  displayName: string;
  avatarUrl: string;
  bio: string;
  userHtml: string;
}) {
  const { displayName, avatarUrl, bio, userHtml } = opts;

  const avatar = avatarUrl || "";
  const avatarImg = avatar
    ? `<img src="${escapeHtml(avatar)}" alt="${escapeHtml(displayName)}" style="max-width:250px;" />`
    : `<div style="width:150px;height:150px;background:#336699;display:flex;align-items:center;justify-content:center;font-size:48px;color:#fff;border-radius:4px;">${escapeHtml(displayName.charAt(0).toUpperCase())}</div>`;

  return `
<div class="bodyContent">

<!-- ====== MAIN PROFILE TABLE (3+ levels of nesting, just like the original) ====== -->
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
        <table width="100%" cellspacing="0" cellpadding="0" border="0" bgcolor="#003366">
          <tr>
            <td align="center">
              <span class="whitetext12">Contacting <span class="nametext">${escapeHtml(displayName)}</span></span>
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
          <tr>
            <td align="center"><a href="#" class="contactTableLink">Add to Group</a></td>
            <td align="center"><a href="#" class="contactTableLink">Add to Favorites</a></td>
          </tr>
        </table>
      </td>
    </tr>
  </table>

  <!-- Interests Table -->
  <table class="sidebar-table" width="100%" cellspacing="3" cellpadding="3" border="0">
    <tr>
      <td><span class="orangetext15"><b>${escapeHtml(displayName)}'s Interests</b></span></td>
    </tr>
    <tr>
      <td>
        <table width="100%" cellspacing="0" cellpadding="2" border="0">
          <tr><td valign="top"><span class="lightbluetext8">General</span></td>
              <td class="text">Music, Friends, Coding, Internet</td></tr>
          <tr><td valign="top"><span class="lightbluetext8">Music</span></td>
              <td class="text">Everything</td></tr>
          <tr><td valign="top"><span class="lightbluetext8">Movies</span></td>
              <td class="text">The classics</td></tr>
          <tr><td valign="top"><span class="lightbluetext8">Television</span></td>
              <td class="text">Reality TV</td></tr>
          <tr><td valign="top"><span class="lightbluetext8">Books</span></td>
              <td class="text">Harry Potter</td></tr>
          <tr><td valign="top"><span class="lightbluetext8">Heroes</span></td>
              <td class="text">Tom from MySpace</td></tr>
        </table>
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
            <tr>
              <td>
                <span class="orangetext15"><b>Who I'd Like to Meet</b></span>
              </td>
            </tr>
            <tr>
              <td class="text">
                <div class="blurbLikeToMeet">
                  <p>Cool people who share my interests.</p>
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </div>

  <!-- Friend Space -->
  <table class="friendSpace" width="100%" cellspacing="3" cellpadding="3" border="0">
    <tr>
      <td>
        <span class="orangetext15"><b>${escapeHtml(displayName)}'s Friend Space</b></span>
        <span class="text"> (<span class="redbtext">Top 8</span>)</span>
      </td>
    </tr>
    <tr>
      <td class="text">
        <table width="100%" cellspacing="3" cellpadding="3" border="0">
          <tr>
            <td align="center" width="25%">
              <a href="#">
                <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3Crect fill='%23336699' width='60' height='60'/%3E%3Ctext x='30' y='35' font-size='14' fill='white' text-anchor='middle'%3ETom%3C/text%3E%3C/svg%3E" width="60" height="60" alt="Tom" />
              </a><br/>
              <span class="blacktext10">Tom</span>
            </td>
            <td align="center" width="25%">
              <span class="text">Add more friends!</span>
            </td>
            <td width="25%"></td>
            <td width="25%"></td>
          </tr>
        </table>
      </td>
    </tr>
  </table>

  <!-- Comments Section -->
  <table class="friendsComments" width="100%" cellspacing="3" cellpadding="3" border="0">
    <tr>
      <td>
        <span class="orangetext15"><b>${escapeHtml(displayName)}'s Comments</b></span>
      </td>
    </tr>
    <tr>
      <td class="text">
        <table width="100%" cellspacing="0" cellpadding="3" border="0">
          <tr>
            <td class="blacktext10" valign="top" align="center" width="100">
              <b>Tom</b><br/>
              <span class="redtext">3/28/2026</span>
            </td>
            <td class="text" valign="top">
              Welcome to NewSpace! Thanks for the add :)
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>

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
  font-size: 10pt;
  font-family: Verdana, Arial, sans-serif;
}
.btext { font-weight: bold; }

/* Small text classes */
.blacktext12 { font-size: 11pt; font-family: Georgia, serif; }
.blacktext10 { font-size: 9pt; font-family: monospace; }
.lightbluetext8 { color: #336699; font-size: 9pt; font-weight: bold; }
.redtext { color: #cc0000; font-size: 9pt; }
.redbtext { color: #cc0000; font-weight: bold; }

/* Contact table */
.contactTable {
  background-color: #bde0fc;
  border: 1px solid #8db3d8;
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

/* Links */
a:link, a:visited { color: #003366; }
a:hover { color: #ff6600; }

/* Tables */
table { border-collapse: collapse; }
.profileInfo, .sidebar-table, .extendedNetwork,
.friendSpace, .friendsComments {
  background-color: #fff;
  border: 1px solid #b5d2ec;
  margin-bottom: 8px;
}
.blurbs {
  background-color: #fff;
  border: 1px solid #b5d2ec;
}
td { padding: 3px; }
`;
