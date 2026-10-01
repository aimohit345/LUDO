"use client";

import React, { useState } from "react";
import Link from "next/link";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { formatTimestamp } from "@/lib/utils";
import { Bell, Trophy, KeyRound, Wallet, Headphones, Check, ArrowRight } from "lucide-react";

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: "TOURNAMENT" | "ROOM_CODE" | "WALLET" | "SUPPORT";
  read: boolean;
  actionUrl?: string;
  createdAt: string;
}

const SAMPLE_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "notif-1",
    title: "Room Code Revealed!",
    message: "Room code 55291480 for Cyberpunk 4-Player Arena is ready. Join now in your external game app.",
    type: "ROOM_CODE",
    read: false,
    actionUrl: "/match/t-2",
    createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
  },
  {
    id: "notif-2",
    title: "Prize Credited: ₹90",
    message: "Congratulations! You won 1st place in Vanguard 1v1 Series. Payout credited to your wallet.",
    type: "WALLET",
    read: false,
    actionUrl: "/wallet",
    createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
  },
  {
    id: "notif-3",
    title: "Tournament Joined",
    message: "You have joined Neon Clash 1v1 Battle. Kickoff is scheduled shortly.",
    type: "TOURNAMENT",
    read: true,
    actionUrl: "/match/t-1",
    createdAt: new Date(Date.now() - 120 * 60 * 1000).toISOString(),
  },
  {
    id: "notif-4",
    title: "Support Response",
    message: "Support staff replied to ticket #1001 regarding your UPI deposit inquiry.",
    type: "SUPPORT",
    read: true,
    actionUrl: "/support/tickets/tick-1",
    createdAt: new Date(Date.now() - 240 * 60 * 1000).toISOString(),
  },
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>(SAMPLE_NOTIFICATIONS);

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const getIcon = (type: NotificationItem["type"]) => {
    switch (type) {
      case "ROOM_CODE":
        return <KeyRound className="w-5 h-5 text-cyan-400" />;
      case "WALLET":
        return <Wallet className="w-5 h-5 text-emerald-400" />;
      case "TOURNAMENT":
        return <Trophy className="w-5 h-5 text-amber-400" />;
      case "SUPPORT":
        return <Headphones className="w-5 h-5 text-violet-400" />;
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <Bell className="w-6 h-6 text-pink-400" />
            Notifications
          </h1>
          <p className="text-xs text-slate-400">
            Realtime alerts for room codes, prize distribution, and support replies.
          </p>
        </div>

        <Button variant="glass" size="sm" onClick={handleMarkAllRead} className="text-xs">
          <Check className="w-3.5 h-3.5 mr-1 text-emerald-400" />
          Mark all as read
        </Button>
      </div>

      <GlassCard className="p-4 sm:p-6 divide-y divide-white/5">
        {notifications.map((n) => (
          <div
            key={n.id}
            className={`py-4 flex items-start justify-between gap-4 transition-colors ${
              !n.read ? "bg-white/[0.02] -mx-4 px-4 rounded-xl" : ""
            }`}
          >
            <div className="flex items-start gap-3.5">
              <div className="p-2.5 rounded-xl bg-surface-200 border border-white/5 shrink-0 mt-0.5">
                {getIcon(n.type)}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-bold text-white">{n.title}</h3>
                  {!n.read && (
                    <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse" />
                  )}
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{n.message}</p>
                <span className="text-[10px] text-slate-500 font-mono">
                  {formatTimestamp(n.createdAt)}
                </span>
              </div>
            </div>

            {n.actionUrl && (
              <Link href={n.actionUrl} className="shrink-0">
                <Button variant="secondary" size="sm" className="text-xs py-1 px-2.5">
                  View
                  <ArrowRight className="w-3 h-3 ml-1" />
                </Button>
              </Link>
            )}
          </div>
        ))}
      </GlassCard>
    </div>
  );
}
