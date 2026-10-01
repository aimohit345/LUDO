"use client";

import React, { useState } from "react";
import { useAppStore } from "@/lib/store/useAppStore";
import { DataTable, Column } from "@/components/ui/DataTable";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { MockTicket } from "@/lib/mock-data";
import { formatTimestamp } from "@/lib/utils";
import { Headphones, MessageSquare, Send, CheckCircle, Clock } from "lucide-react";

export default function AdminSupportInboxPage() {
  const { tickets, replyTicket, updateTicketStatus } = useAppStore();
  const [selectedTicket, setSelectedTicket] = useState<MockTicket | null>(null);
  const [replyText, setReplyText] = useState("");

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !replyText.trim()) return;

    replyTicket(selectedTicket.id, replyText, "ADMIN");
    setReplyText("");
    // Update local modal view
    const updated = tickets.find((t) => t.id === selectedTicket.id);
    if (updated) setSelectedTicket(updated);
  };

  const handleStatusChange = (status: MockTicket["status"]) => {
    if (!selectedTicket) return;
    updateTicketStatus(selectedTicket.id, status);
    setSelectedTicket({ ...selectedTicket, status });
  };

  const columns: Column<MockTicket>[] = [
    {
      key: "ticket_number",
      header: "Ticket #",
      sortable: true,
      render: (row) => (
        <span className="font-mono font-bold text-cyan-400 text-xs">
          #{row.ticket_number}
        </span>
      ),
    },
    {
      key: "subject",
      header: "Subject & User",
      sortable: true,
      render: (row) => (
        <div>
          <p className="font-bold text-white text-xs">{row.subject}</p>
          <p className="text-[10px] text-slate-500">By: {row.username} • Cat: {row.category}</p>
        </div>
      ),
    },
    {
      key: "priority",
      header: "Priority",
      sortable: true,
      render: (row) => (
        <span
          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
            row.priority === "URGENT" || row.priority === "HIGH"
              ? "bg-rose-500/20 text-rose-400"
              : "bg-surface-200 text-slate-300"
          }`}
        >
          {row.priority}
        </span>
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
      header: "Date",
      sortable: true,
      render: (row) => (
        <span className="text-slate-400 font-mono text-[11px]">
          {formatTimestamp(row.created_at)}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Action",
      render: (row) => (
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setSelectedTicket(row)}
          className="text-xs px-2.5 py-1"
        >
          <MessageSquare className="w-3.5 h-3.5 mr-1" />
          Reply
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-black text-white flex items-center gap-2">
          <Headphones className="w-6 h-6 text-cyan-400" />
          Customer Support & Dispute Ticket Inbox
        </h1>
        <p className="text-xs text-slate-400">
          Respond to player inquiries, resolve room disputes, and maintain service SLAs.
        </p>
      </div>

      <GlassCard className="p-6">
        <DataTable
          data={tickets}
          columns={columns}
          searchKey="subject"
          searchPlaceholder="Search tickets by subject or user..."
          pageSize={8}
          exportFileName="LudoArena_Support_Tickets"
        />
      </GlassCard>

      {/* Ticket Modal */}
      <Modal
        isOpen={!!selectedTicket}
        onClose={() => setSelectedTicket(null)}
        title={`Ticket #${selectedTicket?.ticket_number}: ${selectedTicket?.subject}`}
        description={`Reported by ${selectedTicket?.username} (${selectedTicket?.category})`}
        className="max-w-2xl"
      >
        {selectedTicket && (
          <div className="space-y-4">
            {/* Status change bar */}
            <div className="flex items-center justify-between p-2 rounded-xl bg-surface-200/50 text-xs">
              <span className="text-slate-400 font-medium">Ticket Status:</span>
              <div className="flex gap-1.5">
                {(["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => handleStatusChange(st)}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      selectedTicket.status === st
                        ? "bg-violet-600 text-white"
                        : "bg-surface-100 text-slate-400 hover:text-white"
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Conversation Thread */}
            <div className="max-h-60 overflow-y-auto space-y-3 p-2 text-xs">
              {selectedTicket.messages.map((m) => (
                <div
                  key={m.id}
                  className={`p-3 rounded-xl ${
                    m.sender_type === "ADMIN"
                      ? "bg-cyan-950/40 border border-cyan-500/20"
                      : "bg-surface-200 border border-white/5"
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-white">
                      {m.sender_name}{" "}
                      {m.sender_type === "ADMIN" && (
                        <span className="text-cyan-400 text-[9px] uppercase font-bold">(Staff)</span>
                      )}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {formatTimestamp(m.created_at)}
                    </span>
                  </div>
                  <p className="text-slate-200">{m.message}</p>
                </div>
              ))}
            </div>

            {/* Admin reply form */}
            <form onSubmit={handleSendReply} className="space-y-2 pt-2 border-t border-white/10">
              <textarea
                rows={3}
                required
                placeholder="Write official staff reply to the player..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="w-full bg-surface-100 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-cyan-400"
              />
              <Button type="submit" variant="primary" size="sm" className="w-full text-xs">
                <Send className="w-3.5 h-3.5 mr-1.5" />
                Send Staff Reply
              </Button>
            </form>
          </div>
        )}
      </Modal>
    </div>
  );
}
