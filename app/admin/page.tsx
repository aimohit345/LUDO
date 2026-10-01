"use client";

import React from "react";
import Link from "next/link";
import { useAppStore } from "@/lib/store/useAppStore";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { formatCurrency } from "@/lib/utils";
import {
  Users,
  Trophy,
  ArrowUpRight,
  CreditCard,
  AlertCircle,
  TrendingUp,
  CheckCircle,
  Clock,
  ShieldCheck,
  ShieldAlert,
} from "lucide-react";
import dynamic from "next/dynamic";

const VolumeChart = dynamic(
  () => import("@/components/admin/VolumeChart").then((mod) => mod.VolumeChart),
  { ssr: false, loading: () => <div className="h-64 flex items-center justify-center text-xs text-slate-500">Loading metrics...</div> }
);

export default function AdminDashboardPage() {
  const { tournaments, withdrawals, kycDocuments, tickets } = useAppStore();

  const pendingResults = tournaments.filter((t) => t.status === "RESULT_PENDING").length;
  const pendingWithdrawals = withdrawals.filter((w) => w.status === "PENDING").length;
  const pendingKyc = kycDocuments.filter((k) => k.status === "PENDING").length;
  const openTickets = tickets.filter((t) => t.status === "OPEN" || t.status === "IN_PROGRESS").length;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Platform Command Center
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Realtime operations, escrow balances, participant monitoring, and queue actions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/admin/tournaments/new">
            <Button variant="accent" size="sm">
              <Trophy className="w-4 h-4 mr-1.5" />
              Create Tournament
            </Button>
          </Link>
          <Link href="/admin/results">
            <Button variant="secondary" size="sm">
              <CheckCircle className="w-4 h-4 mr-1.5" />
              Verify Results ({pendingResults})
            </Button>
          </Link>
        </div>
      </div>

      {/* Action Items Queue Alert Bar */}
      {(pendingResults > 0 || pendingWithdrawals > 0 || pendingKyc > 0) && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2 text-amber-300 font-semibold">
            <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
            <span>
              Pending Action Queue: {pendingResults} Result Screenshots, {pendingWithdrawals} Payout Requests, {pendingKyc} KYC submissions waiting.
            </span>
          </div>
          <div className="flex items-center gap-2">
            {pendingResults > 0 && (
              <Link href="/admin/results">
                <span className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-200 hover:bg-amber-500/30 font-bold">
                  Review Results →
                </span>
              </Link>
            )}
            {pendingWithdrawals > 0 && (
              <Link href="/admin/withdrawals">
                <span className="px-2.5 py-1 rounded-lg bg-pink-500/20 text-pink-200 hover:bg-pink-500/30 font-bold">
                  Approve Withdrawals →
                </span>
              </Link>
            )}
          </div>
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* GMV */}
        <GlassCard className="p-5 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Total Tournament GMV</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-black text-white font-mono">₹287,500</p>
          <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
            +18.4% from last week
          </span>
        </GlassCard>

        {/* Platform Revenue */}
        <GlassCard className="p-5 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Platform Commission (10%)</span>
            <CreditCard className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-2xl font-black text-cyan-400 font-mono">₹28,750</p>
          <span className="text-[10px] text-slate-400">Net platform fee margin</span>
        </GlassCard>

        {/* Active Tournaments */}
        <GlassCard className="p-5 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Active Tournaments</span>
            <Trophy className="w-4 h-4 text-violet-400" />
          </div>
          <p className="text-2xl font-black text-white font-mono">{tournaments.length}</p>
          <span className="text-[10px] text-violet-400 font-semibold">12 scheduled / live</span>
        </GlassCard>

        {/* Registered Players */}
        <GlassCard className="p-5 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Registered Players</span>
            <Users className="w-4 h-4 text-pink-400" />
          </div>
          <p className="text-2xl font-black text-pink-400 font-mono">1,420</p>
          <span className="text-[10px] text-slate-400">DAU: 384 active today</span>
        </GlassCard>
      </div>

      {/* Main Chart Section */}
      <GlassCard className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <h2 className="text-base font-bold text-white">7-Day Tournament Volume & Deposits</h2>
            <p className="text-xs text-slate-400">Gross player wagers vs total deposit funding.</p>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5 text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full bg-violet-500" /> Tournament Volume
            </span>
            <span className="flex items-center gap-1.5 text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" /> Deposits
            </span>
          </div>
        </div>

        <VolumeChart />
      </GlassCard>

      {/* Action Feeds: Recent Tournaments & Pending Verifications */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Verification Queue Preview */}
        <GlassCard className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-cyan-400" />
              Screenshots Awaiting Verification
            </h3>
            <Link href="/admin/results" className="text-xs text-cyan-400 hover:underline">
              Open Queue
            </Link>
          </div>

          <div className="divide-y divide-white/5 text-xs">
            {tournaments
              .filter((t) => t.status === "RESULT_PENDING")
              .map((tourney) => (
                <div key={tourney.id} className="py-3 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-white">{tourney.title}</p>
                    <p className="text-[11px] text-slate-400">
                      Prize: {formatCurrency(tourney.prize_pool)} • {tourney.participants.length} players
                    </p>
                  </div>
                  <Link href="/admin/results">
                    <Button variant="secondary" size="sm" className="text-xs">
                      Verify Match
                    </Button>
                  </Link>
                </div>
              ))}
          </div>
        </GlassCard>

        {/* Withdrawal Requests Preview */}
        <GlassCard className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <ArrowUpRight className="w-5 h-5 text-pink-400" />
              Withdrawal Approval Queue
            </h3>
            <Link href="/admin/withdrawals" className="text-xs text-pink-400 hover:underline">
              Review Queue
            </Link>
          </div>

          <div className="divide-y divide-white/5 text-xs">
            {withdrawals
              .filter((w) => w.status === "PENDING")
              .map((req) => (
                <div key={req.id} className="py-3 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-white">{req.username}</p>
                    <p className="text-[11px] text-slate-400 font-mono">
                      {req.payout_method.details}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-emerald-400">
                      ₹{req.amount}
                    </span>
                    <Link href="/admin/withdrawals">
                      <Button variant="accent" size="sm" className="text-xs">
                        Action
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
