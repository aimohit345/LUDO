"use client";

import React, { use, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store/useAppStore";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Countdown } from "@/components/ui/Countdown";
import { Modal } from "@/components/ui/Modal";
import { APP_CONFIG } from "@/config/app.config";
import { formatCurrency, formatTimestamp } from "@/lib/utils";
import {
  Copy,
  Check,
  ExternalLink,
  UploadCloud,
  FileImage,
  AlertTriangle,
  Swords,
  Clock,
  ShieldAlert,
  ArrowLeft,
  Trophy,
  CheckCircle2,
  Users,
} from "lucide-react";

export default function MatchRoomPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { tournaments, currentUser, submitMatchResult, addTicket } = useAppStore();

  const [copiedCode, setCopiedCode] = useState(false);
  const [claimedRank, setClaimedRank] = useState<number>(1);
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Dispute modal
  const [isDisputeModalOpen, setIsDisputeModalOpen] = useState(false);
  const [disputeReason, setDisputeReason] = useState("");
  const [disputeSubmitted, setDisputeSubmitted] = useState(false);

  const tournament = tournaments.find((t) => t.id === id);

  if (!tournament) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-bold text-white mb-2">Match Not Found</h2>
        <Link href="/my-matches">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to My Matches
          </Button>
        </Link>
      </div>
    );
  }

  // Room code reveal check: now >= start_time - 10 minutes
  const revealWindowMs = APP_CONFIG.features.roomCodeRevealMinutesBeforeStart * 60 * 1000;
  const matchStartTime = new Date(tournament.start_time).getTime();
  const isRoomCodeUnlocked =
    Date.now() >= matchStartTime - revealWindowMs ||
    tournament.status === "ROOM_SHARED" ||
    tournament.status === "LIVE" ||
    tournament.status === "RESULT_PENDING" ||
    tournament.status === "COMPLETED";

  const roomCode = tournament.room_code || "83921045";
  const myParticipant = tournament.participants.find((p) => p.user_id === currentUser?.id);
  const hasSubmitted = myParticipant?.status === "SUBMITTED" || !!myParticipant?.screenshot_url;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(roomCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrorMsg("Please upload a valid image file (JPG, PNG, WEBP).");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg("Image size exceeds maximum limit of 5 MB.");
      return;
    }

    setErrorMsg("");
    const reader = new FileReader();
    reader.onload = () => {
      setScreenshotPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmitResult = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    if (!screenshotPreview) {
      setErrorMsg("Please attach a screenshot of your match result screen.");
      return;
    }

    setIsUploading(true);
    setTimeout(() => {
      submitMatchResult(tournament.id, currentUser.id, claimedRank, screenshotPreview);
      setIsUploading(false);
      setUploadSuccess(true);
    }, 900);
  };

  const handleDisputeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !disputeReason) return;
    addTicket(
      `Match Dispute: ${tournament.title}`,
      "Result Dispute",
      `Dispute filed for match ${tournament.id} by ${currentUser.username}. Reason: ${disputeReason}`
    );
    setDisputeSubmitted(true);
    setTimeout(() => {
      setIsDisputeModalOpen(false);
      setDisputeSubmitted(false);
      setDisputeReason("");
    }, 1800);
  };

  // Stepper active calculation
  const getStepIndex = () => {
    if (tournament.status === "COMPLETED") return 4;
    if (hasSubmitted || tournament.status === "RESULT_PENDING") return 3;
    if (tournament.status === "LIVE") return 2;
    if (isRoomCodeUnlocked) return 1;
    return 0;
  };

  const activeStep = getStepIndex();
  const steps = [
    { label: "Joined", desc: "Registered" },
    { label: "Room Ready", desc: "Code Revealed" },
    { label: "Playing", desc: "Match Live" },
    { label: "Submit Result", desc: "Upload Screenshot" },
    { label: "Verified", desc: "Prizes Credited" },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Top Breadcrumb */}
      <Link
        href="/my-matches"
        className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to My Matches
      </Link>

      {/* Header Banner */}
      <GlassCard className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <StatusBadge status={tournament.status} />
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-white/5 border border-white/10 text-cyan-400 uppercase">
                {tournament.mode}
              </span>
            </div>
            <h1 className="text-2xl font-black text-white">{tournament.title}</h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Scheduled Start: {formatTimestamp(tournament.start_time)}
            </p>
          </div>

          <button
            onClick={() => setIsDisputeModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 text-xs font-semibold transition-colors"
          >
            <ShieldAlert className="w-4 h-4" />
            Report Issue / Dispute
          </button>
        </div>

        {/* Live Status Stepper */}
        <div className="grid grid-cols-5 gap-2 pt-2 border-t border-white/10">
          {steps.map((st, i) => (
            <div key={i} className="flex flex-col items-center text-center">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold font-mono transition-all ${
                  i < activeStep
                    ? "bg-emerald-500 text-black shadow-sm"
                    : i === activeStep
                    ? "bg-cyan-400 text-black shadow-neon-cyan animate-pulse"
                    : "bg-surface-200 text-slate-500 border border-white/5"
                }`}
              >
                {i < activeStep ? <Check className="w-4 h-4" /> : i + 1}
              </div>
              <span
                className={`text-[11px] font-bold mt-1.5 ${
                  i <= activeStep ? "text-white" : "text-slate-500"
                }`}
              >
                {st.label}
              </span>
              <span className="text-[9px] text-slate-400 hidden sm:inline">{st.desc}</span>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Grid: Room Code & Result Upload */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Col: Room Code Card */}
        <div className="lg:col-span-6 space-y-6">
          <GlassCard
            glow={isRoomCodeUnlocked ? "cyan" : "none"}
            className="p-6 relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Swords className="w-5 h-5 text-cyan-400" />
                Game Room Code
              </h2>
              {isRoomCodeUnlocked ? (
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  Ready to Join
                </span>
              ) : (
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Code Locked
                </span>
              )}
            </div>

            {isRoomCodeUnlocked ? (
              <div className="space-y-4">
                <p className="text-xs text-slate-300">
                  Enter this custom room code inside your external Ludo app to join the match lobby:
                </p>

                {/* Big Room Code Display */}
                <div className="p-4 rounded-2xl bg-surface-200/80 border border-cyan-500/40 shadow-neon-cyan/20 flex items-center justify-between gap-4">
                  <span className="font-mono text-3xl font-black text-white tracking-widest selection:bg-cyan-500">
                    {roomCode}
                  </span>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleCopyCode}
                    className="font-bold text-xs"
                  >
                    {copiedCode ? (
                      <>
                        <Check className="w-3.5 h-3.5 mr-1 text-emerald-400" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 mr-1" />
                        Copy Code
                      </>
                    )}
                  </Button>
                </div>

                <div className="flex gap-2">
                  <a
                    href={`ludoapp://room/${roomCode}`}
                    className="flex-1 block"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Button variant="primary" className="w-full text-xs justify-center">
                      <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
                      Open Game App
                    </Button>
                  </a>
                </div>

                <p className="text-[10px] text-slate-400 leading-tight">
                  Match Host: <strong className="text-white">ArenaHost_Official</strong> • Audit
                  logged for fair play.
                </p>
              </div>
            ) : (
              <div className="text-center py-8 space-y-3">
                <div className="p-3 rounded-full bg-amber-500/10 text-amber-400 w-12 h-12 mx-auto flex items-center justify-center border border-amber-500/20">
                  <Clock className="w-6 h-6 animate-pulse" />
                </div>
                <h3 className="text-base font-bold text-white">Room Code Unlocks Soon</h3>
                <p className="text-xs text-slate-400 max-w-xs mx-auto">
                  To prevent unauthorized sharing, room codes unlock exactly{" "}
                  <strong className="text-white">
                    {APP_CONFIG.features.roomCodeRevealMinutesBeforeStart} minutes
                  </strong>{" "}
                  prior to scheduled start.
                </p>
                <div className="pt-2 flex justify-center">
                  <Countdown targetDate={tournament.start_time} />
                </div>
              </div>
            )}
          </GlassCard>

          {/* Opponent list */}
          <GlassCard className="p-6">
            <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
              <Users className="w-5 h-5 text-violet-400" />
              Match Participants ({tournament.participants.length})
            </h3>
            <div className="divide-y divide-white/5 text-xs">
              {tournament.participants.map((player, idx) => (
                <div key={idx} className="py-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={player.avatar_url}
                      alt={player.username}
                      className="w-7 h-7 rounded-lg object-cover border border-violet-500/30"
                    />
                    <span className="font-semibold text-white">
                      {player.username}
                      {player.user_id === currentUser?.id && (
                        <span className="ml-1 text-[9px] uppercase px-1 rounded bg-cyan-500/20 text-cyan-300">
                          YOU
                        </span>
                      )}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-slate-300 uppercase">
                    {player.status}
                  </span>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* Right Col: Screenshot Result Uploader */}
        <div className="lg:col-span-6 space-y-6">
          <GlassCard className="p-6">
            <h2 className="text-base font-bold text-white mb-1 flex items-center gap-2">
              <UploadCloud className="w-5 h-5 text-pink-400" />
              Upload Match Result Screenshot
            </h2>
            <p className="text-xs text-slate-400 mb-6">
              When match ends, take a clear screenshot of the victory screen showing player names and final rank.
            </p>

            {hasSubmitted ? (
              <div className="text-center py-8 space-y-3 bg-surface-200/40 rounded-2xl border border-white/5 p-6">
                <div className="p-3 rounded-full bg-emerald-500/10 text-emerald-400 w-12 h-12 mx-auto flex items-center justify-center border border-emerald-500/20">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-white">Screenshot Under Admin Review</h3>
                <p className="text-xs text-slate-300 max-w-sm mx-auto">
                  Your claimed rank of{" "}
                  <strong className="text-cyan-400">
                    {myParticipant?.claimed_rank || 1}st Place
                  </strong>{" "}
                  has been recorded. Admin verification verifies winner screenshots side-by-side before releasing escrow prize payouts.
                </p>
                {myParticipant?.screenshot_url && (
                  <div className="mt-3 p-1 rounded-xl bg-surface-100 border border-white/10 max-w-xs mx-auto">
                    <img
                      src={myParticipant.screenshot_url}
                      alt="Uploaded screenshot"
                      className="w-full h-36 object-cover rounded-lg"
                    />
                  </div>
                )}
              </div>
            ) : (
              <form onSubmit={handleSubmitResult} className="space-y-4">
                {errorMsg && (
                  <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
                    {errorMsg}
                  </div>
                )}

                {/* Claimed rank */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Your Claimed Match Position
                  </label>
                  <select
                    value={claimedRank}
                    onChange={(e) => setClaimedRank(Number(e.target.value))}
                    className="w-full bg-surface-100 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-violet-500 font-semibold"
                  >
                    <option value={1}>1st Place (Winner)</option>
                    <option value={2}>2nd Place (Runner Up)</option>
                    <option value={3}>3rd Place</option>
                    <option value={4}>4th Place</option>
                  </select>
                </div>

                {/* Drag / File input */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Attach Screenshot (JPG, PNG, WEBP max 5MB)
                  </label>
                  <label className="flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-dashed border-white/15 hover:border-pink-500/50 bg-surface-100/50 cursor-pointer transition-colors group">
                    <FileImage className="w-8 h-8 text-slate-400 group-hover:text-pink-400 transition-colors mb-2" />
                    <span className="text-xs font-semibold text-white">Click or drag image file here</span>
                    <span className="text-[10px] text-slate-500 mt-0.5">EXIF data stripped automatically</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                </div>

                {screenshotPreview && (
                  <div className="relative rounded-xl overflow-hidden border border-white/10 p-1 bg-surface-100">
                    <img
                      src={screenshotPreview}
                      alt="Preview"
                      className="w-full h-40 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => setScreenshotPreview(null)}
                      className="absolute top-2 right-2 px-2 py-1 rounded bg-black/70 text-[10px] text-rose-300 hover:text-white"
                    >
                      Remove
                    </button>
                  </div>
                )}

                <Button
                  type="submit"
                  variant="accent"
                  className="w-full text-xs font-bold shadow-neon-pink"
                  isLoading={isUploading}
                  disabled={!screenshotPreview}
                >
                  Submit Screenshot for Verification
                </Button>

                <p className="text-[10px] text-slate-500 text-center leading-relaxed">
                  Platform automated SHA-256 and perceptual hash algorithms verify that screenshots are fresh and not reused from past tournaments.
                </p>
              </form>
            )}
          </GlassCard>
        </div>
      </div>

      {/* Dispute Modal */}
      <Modal
        isOpen={isDisputeModalOpen}
        onClose={() => setIsDisputeModalOpen(false)}
        title="Report Match Issue / Dispute"
        description="Submit a conflict report for admin resolution."
      >
        <form onSubmit={handleDisputeSubmit} className="space-y-4">
          {disputeSubmitted ? (
            <div className="text-center py-4 space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
              <p className="text-sm font-bold text-white">Dispute Ticket Created</p>
              <p className="text-xs text-slate-400">
                Staff has been alerted. The match status has been flagged for manual investigation.
              </p>
            </div>
          ) : (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Describe what happened
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="e.g. Opponent did not join external room code, or opponent claimed false 1st place rank..."
                  value={disputeReason}
                  onChange={(e) => setDisputeReason(e.target.value)}
                  className="w-full bg-surface-100 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => setIsDisputeModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="danger" size="sm" className="flex-1">
                  Submit Dispute Ticket
                </Button>
              </div>
            </>
          )}
        </form>
      </Modal>
    </div>
  );
}
