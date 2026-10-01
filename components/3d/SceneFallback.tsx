"use client";

import React from "react";
import { Dice5, Sparkles, Trophy, Shield } from "lucide-react";

export function SceneFallback() {
  return (
    <div className="relative w-full h-[400px] lg:h-[500px] flex items-center justify-center overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-violet-950/40 via-surface-100 to-indigo-950/40 backdrop-blur-xl">
      {/* Background ambient glowing spheres */}
      <div className="absolute w-72 h-72 rounded-full bg-violet-600/20 blur-3xl animate-pulse" />
      <div className="absolute -right-10 -bottom-10 w-64 h-64 rounded-full bg-cyan-500/20 blur-3xl" />
      
      {/* Stylized 2D Graphic */}
      <div className="relative z-10 flex flex-col items-center text-center p-6 space-y-4">
        <div className="relative flex items-center justify-center w-28 h-28 rounded-3xl bg-gradient-to-br from-violet-500 via-indigo-600 to-cyan-500 p-1 shadow-neon-violet animate-float">
          <div className="w-full h-full bg-surface-100 rounded-[22px] flex items-center justify-center">
            <Dice5 className="w-14 h-14 text-cyan-400 drop-shadow-[0_0_15px_rgba(6,182,212,0.8)]" />
          </div>
          <span className="absolute -top-2 -right-2 p-1.5 rounded-full bg-pink-500 text-white shadow-neon-pink">
            <Sparkles className="w-4 h-4" />
          </span>
        </div>

        <div className="space-y-1">
          <h3 className="text-xl font-black text-white">Next-Gen 3D Ludo Arena</h3>
          <p className="text-xs text-slate-400 max-w-xs">
            Optimized graphics mode active. Low power consumption with smooth responsive gameplay.
          </p>
        </div>

        <div className="flex gap-4 pt-2 text-xs text-slate-300">
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10">
            <Trophy className="w-3.5 h-3.5 text-amber-400" /> Real Cash & Coin Tournaments
          </span>
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10">
            <Shield className="w-3.5 h-3.5 text-emerald-400" /> Instant Verified Payouts
          </span>
        </div>
      </div>
    </div>
  );
}
