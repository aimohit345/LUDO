"use client";

import React, { useState } from "react";
import { DataTable, Column } from "@/components/ui/DataTable";
import { GlassCard } from "@/components/ui/GlassCard";
import { formatTimestamp } from "@/lib/utils";
import { FileText, Shield } from "lucide-react";

interface AuditEntry {
  id: string;
  actor: string;
  action: string;
  target: string;
  details: string;
  ip: string;
  timestamp: string;
}

const SAMPLE_AUDITS: AuditEntry[] = [
  { id: "aud-1", actor: "superadmin", action: "DISTRIBUTE_PRIZES", target: "Tournament: Neon Clash 1v1", details: "Distributed ₹90 to winner NeonStriker. Deducted ₹10 platform fee.", ip: "103.212.43.19", timestamp: new Date(Date.now() - 1800000).toISOString() },
  { id: "aud-2", actor: "superadmin", action: "APPROVE_PAYOUT", target: "Withdrawal: w-2", details: "Approved ₹500 payout via UPI to neonstriker@upi", ip: "103.212.43.19", timestamp: new Date(Date.now() - 3600000).toISOString() },
  { id: "aud-3", actor: "superadmin", action: "SET_ROOM_CODE", target: "Tournament: Cyberpunk 4-Player", details: "Updated room code to 55291480", ip: "103.212.43.19", timestamp: new Date(Date.now() - 7200000).toISOString() },
  { id: "aud-4", actor: "superadmin", action: "VERIFY_KYC", target: "User: NeonStriker", details: "Verified PAN ABCDE1234F", ip: "103.212.43.19", timestamp: new Date(Date.now() - 86400000).toISOString() },
  { id: "aud-5", actor: "superadmin", action: "WALLET_ADJUSTMENT", target: "User: CyberDice", details: "Credited ₹100 for network drop compensation", ip: "103.212.43.19", timestamp: new Date(Date.now() - 172800000).toISOString() },
];

export default function AdminAuditLogPage() {
  const [logs] = useState<AuditEntry[]>(SAMPLE_AUDITS);

  const columns: Column<AuditEntry>[] = [
    {
      key: "actor",
      header: "Admin Actor",
      sortable: true,
      render: (row) => (
        <span className="font-bold text-white text-xs font-mono">{row.actor}</span>
      ),
    },
    {
      key: "action",
      header: "Action Performed",
      sortable: true,
      render: (row) => (
        <span className="px-2 py-0.5 rounded bg-surface-200 text-cyan-300 font-mono text-[10px] font-bold">
          {row.action}
        </span>
      ),
    },
    {
      key: "target",
      header: "Target Entity",
      sortable: true,
      render: (row) => <span className="font-semibold text-white text-xs">{row.target}</span>,
    },
    {
      key: "details",
      header: "Audit Description",
      render: (row) => <span className="text-slate-400 text-xs">{row.details}</span>,
    },
    {
      key: "ip",
      header: "IP Address",
      render: (row) => <span className="font-mono text-[11px] text-slate-500">{row.ip}</span>,
    },
    {
      key: "timestamp",
      header: "Timestamp",
      sortable: true,
      render: (row) => (
        <span className="text-slate-400 font-mono text-[11px]">
          {formatTimestamp(row.timestamp)}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-black text-white flex items-center gap-2">
          <FileText className="w-6 h-6 text-pink-400" />
          Immutable Admin Audit Trail
        </h1>
        <p className="text-xs text-slate-400">
          Cryptographically append-only audit log tracking every administrative decision, wallet adjustment, and payout approval.
        </p>
      </div>

      <GlassCard className="p-6">
        <DataTable
          data={logs}
          columns={columns}
          searchKey="action"
          searchPlaceholder="Search audit logs by action or target..."
          pageSize={8}
          exportFileName="LudoArena_Audit_Trail"
        />
      </GlassCard>
    </div>
  );
}
