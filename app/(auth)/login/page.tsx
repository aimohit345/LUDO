"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store/useAppStore";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import { APP_CONFIG } from "@/config/app.config";
import { Lock, Mail, Phone, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { switchUserRole, currentUser } = useAppStore();

  const [authMethod, setAuthMethod] = useState<"email" | "otp">("email");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    setTimeout(() => {
      setIsLoading(false);
      if (authMethod === "otp") {
        if (!phone || phone.length < 10) {
          setErrorMsg("Please enter a valid 10-digit mobile number");
          return;
        }
        router.push(`/verify-otp?phone=${encodeURIComponent(phone)}`);
        return;
      }

      // Check admin or player
      if (email.toLowerCase().includes("admin")) {
        switchUserRole("SUPER_ADMIN");
        router.push("/admin");
      } else {
        switchUserRole("PLAYER");
        router.push("/dashboard");
      }
    }, 600);
  };

  const handleQuickDemo = (role: "PLAYER" | "SUPER_ADMIN") => {
    switchUserRole(role);
    if (role === "SUPER_ADMIN") {
      router.push("/admin");
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Brand header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-600 to-cyan-500 p-0.5 shadow-neon-violet mb-3">
            <div className="w-full h-full bg-surface-100 rounded-[14px] flex items-center justify-center font-black text-xl text-white">
              LA
            </div>
          </div>
          <h1 className="text-2xl font-black text-white tracking-wide">
            Welcome to {APP_CONFIG.brand.name}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Sign in to enter live tournaments and claim real-time prizes
          </p>
        </div>

        {/* Quick Demo Switcher */}
        <div className="mb-4 p-3 rounded-xl border border-violet-500/30 bg-violet-950/20 backdrop-blur-md">
          <p className="text-[11px] font-bold uppercase tracking-wider text-violet-300 flex items-center gap-1.5 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            Instant Demo Sign-in
          </p>
          <div className="grid grid-cols-2 gap-2">
            <Button
              type="button"
              variant="glass"
              size="sm"
              onClick={() => handleQuickDemo("PLAYER")}
              className="text-xs justify-center hover:border-cyan-400"
            >
              Sign in as Player
            </Button>
            <Button
              type="button"
              variant="accent"
              size="sm"
              onClick={() => handleQuickDemo("SUPER_ADMIN")}
              className="text-xs justify-center"
            >
              Sign in as Admin
            </Button>
          </div>
        </div>

        <GlassCard className="p-6">
          {/* Method tabs */}
          <div className="flex border-b border-white/10 mb-5">
            <button
              type="button"
              onClick={() => setAuthMethod("email")}
              className={`flex-1 pb-2.5 text-xs font-semibold text-center border-b-2 transition-all ${
                authMethod === "email"
                  ? "border-violet-500 text-white"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              Email & Password
            </button>
            <button
              type="button"
              onClick={() => setAuthMethod("otp")}
              className={`flex-1 pb-2.5 text-xs font-semibold text-center border-b-2 transition-all ${
                authMethod === "otp"
                  ? "border-cyan-400 text-white"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              Phone OTP
            </button>
          </div>

          {errorMsg && (
            <div className="mb-4 p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            {authMethod === "email" ? (
              <>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      required
                      placeholder="player@ludoarena.gg"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-surface-100 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-medium text-slate-300">Password</label>
                    <Link
                      href="/forgot-password"
                      className="text-[11px] text-cyan-400 hover:underline"
                    >
                      Forgot?
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-surface-100 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
                    />
                  </div>
                </div>
              </>
            ) : (
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  10-Digit Mobile Number
                </label>
                <div className="relative flex">
                  <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-white/10 bg-surface-200 text-xs text-slate-400 font-mono">
                    +91
                  </span>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    placeholder="9876543210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                    className="w-full bg-surface-100 border border-white/10 rounded-r-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 font-mono"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  We will send a 6-digit one-time password (OTP) via SMS.
                </p>
              </div>
            )}

            <Button
              type="submit"
              variant={authMethod === "otp" ? "secondary" : "primary"}
              className="w-full mt-2"
              isLoading={isLoading}
            >
              {authMethod === "otp" ? "Send OTP Code" : "Sign In"}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </form>

          <div className="mt-5 text-center text-xs text-slate-400 border-t border-white/10 pt-4">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-cyan-400 font-semibold hover:underline">
              Create one for free
            </Link>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
