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
      profileMode: true,
    },
  });

  if (!user) redirect("/login");

  const mode = (user.profileMode === "blank" ? "blank" : "classic") as "classic" | "blank";

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
          {mode === "classic"
            ? "Classic Mode: Paste old MySpace layout codes and they'll just work. Your HTML goes in the \"About Me\" section."
            : "Blank Canvas: Full control. Write your own HTML + CSS from scratch."}
          {" "}Scripts are always disabled for security.
        </p>
        <ProfileEditor
          initialHtml={user.profileHtml ?? ""}
          initialCss={user.profileCss ?? ""}
          initialMode={mode}
          displayName={user.displayName ?? user.username}
          avatarUrl={user.avatarUrl ?? ""}
          bio={user.bio ?? ""}
        />
      </div>
    </div>
  );
}
