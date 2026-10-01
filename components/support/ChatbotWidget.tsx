"use client";

import React, { useState } from "react";
import Link from "next/link";
import { MessageSquare, X, Send, Bot, User, Sparkles, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface ChatMessage {
  id: string;
  sender: "USER" | "AI";
  text: string;
}

export function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      sender: "AI",
      text: "👋 Hi! I'm your Arena AI Assistant. Ask me anything about room codes, wallet withdrawals, or game rules!",
    },
  ]);
  const [loading, setLoading] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg: ChatMessage = { id: String(Date.now()), sender: "USER", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai-support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg.text }),
      });
      const data = await res.json();
      const botMsg: ChatMessage = {
        id: String(Date.now() + 1),
        sender: "AI",
        text: data.reply || "I'm having trouble connecting right now. Please create a support ticket.",
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { id: String(Date.now() + 1), sender: "AI", text: "Service temporarily unavailable. Please open a ticket." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-50">
      {isOpen ? (
        <div className="w-80 sm:w-96 h-[480px] rounded-3xl border border-white/15 bg-surface-100/95 shadow-2xl backdrop-blur-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-violet-900/60 to-indigo-900/60 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-violet-600 flex items-center justify-center text-white shadow-neon-violet">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                  Arena AI Assistant
                  <Sparkles className="w-3 h-3 text-cyan-400" />
                </h3>
                <span className="text-[10px] text-emerald-400 font-semibold">Online • 24/7 Support</span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages container */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-2.5 ${m.sender === "USER" ? "justify-end" : "justify-start"}`}
              >
                {m.sender === "AI" && (
                  <div className="w-6 h-6 rounded-lg bg-violet-600/30 text-violet-300 flex items-center justify-center shrink-0 text-[10px] font-bold">
                    AI
                  </div>
                )}
                <div
                  className={`p-3 rounded-2xl max-w-[80%] leading-relaxed ${
                    m.sender === "USER"
                      ? "bg-violet-600 text-white rounded-br-none"
                      : "bg-surface-200 text-slate-200 border border-white/5 rounded-bl-none"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex gap-2 items-center text-slate-400 text-xs pl-8">
                <span className="w-2 h-2 rounded-full bg-violet-400 animate-ping" />
                <span>Thinking...</span>
              </div>
            )}
          </div>

          {/* Quick escalation banner */}
          <div className="px-3 py-1.5 bg-surface-200/50 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400">
            <span>Need human staff assistance?</span>
            <Link
              href="/support"
              onClick={() => setIsOpen(false)}
              className="text-cyan-400 font-bold hover:underline"
            >
              Open Ticket →
            </Link>
          </div>

          {/* Chat input form */}
          <form onSubmit={handleSend} className="p-3 bg-surface-100 border-t border-white/10 flex gap-2">
            <input
              type="text"
              placeholder="Ask about room code, rules, or wallet..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-surface-200 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="p-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 p-3 sm:px-4 sm:py-3 rounded-full bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 text-white font-bold text-xs shadow-neon-violet hover:scale-105 transition-all group"
          aria-label="Open AI Support Chatbot"
        >
          <Bot className="w-5 h-5 group-hover:rotate-12 transition-transform" />
          <span className="hidden sm:inline">Ask Arena AI</span>
        </button>
      )}
    </div>
  );
}
