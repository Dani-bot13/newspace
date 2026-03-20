import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import Navbar from "@/components/Navbar";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <div className="min-h-screen">
      <Navbar
        username={session.user.username}
        displayName={session.user.name ?? session.user.username}
      />
      <main className="pt-16">{children}</main>
    </div>
  );
}
