"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store/useAppStore";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { APP_CONFIG } from "@/config/app.config";
import { formatCurrency } from "@/lib/utils";
import {
  ArrowLeft,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Building,
  Smartphone,
  AlertCircle,
} from "lucide-react";

export default function WithdrawPage() {
  const router = useRouter();
  const { currentUser, requestWithdrawal, kycDocuments } = useAppStore();

  const [amount, setAmount] = useState<number>(500);
  const [methodType, setMethodType] = useState<"UPI" | "BANK">("UPI");
  const [upiId, setUpiId] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const [holderName, setHolderName] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  if (!currentUser) return null;

  const withdrawableAmount = currentUser.wallet.winnings_balance;
  const isKycVerified = kycDocuments.some(
    (k) => k.user_id === currentUser.id && k.status === "VERIFIED"
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (APP_CONFIG.features.requireKycForWithdrawal && !isKycVerified) {
      setErrorMsg("KYC verification is mandatory before requesting withdrawals. Please submit your PAN card.");
      return;
    }

    if (amount < APP_CONFIG.features.minWithdrawal) {
      setErrorMsg(`Minimum withdrawal limit is ₹${APP_CONFIG.features.minWithdrawal}`);
      return;
    }
    if (amount > APP_CONFIG.features.maxWithdrawal) {
      setErrorMsg(`Maximum withdrawal limit is ₹${APP_CONFIG.features.maxWithdrawal}`);
      return;
    }
    if (amount > withdrawableAmount) {
      setErrorMsg("Requested amount exceeds your available Withdrawable Winnings Balance.");
      return;
    }

    const destination = methodType === "UPI" ? upiId : `${accountNumber} (${ifscCode})`;
    if (!destination) {
      setErrorMsg("Please provide valid payout destination details.");
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      const res = requestWithdrawal(amount, destination);
      setIsProcessing(false);
      if (res.success) {
        setShowSuccessModal(true);
      } else {
        setErrorMsg(res.error || "Failed to submit withdrawal");
      }
    }, 700);
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-8 space-y-6">
      <Link
        href="/wallet"
        className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Wallet
      </Link>

      <div className="space-y-1">
        <h1 className="text-2xl font-black text-white flex items-center gap-2">
          <ArrowUpRight className="w-6 h-6 text-pink-400" />
          Withdraw Match Winnings
        </h1>
        <p className="text-xs text-slate-400">
          Instant payouts to your verified UPI ID or Bank account.
        </p>
      </div>

      {/* KYC Warning Banner if not verified */}
      {APP_CONFIG.features.requireKycForWithdrawal && !isKycVerified && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3 text-xs text-amber-200">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold text-white">KYC Verification Required</p>
            <p className="text-slate-300">
              Government regulations require identity verification before cash payouts can be processed.
            </p>
            <Link
              href="/kyc"
              className="inline-block mt-1 font-semibold text-cyan-400 hover:underline"
            >
              Complete 2-Minute KYC →
            </Link>
          </div>
        </div>
      )}

      {/* Withdrawable balance overview */}
      <GlassCard className="p-4 flex items-center justify-between border-emerald-500/30 bg-emerald-950/20">
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-400">
            Available Withdrawable Balance
          </span>
          <p className="text-2xl font-black text-emerald-400 font-mono">
            {formatCurrency(withdrawableAmount)}
          </p>
        </div>
        <span className="text-xs text-slate-400 text-right">
          Min: ₹{APP_CONFIG.features.minWithdrawal} <br />
          Max: ₹{APP_CONFIG.features.maxWithdrawal}
        </span>
      </GlassCard>

      <GlassCard className="p-6">
        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Amount input */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Withdrawal Amount (₹)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-lg font-bold text-slate-400 font-mono">
                ₹
              </span>
              <input
                type="number"
                required
                min={APP_CONFIG.features.minWithdrawal}
                max={withdrawableAmount}
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full bg-surface-100 border border-white/10 rounded-xl pl-8 pr-16 py-2.5 text-base font-bold text-white focus:outline-none focus:border-violet-500 font-mono"
              />
              <button
                type="button"
                onClick={() => setAmount(withdrawableAmount)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold uppercase text-cyan-400 px-2 py-1 rounded bg-cyan-500/10 hover:bg-cyan-500/20"
              >
                Max
              </button>
            </div>
          </div>

          {/* Method tabs */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              Payout Destination
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs mb-3">
              <button
                type="button"
                onClick={() => setMethodType("UPI")}
                className={`p-2.5 rounded-xl border flex items-center justify-center gap-2 font-medium transition-all ${
                  methodType === "UPI"
                    ? "border-violet-500 bg-violet-600/20 text-white shadow-neon-violet/30"
                    : "border-white/5 bg-surface-200 text-slate-400 hover:text-white"
                }`}
              >
                <Smartphone className="w-4 h-4 text-cyan-400" />
                UPI ID (Instant)
              </button>
              <button
                type="button"
                onClick={() => setMethodType("BANK")}
                className={`p-2.5 rounded-xl border flex items-center justify-center gap-2 font-medium transition-all ${
                  methodType === "BANK"
                    ? "border-violet-500 bg-violet-600/20 text-white shadow-neon-violet/30"
                    : "border-white/5 bg-surface-200 text-slate-400 hover:text-white"
                }`}
              >
                <Building className="w-4 h-4 text-pink-400" />
                Bank IMPS
              </button>
            </div>

            {methodType === "UPI" ? (
              <div>
                <input
                  type="text"
                  required
                  placeholder="yourname@okaxis or yourphone@upi"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  className="w-full bg-surface-100 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 font-mono"
                />
              </div>
            ) : (
              <div className="space-y-3">
                <input
                  type="text"
                  required
                  placeholder="Account Holder Full Name"
                  value={holderName}
                  onChange={(e) => setHolderName(e.target.value)}
                  className="w-full bg-surface-100 border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-violet-500"
                />
                <input
                  type="text"
                  required
                  placeholder="Bank Account Number"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  className="w-full bg-surface-100 border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-violet-500 font-mono"
                />
                <input
                  type="text"
                  required
                  placeholder="IFSC Code (e.g. SBIN0001234)"
                  value={ifscCode}
                  onChange={(e) => setIfscCode(e.target.value.toUpperCase())}
                  className="w-full bg-surface-100 border border-white/10 rounded-xl px-4 py-2 text-xs text-white uppercase focus:outline-none focus:border-violet-500 font-mono"
                />
              </div>
            )}
          </div>

          <Button
            type="submit"
            variant="accent"
            className="w-full text-sm font-bold shadow-neon-pink"
            isLoading={isProcessing}
            disabled={withdrawableAmount < APP_CONFIG.features.minWithdrawal}
          >
            Request Withdrawal of ₹{amount}
          </Button>

          <p className="text-[11px] text-slate-500 text-center">
            Withdrawal requests are reviewed and approved within 15–30 minutes by our finance desk.
          </p>
        </form>
      </GlassCard>

      {/* Success Modal */}
      <Modal
        isOpen={showSuccessModal}
        onClose={() => {
          setShowSuccessModal(false);
          router.push("/wallet");
        }}
        title="Withdrawal Submitted"
      >
        <div className="text-center py-4 space-y-3">
          <div className="inline-flex p-3 rounded-full bg-pink-500/10 text-pink-400 border border-pink-500/20">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h3 className="text-xl font-black text-white">Request Queued!</h3>
          <p className="text-xs text-slate-300">
            Your withdrawal of <strong className="text-white">₹{amount}</strong> has been submitted. The amount is held safely in escrow and will be credited to your destination upon admin approval.
          </p>
          <Button
            variant="primary"
            className="w-full text-xs mt-4"
            onClick={() => router.push("/wallet")}
          >
            Back to Wallet
          </Button>
        </div>
      </Modal>
    </div>
  );
}
