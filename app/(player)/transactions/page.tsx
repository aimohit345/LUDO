"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useAppStore } from "@/lib/store/useAppStore";
import { DataTable, Column } from "@/components/ui/DataTable";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { MockTransaction } from "@/lib/mock-data";
import { formatTimestamp } from "@/lib/utils";
import { History, ArrowLeft, Filter, Wallet } from "lucide-react";

export default function TransactionsPage() {
  const { transactions, currentUser } = useAppStore();
  const [typeFilter, setTypeFilter] = useState("ALL");

  const userTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      if (typeFilter !== "ALL" && tx.type !== typeFilter) return false;
      return true;
    });
  }, [transactions, typeFilter]);

  const columns: Column<MockTransaction>[] = [
    {
      key: "type",
      header: "Type",
      sortable: true,
      render: (row) => (
        <span
          className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
            row.type === "PRIZE" || row.type === "DEPOSIT" || row.type === "REFUND" || row.type === "REFERRAL_BONUS"
              ? "bg-emerald-500/15 text-emerald-400"
              : "bg-rose-500/15 text-rose-400"
          }`}
        >
          {row.type}
        </span>
      ),
    },
    {
      key: "description",
      header: "Description & Reference",
      sortable: true,
      render: (row) => (
        <div>
          <p className="font-semibold text-white">{row.description}</p>
          <p className="text-[10px] text-slate-500 font-mono">ID: {row.id}</p>
        </div>
      ),
    },
    {
      key: "balance_bucket",
      header: "Balance Bucket",
      sortable: true,
      render: (row) => (
        <span className="text-[11px] uppercase font-mono font-medium text-slate-400">
          {row.balance_bucket}
        </span>
      ),
    },
    {
      key: "amount",
      header: "Amount",
      sortable: true,
      render: (row) => (
        <span
          className={`font-mono font-bold text-sm ${
            row.amount > 0 ? "text-emerald-400" : "text-rose-400"
          }`}
        >
          {row.amount > 0 ? `+₹${row.amount}` : `-₹${Math.abs(row.amount)}`}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      render: (row) => (
        <span className="text-[10px] uppercase font-semibold text-slate-300">
          {row.status}
        </span>
      ),
    },
    {
      key: "created_at",
      header: "Date & Time",
      sortable: true,
      render: (row) => (
        <span className="text-slate-400 font-mono text-[11px]">
          {formatTimestamp(row.created_at)}
        </span>
      ),
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <Link
        href="/wallet"
        className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Wallet
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <History className="w-6 h-6 text-violet-400" />
            Wallet Ledger & Transactions
          </h1>
          <p className="text-xs text-slate-400">
            Immutable double-entry log of deposits, entry fees, refunds, and prizes.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2">
          {["ALL", "DEPOSIT", "ENTRY_FEE", "PRIZE", "REFUND", "WITHDRAWAL"].map((f) => (
            <button
              key={f}
              onClick={() => setTypeFilter(f)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                typeFilter === f
                  ? "bg-violet-600 text-white shadow-neon-violet"
                  : "bg-surface-100 text-slate-400 hover:text-white border border-white/5"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <GlassCard className="p-6">
        <DataTable
          data={userTransactions}
          columns={columns}
          searchKey="description"
          searchPlaceholder="Search by tournament or description..."
          pageSize={10}
          exportFileName="LudoArena_Ledger_Transactions"
        />
      </GlassCard>
    </div>
  );
}
