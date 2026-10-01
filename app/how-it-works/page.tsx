"use client";

import React from "react";
import Link from "next/link";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { APP_CONFIG } from "@/config/app.config";
import {
  Gamepad2,
  KeyRound,
  Play,
  UploadCloud,
  Trophy,
  ShieldCheck,
  CheckCircle,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export default function HowItWorksPage() {
  const steps = [
    {
      num: "01",
      title: "Join Any Tournament",
      desc: "Browse our active tournament lobby. Choose 1v1 duel or 4-player battles. Confirm entry fee with a single click. Funds are safely held in double-entry escrow.",
      icon: Gamepad2,
    },
    {
      num: "02",
      title: "Receive Room Code Prior to Kickoff",
      desc: `Exactly ${APP_CONFIG.features.roomCodeRevealMinutesBeforeStart} minutes before the match start time, the exclusive room code is revealed in your match room dashboard. Realtime notifications alert you immediately.`,
      icon: KeyRound,
    },
    {
      num: "03",
      title: "Play Match in External Ludo App",
      desc: "Tap 'Open Game App' or copy the room code into the external Ludo game app. Join the custom room with your verified opponent and play the match using skill and strategy.",
      icon: Play,
    },
    {
      num: "04",
      title: "Upload Victory Screenshot",
      desc: "When the game ends, take a clear screenshot of the final score screen showing all player positions. Upload it on your match room page with your claimed rank.",
      icon: UploadCloud,
    },
    {
      num: "05",
      title: "Admin Verification & Instant Payout",
      desc: "Our automated duplicate image hash system and admin review team verify screenshots side-by-side. Escrow funds are immediately disbursed to your withdrawable wallet balance.",
      icon: Trophy,
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-12">
      {/* Header */}
      <div className="text-center space-y-3 max-w-xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-widest text-cyan-400 bg-cyan-950/60 px-3 py-1 rounded-full border border-cyan-800/40">
          Tournament Playbook
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-white">How LudoArena Operates</h1>
        <p className="text-xs sm:text-sm text-slate-300">
          A neutral, transparent esports organizer designed for competitive room-code Ludo matches.
        </p>
      </div>

      {/* Step Cards */}
      <div className="space-y-4">
        {steps.map((st, idx) => {
          const Icon = st.icon;
          return (
            <GlassCard key={idx} className="p-6 flex flex-col sm:flex-row items-start gap-5">
              <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-600 to-cyan-500 p-0.5 shadow-neon-violet shrink-0">
                <div className="w-full h-full bg-surface-100 rounded-[14px] flex items-center justify-center text-white">
                  <Icon className="w-6 h-6 text-cyan-400" />
                </div>
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-violet-400">STEP {st.num}</span>
                  <h3 className="text-base font-bold text-white">{st.title}</h3>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{st.desc}</p>
              </div>
            </GlassCard>
          );
        })}
      </div>

      {/* Fair Play & Trust Banner */}
      <GlassCard className="p-8 bg-gradient-to-r from-violet-950/50 via-surface-100 to-indigo-950/50 text-center space-y-4">
        <ShieldCheck className="w-10 h-10 text-emerald-400 mx-auto" />
        <h2 className="text-xl font-bold text-white">100% Anti-Fraud & Fair Play Guarantee</h2>
        <p className="text-xs text-slate-300 max-w-lg mx-auto leading-relaxed">
          Every screenshot undergoes cryptographic SHA-256 and perceptual hash checks to prevent image reuse. Duplicate devices, VPN abusers, and false claimants face permanent bans and prize forfeiture.
        </p>
        <Link href="/tournaments" className="inline-block pt-2">
          <Button variant="primary" size="lg" className="shadow-neon-violet">
            Enter Live Tournament Lobby
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </GlassCard>
    </div>
  );
}
