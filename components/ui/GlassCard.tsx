"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  glow?: "violet" | "cyan" | "pink" | "none";
  interactive?: boolean;
}

export const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, glow = "none", interactive = false, children, ...props }, ref) => {
    const glowClasses = {
      violet: "hover:shadow-neon-violet hover:border-violet-500/40",
      cyan: "hover:shadow-neon-cyan hover:border-cyan-500/40",
      pink: "hover:shadow-neon-pink hover:border-pink-500/40",
      none: "hover:border-white/20",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "relative overflow-hidden rounded-xl border border-white/10 bg-surface-100/60 backdrop-blur-xl shadow-glass transition-all duration-300",
          interactive && "cursor-pointer hover:-translate-y-1",
          interactive && glowClasses[glow],
          className
        )}
        {...props}
      >
        {/* Subtle top glare reflection */}
        <div className="pointer-events-none absolute -inset-px opacity-30 bg-gradient-to-b from-white/10 via-transparent to-transparent rounded-[inherit]" />
        {children}
      </div>
    );
  }
);

GlassCard.displayName = "GlassCard";
