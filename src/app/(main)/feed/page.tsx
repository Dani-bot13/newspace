import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import Feed from "@/components/Feed";

export const metadata = { title: "Feed — NewSpace" };

export default async function FeedPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <Feed
        currentUserId={session.user.id}
        currentUsername={session.user.username}
      />
    </div>
  );
}
