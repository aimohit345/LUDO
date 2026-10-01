"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAppStore } from "@/lib/store/useAppStore";
import { DataTable, Column } from "@/components/ui/DataTable";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Modal } from "@/components/ui/Modal";
import { MockTournament } from "@/lib/mock-data";
import { formatCurrency, formatTimestamp } from "@/lib/utils";
import { Trophy, Plus, Play, XCircle, KeyRound, Check, ExternalLink } from "lucide-react";

export default function AdminTournamentsPage() {
  const { tournaments, updateTournamentStatus, leaveTournament } = useAppStore();
  const [selectedTourney, setSelectedTourney] = useState<MockTournament | null>(null);
  const [roomCodeInput, setRoomCodeInput] = useState("");
  const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);

  const handleSetRoomCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTourney) return;
    selectedTourney.room_code = roomCodeInput;
    updateTournamentStatus(selectedTourney.id, "ROOM_SHARED");
    setIsRoomModalOpen(false);
  };

  const handleForceStart = (tourney: MockTournament) => {
    updateTournamentStatus(tourney.id, "LIVE");
  };

  const handleCancelAndRefund = (tourney: MockTournament) => {
    if (confirm(`Cancel tournament "${tourney.title}" and refund all participants?`)) {
      updateTournamentStatus(tourney.id, "CANCELLED");
    }
  };

  const columns: Column<MockTournament>[] = [
    {
      key: "title",
      header: "Tournament",
      sortable: true,
      render: (row) => (
        <div>
          <p className="font-bold text-white hover:text-cyan-400 transition-colors">{row.title}</p>
          <p className="text-[10px] text-slate-500 font-mono">
            {row.mode} • ID: {row.id}
          </p>
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
      key: "entry_fee",
      header: "Fee",
      sortable: true,
      render: (row) => (
        <span className="font-mono text-white font-semibold">
          {row.entry_fee === 0 ? "FREE" : `₹${row.entry_fee}`}
        </span>
      ),
    },
    {
      key: "prize_pool",
      header: "Prize",
      sortable: true,
      render: (row) => (
        <span className="font-mono font-bold text-amber-400">
          ₹{row.prize_pool}
        </span>
      ),
    },
    {
      key: "current_players",
      header: "Slots",
      sortable: true,
      render: (row) => (
        <span className="font-mono text-xs text-slate-300">
          {row.current_players} / {row.max_players}
        </span>
      ),
    },
    {
      key: "room_code",
      header: "Room Code",
      render: (row) => (
        <div className="flex items-center gap-1.5 font-mono">
          {row.room_code ? (
            <span className="px-2 py-0.5 rounded bg-surface-200 text-cyan-300 font-bold text-xs border border-cyan-500/30">
              {row.room_code}
            </span>
          ) : (
            <span className="text-[11px] text-slate-500">Not set</span>
          )}
        </div>
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
              setSelectedTourney(row);
              setRoomCodeInput(row.room_code || "");
              setIsRoomModalOpen(true);
            }}
            title="Set Game Room Code"
            className="text-[11px] p-1.5"
          >
            <KeyRound className="w-3.5 h-3.5 text-cyan-400" />
          </Button>

          {row.status !== "LIVE" && row.status !== "COMPLETED" && row.status !== "CANCELLED" && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => handleForceStart(row)}
              title="Force Start Match"
              className="text-[11px] p-1.5"
            >
              <Play className="w-3.5 h-3.5 text-emerald-400" />
            </Button>
          )}

          {row.status !== "COMPLETED" && row.status !== "CANCELLED" && (
            <Button
              variant="danger"
              size="sm"
              onClick={() => handleCancelAndRefund(row)}
              title="Cancel Tournament & Refund"
              className="text-[11px] p-1.5"
            >
              <XCircle className="w-3.5 h-3.5" />
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <Trophy className="w-6 h-6 text-amber-400" />
            Tournament Management
          </h1>
          <p className="text-xs text-slate-400">
            Create, schedule, set room codes, monitor participants, and cancel with auto-refund.
          </p>
        </div>

        <Link href="/admin/tournaments/new">
          <Button variant="accent" size="sm">
            <Plus className="w-4 h-4 mr-1.5" />
            Create Tournament
          </Button>
        </Link>
      </div>

      <GlassCard className="p-6">
        <DataTable
          data={tournaments}
          columns={columns}
          searchKey="title"
          searchPlaceholder="Search tournaments..."
          pageSize={8}
          exportFileName="LudoArena_Tournaments"
        />
      </GlassCard>

      {/* Set Room Code Modal */}
      <Modal
        isOpen={isRoomModalOpen}
        onClose={() => setIsRoomModalOpen(false)}
        title="Set Game Room Code"
        description={`Set external Ludo app room code for: ${selectedTourney?.title}`}
      >
        <form onSubmit={handleSetRoomCode} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              8-Digit Room Code
            </label>
            <input
              type="text"
              required
              placeholder="e.g. 83921045"
              value={roomCodeInput}
              onChange={(e) => setRoomCodeInput(e.target.value)}
              className="w-full bg-surface-100 border border-white/10 rounded-xl px-4 py-2 text-lg font-mono font-bold text-white focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => setIsRoomModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" className="flex-1">
              Save & Notify Players
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
