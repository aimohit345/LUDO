import React from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { RefreshCw } from "lucide-react";

export default function RefundPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-pink-500/20 text-pink-400">
          <RefreshCw className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-white">Refund & Cancellation Policy</h1>
          <p className="text-xs text-slate-400">100% automated player protection guarantees.</p>
        </div>
      </div>

      <GlassCard className="p-8 space-y-6 text-xs text-slate-300 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider text-pink-400">
            1. Player Voluntary Cancellation
          </h2>
          <p>
            You may cancel your tournament registration at any time before the registration window closes. The full entry fee is instantly refunded to your original balance bucket via an automated ledger reversal.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider text-pink-400">
            2. Minimum Players Not Reached
          </h2>
          <p>
            If a tournament does not fulfill its required minimum player capacity by the scheduled start time, the tournament is automatically cancelled by our cron worker, and 100% of all participants&apos; entry fees are credited back to their wallets immediately.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider text-pink-400">
            3. Opponent Disconnections & No-Shows
          </h2>
          <p>
            If an opponent fails to join the room code within 5 minutes of kickoff, or abandons the match, report the dispute with a screenshot. Once verified by an admin, the innocent player will receive the default win prize or full refund.
          </p>
        </section>
      </GlassCard>
    </div>
  );
}
