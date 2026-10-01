"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "accent" | "outline" | "ghost" | "danger" | "glass";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", isLoading = false, children, disabled, ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]";

    const variants = {
      primary:
        "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-neon-violet hover:from-violet-500 hover:to-indigo-500 hover:shadow-lg border border-violet-400/30",
      secondary:
        "bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/20 hover:border-cyan-400 shadow-neon-cyan/30",
      accent:
        "bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-neon-pink hover:from-pink-500 hover:to-rose-500 border border-pink-400/30",
      outline:
        "bg-transparent border border-white/20 text-slate-200 hover:bg-white/10 hover:border-white/40",
      ghost: "bg-transparent text-slate-300 hover:bg-white/5 hover:text-white",
      danger:
        "bg-rose-500/20 text-rose-400 border border-rose-500/40 hover:bg-rose-500/30",
      glass:
        "bg-white/5 backdrop-blur-md border border-white/10 text-slate-200 hover:bg-white/10 hover:border-white/20 shadow-glass",
    };

    const sizes = {
      sm: "text-xs px-3 py-1.5 rounded-md gap-1.5",
      md: "text-sm px-4 py-2.5 rounded-lg gap-2",
      lg: "text-base px-6 py-3 rounded-xl gap-2.5",
      icon: "p-2 rounded-lg aspect-square",
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
