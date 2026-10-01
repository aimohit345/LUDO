"use client";

import React, { useState } from "react";
import { useAppStore } from "@/lib/store/useAppStore";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { APP_CONFIG } from "@/config/app.config";
import { formatCurrency } from "@/lib/utils";
import {
  Share2,
  Gift,
  Copy,
  Check,
  Users,
  Trophy,
  Coins,
  QrCode,
  Send,
  MessageCircle,
} from "lucide-react";

export default function ReferralsPage() {
  const { currentUser } = useAppStore();
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);

  if (!currentUser) return null;

  const referralCode = currentUser.referral_code || "ARENA7788";
  const shareUrl = typeof window !== "undefined"
    ? `${window.location.origin}/signup?ref=${referralCode}`
    : `https://ludoarena.gg/signup?ref=${referralCode}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(referralCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const shareText = encodeURIComponent(
    `Join ${APP_CONFIG.brand.name} with my invite code ${referralCode} and claim ₹${APP_CONFIG.features.referralBonusReferee} welcome bonus + 100 free coins: ${shareUrl}`
  );

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header Banner */}
      <GlassCard className="p-6 md:p-8 bg-gradient-to-r from-violet-950/50 via-surface-100 to-indigo-950/50 border-violet-500/30">
        <div className="max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
            <Gift className="w-3.5 h-3.5" />
            Refer & Earn Program
          </div>
          <h1 className="text-3xl font-black text-white">
            Earn ₹{APP_CONFIG.features.referralBonusReferrer} for Every Gamer You Invite
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Share your unique invite link. Your friend receives ₹{APP_CONFIG.features.referralBonusReferee} welcome bonus, and you get ₹{APP_CONFIG.features.referralBonusReferrer} credited straight to your bonus wallet when they complete their first match!
          </p>
        </div>
      </GlassCard>

      {/* Share Box & Referral Code */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <GlassCard className="p-6 space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Share2 className="w-5 h-5 text-cyan-400" />
            Your Referral Code & Link
          </h2>

          <div className="p-3.5 rounded-xl bg-surface-200/80 border border-white/10 flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400">Referral Code</p>
              <p className="text-2xl font-black text-white font-mono tracking-wider">
                {referralCode}
              </p>
            </div>
            <Button variant="secondary" size="sm" onClick={handleCopyCode} className="text-xs">
              {copiedCode ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              {copiedCode ? "Copied" : "Copy"}
            </Button>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="flex-1 bg-surface-100 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-300 font-mono focus:outline-none"
            />
            <Button variant="primary" size="sm" onClick={handleCopyLink} className="text-xs">
              {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </Button>
          </div>

          {/* Social Share Buttons */}
          <div className="flex flex-wrap gap-2 pt-2">
            <a
              href={`https://wa.me/?text=${shareText}`}
              target="_blank"
              rel="noreferrer"
              className="flex-1"
            >
              <Button
                variant="glass"
                size="sm"
                className="w-full text-xs text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/10 justify-center"
              >
                <MessageCircle className="w-4 h-4 mr-1.5" />
                WhatsApp
              </Button>
            </a>
            <a
              href={`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${shareText}`}
              target="_blank"
              rel="noreferrer"
              className="flex-1"
            >
              <Button
                variant="glass"
                size="sm"
                className="w-full text-xs text-cyan-400 border-cyan-500/30 hover:bg-cyan-500/10 justify-center"
              >
                <Send className="w-4 h-4 mr-1.5" />
                Telegram
              </Button>
            </a>
            <Button
              variant="glass"
              size="sm"
              onClick={() => setIsQrModalOpen(true)}
              className="text-xs text-slate-300 justify-center"
            >
              <QrCode className="w-4 h-4 mr-1" />
              QR Code
            </Button>
          </div>
        </GlassCard>

        {/* Stats Summary */}
        <div className="grid grid-cols-2 gap-4">
          <GlassCard className="p-5 flex flex-col justify-center text-center">
            <Users className="w-6 h-6 text-violet-400 mx-auto mb-2" />
            <span className="text-3xl font-black text-white font-mono">8</span>
            <p className="text-[11px] uppercase font-bold text-slate-400 mt-1">Friends Invited</p>
          </GlassCard>

          <GlassCard className="p-5 flex flex-col justify-center text-center">
            <Trophy className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
            <span className="text-3xl font-black text-cyan-400 font-mono">6</span>
            <p className="text-[11px] uppercase font-bold text-slate-400 mt-1">Qualified Matches</p>
          </GlassCard>

          <GlassCard className="p-5 col-span-2 flex flex-col justify-center text-center bg-violet-950/20 border-violet-500/30">
            <Coins className="w-6 h-6 text-amber-400 mx-auto mb-1" />
            <span className="text-3xl font-black text-amber-400 font-mono">₹150</span>
            <p className="text-[11px] uppercase font-bold text-slate-300 mt-1">
              Total Referral Bonus Credited
            </p>
          </GlassCard>
        </div>
      </div>

      {/* Referral History Table */}
      <GlassCard className="p-6">
        <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
          <Users className="w-5 h-5 text-violet-400" />
          Invited Friends & Reward Status
        </h3>

        <div className="overflow-x-auto rounded-xl border border-white/10">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-surface-200/50 font-bold uppercase text-[10px] text-slate-400 border-b border-white/10">
              <tr>
                <th className="px-4 py-3">Friend</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Qualifying Action</th>
                <th className="px-4 py-3 text-right">Bonus Credited</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-normal">
              {[
                { name: "Rohit_99", status: "QUALIFIED", action: "Played Neon Clash 1v1", bonus: "₹25" },
                { name: "Sneha_Ludo", status: "QUALIFIED", action: "First deposit of ₹100", bonus: "₹25" },
                { name: "ApexGamer", status: "QUALIFIED", action: "Played Speed Duel", bonus: "₹25" },
                { name: "Vikram_X", status: "PENDING", action: "Registered, match pending", bonus: "₹0" },
                { name: "Pooja_22", status: "PENDING", action: "Registered, match pending", bonus: "₹0" },
              ].map((ref, idx) => (
                <tr key={idx} className="hover:bg-white/[0.02]">
                  <td className="px-4 py-3 font-semibold text-white">{ref.name}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        ref.status === "QUALIFIED"
                          ? "bg-emerald-500/15 text-emerald-400"
                          : "bg-amber-500/15 text-amber-400"
                      }`}
                    >
                      {ref.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-400">{ref.action}</td>
                  <td className="px-4 py-3 text-right font-mono font-bold text-amber-400">
                    {ref.bonus}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* QR Code Modal */}
      <Modal
        isOpen={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
        title="Scan to Register"
        description="Point phone camera at QR code to open registration with your referral code."
      >
        <div className="flex flex-col items-center justify-center p-6 space-y-4">
          <div className="p-4 rounded-2xl bg-white text-black shadow-2xl flex items-center justify-center">
            <QrCode className="w-44 h-44 text-slate-900" />
          </div>
          <p className="text-xs font-mono text-cyan-400 font-bold tracking-widest">{referralCode}</p>
          <Button variant="outline" size="sm" onClick={() => setIsQrModalOpen(false)}>
            Close
          </Button>
        </div>
      </Modal>
    </div>
  );
}
