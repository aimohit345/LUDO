"use client";

import React, { useState } from "react";
import { useAppStore } from "@/lib/store/useAppStore";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import {
  User,
  Trophy,
  Shield,
  Smartphone,
  Check,
  Save,
  Flame,
  Award,
  Zap,
} from "lucide-react";

const AVATAR_OPTIONS = [
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150",
  "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
  "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=150",
  "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150",
  "https://images.unsplash.com/photo-1628157582853-a796fa650a6a?w=150",
];

export default function ProfilePage() {
  const { currentUser, setCurrentUser } = useAppStore();

  const [inGameName, setInGameName] = useState(currentUser?.in_game_username || "");
  const [selectedAvatar, setSelectedAvatar] = useState(
    currentUser?.avatar_url || AVATAR_OPTIONS[0]
  );
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!currentUser) return null;

  const totalMatches = currentUser.wins + currentUser.losses;
  const winRate = totalMatches > 0 ? Math.round((currentUser.wins / totalMatches) * 100) : 0;
  const xpForNextLevel = 500;
  const currentLevelProgress = (currentUser.xp % 500) / 5; // percentage

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentUser({
      ...currentUser,
      in_game_username: inGameName,
      avatar_url: selectedAvatar,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Header Banner */}
      <GlassCard className="p-6 md:p-8 bg-gradient-to-r from-violet-950/40 via-surface-100 to-indigo-950/40">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
          <div className="relative">
            <img
              src={selectedAvatar}
              alt={currentUser.username}
              className="w-24 h-24 rounded-2xl object-cover border-2 border-violet-500/60 shadow-neon-violet"
            />
            <span className="absolute -bottom-2 -right-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-[11px] font-black text-white px-2 py-0.5 rounded-full border border-violet-400/40">
              LVL {currentUser.level}
            </span>
          </div>

          <div className="flex-1 space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h1 className="text-2xl font-black text-white">{currentUser.username}</h1>
                <p className="text-xs text-slate-400 font-mono">
                  External Ludo Name:{" "}
                  <span className="text-cyan-400 font-bold">
                    {currentUser.in_game_username || "Not Set"}
                  </span>
                </p>
              </div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                <Shield className="w-3.5 h-3.5" />
                Good Standing (0 Strikes)
              </span>
            </div>

            {/* Level & XP Progress */}
            <div className="space-y-1 pt-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400 flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  XP: {currentUser.xp}
                </span>
                <span className="text-slate-400 font-mono text-[11px]">
                  {Math.round(currentLevelProgress)}% to Level {currentUser.level + 1}
                </span>
              </div>
              <div className="w-full h-2 bg-surface-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-violet-500 to-cyan-400 rounded-full transition-all duration-500"
                  style={{ width: `${currentLevelProgress}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <GlassCard className="p-4 text-center">
          <Trophy className="w-5 h-5 text-amber-400 mx-auto mb-1.5" />
          <span className="text-2xl font-black text-white">{currentUser.wins}</span>
          <p className="text-[11px] uppercase tracking-wider text-slate-400 mt-0.5">Matches Won</p>
        </GlassCard>

        <GlassCard className="p-4 text-center">
          <Flame className="w-5 h-5 text-pink-400 mx-auto mb-1.5" />
          <span className="text-2xl font-black text-white">{winRate}%</span>
          <p className="text-[11px] uppercase tracking-wider text-slate-400 mt-0.5">Win Rate</p>
        </GlassCard>

        <GlassCard className="p-4 text-center">
          <Award className="w-5 h-5 text-cyan-400 mx-auto mb-1.5" />
          <span className="text-2xl font-black text-white">{totalMatches}</span>
          <p className="text-[11px] uppercase tracking-wider text-slate-400 mt-0.5">Total Matches</p>
        </GlassCard>

        <GlassCard className="p-4 text-center">
          <Shield className="w-5 h-5 text-emerald-400 mx-auto mb-1.5" />
          <span className="text-2xl font-black text-emerald-400">0</span>
          <p className="text-[11px] uppercase tracking-wider text-slate-400 mt-0.5">Penalties / Strikes</p>
        </GlassCard>
      </div>

      {/* Edit Profile Form */}
      <GlassCard className="p-6">
        <h2 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
          <User className="w-5 h-5 text-violet-400" />
          Profile Configuration
        </h2>
        <p className="text-xs text-slate-400 mb-6">
          Update your in-game identity. External app room hosts verify this username during matches.
        </p>

        {savedSuccess && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
            <Check className="w-4 h-4" />
            Profile updated successfully!
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              Choose Avatar
            </label>
            <div className="flex flex-wrap gap-3">
              {AVATAR_OPTIONS.map((imgUrl, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setSelectedAvatar(imgUrl)}
                  className={`relative rounded-xl overflow-hidden border-2 transition-transform hover:scale-105 ${
                    selectedAvatar === imgUrl
                      ? "border-cyan-400 shadow-neon-cyan/50 scale-105"
                      : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  <img src={imgUrl} alt={`Avatar ${i}`} className="w-14 h-14 object-cover" />
                  {selectedAvatar === imgUrl && (
                    <div className="absolute inset-0 bg-cyan-500/20 flex items-center justify-center">
                      <Check className="w-5 h-5 text-cyan-300 drop-shadow" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="max-w-md">
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              External Ludo App Username <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              value={inGameName}
              onChange={(e) => setInGameName(e.target.value)}
              placeholder="e.g. Neon_007"
              className="w-full bg-surface-100 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Must match your in-game name in the external app for screenshot victory validation.
            </p>
          </div>

          <Button type="submit" variant="primary">
            <Save className="w-4 h-4 mr-2" />
            Save Profile Changes
          </Button>
        </form>
      </GlassCard>

      {/* Security & Device Session Logs */}
      <GlassCard className="p-6">
        <h3 className="text-base font-bold text-white mb-1 flex items-center gap-2">
          <Smartphone className="w-5 h-5 text-cyan-400" />
          Active Device & Security Logs
        </h3>
        <p className="text-xs text-slate-400 mb-4">
          Duplicate account detection and multi-device session audit.
        </p>
        <div className="divide-y divide-white/5 text-xs text-slate-300">
          <div className="py-2.5 flex items-center justify-between">
            <div>
              <p className="font-semibold text-white">Current Session (Macintosh / Chrome)</p>
              <p className="text-[11px] text-slate-500">IP: 103.212.43.19 • Active Now</p>
            </div>
            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono text-[10px]">
              THIS DEVICE
            </span>
          </div>
          <div className="py-2.5 flex items-center justify-between">
            <div>
              <p className="font-semibold text-slate-300">Mobile App (Android 14)</p>
              <p className="text-[11px] text-slate-500">IP: 103.212.43.25 • 2 days ago</p>
            </div>
            <button
              onClick={() => alert("Session terminated.")}
              className="text-rose-400 hover:underline text-[11px]"
            >
              Log Out
            </button>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
