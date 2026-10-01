"use client";

import React, { useState } from "react";
import Link from "next/link";
import { MockTournament } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";
import { GlassCard } from "@/components/ui/GlassCard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Countdown } from "@/components/ui/Countdown";
import { Button } from "@/components/ui/Button";
import { useAppStore } from "@/lib/store/useAppStore";
import {
  Trophy,
  Users,
  Coins,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  ExternalLink,
} from "lucide-react";

interface TournamentCardProps {
  tournament: MockTournament;
  onJoin?: () => void;
}

export function TournamentCard({ tournament, onJoin }: TournamentCardProps) {
  const { currentUser } = useAppStore();
  const [isHovered, setIsHovered] = useState(false);

  const isJoined = tournament.participants.some((p) => p.user_id === currentUser?.id);
  const fillPercentage = Math.min(
    100,
    Math.round((tournament.current_players / tournament.max_players) * 100)
  );

  const getModeLabel = (mode: string) => {
    switch (mode) {
      case "1v1":
        return "1 vs 1 Duel";
      case "4_PLAYER":
        return "4-Player Battle";
      case "2_PLAYER":
        return "2-Player Quick";
      case "QUICK":
        return "Speed Ludo";
      default:
        return "Classic Mode";
    }
  };

  return (
    <GlassCard
      glow={tournament.status === "LIVE" ? "pink" : tournament.status === "ROOM_SHARED" ? "cyan" : "violet"}
      interactive
      className="p-5 flex flex-col justify-between transition-transform duration-300 hover:scale-[1.02] border-white/10 group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <StatusBadge status={tournament.status} size="sm" />
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider bg-white/5 px-2 py-0.5 rounded-full border border-white/5">
            {getModeLabel(tournament.mode)}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-1 mb-1">
          {tournament.title}
        </h3>
        <p className="text-xs text-slate-400 line-clamp-2 mb-4 leading-relaxed">
          {tournament.description}
        </p>

        {/* Prize Pool and Entry Fee Pill Banner */}
        <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-surface-200/50 border border-white/5 mb-4">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
              <Trophy className="w-3 h-3 text-amber-400" />
              Prize Pool
            </span>
            <span className="text-base font-black text-amber-400 font-mono">
              {formatCurrency(tournament.prize_pool)}
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
              <Coins className="w-3 h-3 text-violet-400" />
              Entry Fee
            </span>
            <span className="text-base font-black text-white font-mono">
              {tournament.entry_fee === 0 ? (
                <span className="text-emerald-400 font-bold uppercase text-xs">FREE ROLL</span>
              ) : (
                formatCurrency(tournament.entry_fee)
              )}
            </span>
          </div>
        </div>

        {/* Capacity / Slots Progress Bar */}
        <div className="space-y-1.5 mb-4">
          <div className="flex justify-between text-xs text-slate-300">
            <span className="flex items-center gap-1 text-[11px] text-slate-400">
              <Users className="w-3.5 h-3.5 text-slate-400" />
              Players Registered
            </span>
            <span className="font-mono font-bold text-white">
              {tournament.current_players} / {tournament.max_players}
            </span>
          </div>
          <div className="w-full h-1.5 bg-surface-300 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                fillPercentage >= 100
                  ? "bg-amber-400"
                  : fillPercentage >= 75
                  ? "bg-pink-500"
                  : "bg-cyan-400"
              }`}
              style={{ width: `${fillPercentage}%` }}
            />
          </div>
        </div>

        {/* Countdown timer for upcoming / starting soon */}
        {(tournament.status === "REGISTRATION_OPEN" ||
          tournament.status === "UPCOMING" ||
          tournament.status === "ROOM_SHARED") && (
          <div className="flex items-center justify-between text-xs py-2 px-3 rounded-lg bg-surface-100 border border-white/5 mb-4">
            <span className="text-slate-400 text-[11px]">Starts in:</span>
            <Countdown targetDate={tournament.start_time} compact />
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="pt-2 border-t border-white/5">
        {isJoined ? (
          <Link href={`/match/${tournament.id}`} className="w-full block">
            <Button
              variant={tournament.status === "ROOM_SHARED" || tournament.status === "LIVE" ? "secondary" : "primary"}
              className="w-full text-xs justify-center"
            >
              <CheckCircle className="w-3.5 h-3.5 mr-1 text-emerald-400" />
              Go to Match Room
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </Link>
        ) : tournament.status === "REGISTRATION_OPEN" || tournament.status === "UPCOMING" ? (
          <div className="flex gap-2">
            <Link href={`/tournaments/${tournament.id}`} className="flex-1">
              <Button variant="glass" size="sm" className="w-full text-xs">
                Details
              </Button>
            </Link>
            <Button
              variant="primary"
              size="sm"
              onClick={onJoin}
              disabled={tournament.current_players >= tournament.max_players}
              className="flex-1 text-xs"
            >
              {tournament.current_players >= tournament.max_players ? "Full" : "Join Now"}
            </Button>
          </div>
        ) : (
          <Link href={`/tournaments/${tournament.id}`} className="w-full block">
            <Button variant="glass" size="sm" className="w-full text-xs justify-center">
              View Match Details
              <ExternalLink className="w-3.5 h-3.5 ml-1 text-slate-400" />
            </Button>
          </Link>
        )}
      </div>
    </GlassCard>
  );
}
