"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useAppStore } from "@/lib/store/useAppStore";
import { TournamentCard } from "@/components/tournament/TournamentCard";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { Swords, Trophy, Gamepad2, ArrowRight } from "lucide-react";

export default function MyMatchesPage() {
  const { tournaments, currentUser } = useAppStore();
  const [activeTab, setActiveTab] = useState<"ACTIVE" | "COMPLETED">("ACTIVE");

  const myTournaments = useMemo(() => {
    if (!currentUser) return [];
    return tournaments.filter((t) =>
      t.participants.some((p) => p.user_id === currentUser.id)
    );
  }, [tournaments, currentUser]);

  const activeMatches = myTournaments.filter(
    (t) => t.status !== "COMPLETED" && t.status !== "CANCELLED"
  );
  const pastMatches = myTournaments.filter(
    (t) => t.status === "COMPLETED" || t.status === "CANCELLED"
  );

  const displayed = activeTab === "ACTIVE" ? activeMatches : pastMatches;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white flex items-center gap-2">
            <Swords className="w-8 h-8 text-cyan-400" />
            My Tournament Matches
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Access your room codes, join games, and upload victory screenshots.
          </p>
        </div>

        <Link href="/tournaments">
          <Button variant="primary" size="sm">
            <Gamepad2 className="w-4 h-4 mr-2" />
            Join More Matches
          </Button>
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-3 border-b border-white/10 pb-3">
        <button
          onClick={() => setActiveTab("ACTIVE")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === "ACTIVE"
              ? "bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-neon-cyan/20"
              : "text-slate-400 hover:text-white"
          }`}
        >
          Active / Live ({activeMatches.length})
        </button>
        <button
          onClick={() => setActiveTab("COMPLETED")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === "COMPLETED"
              ? "bg-violet-600 text-white shadow-neon-violet"
              : "text-slate-400 hover:text-white"
          }`}
        >
          Past & Completed ({pastMatches.length})
        </button>
      </div>

      {/* Match cards */}
      {displayed.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayed.map((tourney) => (
            <TournamentCard key={tourney.id} tournament={tourney} />
          ))}
        </div>
      ) : (
        <GlassCard className="p-12 text-center space-y-4 max-w-md mx-auto">
          <Gamepad2 className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-white">No matches found in this tab</h3>
          <p className="text-xs text-slate-400">
            {activeTab === "ACTIVE"
              ? "You haven't joined any active tournaments right now."
              : "You haven't completed any tournament matches yet."}
          </p>
          <Link href="/tournaments" className="inline-block pt-2">
            <Button variant="primary" size="sm">
              Explore Available Tournaments
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </Link>
        </GlassCard>
      )}
    </div>
  );
}
