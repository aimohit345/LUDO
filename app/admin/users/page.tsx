"use client";

import React, { useState } from "react";
import Link from "next/link";
import { INITIAL_USERS, MockUser } from "@/lib/mock-data";
import { DataTable, Column } from "@/components/ui/DataTable";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { formatCurrency } from "@/lib/utils";
import { Users, Shield, Ban, CheckCircle, Wallet, Edit3, ArrowRight } from "lucide-react";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<MockUser[]>(INITIAL_USERS);
  const [selectedUser, setSelectedUser] = useState<MockUser | null>(null);
  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
  const [adjustAmount, setAdjustAmount] = useState<number>(100);
  const [adjustReason, setAdjustReason] = useState("");

  const handleToggleBan = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId ? { ...u, is_banned: !u.is_banned } : u
      )
    );
  };

  const handleAdjustBalance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser || !adjustReason) return;

    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === selectedUser.id) {
          return {
            ...u,
            wallet: {
              ...u.wallet,
              deposit_balance: Math.max(0, u.wallet.deposit_balance + adjustAmount),
            },
          };
        }
        return u;
      })
    );

    setIsAdjustModalOpen(false);
    setAdjustReason("");
    alert(`Adjusted balance by ₹${adjustAmount} for ${selectedUser.username}. Logged to audit trail.`);
  };

  const columns: Column<MockUser>[] = [
    {
      key: "username",
      header: "User",
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-2.5">
          <img
            src={row.avatar_url}
            alt={row.username}
            className="w-8 h-8 rounded-lg object-cover border border-white/10"
          />
          <div>
            <p className="font-bold text-white flex items-center gap-1.5">
              {row.username}
              {row.is_banned && (
                <span className="px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-400 text-[9px] uppercase font-bold">
                  BANNED
                </span>
              )}
            </p>
            <p className="text-[10px] text-slate-500 font-mono">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "role",
      header: "Role",
      sortable: true,
      render: (row) => (
        <span
          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
            row.role === "SUPER_ADMIN"
              ? "bg-pink-500/20 text-pink-400 border border-pink-500/30"
              : "bg-surface-200 text-slate-300"
          }`}
        >
          {row.role}
        </span>
      ),
    },
    {
      key: "in_game_username",
      header: "Ludo ID",
      sortable: true,
      render: (row) => (
        <span className="font-mono text-cyan-300 text-xs">
          {row.in_game_username || "—"}
        </span>
      ),
    },
    {
      key: "stats",
      header: "Wins / Level",
      sortable: true,
      render: (row) => (
        <span className="font-mono text-xs text-slate-300">
          {row.wins}W • LVL {row.level}
        </span>
      ),
    },
    {
      key: "balance",
      header: "Total Balance",
      sortable: true,
      render: (row) => (
        <span className="font-mono font-bold text-emerald-400 text-xs">
          {formatCurrency(row.wallet.deposit_balance + row.wallet.winnings_balance)}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (row) => (
        <div className="flex items-center gap-1.5">
          <Button
            variant="glass"
            size="sm"
            onClick={() => {
              setSelectedUser(row);
              setIsAdjustModalOpen(true);
            }}
            title="Adjust Wallet"
            className="text-[11px] p-1.5"
          >
            <Wallet className="w-3.5 h-3.5 text-cyan-400" />
          </Button>

          <Button
            variant={row.is_banned ? "secondary" : "danger"}
            size="sm"
            onClick={() => handleToggleBan(row.id)}
            title={row.is_banned ? "Unban Account" : "Suspend Account"}
            className="text-[11px] p-1.5"
          >
            {row.is_banned ? <CheckCircle className="w-3.5 h-3.5" /> : <Ban className="w-3.5 h-3.5" />}
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-black text-white flex items-center gap-2">
          <Users className="w-6 h-6 text-pink-400" />
          User & Account Administration
        </h1>
        <p className="text-xs text-slate-400">
          Inspect player balances, game stats, issue strikes, and suspend fraudulent accounts.
        </p>
      </div>

      <GlassCard className="p-6">
        <DataTable
          data={users}
          columns={columns}
          searchKey="username"
          searchPlaceholder="Search users by username or email..."
          pageSize={8}
          exportFileName="LudoArena_Users"
        />
      </GlassCard>

      {/* Adjust Wallet Balance Modal */}
      <Modal
        isOpen={isAdjustModalOpen}
        onClose={() => setIsAdjustModalOpen(false)}
        title="Admin Wallet Adjustment"
        description={`Modify balance for ${selectedUser?.username}. Mandatory audit reason required.`}
      >
        <form onSubmit={handleAdjustBalance} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Adjustment Amount (₹)
            </label>
            <input
              type="number"
              required
              value={adjustAmount}
              onChange={(e) => setAdjustAmount(Number(e.target.value))}
              placeholder="e.g. 100 or -50"
              className="w-full bg-surface-100 border border-white/10 rounded-xl px-4 py-2 text-sm text-white font-mono focus:outline-none focus:border-cyan-400"
            />
            <p className="text-[10px] text-slate-500 mt-0.5">
              Enter positive amount to credit, negative amount to debit.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Mandatory Audit Reason <span className="text-rose-400">*</span>
            </label>
            <textarea
              rows={3}
              required
              placeholder="e.g. Match compensation for opponent network drop / promo grant"
              value={adjustReason}
              onChange={(e) => setAdjustReason(e.target.value)}
              className="w-full bg-surface-100 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => setIsAdjustModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" className="flex-1">
              Apply & Log Adjustment
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
