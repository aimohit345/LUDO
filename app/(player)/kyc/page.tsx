"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAppStore } from "@/lib/store/useAppStore";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import {
  ShieldCheck,
  ArrowLeft,
  FileText,
  Upload,
  CheckCircle2,
  AlertCircle,
  Lock,
} from "lucide-react";

export default function PlayerKycPage() {
  const { currentUser, kycDocuments, submitKyc } = useAppStore();

  const [idType, setIdType] = useState<"PAN" | "AADHAAR" | "BANK_PROOF">("PAN");
  const [docNum, setDocNum] = useState("");
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  if (!currentUser) return null;

  const existingDoc = kycDocuments.find((k) => k.user_id === currentUser.id);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setFileUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docNum) {
      setErrorMsg("Please provide your document number.");
      return;
    }
    const samplePhoto =
      fileUrl ||
      "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600";

    submitKyc(idType, docNum, samplePhoto);
    setSubmitted(true);
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-8 space-y-6">
      <Link
        href="/profile"
        className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Profile
      </Link>

      <div className="space-y-1">
        <h1 className="text-2xl font-black text-white flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-emerald-400" />
          KYC Identity Verification
        </h1>
        <p className="text-xs text-slate-400">
          Required for cash tournament withdrawals under government AML policies.
        </p>
      </div>

      {existingDoc ? (
        <GlassCard className="p-6 text-center space-y-3">
          <div
            className={`w-12 h-12 rounded-full mx-auto flex items-center justify-center ${
              existingDoc.status === "VERIFIED"
                ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                : "bg-amber-500/15 text-amber-400 border border-amber-500/30 animate-pulse"
            }`}
          >
            <CheckCircle2 className="w-6 h-6" />
          </div>

          <h3 className="text-lg font-bold text-white">
            {existingDoc.status === "VERIFIED"
              ? "KYC Verified Successfully"
              : "KYC Under Verification"}
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            {existingDoc.status === "VERIFIED"
              ? `Your ${existingDoc.id_type} (${existingDoc.document_number}) has been approved. You have full access to cash withdrawals.`
              : "Our compliance team is verifying your uploaded document. Review takes 15–30 minutes."}
          </p>

          <div className="pt-2">
            <span
              className={`inline-block px-3 py-1 rounded-full text-xs font-bold font-mono ${
                existingDoc.status === "VERIFIED"
                  ? "bg-emerald-500/20 text-emerald-300"
                  : "bg-amber-500/20 text-amber-300"
              }`}
            >
              STATUS: {existingDoc.status}
            </span>
          </div>
        </GlassCard>
      ) : (
        <GlassCard className="p-6">
          {submitted ? (
            <div className="text-center py-6 space-y-3">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
              <h3 className="text-lg font-bold text-white">Documents Received</h3>
              <p className="text-xs text-slate-300">
                Your KYC submission is under review by the finance desk. You will receive an in-app notification once verified.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
                  {errorMsg}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Document Type
                </label>
                <select
                  value={idType}
                  onChange={(e) => setIdType(e.target.value as any)}
                  className="w-full bg-surface-100 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-semibold"
                >
                  <option value="PAN">PAN Card (Permanent Account Number)</option>
                  <option value="AADHAAR">Aadhaar (Last 4 Digits & Masked Front)</option>
                  <option value="BANK_PROOF">Bank Passbook / Cancelled Cheque</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Document ID Number
                </label>
                <input
                  type="text"
                  required
                  placeholder={idType === "PAN" ? "ABCDE1234F" : "XXXX-XXXX-1234"}
                  value={docNum}
                  onChange={(e) => setDocNum(e.target.value.toUpperCase())}
                  className="w-full bg-surface-100 border border-white/10 rounded-xl px-4 py-2 text-sm text-white font-mono uppercase focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Upload Photo of Document Front
                </label>
                <label className="flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-dashed border-white/15 hover:border-emerald-500/50 bg-surface-100/50 cursor-pointer transition-colors">
                  <Upload className="w-6 h-6 text-slate-400 mb-1" />
                  <span className="text-xs font-semibold text-white">Select image from device</span>
                  <span className="text-[10px] text-slate-500 mt-0.5">JPG or PNG up to 5MB</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFile}
                    className="hidden"
                  />
                </label>
              </div>

              {fileUrl && (
                <div className="rounded-xl overflow-hidden border border-white/10 p-1 bg-surface-100">
                  <img
                    src={fileUrl}
                    alt="Preview"
                    className="w-full h-36 object-cover rounded-lg"
                  />
                </div>
              )}

              <Button type="submit" variant="primary" className="w-full text-xs font-bold">
                Submit KYC for Verification
              </Button>

              <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-500 pt-1">
                <Lock className="w-3 h-3 text-emerald-400" />
                <span>Encrypted at rest with strict compliance isolation</span>
              </div>
            </form>
          )}
        </GlassCard>
      )}
    </div>
  );
}
