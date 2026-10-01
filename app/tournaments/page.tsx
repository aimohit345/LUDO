"use client";

import React, { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useAppStore } from "@/lib/store/useAppStore";
import { TournamentCard } from "@/components/tournament/TournamentCard";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { formatCurrency } from "@/lib/utils";
import {
  Search,
  Filter,
  Trophy,
  Gamepad2,
  CheckCircle2,
  Coins,
  Sparkles,
  Flame,
} from "lucide-react";

function TournamentsContent() {
  const searchParams = useSearchParams();
  const initialStatus = searchParams.get("status") || "ALL";

  const { tournaments, currentUser, joinTournament } = useAppStore();
  const [activeTab, setActiveTab] = useState(initialStatus);
  const [selectedMode, setSelectedMode] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTourneyToJoin, setSelectedTourneyToJoin] = useState<string | null>(null);
  const [joinFeedback, setJoinFeedback] = useState<{ error?: string; success?: boolean } | null>(null);

  const filteredTournaments = useMemo(() => {
    return tournaments.filter((t) => {
      // Status filter
      if (activeTab === "LIVE" && t.status !== "LIVE" && t.status !== "ROOM_SHARED") return false;
      if (activeTab === "UPCOMING" && t.status !== "REGISTRATION_OPEN" && t.status !== "UPCOMING") return false;
      if (activeTab === "FREE" && t.tournament_type !== "FREE" && t.entry_fee !== 0) return false;
      if (activeTab === "COMPLETED" && t.status !== "COMPLETED") return false;

      // Mode filter
      if (selectedMode !== "ALL" && t.mode !== selectedMode) return false;

      // Search term
      if (searchTerm && !t.title.toLowerCase().includes(searchTerm.toLowerCase())) return false;

      return true;
    });
  }, [tournaments, activeTab, selectedMode, searchTerm]);

  const tourneyToJoin = tournaments.find((t) => t.id === selectedTourneyToJoin);

  const handleConfirmJoin = () => {
    if (!currentUser) {
      setJoinFeedback({ error: "Please sign in to join tournaments." });
      return;
    }
    if (!selectedTourneyToJoin) return;

    const res = joinTournament(selectedTourneyToJoin, currentUser.id);
    if (res.success) {
      setJoinFeedback({ success: true });
      setTimeout(() => {
        setSelectedTourneyToJoin(null);
        setJoinFeedback(null);
      }, 1200);
    } else {
      setJoinFeedback({ error: res.error });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white flex items-center gap-2">
            <Trophy className="w-8 h-8 text-amber-400" />
            Tournament Lobby
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Pick a match, lock your slot, and compete for verified prizes.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search tournament name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-surface-100 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: "ALL", label: "All Tournaments" },
            { id: "LIVE", label: "Live Now 🔴" },
            { id: "UPCOMING", label: "Starting Soon ⚡" },
            { id: "FREE", label: "Free Rolls 🎁" },
            { id: "COMPLETED", label: "Completed" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === tab.id
                  ? "bg-violet-600 text-white shadow-neon-violet border border-violet-400/40"
                  : "bg-surface-100 text-slate-400 hover:text-white hover:bg-surface-200 border border-white/5"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Mode Selector */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400 font-medium">Mode:</span>
          <select
            value={selectedMode}
            onChange={(e) => setSelectedMode(e.target.value)}
            className="bg-surface-100 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-violet-500"
          >
            <option value="ALL">All Modes</option>
            <option value="1v1">1 vs 1 Duel</option>
            <option value="4_PLAYER">4-Player Battle</option>
            <option value="2_PLAYER">2-Player Quick</option>
            <option value="QUICK">Speed Ludo</option>
            <option value="CLASSIC">Classic</option>
          </select>
        </div>
      </div>

      {/* Tournaments Grid */}
      {filteredTournaments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTournaments.map((tourney) => (
            <TournamentCard
              key={tourney.id}
              tournament={tourney}
              onJoin={() => setSelectedTourneyToJoin(tourney.id)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 rounded-2xl border border-white/10 bg-surface-100/50 p-8">
          <Gamepad2 className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white">No tournaments found</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Try adjusting your search filters or check back shortly for newly scheduled brackets.
          </p>
          <Button
            variant="glass"
            size="sm"
            onClick={() => {
              setActiveTab("ALL");
              setSelectedMode("ALL");
              setSearchTerm("");
            }}
            className="mt-4 text-xs"
          >
            Reset Filters
          </Button>
        </div>
      )}

      {/* Join Modal */}
      <Modal
        isOpen={!!selectedTourneyToJoin}
        onClose={() => {
          setSelectedTourneyToJoin(null);
          setJoinFeedback(null);
        }}
        title="Confirm Tournament Entry"
        description="Verify tournament rules and deduct entry fee from wallet."
      >
        {tourneyToJoin && (
          <div className="space-y-4">
            <div className="p-3 rounded-xl bg-surface-200/50 border border-white/5 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-400">Tournament:</span>
                <span className="text-xs font-bold text-white">{tourneyToJoin.title}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-400">Mode:</span>
                <span className="text-xs font-bold text-cyan-400 uppercase">{tourneyToJoin.mode}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-400">Entry Fee:</span>
                <span className="text-xs font-bold text-white font-mono">
                  {tourneyToJoin.entry_fee === 0 ? "FREE" : formatCurrency(tourneyToJoin.entry_fee)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-400">Prize Pool:</span>
                <span className="text-xs font-bold text-amber-400 font-mono">
                  {formatCurrency(tourneyToJoin.prize_pool)}
                </span>
              </div>
            </div>

            {joinFeedback?.error && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
                {joinFeedback.error}
              </div>
            )}

            {joinFeedback?.success && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Successfully joined tournament!
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                className="flex-1 text-xs"
                onClick={() => {
                  setSelectedTourneyToJoin(null);
                  setJoinFeedback(null);
                }}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                className="flex-1 text-xs"
                onClick={handleConfirmJoin}
                disabled={joinFeedback?.success}
              >
                Confirm & Join
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default function TournamentsPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-16 text-slate-400 text-center">Loading tournament lobby...</div>}>
      <TournamentsContent />
    </Suspense>
  );
}
