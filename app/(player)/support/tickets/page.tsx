"use client";

import React from "react";
import Link from "next/link";
import { useAppStore } from "@/lib/store/useAppStore";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatTimestamp } from "@/lib/utils";
import { Headphones, ArrowLeft, Plus, MessageSquare } from "lucide-react";

export default function PlayerTicketsPage() {
  const { tickets, currentUser } = useAppStore();

  const userTickets = tickets.filter((t) => t.user_id === currentUser?.id);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <Link
        href="/support"
        className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Help Center
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <Headphones className="w-6 h-6 text-cyan-400" />
            My Support Tickets
          </h1>
          <p className="text-xs text-slate-400">
            Track inquiries, match disputes, and staff responses in realtime.
          </p>
        </div>

        <Link href="/support">
          <Button variant="primary" size="sm" className="text-xs">
            <Plus className="w-4 h-4 mr-1" />
            New Ticket
          </Button>
        </Link>
      </div>

      <GlassCard className="p-6">
        {userTickets.length > 0 ? (
          <div className="divide-y divide-white/5">
            {userTickets.map((ticket) => (
              <Link
                key={ticket.id}
                href={`/support/tickets/${ticket.id}`}
                className="py-4 flex items-center justify-between gap-4 hover:bg-white/[0.02] -mx-4 px-4 rounded-xl transition-colors block"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-violet-400">
                      #{ticket.ticket_number}
                    </span>
                    <StatusBadge status={ticket.status} size="sm" />
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">
                      {ticket.category}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-white hover:text-cyan-300 transition-colors">
                    {ticket.subject}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Created: {formatTimestamp(ticket.created_at)} • {ticket.messages.length} messages
                  </p>
                </div>

                <Button variant="glass" size="sm" className="text-xs shrink-0">
                  <MessageSquare className="w-3.5 h-3.5 mr-1 text-cyan-400" />
                  View Thread
                </Button>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-slate-500 text-xs">
            You don&apos;t have any active support tickets. Need help? Click New Ticket above.
          </div>
        )}
      </GlassCard>
    </div>
  );
}
