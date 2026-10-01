import React from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { HeartHandshake, ShieldCheck, AlertCircle } from "lucide-react";

export default function ResponsiblePlayPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-pink-500/20 text-pink-400">
          <HeartHandshake className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-white">Responsible Gaming & Player Welfare</h1>
          <p className="text-xs text-slate-400">18+ strictly enforced. Play for entertainment.</p>
        </div>
      </div>

      <GlassCard className="p-8 space-y-6 text-xs text-slate-300 leading-relaxed">
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-3 text-amber-300">
          <AlertCircle className="w-5 h-5 shrink-0 text-amber-400" />
          <span>
            Online skill gaming should remain entertaining and social. Never play with funds you cannot afford to lose.
          </span>
        </div>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider text-pink-400">
            Player Protection Controls
          </h2>
          <ul className="space-y-2 list-disc list-inside text-slate-300">
            <li><strong>Daily Deposit Caps:</strong> Players can set voluntary daily funding limits in their account settings.</li>
            <li><strong>Self-Exclusion:</strong> You can temporarily freeze your account or self-exclude by contacting support.</li>
            <li><strong>Underage Prohibition:</strong> We strictly bar individuals under 18 years from participating.</li>
            <li><strong>Session Reminders:</strong> Periodic prompts encourage taking breaks during prolonged play sessions.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider text-pink-400">
            Helpline & Assistance
          </h2>
          <p>
            If you or someone you know feels overwhelmed by competitive gaming, free counseling resources are available. Reach out to our welfare team at support@ludoarena.gg for guidance and account timeout assistance.
          </p>
        </section>
      </GlassCard>
    </div>
  );
}
