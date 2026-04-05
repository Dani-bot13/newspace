import Link from "next/link";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      {/* Minimal floating nav — doesn't block the profile */}
      <div className="fixed top-4 left-4 z-50 flex items-center gap-2">
        <Link
          href="/feed"
          className="bg-black/50 hover:bg-black/70 backdrop-blur text-white text-xs font-medium px-3 py-1.5 rounded-full transition-colors border border-white/10"
        >
          ← Feed
        </Link>
      </div>
      {children}
    </div>
  );
}
