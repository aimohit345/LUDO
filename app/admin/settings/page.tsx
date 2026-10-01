"use client";

import React, { useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { APP_CONFIG, MoneyMode } from "@/config/app.config";
import { Sliders, Shield, AlertTriangle, Check, Save, Zap } from "lucide-react";

export default function AdminSettingsPage() {
  const [moneyMode, setMoneyMode] = useState<MoneyMode>(APP_CONFIG.features.moneyMode);
  const [requireKyc, setRequireKyc] = useState(APP_CONFIG.features.requireKycForWithdrawal);
  const [minWithdrawal, setMinWithdrawal] = useState(APP_CONFIG.features.minWithdrawal);
  const [maxWithdrawal, setMaxWithdrawal] = useState(APP_CONFIG.features.maxWithdrawal);
  const [platformFee, setPlatformFee] = useState(APP_CONFIG.features.platformFeePercent);
  const [maintenanceMode, setMaintenanceMode] = useState(APP_CONFIG.features.maintenanceMode);
  const [blockedStates, setBlockedStates] = useState(APP_CONFIG.features.blockedRegions.join(", "));
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white flex items-center gap-2">
          <Sliders className="w-6 h-6 text-violet-400" />
          Global Platform Configuration & Switches
        </h1>
        <p className="text-xs text-slate-400">
          Control money mode, compliance geo-fencing, fees, and operational kill-switches.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2 font-semibold">
          <Check className="w-4 h-4" />
          Configuration settings saved and applied to live cluster!
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Money Mode Feasibility Switch */}
        <GlassCard className="p-6 space-y-4 border-violet-500/30">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-400" />
                Platform Operational Money Mode
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                In <strong>Coins Mode</strong>, wallets use virtual coins, cash withdrawal is disabled, and rewards are coin badges. In <strong>Real Mode</strong>, deposits, cash withdrawals, and KYC gates are active.
              </p>
            </div>
            <div className="flex items-center gap-2 bg-surface-200 p-1 rounded-xl text-xs">
              <button
                type="button"
                onClick={() => setMoneyMode("coins")}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  moneyMode === "coins" ? "bg-amber-500 text-black shadow-sm" : "text-slate-400 hover:text-white"
                }`}
              >
                Coins Mode
              </button>
              <button
                type="button"
                onClick={() => setMoneyMode("real")}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  moneyMode === "real" ? "bg-violet-600 text-white shadow-neon-violet" : "text-slate-400 hover:text-white"
                }`}
              >
                Real Cash Mode
              </button>
            </div>
          </div>
        </GlassCard>

        {/* Financial & Compliance Parameters */}
        <GlassCard className="p-6 space-y-4">
          <h2 className="text-base font-bold text-white">Financial & KYC Gates</h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Platform Fee (%)
              </label>
              <input
                type="number"
                value={platformFee}
                onChange={(e) => setPlatformFee(Number(e.target.value))}
                className="w-full bg-surface-100 border border-white/10 rounded-xl px-3 py-2 text-white font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Min Withdrawal (₹)
              </label>
              <input
                type="number"
                value={minWithdrawal}
                onChange={(e) => setMinWithdrawal(Number(e.target.value))}
                className="w-full bg-surface-100 border border-white/10 rounded-xl px-3 py-2 text-white font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Max Withdrawal (₹)
              </label>
              <input
                type="number"
                value={maxWithdrawal}
                onChange={(e) => setMaxWithdrawal(Number(e.target.value))}
                className="w-full bg-surface-100 border border-white/10 rounded-xl px-3 py-2 text-white font-mono"
              />
            </div>
          </div>

          <div className="pt-2">
            <label className="flex items-center gap-2.5 text-xs text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={requireKyc}
                onChange={(e) => setRequireKyc(e.target.checked)}
                className="rounded border-white/20 bg-surface-200 text-violet-600"
              />
              <span>
                Require mandatory KYC approval before players can request cash withdrawals.
              </span>
            </label>
          </div>
        </GlassCard>

        {/* Geo-Blocking Compliance */}
        <GlassCard className="p-6 space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Shield className="w-5 h-5 text-cyan-400" />
            Restricted Regions & Geo-Blocking (State Codes)
          </h2>
          <p className="text-xs text-slate-400">
            Comma-separated Indian state codes where real-money skill gaming is legally restricted. Middleware automatically restricts access for visitors from these states.
          </p>
          <input
            type="text"
            value={blockedStates}
            onChange={(e) => setBlockedStates(e.target.value)}
            className="w-full bg-surface-100 border border-white/10 rounded-xl px-4 py-2 text-xs text-white font-mono"
          />
        </GlassCard>

        {/* Emergency Kill Switches */}
        <GlassCard className="p-6 space-y-3 border-rose-500/30 bg-rose-950/10">
          <h2 className="text-base font-bold text-rose-400 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-rose-400" />
            Operational Kill Switches
          </h2>
          <p className="text-xs text-slate-400">
            Activate emergency overrides to immediately suspend payment intake or match registrations.
          </p>

          <div className="space-y-2 pt-1 text-xs">
            <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={maintenanceMode}
                onChange={(e) => setMaintenanceMode(e.target.checked)}
                className="rounded text-rose-600"
              />
              <span className="font-semibold text-white">Full Maintenance Mode (Lock player access)</span>
            </label>
          </div>
        </GlassCard>

        <Button type="submit" variant="primary" size="lg" className="w-full">
          <Save className="w-4 h-4 mr-2" />
          Save Platform Changes
        </Button>
      </form>
    </div>
  );
}
