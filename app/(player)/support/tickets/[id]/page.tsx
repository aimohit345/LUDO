"use client";

import React, { use, useState } from "react";
import Link from "next/link";
import { useAppStore } from "@/lib/store/useAppStore";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatTimestamp } from "@/lib/utils";
import { ArrowLeft, Send, Headphones, User, Bot, ShieldCheck } from "lucide-react";

export default function TicketDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { tickets, replyTicket, currentUser } = useAppStore();
  const [replyText, setReplyText] = useState("");

  const ticket = tickets.find((t) => t.id === id);

  if (!ticket) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-white mb-2">Ticket Not Found</h2>
        <Link href="/support/tickets">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            Back to Tickets
          </Button>
        </Link>
      </div>
    );
  }

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    replyTicket(ticket.id, replyText, "USER");
    setReplyText("");
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <Link
        href="/support/tickets"
        className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to My Tickets
      </Link>

      {/* Ticket Header */}
      <GlassCard className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono font-bold text-cyan-400">
                Ticket #{ticket.ticket_number}
              </span>
              <StatusBadge status={ticket.status} size="sm" />
              <span className="text-[10px] text-slate-400 uppercase font-semibold">
                Category: {ticket.category}
              </span>
            </div>
            <h1 className="text-xl font-black text-white">{ticket.subject}</h1>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Created {formatTimestamp(ticket.created_at)}
            </p>
          </div>
        </div>
      </GlassCard>

      {/* Conversation Thread */}
      <GlassCard className="p-6 space-y-4">
        <h2 className="text-sm font-bold text-white mb-4">Conversation Thread</h2>

        <div className="space-y-4">
          {ticket.messages.map((msg) => (
            <div
              key={msg.id}
              className={`p-4 rounded-2xl text-xs space-y-2 leading-relaxed ${
                msg.sender_type === "USER"
                  ? "bg-violet-950/30 border border-violet-500/20 ml-6"
                  : msg.sender_type === "ADMIN"
                  ? "bg-cyan-950/30 border border-cyan-500/20 mr-6"
                  : "bg-surface-200/50 border border-white/5 mr-6"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-white flex items-center gap-1.5">
                  {msg.sender_type === "USER" ? (
                    <User className="w-3.5 h-3.5 text-violet-400" />
                  ) : msg.sender_type === "ADMIN" ? (
                    <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                  ) : (
                    <Bot className="w-3.5 h-3.5 text-pink-400" />
                  )}
                  {msg.sender_name}
                  {msg.sender_type === "ADMIN" && (
                    <span className="text-[9px] uppercase px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 font-bold">
                      STAFF
                    </span>
                  )}
                </span>
                <span className="text-[10px] text-slate-500 font-mono">
                  {formatTimestamp(msg.created_at)}
                </span>
              </div>
              <p className="text-slate-200">{msg.message}</p>
            </div>
          ))}
        </div>

        {/* Reply Box */}
        {ticket.status !== "CLOSED" ? (
          <form onSubmit={handleSendReply} className="pt-4 border-t border-white/10 space-y-3">
            <textarea
              rows={3}
              required
              placeholder="Type your response to support staff..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              className="w-full bg-surface-100 border border-white/10 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
            <Button type="submit" variant="primary" size="sm" className="text-xs">
              <Send className="w-3.5 h-3.5 mr-1.5" />
              Send Response
            </Button>
          </form>
        ) : (
          <p className="text-center text-xs text-slate-500 py-3 border-t border-white/10">
            This ticket is closed. Please open a new ticket if you need further help.
          </p>
        )}
      </GlassCard>
    </div>
  );
}
