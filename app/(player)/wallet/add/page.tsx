"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store/useAppStore";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { APP_CONFIG } from "@/config/app.config";
import {
  ArrowLeft,
  CreditCard,
  QrCode,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from "lucide-react";

const PRESET_AMOUNTS = [50, 100, 250, 500, 1000, 2500];

export default function AddMoneyPage() {
  const router = useRouter();
  const { currentUser, addDeposit } = useAppStore();

  const [amount, setAmount] = useState<number>(100);
  const [customInput, setCustomInput] = useState<string>("100");
  const [selectedProvider, setSelectedProvider] = useState<"mock" | "razorpay" | "paytm">("mock");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  if (!currentUser) return null;

  const handleSelectPreset = (val: number) => {
    setAmount(val);
    setCustomInput(String(val));
    setErrorMsg("");
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "");
    setCustomInput(raw);
    const parsed = Number(raw);
    setAmount(parsed);
    setErrorMsg("");
  };

  const handleInitiatePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (amount < APP_CONFIG.features.minDeposit) {
      setErrorMsg(`Minimum deposit amount is ₹${APP_CONFIG.features.minDeposit}`);
      return;
    }
    if (amount > APP_CONFIG.features.maxDeposit) {
      setErrorMsg(`Maximum deposit amount is ₹${APP_CONFIG.features.maxDeposit}`);
      return;
    }

    setIsProcessing(true);

    try {
      // 1. Call server order route
      const res = await fetch("/api/payments/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount,
          userId: currentUser.id,
          provider: selectedProvider,
        }),
      });

      const orderData = await res.json();
      if (!res.ok) {
        throw new Error(orderData.error || "Order creation failed");
      }

      // 2. In Mock/Demo mode, simulate instant successful payment
      setTimeout(() => {
        addDeposit(amount, selectedProvider.toUpperCase());
        setIsProcessing(false);
        setShowSuccessModal(true);
      }, 800);
    } catch (err: any) {
      setIsProcessing(false);
      setErrorMsg(err.message || "Failed to process payment");
    }
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
          <CreditCard className="w-6 h-6 text-cyan-400" />
          Add Cash to Deposit Balance
        </h1>
        <p className="text-xs text-slate-400">
          Funds are credited instantly for joining tournaments. 100% secure gateway.
        </p>
      </div>

      <GlassCard className="p-6">
        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleInitiatePayment} className="space-y-6">
          {/* Amount presets */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              Select Preset Amount
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {PRESET_AMOUNTS.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => handleSelectPreset(preset)}
                  className={`py-2.5 rounded-xl text-sm font-bold font-mono transition-all ${
                    amount === preset
                      ? "bg-violet-600 text-white shadow-neon-violet border border-violet-400/40 scale-[1.02]"
                      : "bg-surface-200 text-slate-300 hover:bg-surface-300 border border-white/5"
                  }`}
                >
                  ₹{preset}
                </button>
              ))}
            </div>
          </div>

          {/* Custom amount */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Or Enter Custom Amount (₹{APP_CONFIG.features.minDeposit} - ₹{APP_CONFIG.features.maxDeposit})
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-lg font-bold text-slate-400 font-mono">
                ₹
              </span>
              <input
                type="text"
                required
                value={customInput}
                onChange={handleCustomChange}
                placeholder="100"
                className="w-full bg-surface-100 border border-white/10 rounded-xl pl-8 pr-4 py-2.5 text-base font-bold text-white focus:outline-none focus:border-violet-500 font-mono"
              />
            </div>
          </div>

          {/* Gateway selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              Payment Gateway
            </label>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <button
                type="button"
                onClick={() => setSelectedProvider("mock")}
                className={`p-2.5 rounded-xl border text-center font-medium transition-all ${
                  selectedProvider === "mock"
                    ? "border-cyan-400 bg-cyan-500/10 text-cyan-300"
                    : "border-white/5 bg-surface-200 text-slate-400 hover:text-white"
                }`}
              >
                Instant Sandbox
              </button>
              <button
                type="button"
                onClick={() => setSelectedProvider("razorpay")}
                className={`p-2.5 rounded-xl border text-center font-medium transition-all ${
                  selectedProvider === "razorpay"
                    ? "border-violet-500 bg-violet-600/20 text-white"
                    : "border-white/5 bg-surface-200 text-slate-400 hover:text-white"
                }`}
              >
                Razorpay UPI
              </button>
              <button
                type="button"
                onClick={() => setSelectedProvider("paytm")}
                className={`p-2.5 rounded-xl border text-center font-medium transition-all ${
                  selectedProvider === "paytm"
                    ? "border-violet-500 bg-violet-600/20 text-white"
                    : "border-white/5 bg-surface-200 text-slate-400 hover:text-white"
                }`}
              >
                Paytm Wallet
              </button>
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            className="w-full text-sm font-bold shadow-neon-violet"
            isLoading={isProcessing}
          >
            Pay ₹{amount || 0} via UPI / Cards
          </Button>

          <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500 pt-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>256-Bit SSL Encrypted • Zero Extra Gateway Surcharge</span>
          </div>
        </form>
      </GlassCard>

      {/* Success Modal */}
      <Modal
        isOpen={showSuccessModal}
        onClose={() => {
          setShowSuccessModal(false);
          router.push("/wallet");
        }}
        title="Deposit Completed"
      >
        <div className="text-center py-4 space-y-3">
          <div className="inline-flex p-3 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h3 className="text-xl font-black text-white">₹{amount} Credited!</h3>
          <p className="text-xs text-slate-300">
            Your payment was verified. Your deposit balance has been updated and is ready to enter tournaments.
          </p>
          <Button
            variant="primary"
            className="w-full text-xs mt-4"
            onClick={() => router.push("/tournaments")}
          >
            Browse Tournaments
          </Button>
        </div>
      </Modal>
    </div>
  );
}
