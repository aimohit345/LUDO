"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAppStore } from "@/lib/store/useAppStore";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import {
  HelpCircle,
  Headphones,
  ChevronDown,
  ChevronUp,
  Plus,
  Send,
  CheckCircle2,
  ShieldCheck,
  Search,
} from "lucide-react";

const FAQS = [
  {
    q: "When will I get my tournament room code?",
    a: "Your game room code will appear directly on your match page exactly 10 minutes before the scheduled start time. You will also receive an in-app alert with a direct copy button.",
  },
  {
    q: "How does the external Ludo match work?",
    a: "LudoArena organizes the tournament brackets, entry fee escrow, and prize payouts. When the room code is revealed, you open your external Ludo app, join the custom room with that code, and play against your registered opponent.",
  },
  {
    q: "How do I claim my prize after winning?",
    a: "As soon as the match concludes, take a clear screenshot of the final score screen showing all player tokens and names. Upload the screenshot on your match page. Admin verification reviews it and releases prize funds to your Withdrawable Winnings Balance.",
  },
  {
    q: "What if my opponent disconnects or fails to show up?",
    a: "If an opponent fails to join the room within 5 minutes of kickoff, take a screenshot of the lobby waiting screen and report a match dispute. Our admin team will verify and award the default win or refund your entry fee.",
  },
  {
    q: "How fast are UPI and Bank withdrawals processed?",
    a: "Withdrawal requests are reviewed and disbursed by our finance desk within 15 to 30 minutes 24/7. In Coins mode, play rewards and badges are instant.",
  },
  {
    q: "Is playing skill-based Ludo legal in India?",
    a: "Yes. Competitions of skill are recognized under the Public Gambling Act, 1867 and affirmed by the Supreme Court of India. Residents of states with local restrictions (Assam, Odisha, Telangana, Nagaland, Andhra Pradesh, and Sikkim) are prohibited from cash contests.",
  },
];

export default function SupportPage() {
  const { currentUser, addTicket } = useAppStore();

  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [search, setSearch] = useState("");
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState("Tournament");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const filteredFaqs = FAQS.filter(
    (f) =>
      f.q.toLowerCase().includes(search.toLowerCase()) ||
      f.a.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    addTicket(subject, category, message);
    setSubmitted(true);
    setTimeout(() => {
      setIsTicketModalOpen(false);
      setSubmitted(false);
      setSubject("");
      setMessage("");
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <div className="inline-flex p-3 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 mb-2">
          <Headphones className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-black text-white">Help Center & Support Desk</h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Find instant answers to common questions or reach out directly to our 24/7 gamer support staff.
        </p>
      </div>

      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search help articles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-surface-100 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {currentUser && (
            <Link href="/support/tickets" className="flex-1 sm:flex-initial">
              <Button variant="glass" size="sm" className="w-full text-xs">
                View My Tickets
              </Button>
            </Link>
          )}
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsTicketModalOpen(true)}
            className="flex-1 sm:flex-initial text-xs shadow-neon-violet"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Open Support Ticket
          </Button>
        </div>
      </div>

      {/* FAQ Accordion */}
      <GlassCard className="p-6 space-y-3">
        <h2 className="text-base font-bold text-white mb-2 flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-violet-400" />
          Frequently Asked Questions
        </h2>

        <div className="divide-y divide-white/5">
          {filteredFaqs.map((faq, idx) => (
            <div key={idx} className="py-3">
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full flex items-center justify-between text-left font-bold text-sm text-white hover:text-cyan-300 transition-colors py-1"
              >
                <span>{faq.q}</span>
                {openFaq === idx ? (
                  <ChevronUp className="w-4 h-4 text-cyan-400 shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                )}
              </button>
              {openFaq === idx && (
                <p className="text-xs text-slate-300 mt-2 leading-relaxed animate-in fade-in duration-200">
                  {faq.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Create Ticket Modal */}
      <Modal
        isOpen={isTicketModalOpen}
        onClose={() => setIsTicketModalOpen(false)}
        title="Open Support Ticket"
        description="Our support team typically responds within 15 minutes."
      >
        {submitted ? (
          <div className="text-center py-6 space-y-2">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
            <h3 className="text-lg font-bold text-white">Ticket Submitted</h3>
            <p className="text-xs text-slate-300">
              Your ticket has been assigned to support staff. You can view responses on your tickets page.
            </p>
          </div>
        ) : (
          <form onSubmit={handleCreateTicket} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-surface-100 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500 font-semibold"
              >
                <option value="Tournament">Tournament & Room Code</option>
                <option value="Payment">Deposit Issue</option>
                <option value="Withdrawal">Withdrawal & Payout</option>
                <option value="Result Dispute">Match Result Conflict</option>
                <option value="Account">Account & KYC</option>
                <option value="Other">Other Query</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Subject</label>
              <input
                type="text"
                required
                placeholder="Brief summary of your issue..."
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full bg-surface-100 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Detailed Message
              </label>
              <textarea
                rows={4}
                required
                placeholder="Please describe your issue, tournament name, or transaction ID..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-surface-100 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-violet-500"
              />
            </div>

            <Button type="submit" variant="primary" className="w-full text-xs font-bold">
              <Send className="w-3.5 h-3.5 mr-1.5" />
              Submit Ticket
            </Button>
          </form>
        )}
      </Modal>
    </div>
  );
}
