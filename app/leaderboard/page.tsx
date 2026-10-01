"use client";

import React, { useState } from "react";
import { INITIAL_USERS } from "@/lib/mock-data";
import { GlassCard } from "@/components/ui/GlassCard";
import { formatCurrency } from "@/lib/utils";
import { Trophy, Medal, Flame, Zap, Award, Crown } from "lucide-react";

export default function LeaderboardPage() {
  const [timeRange, setTimeRange] = useState<"DAILY" | "WEEKLY" | "ALL_TIME">("ALL_TIME");

  // Sorted players by earnings & wins
  const sortedPlayers = [...INITIAL_USERS].sort((a, b) => {
    const earnA = a.wallet.winnings_balance;
    const earnB = b.wallet.winnings_balance;
    return earnB - earnA;
  });

  const top1 = sortedPlayers[0];
  const top2 = sortedPlayers[1];
  const top3 = sortedPlayers[2];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white flex items-center gap-2">
            <Trophy className="w-8 h-8 text-amber-400" />
            Arena Hall of Fame
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Top ranked esports Ludo champions by prize earnings and win streaks.
          </p>
        </div>

        {/* Time Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-surface-100 border border-white/10 text-xs">
          {[
            { id: "DAILY", label: "Today" },
            { id: "WEEKLY", label: "This Week" },
            { id: "ALL_TIME", label: "All-Time" },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTimeRange(t.id as any)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                timeRange === t.id
                  ? "bg-violet-600 text-white shadow-neon-violet"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* TOP 3 PODIUM */}
      <div className="grid grid-cols-3 gap-3 sm:gap-6 items-end pt-8 pb-4">
        {/* 2nd Place */}
        {top2 && (
          <GlassCard className="p-4 sm:p-6 text-center space-y-2 border-slate-400/30 flex flex-col items-center">
            <span className="w-6 h-6 rounded-full bg-slate-300 text-slate-900 text-xs font-black flex items-center justify-center">
              2
            </span>
            <div className="relative">
              <img
                src={top2.avatar_url}
                alt={top2.username}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-slate-300 shadow-md"
              />
            </div>
            <div>
              <p className="text-sm font-bold text-white truncate max-w-[100px] sm:max-w-none">
                {top2.username}
              </p>
              <p className="text-xs font-mono font-bold text-cyan-400">
                {formatCurrency(top2.wallet.winnings_balance)}
              </p>
            </div>
            <span className="text-[10px] text-slate-400 uppercase font-semibold">
              {top2.wins} Wins • {Math.round((top2.wins / (top2.wins + top2.losses)) * 100)}% Win
            </span>
          </GlassCard>
        )}

        {/* 1st Place (Gold Crown & Elevated) */}
        {top1 && (
          <GlassCard
            glow="violet"
            className="p-5 sm:p-8 text-center space-y-2.5 border-amber-400/50 bg-amber-950/20 shadow-neon-violet flex flex-col items-center -translate-y-4"
          >
            <div className="flex items-center gap-1 text-amber-400 font-black text-xs uppercase tracking-wider">
              <Crown className="w-5 h-5 fill-amber-400" /> Champion
            </div>
            <div className="relative">
              <img
                src={top1.avatar_url}
                alt={top1.username}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-amber-400 shadow-neon-violet"
              />
              <span className="absolute -bottom-2 -right-1 bg-amber-400 text-black text-[10px] font-black px-1.5 py-0.5 rounded-full">
                #1
              </span>
            </div>
            <div>
              <p className="text-base font-black text-white truncate max-w-[110px] sm:max-w-none">
                {top1.username}
              </p>
              <p className="text-sm sm:text-base font-mono font-black text-amber-400">
                {formatCurrency(top1.wallet.winnings_balance)}
              </p>
            </div>
            <span className="text-[11px] text-slate-300 uppercase font-semibold">
              {top1.wins} Wins • {Math.round((top1.wins / (top1.wins + top1.losses)) * 100)}% Win
            </span>
          </GlassCard>
        )}

        {/* 3rd Place */}
        {top3 && (
          <GlassCard className="p-4 sm:p-6 text-center space-y-2 border-amber-600/30 flex flex-col items-center">
            <span className="w-6 h-6 rounded-full bg-amber-700 text-white text-xs font-black flex items-center justify-center">
              3
            </span>
            <div className="relative">
              <img
                src={top3.avatar_url}
                alt={top3.username}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-amber-600 shadow-md"
              />
            </div>
            <div>
              <p className="text-sm font-bold text-white truncate max-w-[100px] sm:max-w-none">
                {top3.username}
              </p>
              <p className="text-xs font-mono font-bold text-cyan-400">
                {formatCurrency(top3.wallet.winnings_balance)}
              </p>
            </div>
            <span className="text-[10px] text-slate-400 uppercase font-semibold">
              {top3.wins} Wins • {Math.round((top3.wins / (top3.wins + top3.losses)) * 100)}% Win
            </span>
          </GlassCard>
        )}
      </div>

      {/* Leaderboard Full Table */}
      <GlassCard className="p-6">
        <h2 className="text-base font-bold text-white mb-4">Complete Rankings</h2>
        <div className="overflow-x-auto rounded-xl border border-white/10">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-surface-200/50 font-bold uppercase text-[10px] text-slate-400 border-b border-white/10">
              <tr>
                <th className="px-4 py-3">Rank</th>
                <th className="px-4 py-3">Gamer</th>
                <th className="px-4 py-3">Level</th>
                <th className="px-4 py-3">Matches Won</th>
                <th className="px-4 py-3">Win Rate</th>
                <th className="px-4 py-3 text-right">Total Earnings</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-normal">
              {sortedPlayers.map((player, idx) => {
                const total = player.wins + player.losses;
                const rate = total > 0 ? Math.round((player.wins / total) * 100) : 0;
                return (
                  <tr key={player.id} className="hover:bg-white/[0.02]">
                    <td className="px-4 py-3 font-mono font-black text-sm">
                      {idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : `#${idx + 1}`}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={player.avatar_url}
                          alt={player.username}
                          className="w-7 h-7 rounded-lg object-cover border border-white/10"
                        />
                        <span className="font-bold text-white">{player.username}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono text-violet-400 font-semibold">
                      LVL {player.level}
                    </td>
                    <td className="px-4 py-3 font-mono text-white">{player.wins}</td>
                    <td className="px-4 py-3 font-mono text-cyan-400 font-bold">{rate}%</td>
                    <td className="px-4 py-3 text-right font-mono font-black text-amber-400">
                      {formatCurrency(player.wallet.winnings_balance)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}
