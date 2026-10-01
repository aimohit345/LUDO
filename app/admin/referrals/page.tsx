"use client";

import React, { useState } from "react";
import { DataTable, Column } from "@/components/ui/DataTable";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { Gift, AlertTriangle, Check, X, ShieldAlert } from "lucide-react";
import { formatTimestamp } from "@/lib/utils";

interface ReferralRecord {
  id: string;
  referrer: string;
  referee: string;
  code: string;
  status: "QUALIFIED" | "PENDING" | "FLAGGED" | "VOIDED";
  ipMatch: boolean;
  bonus: number;
  date: string;
}

const SAMPLE_REFS: ReferralRecord[] = [
  { id: "ref-1", referrer: "NeonStriker", referee: "Sneha_Ludo", code: "NEON4821", status: "QUALIFIED", ipMatch: false, bonus: 25, date: new Date(Date.now() - 86400000).toISOString() },
  { id: "ref-2", referrer: "CyberDice", referee: "CyberAlt2", code: "CYBR9912", status: "FLAGGED", ipMatch: true, bonus: 25, date: new Date(Date.now() - 43200000).toISOString() },
  { id: "ref-3", referrer: "LudoQueen", referee: "QueenFan", code: "QUEN9988", status: "QUALIFIED", ipMatch: false, bonus: 25, date: new Date(Date.now() - 21600000).toISOString() },
];

export default function AdminReferralsPage() {
  const [referrals, setReferrals] = useState<ReferralRecord[]>(SAMPLE_REFS);

  const handleVoid = (id: string) => {
    setReferrals((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "VOIDED" as const } : r))
    );
    alert("Referral voided. Bonus clawback applied.");
  };

  const columns: Column<ReferralRecord>[] = [
    {
      key: "referrer",
      header: "Referrer",
      sortable: true,
      render: (row) => <span className="font-bold text-white text-xs">{row.referrer}</span>,
    },
    {
      key: "referee",
      header: "Referred Friend",
      sortable: true,
      render: (row) => <span className="text-slate-300 text-xs">{row.referee}</span>,
    },
    {
      key: "code",
      header: "Invite Code",
      sortable: true,
      render: (row) => <span className="font-mono text-cyan-300 text-xs">{row.code}</span>,
    },
    {
      key: "ipMatch",
      header: "Fraud Check",
      render: (row) =>
        row.ipMatch ? (
          <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 text-[10px] font-bold border border-rose-500/30 flex items-center gap-1 w-fit">
            <AlertTriangle className="w-3 h-3" /> Same IP / Device
          </span>
        ) : (
          <span className="text-emerald-400 text-[10px] font-semibold">✓ Clean</span>
        ),
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      render: (row) => (
        <span
          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
            row.status === "QUALIFIED"
              ? "bg-emerald-500/15 text-emerald-400"
              : row.status === "FLAGGED"
              ? "bg-amber-500/15 text-amber-400"
              : row.status === "VOIDED"
              ? "bg-rose-500/15 text-rose-400"
              : "bg-surface-200 text-slate-400"
          }`}
        >
          {row.status}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (row) => (
        <div>
          {row.status !== "VOIDED" && (
            <Button
              variant="danger"
              size="sm"
              onClick={() => handleVoid(row.id)}
              className="text-[10px] px-2 py-1"
            >
              Void & Reclaim
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-black text-white flex items-center gap-2">
          <Gift className="w-6 h-6 text-pink-400" />
          Referral Monitoring & Anti-Abuse
        </h1>
        <p className="text-xs text-slate-400">
          Detect duplicate IP networks, multiple accounts sharing devices, and void fraudulent referral credits.
        </p>
      </div>

      <GlassCard className="p-6">
        <DataTable
          data={referrals}
          columns={columns}
          searchKey="referrer"
          searchPlaceholder="Search by referrer or friend username..."
          pageSize={8}
          exportFileName="LudoArena_Referral_Audit"
        />
      </GlassCard>
    </div>
  );
}
