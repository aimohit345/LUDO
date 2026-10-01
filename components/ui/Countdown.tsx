"use client";

import React, { useEffect, useState } from "react";
import { formatTimeRemaining } from "@/lib/utils";
import { Clock } from "lucide-react";

interface CountdownProps {
  targetDate: string;
  onExpire?: () => void;
  className?: string;
  compact?: boolean;
}

export function Countdown({ targetDate, onExpire, className, compact = false }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState(() => formatTimeRemaining(targetDate));

  useEffect(() => {
    const timer = setInterval(() => {
      const updated = formatTimeRemaining(targetDate);
      setTimeLeft(updated);
      if (updated.isPast) {
        clearInterval(timer);
        onExpire?.();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate, onExpire]);

  if (timeLeft.isPast) {
    return (
      <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
        <Clock className="w-3.5 h-3.5 text-slate-500" />
        Started
      </span>
    );
  }

  if (compact) {
    return (
      <span className="text-xs font-mono font-medium text-cyan-400 flex items-center gap-1 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-800/40">
        <Clock className="w-3 h-3 text-cyan-400 animate-pulse" />
        {timeLeft.formatted}
      </span>
    );
  }

  return (
    <div className={`flex items-center gap-1.5 font-mono ${className || ""}`}>
      {timeLeft.days > 0 && (
        <div className="flex flex-col items-center bg-surface-100 border border-white/10 px-2 py-1 rounded">
          <span className="text-base font-bold text-white">{timeLeft.days}</span>
          <span className="text-[9px] uppercase text-slate-400 font-sans">Days</span>
        </div>
      )}
      <div className="flex flex-col items-center bg-surface-100 border border-white/10 px-2 py-1 rounded">
        <span className="text-base font-bold text-white">
          {String(timeLeft.hours).padStart(2, "0")}
        </span>
        <span className="text-[9px] uppercase text-slate-400 font-sans">Hrs</span>
      </div>
      <span className="text-violet-400 font-bold">:</span>
      <div className="flex flex-col items-center bg-surface-100 border border-white/10 px-2 py-1 rounded">
        <span className="text-base font-bold text-cyan-400">
          {String(timeLeft.minutes).padStart(2, "0")}
        </span>
        <span className="text-[9px] uppercase text-slate-400 font-sans">Min</span>
      </div>
      <span className="text-violet-400 font-bold">:</span>
      <div className="flex flex-col items-center bg-surface-100 border border-white/10 px-2 py-1 rounded">
        <span className="text-base font-bold text-pink-400">
          {String(timeLeft.seconds).padStart(2, "0")}
        </span>
        <span className="text-[9px] uppercase text-slate-400 font-sans">Sec</span>
      </div>
    </div>
  );
}
