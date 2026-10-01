"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { APP_CONFIG } from "@/config/app.config";
import { useAppStore } from "@/lib/store/useAppStore";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import {
  Gamepad2,
  Trophy,
  HelpCircle,
  Headphones,
  Wallet,
  User,
  Shield,
  Bell,
  LogOut,
  ChevronDown,
  Sparkles,
  Zap,
} from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const { currentUser, switchUserRole, lowPowerMode, toggleLowPowerMode } = useAppStore();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const isAdmin = currentUser?.role === "SUPER_ADMIN" || currentUser?.role === "ADMIN";

  const navLinks = [
    { href: "/tournaments", label: "Tournaments", icon: Gamepad2 },
    { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
    { href: "/how-it-works", label: "How It Works", icon: HelpCircle },
    { href: "/support", label: "Support", icon: Headphones },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-background/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
        {/* Brand */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 via-indigo-600 to-cyan-500 p-0.5 shadow-neon-violet group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-surface-100 rounded-[10px] flex items-center justify-center">
                <span className="font-black text-xl bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
                  LA
                </span>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-lg tracking-wider text-white flex items-center gap-1">
                {APP_CONFIG.brand.name}
                <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-violet-500/20 text-violet-400 border border-violet-500/30">
                  3D
                </span>
              </span>
              <span className="text-[10px] text-slate-400 -mt-1 tracking-tight hidden sm:inline">
                Esports Tournaments
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? "text-cyan-400 bg-cyan-500/10 shadow-sm border border-cyan-500/20"
                      : "text-slate-300 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right Action Icons & User Info */}
        <div className="flex items-center gap-3">
          {/* Quick Role Switcher (Admin / Player Demo) */}
          <div className="hidden lg:flex items-center bg-surface-100 border border-white/10 rounded-lg p-1 text-xs">
            <button
              onClick={() => switchUserRole("PLAYER")}
              className={`px-2.5 py-1 rounded font-medium transition-colors ${
                !isAdmin ? "bg-violet-600 text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              Player Mode
            </button>
            <button
              onClick={() => switchUserRole("SUPER_ADMIN")}
              className={`px-2.5 py-1 rounded font-medium transition-colors flex items-center gap-1 ${
                isAdmin ? "bg-pink-600 text-white shadow-neon-pink/40" : "text-slate-400 hover:text-white"
              }`}
            >
              <Shield className="w-3 h-3" />
              Admin Mode
            </button>
          </div>

          {/* Low Power 3D Toggle */}
          <button
            onClick={toggleLowPowerMode}
            title={lowPowerMode ? "Enable 3D Visuals" : "Low Power / 2D Fallback"}
            className={`p-2 rounded-lg border text-xs flex items-center gap-1 transition-all ${
              lowPowerMode
                ? "bg-amber-500/15 border-amber-500/30 text-amber-400"
                : "border-white/10 text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <Zap className="w-4 h-4" />
            <span className="hidden xl:inline">{lowPowerMode ? "2D Mode" : "3D Mode"}</span>
          </button>

          {currentUser ? (
            <>
              {/* Wallet Pill */}
              <Link
                href="/wallet"
                className="flex items-center gap-2 bg-surface-100/90 hover:bg-surface-200/90 border border-violet-500/30 px-3 py-1.5 rounded-xl shadow-neon-violet/20 transition-all group"
              >
                <div className="w-6 h-6 rounded-lg bg-violet-600/30 flex items-center justify-center text-violet-400">
                  <Wallet className="w-3.5 h-3.5" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Wallet</span>
                  <span className="text-xs font-bold text-white group-hover:text-cyan-400 transition-colors">
                    {formatCurrency(
                      currentUser.wallet.deposit_balance + currentUser.wallet.winnings_balance
                    )}
                  </span>
                </div>
              </Link>

              {/* Notifications */}
              <Link
                href="/notifications"
                className="relative p-2 rounded-lg border border-white/10 text-slate-300 hover:text-white hover:bg-white/5"
                aria-label="View notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-pink-500 animate-pulse" />
              </Link>

              {/* User Avatar & Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 p-1 pl-2 rounded-xl border border-white/10 hover:border-white/20 bg-surface-100 transition-colors"
                >
                  <span className="text-xs font-semibold text-white hidden sm:inline">
                    {currentUser.username}
                  </span>
                  <img
                    src={currentUser.avatar_url}
                    alt={currentUser.username}
                    className="w-7 h-7 rounded-lg object-cover border border-violet-500/40"
                  />
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {userMenuOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 rounded-2xl border border-white/10 bg-surface-100/95 backdrop-blur-2xl p-2 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <div className="px-3 py-2 border-b border-white/10 mb-1">
                      <p className="text-xs font-semibold text-white">{currentUser.username}</p>
                      <p className="text-[10px] text-slate-400 truncate">{currentUser.email}</p>
                      <span className="inline-block mt-1 text-[9px] uppercase px-1.5 py-0.5 rounded bg-violet-600/30 text-violet-300 font-bold">
                        Level {currentUser.level} • {currentUser.role}
                      </span>
                    </div>

                    {isAdmin && (
                      <Link
                        href="/admin"
                        className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-pink-400 hover:bg-pink-500/10 rounded-lg transition-colors"
                      >
                        <Shield className="w-4 h-4" />
                        Admin Control Panel
                      </Link>
                    )}

                    <Link
                      href="/dashboard"
                      className="flex items-center gap-2 px-3 py-2 text-xs text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                    >
                      <Sparkles className="w-4 h-4 text-violet-400" />
                      Player Dashboard
                    </Link>
                    <Link
                      href="/my-matches"
                      className="flex items-center gap-2 px-3 py-2 text-xs text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                    >
                      <Gamepad2 className="w-4 h-4 text-cyan-400" />
                      My Matches
                    </Link>
                    <Link
                      href="/profile"
                      className="flex items-center gap-2 px-3 py-2 text-xs text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                    >
                      <User className="w-4 h-4 text-indigo-400" />
                      Profile & Stats
                    </Link>
                    <Link
                      href="/kyc"
                      className="flex items-center gap-2 px-3 py-2 text-xs text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                    >
                      <Shield className="w-4 h-4 text-emerald-400" />
                      KYC Verification
                    </Link>
                    <Link
                      href="/referrals"
                      className="flex items-center gap-2 px-3 py-2 text-xs text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                    >
                      <Trophy className="w-4 h-4 text-amber-400" />
                      Refer & Earn
                    </Link>

                    <div className="border-t border-white/10 my-1 pt-1">
                      <Link
                        href="/login"
                        className="flex items-center gap-2 px-3 py-2 text-xs text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link href="/signup">
                <Button variant="primary" size="sm">
                  Join Free
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
