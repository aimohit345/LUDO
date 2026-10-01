"use client";

import React, { use, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store/useAppStore";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Countdown } from "@/components/ui/Countdown";
import { Modal } from "@/components/ui/Modal";
import { formatCurrency, formatTimestamp } from "@/lib/utils";
import {
  Trophy,
  Users,
  Coins,
  Clock,
  Shield,
  ArrowLeft,
  CheckCircle,
  AlertTriangle,
  PlayCircle,
  ExternalLink,
} from "lucide-react";

export default function TournamentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { tournaments, currentUser, joinTournament, leaveTournament } = useAppStore();

  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [feedback, setFeedback] = useState<{ error?: string; success?: boolean } | null>(null);

  const tournament = tournaments.find((t) => t.id === id);

  if (!tournament) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-bold text-white mb-2">Tournament Not Found</h2>
        <p className="text-xs text-slate-400 mb-4">
          This tournament does not exist or has been removed.
        </p>
        <Link href="/tournaments">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Tournaments
          </Button>
        </Link>
      </div>
    );
  }

  const isJoined = tournament.participants.some((p) => p.user_id === currentUser?.id);
  const fillPercentage = Math.min(
    100,
    Math.round((tournament.current_players / tournament.max_players) * 100)
  );

  const handleJoin = () => {
    if (!currentUser) {
      router.push("/login");
      return;
    }
    const res = joinTournament(tournament.id, currentUser.id);
    if (res.success) {
      setFeedback({ success: true });
      setTimeout(() => {
        setIsJoinModalOpen(false);
        router.push(`/match/${tournament.id}`);
      }, 1000);
    } else {
      setFeedback({ error: res.error });
    }
  };

  const handleLeave = () => {
    if (!currentUser) return;
    if (confirm("Are you sure you want to leave this tournament? Your entry fee will be refunded.")) {
      leaveTournament(tournament.id, currentUser.id);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Back button */}
      <Link
        href="/tournaments"
        className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Lobby
      </Link>

      {/* Main Header Banner */}
      <GlassCard className="p-6 md:p-8 bg-gradient-to-r from-surface-100 via-surface-100 to-indigo-950/30">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge status={tournament.status} />
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-cyan-400">
                Mode: {tournament.mode}
              </span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-violet-400">
                Type: {tournament.tournament_type}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white">{tournament.title}</h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {tournament.description}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-violet-400" />
                Scheduled Start: {formatTimestamp(tournament.start_time)}
              </span>
              <span className="flex items-center gap-1">
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                Admin Supervised Room
              </span>
            </div>
          </div>

          {/* Right Action / Countdown Box */}
          <div className="flex flex-col sm:items-end justify-between gap-4 p-4 rounded-2xl bg-surface-200/60 border border-white/10 shrink-0 min-w-[260px]">
            <div className="sm:text-right">
              <p className="text-[10px] uppercase font-bold text-slate-400">Time Until Start</p>
              <Countdown targetDate={tournament.start_time} className="mt-1" />
            </div>

            <div className="w-full">
              {isJoined ? (
                <div className="space-y-2">
                  <Link href={`/match/${tournament.id}`} className="w-full block">
                    <Button variant="secondary" className="w-full text-xs">
                      <PlayCircle className="w-4 h-4 mr-2 text-cyan-400" />
                      Enter Match Room
                    </Button>
                  </Link>
                  {(tournament.status === "REGISTRATION_OPEN" || tournament.status === "UPCOMING") && (
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={handleLeave}
                      className="w-full text-xs"
                    >
                      Leave Tournament & Refund
                    </Button>
                  )}
                </div>
              ) : (
                <Button
                  variant="primary"
                  className="w-full shadow-neon-violet"
                  onClick={() => setIsJoinModalOpen(true)}
                  disabled={
                    tournament.current_players >= tournament.max_players ||
                    (tournament.status !== "REGISTRATION_OPEN" && tournament.status !== "UPCOMING")
                  }
                >
                  {tournament.current_players >= tournament.max_players
                    ? "Tournament Full"
                    : tournament.entry_fee === 0
                    ? "Join Free Roll"
                    : `Join for ${formatCurrency(tournament.entry_fee)}`}
                </Button>
              )}
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Grid: Financial Breakdown & Rules & Participants */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Prize Breakdown & Rules */}
        <div className="lg:col-span-7 space-y-6">
          {/* Prize breakdown */}
          <GlassCard className="p-6">
            <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-400" />
              Prize Pool & Distribution
            </h2>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="p-3 rounded-xl bg-surface-200/50 border border-white/5">
                <span className="text-[10px] uppercase font-bold text-slate-400">Total Prize Pool</span>
                <p className="text-2xl font-black text-amber-400 font-mono mt-0.5">
                  {formatCurrency(tournament.prize_pool)}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-surface-200/50 border border-white/5">
                <span className="text-[10px] uppercase font-bold text-slate-400">Entry Fee</span>
                <p className="text-2xl font-black text-white font-mono mt-0.5">
                  {tournament.entry_fee === 0 ? "FREE" : formatCurrency(tournament.entry_fee)}
                </p>
              </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-white/10">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-surface-200/50 font-bold uppercase text-[10px] text-slate-400 border-b border-white/10">
                  <tr>
                    <th className="px-4 py-2.5">Placement</th>
                    <th className="px-4 py-2.5">Share %</th>
                    <th className="px-4 py-2.5">Estimated Prize</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-mono">
                  {Object.entries(tournament.prize_distribution).map(([rank, percent]) => (
                    <tr key={rank}>
                      <td className="px-4 py-2.5 font-bold text-white flex items-center gap-1.5 font-sans">
                        <Trophy className="w-3.5 h-3.5 text-amber-400" />
                        {rank} Place
                      </td>
                      <td className="px-4 py-2.5 text-cyan-400">{percent}%</td>
                      <td className="px-4 py-2.5 text-emerald-400 font-bold">
                        {formatCurrency(Math.round((tournament.prize_pool * (percent / 100)) * 0.9))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-[10px] text-slate-500 mt-2">
              * Net prize amounts shown after 10% platform organizer fee.
            </p>
          </GlassCard>

          {/* Rules Card */}
          <GlassCard className="p-6">
            <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
              <Shield className="w-5 h-5 text-cyan-400" />
              Tournament Rules & Fair Play
            </h3>
            <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
              <p className="p-3 rounded-xl bg-surface-200/40 border border-white/5">
                {tournament.rules_text}
              </p>
              <ul className="space-y-2 list-disc list-inside text-slate-400">
                <li>Room code will appear on your match room page 10 minutes prior to kickoff.</li>
                <li>Ensure your in-game name in the external app matches your registered profile name.</li>
                <li>Both winner and runner-up must take clean screenshots of the final score screen.</li>
                <li>Falsified or reused screenshots result in an immediate permanent ban and escrow forfeiture.</li>
              </ul>
            </div>
          </GlassCard>
        </div>

        {/* Right Column: Participants List */}
        <div className="lg:col-span-5 space-y-6">
          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-violet-400" />
                Registered Players ({tournament.current_players} / {tournament.max_players})
              </h3>
              <span className="text-xs font-mono font-bold text-slate-400">
                {fillPercentage}% Full
              </span>
            </div>

            <div className="w-full h-1.5 bg-surface-300 rounded-full overflow-hidden mb-6">
              <div
                className="h-full bg-gradient-to-r from-violet-500 to-cyan-400 rounded-full"
                style={{ width: `${fillPercentage}%` }}
              />
            </div>

            {tournament.participants.length > 0 ? (
              <div className="divide-y divide-white/5">
                {tournament.participants.map((player, idx) => (
                  <div key={idx} className="py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={player.avatar_url}
                        alt={player.username}
                        className="w-8 h-8 rounded-lg object-cover border border-violet-500/30"
                      />
                      <div>
                        <p className="text-xs font-bold text-white flex items-center gap-1.5">
                          {player.username}
                          {player.user_id === currentUser?.id && (
                            <span className="text-[9px] uppercase px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300">
                              YOU
                            </span>
                          )}
                        </p>
                        <p className="text-[10px] text-slate-500">
                          Joined {formatTimestamp(player.joined_at)}
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-white/5 border border-white/10 text-slate-300 uppercase">
                      {player.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 text-center py-6">
                No players registered yet. Be the first to join!
              </p>
            )}
          </GlassCard>
        </div>
      </div>

      {/* Join Modal */}
      <Modal
        isOpen={isJoinModalOpen}
        onClose={() => {
          setIsJoinModalOpen(false);
          setFeedback(null);
        }}
        title="Confirm Tournament Entry"
        description="Review tournament details and deduct entry fee from wallet."
      >
        <div className="space-y-4">
          <div className="p-3 rounded-xl bg-surface-200/50 border border-white/5 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400">Tournament:</span>
              <span className="font-bold text-white">{tournament.title}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400">Entry Fee:</span>
              <span className="font-bold text-white font-mono">
                {tournament.entry_fee === 0 ? "FREE" : formatCurrency(tournament.entry_fee)}
              </span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400">Prize Pool:</span>
              <span className="font-bold text-amber-400 font-mono">
                {formatCurrency(tournament.prize_pool)}
              </span>
            </div>
          </div>

          {feedback?.error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
              {feedback.error}
            </div>
          )}

          {feedback?.success && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Spot secured! Loading match room...
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              className="flex-1 text-xs"
              onClick={() => {
                setIsJoinModalOpen(false);
                setFeedback(null);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              className="flex-1 text-xs"
              onClick={handleJoin}
              disabled={feedback?.success}
            >
              Confirm Entry
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
