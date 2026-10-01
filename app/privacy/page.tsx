import React from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { APP_CONFIG } from "@/config/app.config";
import { Lock } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400">
          <Lock className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-white">Privacy & Data Protection Policy</h1>
          <p className="text-xs text-slate-400">Commitment to player privacy and zero data leakage.</p>
        </div>
      </div>

      <GlassCard className="p-8 space-y-6 text-xs text-slate-300 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider text-cyan-400">
            Information We Collect
          </h2>
          <p>
            We collect your username, email, phone number, in-game name, and KYC documentation (where required by financial law). We strip all EXIF metadata (including geolocation and device camera serials) from uploaded match screenshots before processing.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider text-cyan-400">
            Payment & Gateway Data Security
          </h2>
          <p>
            We never store credit/debit card numbers or bank account passwords on our servers. All transactions are securely processed through RBI-licensed payment aggregators (Razorpay / Paytm) over TLS 1.3 encrypted channels.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider text-cyan-400">
            Data Rights & Deletion
          </h2>
          <p>
            You have the right to request deletion of your account and personal identifiers by contacting {APP_CONFIG.brand.supportEmail}, subject to statutory financial transaction record-keeping requirements.
          </p>
        </section>
      </GlassCard>
    </div>
  );
}
