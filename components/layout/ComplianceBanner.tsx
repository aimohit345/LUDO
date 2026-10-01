"use client";

import React, { useState, useEffect } from "react";
import { AlertTriangle, X, ShieldCheck } from "lucide-react";
import { APP_CONFIG } from "@/config/app.config";

export function ComplianceBanner() {
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    const isDismissed = localStorage.getItem("ludoarena_compliance_dismissed");
    if (!isDismissed) {
      setDismissed(false);
    }
  }, []);

  const handleDismiss = () => {
    localStorage.setItem("ludoarena_compliance_dismissed", "true");
    setDismissed(true);
  };

  if (dismissed) return null;

  return (
    <div className="bg-gradient-to-r from-violet-950/80 via-surface-100 to-indigo-950/80 border-b border-violet-500/20 px-4 py-2.5 text-xs text-slate-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            <strong className="text-white font-semibold">18+ Only & Fair Play:</strong> Players must be 18 years or older. Real money tournaments are prohibited for residents of{" "}
            {APP_CONFIG.features.blockedRegions.join(", ")}. Please play responsibly.
          </span>
        </div>
        <button
          onClick={handleDismiss}
          className="text-slate-400 hover:text-white p-1 rounded hover:bg-white/5 transition-colors shrink-0"
          aria-label="Dismiss compliance notice"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
