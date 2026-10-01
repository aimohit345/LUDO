"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store/useAppStore";
import {
  LayoutDashboard,
  Trophy,
  CheckSquare,
  Users,
  CreditCard,
  ArrowUpRight,
  ShieldCheck,
  Gift,
  Headphones,
  Sliders,
  FileText,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  ArrowLeft,
  Lock,
} from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser, switchUserRole } = useAppStore();
  const [collapsed, setCollapsed] = useState(false);

  // Check role
  const isAuthorized =
    currentUser?.role === "SUPER_ADMIN" ||
    currentUser?.role === "ADMIN" ||
    currentUser?.role === "FINANCE" ||
    currentUser?.role === "SUPPORT";

  const navItems = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/tournaments", label: "Tournaments", icon: Trophy },
    { href: "/admin/results", label: "Result Verification", icon: CheckSquare },
    { href: "/admin/users", label: "Users & Accounts", icon: Users },
    { href: "/admin/withdrawals", label: "Withdrawals Queue", icon: ArrowUpRight },
    { href: "/admin/payments", label: "Deposits & Gateway", icon: CreditCard },
    { href: "/admin/kyc", label: "KYC Documents", icon: ShieldCheck },
    { href: "/admin/referrals", label: "Referral Control", icon: Gift },
    { href: "/admin/support", label: "Support Inbox", icon: Headphones },
    { href: "/admin/settings", label: "Platform Settings", icon: Sliders },
    { href: "/admin/audit-log", label: "Audit Logs", icon: FileText },
  ];

  if (!isAuthorized) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center space-y-4">
        <div className="p-4 rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
          <Lock className="w-10 h-10" />
        </div>
        <h2 className="text-xl font-bold text-white">Admin Privileges Required</h2>
        <p className="text-xs text-slate-400 max-w-sm">
          You are currently in Player mode. Click below to switch to Super Admin mode for demo review.
        </p>
        <button
          onClick={() => {
            switchUserRole("SUPER_ADMIN");
            router.refresh();
          }}
          className="px-4 py-2 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-bold text-xs shadow-neon-pink transition-all"
        >
          Switch to Super Admin
        </button>
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] border-t border-white/10">
      {/* Sidebar */}
      <aside
        className={`bg-surface-100/90 border-r border-white/10 backdrop-blur-xl transition-all duration-300 flex flex-col justify-between shrink-0 ${
          collapsed ? "w-16" : "w-64"
        }`}
      >
        <div className="p-3 space-y-4">
          <div className="flex items-center justify-between px-2 py-1">
            {!collapsed && (
              <span className="text-xs font-black uppercase tracking-wider text-pink-400 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4" />
                Admin Panel
              </span>
            )}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 mx-auto"
            >
              {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-gradient-to-r from-violet-600 to-pink-600 text-white shadow-neon-pink"
                      : "text-slate-400 hover:text-white hover:bg-white/5"
                  }`}
                  title={collapsed ? item.label : undefined}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-white/10 space-y-2">
          {!collapsed && (
            <div className="px-2 py-1.5 rounded-lg bg-surface-200/50 text-[10px] text-slate-400">
              <p className="font-bold text-white truncate">{currentUser?.username}</p>
              <p className="text-pink-400 font-mono font-semibold uppercase">{currentUser?.role}</p>
            </div>
          )}
          <Link
            href="/dashboard"
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-slate-400 hover:text-white hover:bg-white/5"
          >
            <ArrowLeft className="w-4 h-4 shrink-0" />
            {!collapsed && <span>Exit to Player App</span>}
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-x-hidden p-4 sm:p-6 lg:p-8 bg-background/50">
        {children}
      </main>
    </div>
  );
}
