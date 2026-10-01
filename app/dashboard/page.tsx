"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAppStore } from "@/lib/store/useAppStore";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { TournamentCard } from "@/components/tournament/TournamentCard";
import { formatCurrency } from "@/lib/utils";
import {
  Gamepad2,
  Wallet,
  Trophy,
  Swords,
  Gift,
  ArrowRight,
  Sparkles,
  Flame,
  CheckCircle2,
  ShieldCheck,
  Zap,
} from "lucide-react";

export default function DashboardPage() {
  const { currentUser, tournaments, addDeposit } = useAppStore();
  const [claimedDailyBonus, setClaimedDailyBonus] = useState(false);

  if (!currentUser) return null;

  const myMatches = tournaments.filter((t) =>
    t.participants.some((p) => p.user_id === currentUser.id)
  );

  const activeMatches = myMatches.filter(
    (t) => t.status !== "COMPLETED" && t.status !== "CANCELLED"
  );

  const handleClaimDaily = () => {
    if (claimedDailyBonus) return;
    setClaimedDailyBonus(true);
    addDeposit(10, "DAILY_STREAK_BONUS");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Welcome Banner */}
      <GlassCard className="p-6 md:p-8 bg-gradient-to-r from-violet-950/40 via-surface-100 to-cyan-950/40 border-violet-500/30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={currentUser.avatar_url}
                alt={currentUser.username}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-violet-500/50 shadow-neon-violet"
              />
              <span className="absolute -bottom-1 -right-1 bg-violet-600 text-[10px] font-black text-white px-1.5 rounded-full">
                LVL {currentUser.level}
              </span>
            </div>
            <div className="space-y-1">
              <h1 className="text-2xl font-black text-white flex items-center gap-2">
                Welcome back, {currentUser.username}!
                <Sparkles className="w-5 h-5 text-amber-400" />
              </h1>
              <p className="text-xs text-slate-400">
                In-game ID: <strong className="text-cyan-400">{currentUser.in_game_username}</strong> • Win Rate:{" "}
                <strong className="text-white">
                  {currentUser.wins + currentUser.losses > 0
                    ? Math.round((currentUser.wins / (currentUser.wins + currentUser.losses)) * 100)
                    : 0}%
                </strong>
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleClaimDaily}
              disabled={claimedDailyBonus}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                claimedDailyBonus
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 cursor-default"
                  : "bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30 animate-pulse"
              }`}
            >
              <Gift className="w-4 h-4 text-amber-400" />
              {claimedDailyBonus ? "Claimed Daily Bonus (+₹10)" : "Claim Daily Bonus (Free ₹10)"}
            </button>
            <Link href="/tournaments">
              <Button variant="primary" size="sm">
                <Gamepad2 className="w-4 h-4 mr-1.5" />
                Play Tournament
              </Button>
            </Link>
          </div>
        </div>
      </GlassCard>

      {/* Quick Summary Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Wallet Balance */}
        <GlassCard className="p-5 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Combined Balance</span>
            <Wallet className="w-4 h-4 text-violet-400" />
          </div>
          <p className="text-2xl font-black text-white font-mono">
            {formatCurrency(currentUser.wallet.deposit_balance + currentUser.wallet.winnings_balance)}
          </p>
          <div className="flex items-center gap-2 pt-1">
            <Link href="/wallet/add" className="text-[11px] text-cyan-400 font-bold hover:underline">
              + Add Cash
            </Link>
            <span className="text-slate-600">•</span>
            <Link href="/wallet/withdraw" className="text-[11px] text-pink-400 font-bold hover:underline">
              Withdraw
            </Link>
          </div>
        </GlassCard>

        {/* Winnings Withdrawable */}
        <GlassCard className="p-5 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Withdrawable Winnings</span>
            <Trophy className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-black text-emerald-400 font-mono">
            {formatCurrency(currentUser.wallet.winnings_balance)}
          </p>
          <span className="text-[11px] text-slate-400">Available to withdraw</span>
        </GlassCard>

        {/* Active Matches */}
        <GlassCard className="p-5 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Active Matches</span>
            <Swords className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-2xl font-black text-white font-mono">{activeMatches.length}</p>
          <Link href="/my-matches" className="text-[11px] text-cyan-400 font-bold hover:underline">
            View match rooms →
          </Link>
        </GlassCard>

        {/* Wins / XP */}
        <GlassCard className="p-5 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Career Wins</span>
            <Flame className="w-4 h-4 text-pink-400" />
          </div>
          <p className="text-2xl font-black text-pink-400 font-mono">{currentUser.wins}</p>
          <span className="text-[11px] text-slate-400">{currentUser.xp} XP Earned</span>
        </GlassCard>
      </div>

      {/* Active Matches Spotlight */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Swords className="w-5 h-5 text-cyan-400" />
            Your Live & Upcoming Match Rooms
          </h2>
          <Link href="/my-matches" className="text-xs text-cyan-400 hover:underline">
            View All ({myMatches.length})
          </Link>
        </div>

        {activeMatches.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeMatches.map((tourney) => (
              <TournamentCard key={tourney.id} tournament={tourney} />
            ))}
          </div>
        ) : (
          <GlassCard className="p-8 text-center space-y-2">
            <Gamepad2 className="w-8 h-8 text-slate-500 mx-auto" />
            <p className="text-sm font-bold text-white">No active matches joined</p>
            <p className="text-xs text-slate-400">
              Browse available 1v1 duels or 4-player battles to compete for prizes.
            </p>
            <Link href="/tournaments" className="inline-block pt-2">
              <Button variant="primary" size="sm">
                Browse Tournaments
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </Link>
          </GlassCard>
        )}
      </div>
    </div>
  );
}
