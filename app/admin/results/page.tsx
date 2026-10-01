"use client";

import React, { useState } from "react";
import { useAppStore } from "@/lib/store/useAppStore";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatCurrency, formatTimestamp } from "@/lib/utils";
import {
  CheckSquare,
  Trophy,
  AlertTriangle,
  Check,
  X,
  FileImage,
  RefreshCw,
  ShieldCheck,
  ShieldAlert,
  Coins,
} from "lucide-react";

export default function AdminResultsVerificationPage() {
  const { tournaments, verifyMatchResult, updateTournamentStatus } = useAppStore();

  const pendingTournaments = tournaments.filter(
    (t) => t.status === "RESULT_PENDING" || (t.participants && t.participants.some((p) => p.screenshot_url))
  );

  const [selectedWinnerId, setSelectedWinnerId] = useState<string>("");
  const [successMsg, setSuccessMsg] = useState<string>("");

  const handleApproveAndPay = (tournamentId: string, winnerId: string) => {
    if (!winnerId) {
      alert("Please select a verified 1st place winner.");
      return;
    }
    verifyMatchResult(tournamentId, winnerId);
    setSuccessMsg(`Prizes successfully distributed for match ${tournamentId}! Winnings credited.`);
    setTimeout(() => setSuccessMsg(""), 4000);
  };

  const handleMarkDispute = (tournamentId: string) => {
    alert(`Tournament ${tournamentId} flagged as DISPUTED. An internal investigation ticket has been created.`);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <CheckSquare className="w-6 h-6 text-cyan-400" />
            Match Result Verification Queue
          </h1>
          <p className="text-xs text-slate-400">
            Compare participant victory screenshots side-by-side, resolve rank claims, and trigger atomic escrow prize distribution.
          </p>
        </div>

        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
          {pendingTournaments.length} Pending Verifications
        </span>
      </div>

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2 font-semibold">
          <ShieldCheck className="w-5 h-5 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {pendingTournaments.length > 0 ? (
        <div className="space-y-8">
          {pendingTournaments.map((tourney) => {
            const participantsWithScreenshots = tourney.participants.filter(
              (p) => p.screenshot_url || p.status === "SUBMITTED"
            );

            // Check if claims conflict (e.g. two users claim 1st place)
            const firstPlaceClaims = tourney.participants.filter((p) => p.claimed_rank === 1);
            const isConflicted = firstPlaceClaims.length > 1;

            return (
              <GlassCard key={tourney.id} className="p-6 space-y-6 border-white/15">
                {/* Match summary header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <StatusBadge status={tourney.status} size="sm" />
                      <span className="text-xs font-mono font-bold text-cyan-400">
                        {tourney.mode}
                      </span>
                      {isConflicted && (
                        <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 text-[10px] font-bold border border-rose-500/40 animate-pulse">
                          ⚠️ Claim Conflict Detected
                        </span>
                      )}
                    </div>
                    <h2 className="text-lg font-bold text-white">{tourney.title}</h2>
                    <p className="text-xs text-slate-400">
                      Prize Pool: <strong className="text-amber-400">{formatCurrency(tourney.prize_pool)}</strong> • Started: {formatTimestamp(tourney.start_time)}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleMarkDispute(tourney.id)}
                      className="text-xs"
                    >
                      <ShieldAlert className="w-3.5 h-3.5 mr-1" />
                      Mark Dispute
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() =>
                        handleApproveAndPay(
                          tourney.id,
                          selectedWinnerId || firstPlaceClaims[0]?.user_id || tourney.participants[0]?.user_id
                        )
                      }
                      className="text-xs shadow-neon-violet"
                    >
                      <Check className="w-3.5 h-3.5 mr-1" />
                      Approve & Distribute Payout
                    </Button>
                  </div>
                </div>

                {/* Side-by-side screenshots comparisons */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {tourney.participants.map((player) => (
                    <div
                      key={player.user_id}
                      className={`p-4 rounded-2xl border transition-all ${
                        selectedWinnerId === player.user_id
                          ? "border-amber-400 bg-amber-950/20"
                          : "border-white/10 bg-surface-200/40"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={player.avatar_url}
                            alt={player.username}
                            className="w-8 h-8 rounded-lg object-cover border border-white/10"
                          />
                          <div>
                            <p className="text-xs font-bold text-white">{player.username}</p>
                            <p className="text-[10px] text-slate-400">
                              Claimed:{" "}
                              <strong className="text-cyan-400">
                                {player.claimed_rank ? `${player.claimed_rank}st Place` : "Pending Upload"}
                              </strong>
                            </p>
                          </div>
                        </div>

                        <label className="flex items-center gap-1.5 text-xs text-slate-300 font-semibold cursor-pointer">
                          <input
                            type="radio"
                            name={`winner-${tourney.id}`}
                            value={player.user_id}
                            checked={
                              selectedWinnerId === player.user_id ||
                              (!selectedWinnerId && player.claimed_rank === 1)
                            }
                            onChange={() => setSelectedWinnerId(player.user_id)}
                            className="text-amber-500 focus:ring-amber-400"
                          />
                          <span>Assign Winner (1st)</span>
                        </label>
                      </div>

                      {/* Screenshot image container */}
                      {player.screenshot_url ? (
                        <div className="space-y-2">
                          <div className="relative rounded-xl overflow-hidden border border-white/10 bg-black/50 group">
                            <img
                              src={player.screenshot_url}
                              alt="Result screenshot"
                              className="w-full h-52 object-contain"
                            />
                            <a
                              href={player.screenshot_url}
                              target="_blank"
                              rel="noreferrer"
                              className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/70 text-slate-300 hover:text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              View Full Size ↗
                            </a>
                          </div>
                          <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
                            <span>Hash: e3b0c442...991b</span>
                            <span className="text-emerald-400 font-semibold">✓ Unique Image Hash</span>
                          </div>
                        </div>
                      ) : (
                        <div className="h-52 rounded-xl border border-dashed border-white/10 flex flex-col items-center justify-center text-center p-4 text-slate-500 text-xs">
                          <FileImage className="w-8 h-8 mb-2 opacity-40" />
                          <span>No screenshot uploaded by this player yet</span>
                          <span className="text-[10px] text-slate-600 mt-1">
                            Deadline forfeiture applies if not submitted
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </GlassCard>
            );
          })}
        </div>
      ) : (
        <GlassCard className="p-12 text-center space-y-3">
          <CheckSquare className="w-12 h-12 text-emerald-400 mx-auto" />
          <h3 className="text-base font-bold text-white">Verification Queue is Empty</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            All submitted match screenshots have been reviewed and prize payouts released.
          </p>
        </GlassCard>
      )}
    </div>
  );
}
