"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function set(field: string) {
    return (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Something went wrong");
      setLoading(false);
      return;
    }

    // Auto sign-in after signup
    await signIn("credentials", {
      email: form.email,
      password: form.password,
      redirect: false,
    });

    router.push("/feed");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white tracking-tight">
            New<span className="text-orange-400">Space</span>
          </h1>
          <p className="text-blue-300 mt-2">Join the space.</p>
        </div>

        <div className="bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-8">
          <h2 className="text-xl font-semibold text-white mb-6">Create Account</h2>

          {error && (
            <div className="bg-red-500/20 border border-red-500/50 text-red-200 rounded-lg px-4 py-3 mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-blue-200 text-sm mb-1">Username</label>
              <input
                type="text"
                value={form.username}
                onChange={set("username")}
                required
                minLength={3}
                maxLength={30}
                pattern="[a-zA-Z0-9_]+"
                className="w-full bg-white/10 border border-white/20 text-white placeholder-blue-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400"
                placeholder="cooluser123"
              />
            </div>
            <div>
              <label className="block text-blue-200 text-sm mb-1">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={set("email")}
                required
                className="w-full bg-white/10 border border-white/20 text-white placeholder-blue-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-blue-200 text-sm mb-1">Password</label>
              <input
                type="password"
                value={form.password}
                onChange={set("password")}
                required
                minLength={8}
                className="w-full bg-white/10 border border-white/20 text-white placeholder-blue-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-500 hover:bg-orange-400 disabled:opacity-50 text-white font-semibold rounded-lg py-2.5 transition-colors"
            >
              {loading ? "Creating account…" : "Create Account"}
            </button>
          </form>

          <p className="text-center text-blue-300 text-sm mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-orange-400 hover:text-orange-300 font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
