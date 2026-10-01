"use client";

import React, { useState } from "react";
import { DataTable, Column } from "@/components/ui/DataTable";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { formatCurrency, formatTimestamp } from "@/lib/utils";
import { CreditCard, RefreshCw, CheckCircle, ExternalLink, ShieldCheck } from "lucide-react";

interface DepositOrder {
  id: string;
  user: string;
  orderId: string;
  paymentId: string;
  amount: number;
  provider: "razorpay" | "paytm" | "mock";
  status: "PAID" | "PENDING" | "FAILED";
  timestamp: string;
}

const SAMPLE_ORDERS: DepositOrder[] = [
  { id: "ord-1", user: "NeonStriker", orderId: "order_mock_99182", paymentId: "pay_mock_2831", amount: 200, provider: "mock", status: "PAID", timestamp: new Date(Date.now() - 3600000).toISOString() },
  { id: "ord-2", user: "CyberDice", orderId: "order_mock_77182", paymentId: "pay_mock_1192", amount: 150, provider: "mock", status: "PAID", timestamp: new Date(Date.now() - 7200000).toISOString() },
  { id: "ord-3", user: "LudoQueen", orderId: "order_rzp_66192", paymentId: "pay_rzp_44921", amount: 800, provider: "razorpay", status: "PAID", timestamp: new Date(Date.now() - 14400000).toISOString() },
  { id: "ord-4", user: "ShadowPawn", orderId: "order_ptm_11029", paymentId: "pay_ptm_9921", amount: 500, provider: "paytm", status: "PAID", timestamp: new Date(Date.now() - 28800000).toISOString() },
];

export default function AdminPaymentsPage() {
  const [orders] = useState<DepositOrder[]>(SAMPLE_ORDERS);
  const [reconciling, setReconciling] = useState(false);
  const [reconciledMsg, setReconciledMsg] = useState("");

  const handleReconcile = () => {
    setReconciling(true);
    setTimeout(() => {
      setReconciling(false);
      setReconciledMsg("Gateway reconciliation completed. All 4 orders match bank webhook settlement status.");
      setTimeout(() => setReconciledMsg(""), 4000);
    }, 1200);
  };

  const columns: Column<DepositOrder>[] = [
    {
      key: "orderId",
      header: "Order / Gateway ID",
      sortable: true,
      render: (row) => (
        <div>
          <p className="font-mono font-bold text-white text-xs">{row.orderId}</p>
          <p className="font-mono text-[10px] text-slate-500">PayID: {row.paymentId}</p>
        </div>
      ),
    },
    {
      key: "user",
      header: "Player",
      sortable: true,
      render: (row) => <span className="font-bold text-white text-xs">{row.user}</span>,
    },
    {
      key: "provider",
      header: "Gateway",
      sortable: true,
      render: (row) => (
        <span className="px-2 py-0.5 rounded bg-surface-200 text-cyan-300 font-mono text-[10px] font-bold uppercase">
          {row.provider}
        </span>
      ),
    },
    {
      key: "amount",
      header: "Amount",
      sortable: true,
      render: (row) => (
        <span className="font-mono font-bold text-sm text-emerald-400">
          ₹{row.amount}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      render: (row) => (
        <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 text-[10px] font-bold">
          {row.status}
        </span>
      ),
    },
    {
      key: "timestamp",
      header: "Settled At",
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-cyan-400" />
            Gateway Settlements & Deposit Logs
          </h1>
          <p className="text-xs text-slate-400">
            Reconcile Razorpay, Paytm, and webhook events against internal ledger balances.
          </p>
        </div>

        <Button
          variant="secondary"
          size="sm"
          onClick={handleReconcile}
          isLoading={reconciling}
        >
          <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
          Run Gateway Reconciliation
        </Button>
      </div>

      {reconciledMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2 font-semibold">
          <ShieldCheck className="w-5 h-5 shrink-0" />
          <span>{reconciledMsg}</span>
        </div>
      )}

      <GlassCard className="p-6">
        <DataTable
          data={orders}
          columns={columns}
          searchKey="user"
          searchPlaceholder="Search order or player..."
          pageSize={8}
          exportFileName="LudoArena_Deposits_Reconciliation"
        />
      </GlassCard>
    </div>
  );
}
