import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import ProfileEditor from "@/components/ProfileEditor";
import ProfileSettingsForm from "@/components/ProfileSettingsForm";

export const metadata = { title: "Edit Profile — NewSpace" };

export default async function SettingsProfilePage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: {
      username: true,
      displayName: true,
      bio: true,
      avatarUrl: true,
      profileHtml: true,
      profileCss: true,
    },
  });

  if (!user) redirect("/login");

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-white mb-6">Edit Profile</h1>

      {/* Basic info */}
      <div className="bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-6 mb-8">
        <h2 className="text-white font-semibold mb-4">Basic Info</h2>
        <ProfileSettingsForm
          initialDisplayName={user.displayName ?? ""}
          initialBio={user.bio ?? ""}
          initialAvatarUrl={user.avatarUrl ?? ""}
        />
      </div>

      {/* HTML/CSS editor */}
      <div className="bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-6">
        <h2 className="text-white font-semibold mb-2">Profile Customization</h2>
        <p className="text-blue-300 text-sm mb-4">
          Write HTML and CSS to customize your profile page. Scripts are disabled for security.
        </p>
        <ProfileEditor
          initialHtml={user.profileHtml ?? DEFAULT_HTML}
          initialCss={user.profileCss ?? DEFAULT_CSS}
        />
      </div>
    </div>
  );
}

const DEFAULT_HTML = `<div class="profile-container">
  <h1>Welcome to my space! ✨</h1>
  <p>Edit this to make it your own.</p>
  <marquee>Thanks for visiting! 🌟</marquee>
</div>`;

const DEFAULT_CSS = `body {
  background: linear-gradient(135deg, #1a1a2e, #16213e);
  color: #e0e0e0;
  font-family: 'Georgia', serif;
  padding: 2rem;
}

.profile-container {
  max-width: 600px;
  margin: 0 auto;
  text-align: center;
}

h1 {
  font-size: 2rem;
  color: #ff6b9d;
  text-shadow: 0 0 20px rgba(255, 107, 157, 0.5);
}`;
