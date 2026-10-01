import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { APP_CONFIG } from "@/config/app.config";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, overrideMode?: "coins" | "real"): string {
  const mode = overrideMode || APP_CONFIG.features.moneyMode;
  if (mode === "coins") {
    return `${amount.toLocaleString("en-IN")} Coins`;
  }
  return `₹${amount.toLocaleString("en-IN")}`;
}

export function formatTimeRemaining(targetDateStr: string): {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPast: boolean;
  formatted: string;
} {
  const target = new Date(targetDateStr).getTime();
  const diff = target - Date.now();

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true, formatted: "Ended" };
  }

  const seconds = Math.floor((diff / 1000) % 60);
  const minutes = Math.floor((diff / 1000 / 60) % 60);
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  let formatted = "";
  if (days > 0) formatted += `${days}d `;
  if (hours > 0 || days > 0) formatted += `${hours}h `;
  formatted += `${minutes}m ${seconds}s`;

  return { days, hours, minutes, seconds, isPast: false, formatted: formatted.trim() };
}

export function formatTimestamp(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-IN", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return dateStr;
  }
}

export function truncateStr(str: string, maxLen = 12): string {
  if (!str || str.length <= maxLen) return str;
  return `${str.slice(0, 6)}...${str.slice(-4)}`;
}
