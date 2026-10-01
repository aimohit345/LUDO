"use client";

import React, { useState } from "react";
import { useAppStore } from "@/lib/store/useAppStore";
import { DataTable, Column } from "@/components/ui/DataTable";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { MockPayoutRequest } from "@/lib/mock-data";
import { formatCurrency, formatTimestamp } from "@/lib/utils";
import { ArrowUpRight, Check, X, ShieldCheck, AlertCircle } from "lucide-react";

export default function AdminWithdrawalsPage() {
  const { withdrawals, resolveWithdrawal } = useAppStore();
  const [selectedReq, setSelectedReq] = useState<MockPayoutRequest | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);

  const handleApprove = (reqId: string) => {
    resolveWithdrawal(reqId, "PAID");
    alert("Withdrawal marked as PAID. Payout reference recorded.");
  };

  const handleConfirmReject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReq || !rejectReason) return;
    resolveWithdrawal(selectedReq.id, "REJECTED", rejectReason);
    setIsRejectModalOpen(false);
    setRejectReason("");
    alert("Withdrawal rejected. Amount has been reversed back to the player's winnings balance.");
  };

  const columns: Column<MockPayoutRequest>[] = [
    {
      key: "username",
      header: "Player",
      sortable: true,
      render: (row) => (
        <div>
          <p className="font-bold text-white">{row.username}</p>
          <p className="text-[10px] text-slate-500 font-mono">Req: {row.id}</p>
        </div>
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
      key: "payout_method",
      header: "Destination",
      render: (row) => (
        <div className="font-mono text-xs">
          <span className="px-1.5 py-0.5 rounded bg-surface-200 text-cyan-300 text-[10px] font-bold mr-1.5">
            {row.payout_method.type}
          </span>
          <span className="text-white">{row.payout_method.details}</span>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      render: (row) => <StatusBadge status={row.status} size="sm" />,
    },
    {
      key: "created_at",
      header: "Requested At",
      sortable: true,
      render: (row) => (
        <span className="text-slate-400 font-mono text-[11px]">
          {formatTimestamp(row.created_at)}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Decision",
      render: (row) => (
        <div className="flex items-center gap-1.5">
          {row.status === "PENDING" && (
            <>
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleApprove(row.id)}
                className="text-xs px-2.5 py-1"
              >
                <Check className="w-3.5 h-3.5 mr-1" />
                Approve
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => {
                  setSelectedReq(row);
                  setIsRejectModalOpen(true);
                }}
                className="text-xs px-2.5 py-1"
              >
                <X className="w-3.5 h-3.5 mr-1" />
                Reject
              </Button>
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-black text-white flex items-center gap-2">
          <ArrowUpRight className="w-6 h-6 text-pink-400" />
          Finance Withdrawals Approval Desk
        </h1>
        <p className="text-xs text-slate-400">
          Review player payout requests, execute RazorpayX / IMPS payouts, or reject with automatic wallet reversal.
        </p>
      </div>

      <GlassCard className="p-6">
        <DataTable
          data={withdrawals}
          columns={columns}
          searchKey="username"
          searchPlaceholder="Search by username or destination..."
          pageSize={8}
          exportFileName="LudoArena_Withdrawals"
        />
      </GlassCard>

      {/* Reject Modal */}
      <Modal
        isOpen={isRejectModalOpen}
        onClose={() => setIsRejectModalOpen(false)}
        title="Reject Withdrawal Request"
        description={`Rejecting ₹${selectedReq?.amount} payout for ${selectedReq?.username}. Funds will be automatically refunded.`}
      >
        <form onSubmit={handleConfirmReject} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Rejection Reason <span className="text-rose-400">*</span>
            </label>
            <textarea
              rows={3}
              required
              placeholder="e.g. Invalid UPI handle / Name mismatch with KYC document"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full bg-surface-100 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-rose-500"
            />
          </div>

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => setIsRejectModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="danger" size="sm" className="flex-1">
              Confirm Rejection & Refund
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
