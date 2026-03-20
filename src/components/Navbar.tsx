"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { useState } from "react";

interface Props {
  username: string;
  displayName: string;
}

export default function Navbar({ username, displayName }: Props) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  function isActive(href: string) {
    return pathname === href || pathname.startsWith(href + "/");
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-blue-950/80 backdrop-blur border-b border-white/10">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/feed" className="text-2xl font-bold text-white tracking-tight">
          New<span className="text-orange-400">Space</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          <NavLink href="/feed" active={isActive("/feed")}>Feed</NavLink>
          <NavLink href={`/profile/${username}`} active={isActive(`/profile/${username}`)}>
            My Profile
          </NavLink>
          <NavLink href="/settings/profile" active={isActive("/settings/profile")}>
            Edit Profile
          </NavLink>
        </div>

        {/* User menu */}
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-2 text-white hover:text-orange-300 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-sm font-bold">
              {displayName.charAt(0).toUpperCase()}
            </div>
            <span className="hidden md:block text-sm font-medium">{displayName}</span>
            <span className="text-xs text-blue-300">▾</span>
          </button>

          {menuOpen && (
            <div
              className="absolute right-0 top-full mt-2 w-48 bg-blue-950 border border-white/20 rounded-xl shadow-xl py-1 z-50"
              onMouseLeave={() => setMenuOpen(false)}
            >
              <Link
                href={`/profile/${username}`}
                className="block px-4 py-2.5 text-sm text-white hover:bg-white/10 transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                View Profile
              </Link>
              <Link
                href="/settings/profile"
                className="block px-4 py-2.5 text-sm text-white hover:bg-white/10 transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                Edit Profile
              </Link>
              <hr className="border-white/10 my-1" />
              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="block w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-white/10 transition-colors"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile nav */}
      <div className="md:hidden flex border-t border-white/10">
        <MobileNavLink href="/feed" active={isActive("/feed")}>Feed</MobileNavLink>
        <MobileNavLink href={`/profile/${username}`} active={isActive(`/profile/${username}`)}>Profile</MobileNavLink>
        <MobileNavLink href="/settings/profile" active={isActive("/settings/profile")}>Edit</MobileNavLink>
      </div>
    </nav>
  );
}

function NavLink({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
        active
          ? "bg-white/15 text-white"
          : "text-blue-200 hover:bg-white/10 hover:text-white"
      }`}
    >
      {children}
    </Link>
  );
}

function MobileNavLink({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className={`flex-1 text-center py-2.5 text-xs font-medium transition-colors ${
        active ? "text-orange-400" : "text-blue-300"
      }`}
    >
      {children}
    </Link>
  );
}
