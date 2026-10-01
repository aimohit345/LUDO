import React from "react";
import Link from "next/link";
import { APP_CONFIG } from "@/config/app.config";
import { ShieldCheck, HeartHandshake, FileText, Lock, RefreshCw, Sparkles } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-surface-100/40 backdrop-blur-md pt-12 pb-24 md:pb-12 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand info */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-cyan-500 p-0.5">
                <div className="w-full h-full bg-surface-100 rounded-[6px] flex items-center justify-center font-bold text-white text-sm">
                  LA
                </div>
              </div>
              <span className="font-extrabold text-base text-white tracking-wider">
                {APP_CONFIG.brand.name}
              </span>
            </div>
            <p className="text-slate-400 leading-relaxed text-xs">
              {APP_CONFIG.brand.description} Join daily tournaments, roll with players nationwide, and win verified prizes.
            </p>
            <div className="flex items-center gap-2 text-violet-400 font-semibold pt-1">
              <Sparkles className="w-4 h-4" />
              <span>100% Skill-Based Gaming</span>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-bold text-white uppercase tracking-wider text-xs mb-3">Tournaments</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/tournaments" className="hover:text-white transition-colors">
                  All Tournaments
                </Link>
              </li>
              <li>
                <Link href="/tournaments?status=LIVE" className="hover:text-white transition-colors">
                  Live Matches
                </Link>
              </li>
              <li>
                <Link href="/tournaments?fee=FREE" className="hover:text-white transition-colors">
                  Free Tournaments
                </Link>
              </li>
              <li>
                <Link href="/leaderboard" className="hover:text-white transition-colors">
                  Top Earners Leaderboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Support & Community */}
          <div>
            <h4 className="font-bold text-white uppercase tracking-wider text-xs mb-3">Help & Trust</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/how-it-works" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/support" className="hover:text-white transition-colors">
                  24/7 Support Desk
                </Link>
              </li>
              <li>
                <Link href="/referrals" className="hover:text-white transition-colors">
                  Referral Program
                </Link>
              </li>
              <li>
                <a href={APP_CONFIG.brand.socials.telegram} target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
                  Telegram Community
                </a>
              </li>
            </ul>
          </div>

          {/* Legal & Compliance */}
          <div>
            <h4 className="font-bold text-white uppercase tracking-wider text-xs mb-3">Compliance & Policies</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/terms" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5" />
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5" />
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/refund-policy" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <RefreshCw className="w-3.5 h-3.5" />
                  Refund & Cancellation Policy
                </Link>
              </li>
              <li>
                <Link href="/responsible-play" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <HeartHandshake className="w-3.5 h-3.5 text-pink-400" />
                  Responsible Gaming (18+)
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Regulatory disclaimer */}
        <div className="border-t border-white/10 pt-6 mt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
          <p>
            © {new Date().getFullYear()} {APP_CONFIG.brand.name}. All rights reserved. Games of skill are legally recognized under Indian law.
            Not affiliated with any proprietary game application or trademark.
          </p>
          <div className="flex items-center gap-3">
            <span className="px-2 py-0.5 rounded border border-white/10 bg-white/5 font-semibold text-slate-400">
              18+ ONLY
            </span>
            <span className="px-2 py-0.5 rounded border border-white/10 bg-white/5 font-semibold text-emerald-400">
              SSL SECURED
            </span>
            <span className="px-2 py-0.5 rounded border border-white/10 bg-white/5 font-semibold text-cyan-400">
              RNG FAIR PLAY
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
