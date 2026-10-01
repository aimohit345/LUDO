import React from "react";
import { cn } from "@/lib/utils";

export interface StatusBadgeProps {
  status: string;
  size?: "sm" | "md";
  className?: string;
}

export function StatusBadge({ status, size = "md", className }: StatusBadgeProps) {
  const norm = status.toUpperCase();

  const getStyle = () => {
    switch (norm) {
      case "LIVE":
        return {
          bg: "bg-red-500/15 text-red-400 border-red-500/30",
          dot: "bg-red-500 animate-ping",
          label: "LIVE NOW",
        };
      case "ROOM_SHARED":
        return {
          bg: "bg-cyan-500/15 text-cyan-400 border-cyan-500/30",
          dot: "bg-cyan-400 animate-pulse",
          label: "ROOM READY",
        };
      case "REGISTRATION_OPEN":
        return {
          bg: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
          dot: "bg-emerald-400",
          label: "JOIN OPEN",
        };
      case "FULL":
        return {
          bg: "bg-amber-500/15 text-amber-400 border-amber-500/30",
          dot: "bg-amber-400",
          label: "FULL",
        };
      case "UPCOMING":
        return {
          bg: "bg-violet-500/15 text-violet-400 border-violet-500/30",
          dot: "bg-violet-400",
          label: "UPCOMING",
        };
      case "RESULT_PENDING":
        return {
          bg: "bg-orange-500/15 text-orange-400 border-orange-500/30",
          dot: "bg-orange-400 animate-pulse",
          label: "VERIFYING RESULT",
        };
      case "COMPLETED":
        return {
          bg: "bg-slate-500/15 text-slate-300 border-slate-500/30",
          dot: "bg-slate-400",
          label: "COMPLETED",
        };
      case "CANCELLED":
        return {
          bg: "bg-rose-500/15 text-rose-400 border-rose-500/30",
          dot: "bg-rose-400",
          label: "CANCELLED",
        };
      case "APPROVED":
      case "PAID":
      case "VERIFIED":
        return {
          bg: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
          dot: "bg-emerald-400",
          label: norm,
        };
      case "PENDING":
      case "PROCESSING":
        return {
          bg: "bg-amber-500/15 text-amber-400 border-amber-500/30",
          dot: "bg-amber-400 animate-pulse",
          label: norm,
        };
      case "REJECTED":
      case "FAILED":
        return {
          bg: "bg-rose-500/15 text-rose-400 border-rose-500/30",
          dot: "bg-rose-400",
          label: norm,
        };
      default:
        return {
          bg: "bg-slate-800 text-slate-300 border-slate-700",
          dot: "bg-slate-400",
          label: norm,
        };
    }
  };

  const style = getStyle();

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 font-semibold uppercase tracking-wider rounded-full border backdrop-blur-sm",
        size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-3 py-1 text-xs",
        style.bg,
        className
      )}
    >
      <span className="relative flex h-2 w-2">
        {style.dot.includes("ping") && (
          <span className={cn("absolute inline-flex h-full w-full rounded-full opacity-75", style.dot)} />
        )}
        <span
          className={cn(
            "relative inline-flex rounded-full h-2 w-2",
            style.dot.replace("animate-ping", "").replace("animate-pulse", "")
          )}
        />
      </span>
      {style.label}
    </span>
  );
}
