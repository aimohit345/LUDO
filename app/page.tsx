"use client";

import React, { useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { SceneFallback } from "@/components/3d/SceneFallback";

const LudoScene = dynamic(
  () => import("@/components/3d/LudoScene").then((mod) => mod.LudoScene),
  { ssr: false, loading: () => <SceneFallback /> }
);
import { TournamentCard } from "@/components/tournament/TournamentCard";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import { Modal } from "@/components/ui/Modal";
import { useAppStore } from "@/lib/store/useAppStore";
import { APP_CONFIG } from "@/config/app.config";
import { formatCurrency } from "@/lib/utils";
import {
  Gamepad2,
  Trophy,
  ShieldCheck,
  Zap,
  Users,
  Sparkles,
  ArrowRight,
  Flame,
  CheckCircle2,
  Coins,
  Share2,
  ExternalLink,
} from "lucide-react";

export default function HomePage() {
  const { tournaments, currentUser, joinTournament } = useAppStore();
  const [selectedTourneyToJoin, setSelectedTourneyToJoin] = useState<string | null>(null);
  const [joinFeedback, setJoinFeedback] = useState<{ error?: string; success?: boolean } | null>(null);

  const liveMatches = tournaments.filter((t) => t.status === "LIVE" || t.status === "ROOM_SHARED");
  const upcomingMatches = tournaments.filter((t) => t.status === "REGISTRATION_OPEN" || t.status === "UPCOMING");

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
      }, 1500);
    } else {
      setJoinFeedback({ error: res.error });
    }
  };

  return (
    <div className="space-y-20 pb-16">
      {/* 1. HERO SECTION WITH 3D R3F SCENE */}
      <section className="relative pt-6 md:pt-12 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Hero Left Content */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-violet-500/30 bg-violet-950/40 text-xs font-semibold text-violet-300 shadow-neon-violet/20">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span>India&apos;s Premier 3D Esports Ludo Platform</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1]">
              Compete. Roll.{" "}
              <span className="bg-gradient-to-r from-violet-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                Conquer & Win.
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Enter skill-based tournaments for room-code matches. Secure entry fee escrow, live automated room code distribution, instant verified prize payouts, and zero bot play.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
              <Link href="/tournaments">
                <Button size="lg" variant="primary" className="w-full sm:w-auto shadow-neon-violet">
                  <Gamepad2 className="w-5 h-5 mr-2" />
                  Explore Tournaments
                </Button>
              </Link>
              <Link href="/how-it-works">
                <Button size="lg" variant="glass" className="w-full sm:w-auto">
                  How It Works
                  <ArrowRight className="w-4 h-4 ml-2 text-cyan-400" />
                </Button>
              </Link>
            </div>

            {/* Quick Live Stats Ticker */}
            <div className="pt-6 grid grid-cols-3 gap-4 border-t border-white/10 text-center lg:text-left">
              <div>
                <p className="text-2xl font-black text-white font-mono">15,400+</p>
                <p className="text-[11px] uppercase tracking-wider text-slate-400 font-medium">Registered Players</p>
              </div>
              <div>
                <p className="text-2xl font-black text-cyan-400 font-mono">₹4.8M+</p>
                <p className="text-[11px] uppercase tracking-wider text-slate-400 font-medium">Prizes Distributed</p>
              </div>
              <div>
                <p className="text-2xl font-black text-pink-400 font-mono">99.8%</p>
                <p className="text-[11px] uppercase tracking-wider text-slate-400 font-medium">Verified Payouts</p>
              </div>
            </div>
          </div>

          {/* Hero Right: 3D Interactive Scene */}
          <div className="lg:col-span-6 w-full">
            <LudoScene />
          </div>
        </div>
      </section>

      {/* 2. LIVE MATCHES NOW / STARTING SOON */}
      <section className="px-4 sm:px-6 max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
              </span>
              <h2 className="text-2xl font-black text-white">Live Matches Now</h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Active games in progress and room codes currently being revealed
            </p>
          </div>
          <Link href="/tournaments?status=LIVE">
            <Button variant="ghost" size="sm" className="text-cyan-400 hover:text-cyan-300">
              View All Live
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {liveMatches.slice(0, 3).map((tourney) => (
            <TournamentCard
              key={tourney.id}
              tournament={tourney}
              onJoin={() => setSelectedTourneyToJoin(tourney.id)}
            />
          ))}
        </div>
      </section>

      {/* 3. UPCOMING TOURNAMENTS */}
      <section className="px-4 sm:px-6 max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <Flame className="w-6 h-6 text-amber-400" />
              <h2 className="text-2xl font-black text-white">Starting Soon & Registration Open</h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Reserve your slot before brackets fill up. 100% money-back guarantee if min players not reached.
            </p>
          </div>
          <Link href="/tournaments">
            <Button variant="ghost" size="sm" className="text-cyan-400 hover:text-cyan-300">
              Browse All Matches
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {upcomingMatches.slice(0, 3).map((tourney) => (
            <TournamentCard
              key={tourney.id}
              tournament={tourney}
              onJoin={() => setSelectedTourneyToJoin(tourney.id)}
            />
          ))}
        </div>
      </section>

      {/* 4. HOW IT WORKS (3 SIMPLE STEPS) */}
      <section className="px-4 sm:px-6 max-w-7xl mx-auto">
        <GlassCard className="p-8 md:p-12 relative overflow-hidden bg-surface-100/70">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 bg-cyan-950/60 px-3 py-1 rounded-full border border-cyan-800/40">
              Simple 3-Step Process
            </span>
            <h2 className="text-3xl font-black text-white">How LudoArena Works</h2>
            <p className="text-xs sm:text-sm text-slate-300">
              {APP_CONFIG.brand.name} organizes competitive tournaments while you play matches in your favorite external Ludo app.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center space-y-4 p-6 rounded-2xl bg-surface-200/40 border border-white/5">
              <div className="w-14 h-14 rounded-2xl bg-violet-600/20 border border-violet-500/40 flex items-center justify-center text-violet-400 shadow-neon-violet">
                <Gamepad2 className="w-7 h-7" />
              </div>
              <span className="text-[10px] font-mono font-bold text-violet-400 uppercase tracking-widest">
                STEP 01
              </span>
              <h3 className="text-base font-bold text-white">Join & Receive Room Code</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Choose a tournament (1v1 or 4-player). Exactly 10 minutes before start time, the exclusive game room code unlocks on your match page.
              </p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center space-y-4 p-6 rounded-2xl bg-surface-200/40 border border-white/5">
              <div className="w-14 h-14 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400 shadow-neon-cyan">
                <Zap className="w-7 h-7" />
              </div>
              <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-widest">
                STEP 02
              </span>
              <h3 className="text-base font-bold text-white">Play in External Game App</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Click &apos;Open Game App&apos;, enter the shared room code with verified opponents, and play out the match with your skills.
              </p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center space-y-4 p-6 rounded-2xl bg-surface-200/40 border border-white/5">
              <div className="w-14 h-14 rounded-2xl bg-pink-500/20 border border-pink-400/40 flex items-center justify-center text-pink-400 shadow-neon-pink">
                <Trophy className="w-7 h-7" />
              </div>
              <span className="text-[10px] font-mono font-bold text-pink-400 uppercase tracking-widest">
                STEP 03
              </span>
              <h3 className="text-base font-bold text-white">Upload Screenshot & Win</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Take a screenshot of the victory screen, upload it to the match portal, and our admin verification team releases instant prize payouts to your wallet!
              </p>
            </div>
          </div>
        </GlassCard>
      </section>

      {/* 5. REFERRAL PROMO BANNER */}
      <section className="px-4 sm:px-6 max-w-7xl mx-auto">
        <GlassCard className="p-8 bg-gradient-to-r from-violet-900/40 via-surface-100 to-indigo-900/40 border-violet-500/30 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              <Coins className="w-3.5 h-3.5" /> Refer & Earn Program
            </span>
            <h3 className="text-2xl font-black text-white">
              Invite Friends. Earn ₹{APP_CONFIG.features.referralBonusReferrer} for Every Referral!
            </h3>
            <p className="text-xs text-slate-300 max-w-xl">
              Share your personal invite link. When your friend joins, they get ₹{APP_CONFIG.features.referralBonusReferee} welcome bonus, and you earn ₹{APP_CONFIG.features.referralBonusReferrer} directly into your wallet.
            </p>
          </div>
          <Link href="/referrals">
            <Button variant="accent" size="lg" className="whitespace-nowrap">
              <Share2 className="w-4 h-4 mr-2" />
              Get Referral Link
            </Button>
          </Link>
        </GlassCard>
      </section>

      {/* 6. JOIN CONFIRMATION MODAL */}
      <Modal
        isOpen={!!selectedTourneyToJoin}
        onClose={() => {
          setSelectedTourneyToJoin(null);
          setJoinFeedback(null);
        }}
        title="Confirm Tournament Entry"
        description="Review tournament details and confirm entry fee deduction."
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
                Successfully joined tournament! Redirecting...
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
