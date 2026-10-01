"use client";

import React from "react";
import Link from "next/link";
import { useAppStore } from "@/lib/store/useAppStore";
import { formatCurrency, formatTimestamp } from "@/lib/utils";
import { APP_CONFIG } from "@/config/app.config";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import {
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  History,
  ShieldCheck,
  HelpCircle,
  Sparkles,
  Coins,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

export default function WalletPage() {
  const { currentUser, transactions } = useAppStore();

  if (!currentUser) return null;

  const totalCashBalance =
    currentUser.wallet.deposit_balance +
    currentUser.wallet.winnings_balance +
    currentUser.wallet.bonus_balance;

  const isRealMode = APP_CONFIG.features.moneyMode === "real";

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white flex items-center gap-2">
            <Wallet className="w-8 h-8 text-violet-400" />
            My Gaming Wallet
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Double-entry escrow ledger. 100% transparent and verified transactions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/wallet/add">
            <Button variant="primary" size="md" className="shadow-neon-violet">
              <ArrowDownLeft className="w-4 h-4 mr-1.5 text-cyan-300" />
              Add Cash
            </Button>
          </Link>
          <Link href="/wallet/withdraw">
            <Button variant="glass" size="md">
              <ArrowUpRight className="w-4 h-4 mr-1.5 text-pink-400" />
              Withdraw
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Balance Overview Card */}
      <GlassCard className="p-6 md:p-8 bg-gradient-to-r from-violet-950/40 via-surface-100 to-indigo-950/40 border-violet-500/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <span className="text-xs uppercase font-bold tracking-wider text-slate-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              Total Combined Balance
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl sm:text-5xl font-black text-white font-mono tracking-tight">
                {formatCurrency(totalCashBalance)}
              </span>
              <span className="text-xs text-slate-400 uppercase font-semibold">INR</span>
            </div>
            <p className="text-[11px] text-slate-400 pt-1">
              Active mode:{" "}
              <strong className="text-cyan-400 uppercase">
                {APP_CONFIG.features.moneyMode} Mode
              </strong>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link href="/wallet/add">
              <Button variant="secondary" size="sm">
                Instant UPI Deposit
              </Button>
            </Link>
            <Link href="/wallet/withdraw">
              <Button variant="outline" size="sm">
                Request Payout
              </Button>
            </Link>
          </div>
        </div>
      </GlassCard>

      {/* 3 Ledger Buckets Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Deposit Balance */}
        <GlassCard className="p-5 space-y-2 border-cyan-500/20">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-bold text-slate-400">Deposit Balance</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 font-semibold">
              Tournament Entry
            </span>
          </div>
          <p className="text-2xl font-black text-cyan-400 font-mono">
            {formatCurrency(currentUser.wallet.deposit_balance)}
          </p>
          <p className="text-[11px] text-slate-400 leading-snug">
            Added via UPI/Cards. Used directly for entering tournaments. Non-withdrawable.
          </p>
        </GlassCard>

        {/* Winnings Balance */}
        <GlassCard className="p-5 space-y-2 border-emerald-500/20">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-bold text-slate-400">Winnings Balance</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-semibold">
              Withdrawable
            </span>
          </div>
          <p className="text-2xl font-black text-emerald-400 font-mono">
            {formatCurrency(currentUser.wallet.winnings_balance)}
          </p>
          <p className="text-[11px] text-slate-400 leading-snug">
            Prize earnings from matches. Instantly withdrawable to UPI / Bank Account.
          </p>
        </GlassCard>

        {/* Bonus Balance */}
        <GlassCard className="p-5 space-y-2 border-pink-500/20">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-bold text-slate-400">Bonus Balance</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-pink-500/10 text-pink-400 font-semibold">
              Promotional
            </span>
          </div>
          <p className="text-2xl font-black text-pink-400 font-mono">
            {formatCurrency(currentUser.wallet.bonus_balance)}
          </p>
          <p className="text-[11px] text-slate-400 leading-snug">
            Earned from referrals & signups. Automatically covers up to 20% of entry fees.
          </p>
        </GlassCard>
      </div>

      {/* Free Roll Coins Balance Banner */}
      <GlassCard className="p-4 flex items-center justify-between gap-4 bg-amber-950/20 border-amber-500/30">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400">
            <Coins className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-bold text-amber-300 uppercase tracking-wide">
              Virtual Coins: {currentUser.wallet.coins_balance} Coins
            </span>
            <p className="text-[11px] text-slate-400">
              Use coins for daily free roll tournaments and cosmetic player badges.
            </p>
          </div>
        </div>
        <Link href="/tournaments?fee=FREE">
          <Button variant="glass" size="sm" className="text-xs border-amber-500/30 text-amber-300">
            Play Free Rolls
          </Button>
        </Link>
      </GlassCard>

      {/* Recent Ledger Transactions */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <History className="w-5 h-5 text-violet-400" />
            Recent Wallet Ledger Entries
          </h2>
          <Link href="/transactions">
            <Button variant="ghost" size="sm" className="text-xs text-cyan-400 hover:text-cyan-300">
              View All & Export CSV
            </Button>
          </Link>
        </div>

        <div className="overflow-x-auto rounded-xl border border-white/10 bg-surface-100/50 backdrop-blur-md">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-surface-200/50 font-bold uppercase text-[10px] text-slate-400 border-b border-white/10">
              <tr>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Description</th>
                <th className="px-4 py-3">Bucket</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {transactions.slice(0, 5).map((tx) => (
                <tr key={tx.id} className="hover:bg-white/[0.02]">
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                        tx.type === "PRIZE" || tx.type === "DEPOSIT" || tx.type === "REFUND"
                          ? "bg-emerald-500/15 text-emerald-400"
                          : "bg-rose-500/15 text-rose-400"
                      }`}
                    >
                      {tx.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-medium text-white max-w-xs truncate">
                    {tx.description}
                  </td>
                  <td className="px-4 py-3 uppercase text-[10px] font-mono text-slate-400">
                    {tx.balance_bucket}
                  </td>
                  <td className="px-4 py-3 text-slate-400 whitespace-nowrap font-mono text-[11px]">
                    {formatTimestamp(tx.created_at)}
                  </td>
                  <td className="px-4 py-3 text-right font-mono font-bold whitespace-nowrap">
                    <span className={tx.amount > 0 ? "text-emerald-400" : "text-rose-400"}>
                      {tx.amount > 0 ? `+₹${tx.amount}` : `-₹${Math.abs(tx.amount)}`}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
