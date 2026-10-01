"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store/useAppStore";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { ArrowLeft, Plus, Trophy, Sparkles } from "lucide-react";

export default function NewTournamentPage() {
  const router = useRouter();
  const { addTournament } = useAppStore();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [mode, setMode] = useState<"1v1" | "4_PLAYER" | "2_PLAYER" | "QUICK" | "CLASSIC">("1v1");
  const [tournamentType, setTournamentType] = useState<"PAID" | "FREE" | "SPONSORED">("PAID");
  const [entryFee, setEntryFee] = useState<number>(50);
  const [maxPlayers, setMaxPlayers] = useState<number>(2);
  const [prizePool, setPrizePool] = useState<number>(90);
  const [startMinutesFromNow, setStartMinutesFromNow] = useState<number>(30);
  const [roomCode, setRoomCode] = useState<string>("");
  const [rules, setRules] = useState<string>(
    "Standard 2-token fast match. Winner takes screenshot of victory screen."
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const startTime = new Date(Date.now() + startMinutesFromNow * 60 * 1000).toISOString();
    const regCloseTime = new Date(Date.now() + (startMinutesFromNow - 5) * 60 * 1000).toISOString();

    addTournament({
      title,
      description,
      mode,
      tournament_type: tournamentType,
      entry_fee: tournamentType === "FREE" ? 0 : entryFee,
      prize_pool: prizePool,
      prize_distribution: mode === "1v1" ? { "1st": 100 } : { "1st": 70, "2nd": 30 },
      max_players: maxPlayers,
      min_players: 2,
      start_time: startTime,
      registration_close_time: regCloseTime,
      rules_text: rules,
      status: "REGISTRATION_OPEN",
      room_code: roomCode || undefined,
    });

    router.push("/admin/tournaments");
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      <Link
        href="/admin/tournaments"
        className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Tournaments
      </Link>

      <div>
        <h1 className="text-2xl font-black text-white flex items-center gap-2">
          <Trophy className="w-6 h-6 text-pink-400" />
          Schedule New Tournament Bracket
        </h1>
        <p className="text-xs text-slate-400">
          Configure match rules, entry fee, prize pool, and room settings.
        </p>
      </div>

      <GlassCard className="p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Tournament Title
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Neon Blitz 1v1 High Roller"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-surface-100 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-pink-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Short Description
            </label>
            <textarea
              rows={2}
              placeholder="Fast-paced 1v1 ludo duel. Winner takes all."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-surface-100 border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-pink-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Mode</label>
              <select
                value={mode}
                onChange={(e) => {
                  const m = e.target.value as any;
                  setMode(m);
                  if (m === "1v1" || m === "2_PLAYER") {
                    setMaxPlayers(2);
                  } else {
                    setMaxPlayers(4);
                  }
                }}
                className="w-full bg-surface-100 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-pink-500 font-semibold"
              >
                <option value="1v1">1 vs 1 Duel</option>
                <option value="4_PLAYER">4-Player Battle</option>
                <option value="2_PLAYER">2-Player Quick</option>
                <option value="QUICK">Speed Ludo</option>
                <option value="CLASSIC">Classic</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Type</label>
              <select
                value={tournamentType}
                onChange={(e) => setTournamentType(e.target.value as any)}
                className="w-full bg-surface-100 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-pink-500 font-semibold"
              >
                <option value="PAID">Paid Entry</option>
                <option value="FREE">Free Roll (Coins)</option>
                <option value="SPONSORED">Sponsored</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Max Players Capacity
              </label>
              <input
                type="number"
                required
                min={2}
                max={16}
                value={maxPlayers}
                onChange={(e) => setMaxPlayers(Number(e.target.value))}
                className="w-full bg-surface-100 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-pink-500 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Entry Fee (₹)
              </label>
              <input
                type="number"
                required
                disabled={tournamentType === "FREE"}
                value={tournamentType === "FREE" ? 0 : entryFee}
                onChange={(e) => {
                  const fee = Number(e.target.value);
                  setEntryFee(fee);
                  setPrizePool(Math.round(fee * maxPlayers * 0.9));
                }}
                className="w-full bg-surface-100 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-pink-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Total Prize Pool (₹)
              </label>
              <input
                type="number"
                required
                value={prizePool}
                onChange={(e) => setPrizePool(Number(e.target.value))}
                className="w-full bg-surface-100 border border-white/10 rounded-xl px-3 py-2 text-xs text-amber-400 font-bold focus:outline-none focus:border-pink-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Start In (Minutes)
              </label>
              <input
                type="number"
                required
                min={5}
                value={startMinutesFromNow}
                onChange={(e) => setStartMinutesFromNow(Number(e.target.value))}
                className="w-full bg-surface-100 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-pink-500 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Initial Game Room Code (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. 55992211 (can be added right before kickoff)"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value)}
              className="w-full bg-surface-100 border border-white/10 rounded-xl px-4 py-2 text-xs text-cyan-300 font-mono focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Custom Match Rules
            </label>
            <textarea
              rows={2}
              value={rules}
              onChange={(e) => setRules(e.target.value)}
              className="w-full bg-surface-100 border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-pink-500"
            />
          </div>

          <Button type="submit" variant="accent" className="w-full text-xs font-bold">
            <Plus className="w-4 h-4 mr-1.5" />
            Publish Tournament to Lobby
          </Button>
        </form>
      </GlassCard>
    </div>
  );
}
