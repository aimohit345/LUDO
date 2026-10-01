import { create } from "zustand";
import { persist } from "zustand/middleware";
import { INITIAL_USERS, INITIAL_TOURNAMENTS, INITIAL_TRANSACTIONS, INITIAL_TICKETS, INITIAL_WITHDRAWALS, INITIAL_KYC, MockUser, MockTournament, MockTransaction, MockTicket, MockPayoutRequest, MockKycDoc } from "@/lib/mock-data";

interface AppState {
  // Current logged in user
  currentUser: MockUser | null;
  setCurrentUser: (user: MockUser | null) => void;
  switchUserRole: (role: "PLAYER" | "SUPER_ADMIN") => void;

  // Tournaments
  tournaments: MockTournament[];
  setTournaments: (tournaments: MockTournament[]) => void;
  joinTournament: (tournamentId: string, userId: string) => { success: boolean; error?: string };
  leaveTournament: (tournamentId: string, userId: string) => { success: boolean; error?: string };
  addTournament: (tourney: Omit<MockTournament, "id" | "participants" | "current_players">) => void;
  updateTournamentStatus: (id: string, status: MockTournament["status"]) => void;

  // Results & Verification
  submitMatchResult: (tournamentId: string, userId: string, claimedRank: number, screenshotUrl: string) => void;
  verifyMatchResult: (tournamentId: string, winnerId: string, runnerUpId?: string) => void;

  // Wallet & Transactions
  transactions: MockTransaction[];
  addDeposit: (amount: number, provider: string) => void;
  requestWithdrawal: (amount: number, upiId: string) => { success: boolean; error?: string };
  withdrawals: MockPayoutRequest[];
  resolveWithdrawal: (id: string, status: "PAID" | "REJECTED", reason?: string) => void;

  // Support
  tickets: MockTicket[];
  addTicket: (subject: string, category: string, message: string) => void;
  replyTicket: (ticketId: string, message: string, senderType: "USER" | "ADMIN" | "AI") => void;
  updateTicketStatus: (ticketId: string, status: MockTicket["status"]) => void;

  // KYC
  kycDocuments: MockKycDoc[];
  submitKyc: (idType: "PAN" | "AADHAAR" | "BANK_PROOF", docNum: string, frontUrl: string) => void;
  verifyKyc: (id: string, status: "VERIFIED" | "REJECTED") => void;

  // UI Settings
  lowPowerMode: boolean;
  toggleLowPowerMode: () => void;
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      currentUser: INITIAL_USERS[1], // Default to NeonStriker for realistic player experience
      setCurrentUser: (user) => set({ currentUser: user }),
      switchUserRole: (role) => {
        if (role === "SUPER_ADMIN") {
          set({ currentUser: INITIAL_USERS[0] });
        } else {
          set({ currentUser: INITIAL_USERS[1] });
        }
      },

      tournaments: INITIAL_TOURNAMENTS,
      setTournaments: (tournaments) => set({ tournaments }),

      joinTournament: (tournamentId, userId) => {
        const { tournaments, currentUser, transactions } = get();
        const tourney = tournaments.find((t) => t.id === tournamentId);
        if (!tourney) return { success: false, error: "Tournament not found" };
        if (tourney.status !== "REGISTRATION_OPEN" && tourney.status !== "UPCOMING") {
          return { success: false, error: "Registration is not open" };
        }
        if (tourney.current_players >= tourney.max_players) {
          return { success: false, error: "Tournament is already full" };
        }
        if (tourney.participants.some((p) => p.user_id === userId)) {
          return { success: false, error: "Already registered for this tournament" };
        }

        if (currentUser) {
          const totalBalance = currentUser.wallet.deposit_balance + currentUser.wallet.winnings_balance + currentUser.wallet.bonus_balance;
          if (totalBalance < tourney.entry_fee) {
            return { success: false, error: "Insufficient wallet balance" };
          }

          // Deduct fee: bonus first (up to 20%), then deposit, then winnings
          const fee = tourney.entry_fee;
          const bonusUse = Math.min(currentUser.wallet.bonus_balance, fee * 0.2);
          const rem1 = fee - bonusUse;
          const depositUse = Math.min(currentUser.wallet.deposit_balance, rem1);
          const winningsUse = rem1 - depositUse;

          const updatedUser: MockUser = {
            ...currentUser,
            wallet: {
              ...currentUser.wallet,
              bonus_balance: currentUser.wallet.bonus_balance - bonusUse,
              deposit_balance: currentUser.wallet.deposit_balance - depositUse,
              winnings_balance: currentUser.wallet.winnings_balance - winningsUse,
            },
          };

          const newTx: MockTransaction = {
            id: `tx-${Date.now()}`,
            user_id: userId,
            type: "ENTRY_FEE",
            amount: -fee,
            balance_bucket: depositUse > 0 ? "deposit" : "winnings",
            description: `Entry fee: ${tourney.title}`,
            created_at: new Date().toISOString(),
            status: "COMPLETED",
          };

          const updatedTourneys = tournaments.map((t) => {
            if (t.id === tournamentId) {
              const newCount = t.current_players + 1;
              return {
                ...t,
                current_players: newCount,
                status: newCount >= t.max_players ? ("FULL" as const) : t.status,
                participants: [
                  ...t.participants,
                  {
                    user_id: currentUser.id,
                    username: currentUser.username,
                    avatar_url: currentUser.avatar_url,
                    status: "REGISTERED",
                    joined_at: new Date().toISOString(),
                  },
                ],
              };
            }
            return t;
          });

          set({
            currentUser: updatedUser,
            tournaments: updatedTourneys,
            transactions: [newTx, ...transactions],
          });
          return { success: true };
        }
        return { success: false, error: "Please sign in to join" };
      },

      leaveTournament: (tournamentId, userId) => {
        const { tournaments, currentUser, transactions } = get();
        const tourney = tournaments.find((t) => t.id === tournamentId);
        if (!tourney) return { success: false, error: "Tournament not found" };

        const updatedTourneys = tournaments.map((t) => {
          if (t.id === tournamentId) {
            return {
              ...t,
              current_players: Math.max(0, t.current_players - 1),
              status: t.status === "FULL" ? ("REGISTRATION_OPEN" as const) : t.status,
              participants: t.participants.filter((p) => p.user_id !== userId),
            };
          }
          return t;
        });

        if (currentUser && tourney.entry_fee > 0) {
          const refundTx: MockTransaction = {
            id: `tx-${Date.now()}`,
            user_id: userId,
            type: "REFUND",
            amount: tourney.entry_fee,
            balance_bucket: "deposit",
            description: `Refund for leaving: ${tourney.title}`,
            created_at: new Date().toISOString(),
            status: "COMPLETED",
          };

          set({
            tournaments: updatedTourneys,
            currentUser: {
              ...currentUser,
              wallet: {
                ...currentUser.wallet,
                deposit_balance: currentUser.wallet.deposit_balance + tourney.entry_fee,
              },
            },
            transactions: [refundTx, ...transactions],
          });
        } else {
          set({ tournaments: updatedTourneys });
        }
        return { success: true };
      },

      addTournament: (tourney) => {
        const newTourney: MockTournament = {
          ...tourney,
          id: `t-${Date.now()}`,
          current_players: 0,
          participants: [],
        };
        set((state) => ({ tournaments: [newTourney, ...state.tournaments] }));
      },

      updateTournamentStatus: (id, status) => {
        set((state) => ({
          tournaments: state.tournaments.map((t) => (t.id === id ? { ...t, status } : t)),
        }));
      },

      submitMatchResult: (tournamentId, userId, claimedRank, screenshotUrl) => {
        set((state) => ({
          tournaments: state.tournaments.map((t) => {
            if (t.id === tournamentId) {
              const updatedParticipants = t.participants.map((p) =>
                p.user_id === userId
                  ? { ...p, claimed_rank: claimedRank, screenshot_url: screenshotUrl, status: "SUBMITTED" }
                  : p
              );
              return {
                ...t,
                status: "RESULT_PENDING" as const,
                participants: updatedParticipants,
              };
            }
            return t;
          }),
        }));
      },

      verifyMatchResult: (tournamentId, winnerId, runnerUpId) => {
        const { tournaments, currentUser, transactions } = get();
        const tourney = tournaments.find((t) => t.id === tournamentId);
        if (!tourney) return;

        const firstPlacePayout = Math.round(tourney.prize_pool * 0.9 * ((tourney.prize_distribution["1st"] || 100) / 100));

        let updatedUser = currentUser;
        const newTxs: MockTransaction[] = [];

        if (currentUser && currentUser.id === winnerId) {
          updatedUser = {
            ...currentUser,
            wins: currentUser.wins + 1,
            xp: currentUser.xp + 100,
            wallet: {
              ...currentUser.wallet,
              winnings_balance: currentUser.wallet.winnings_balance + firstPlacePayout,
            },
          };
          newTxs.push({
            id: `tx-${Date.now()}`,
            user_id: winnerId,
            type: "PRIZE",
            amount: firstPlacePayout,
            balance_bucket: "winnings",
            description: `1st Place Prize: ${tourney.title}`,
            created_at: new Date().toISOString(),
            status: "COMPLETED",
          });
        }

        const updatedTourneys = tournaments.map((t) =>
          t.id === tournamentId ? { ...t, status: "COMPLETED" as const } : t
        );

        set({
          tournaments: updatedTourneys,
          currentUser: updatedUser,
          transactions: [...newTxs, ...transactions],
        });
      },

      transactions: INITIAL_TRANSACTIONS,
      addDeposit: (amount, provider) => {
        const { currentUser, transactions } = get();
        if (!currentUser) return;

        const newTx: MockTransaction = {
          id: `tx-${Date.now()}`,
          user_id: currentUser.id,
          type: "DEPOSIT",
          amount: amount,
          balance_bucket: "deposit",
          description: `Deposit via ${provider}`,
          created_at: new Date().toISOString(),
          status: "COMPLETED",
        };

        set({
          currentUser: {
            ...currentUser,
            wallet: {
              ...currentUser.wallet,
              deposit_balance: currentUser.wallet.deposit_balance + amount,
            },
          },
          transactions: [newTx, ...transactions],
        });
      },

      withdrawals: INITIAL_WITHDRAWALS,
      requestWithdrawal: (amount, upiId) => {
        const { currentUser, transactions, withdrawals } = get();
        if (!currentUser) return { success: false, error: "Please log in" };
        if (currentUser.wallet.winnings_balance < amount) {
          return { success: false, error: "Insufficient withdrawable winnings balance" };
        }

        const newPayout: MockPayoutRequest = {
          id: `w-${Date.now()}`,
          user_id: currentUser.id,
          username: currentUser.username,
          amount,
          payout_method: { type: "UPI", details: upiId },
          status: "PENDING",
          created_at: new Date().toISOString(),
        };

        const newTx: MockTransaction = {
          id: `tx-${Date.now()}`,
          user_id: currentUser.id,
          type: "WITHDRAWAL",
          amount: -amount,
          balance_bucket: "winnings",
          description: `Withdrawal to ${upiId} (Pending)`,
          created_at: new Date().toISOString(),
          status: "PENDING",
        };

        set({
          currentUser: {
            ...currentUser,
            wallet: {
              ...currentUser.wallet,
              winnings_balance: currentUser.wallet.winnings_balance - amount,
            },
          },
          withdrawals: [newPayout, ...withdrawals],
          transactions: [newTx, ...transactions],
        });

        return { success: true };
      },

      resolveWithdrawal: (id, status, reason) => {
        const { withdrawals, transactions, currentUser } = get();
        const req = withdrawals.find((w) => w.id === id);
        if (!req) return;

        let updatedUser = currentUser;
        const newTxs: MockTransaction[] = [];

        if (status === "REJECTED" && currentUser && currentUser.id === req.user_id) {
          updatedUser = {
            ...currentUser,
            wallet: {
              ...currentUser.wallet,
              winnings_balance: currentUser.wallet.winnings_balance + req.amount,
            },
          };
          newTxs.push({
            id: `tx-${Date.now()}`,
            user_id: req.user_id,
            type: "WITHDRAWAL_REVERSAL",
            amount: req.amount,
            balance_bucket: "winnings",
            description: `Withdrawal Reversal: ${reason || "Verification rejected"}`,
            created_at: new Date().toISOString(),
            status: "COMPLETED",
          });
        }

        set({
          withdrawals: withdrawals.map((w) => (w.id === id ? { ...w, status } : w)),
          currentUser: updatedUser,
          transactions: [...newTxs, ...transactions],
        });
      },

      tickets: INITIAL_TICKETS,
      addTicket: (subject, category, message) => {
        const { currentUser, tickets } = get();
        if (!currentUser) return;
        const newTicket: MockTicket = {
          id: `tick-${Date.now()}`,
          ticket_number: 1000 + tickets.length + 1,
          user_id: currentUser.id,
          username: currentUser.username,
          subject,
          category,
          priority: "MEDIUM",
          status: "OPEN",
          created_at: new Date().toISOString(),
          messages: [
            {
              id: `msg-${Date.now()}`,
              sender_type: "USER",
              sender_name: currentUser.username,
              message,
              created_at: new Date().toISOString(),
            },
          ],
        };
        set({ tickets: [newTicket, ...tickets] });
      },

      replyTicket: (ticketId, message, senderType) => {
        const { tickets, currentUser } = get();
        set({
          tickets: tickets.map((t) => {
            if (t.id === ticketId) {
              const newMsg = {
                id: `msg-${Date.now()}`,
                sender_type: senderType,
                sender_name: senderType === "USER" ? (currentUser?.username || "Player") : senderType === "AI" ? "Arena Bot" : "Support Staff",
                message,
                created_at: new Date().toISOString(),
              };
              return {
                ...t,
                status: senderType === "USER" ? ("IN_PROGRESS" as const) : ("WAITING_USER" as const),
                messages: [...t.messages, newMsg],
              };
            }
            return t;
          }),
        });
      },

      updateTicketStatus: (ticketId, status) => {
        set((state) => ({
          tickets: state.tickets.map((t) => (t.id === ticketId ? { ...t, status } : t)),
        }));
      },

      kycDocuments: INITIAL_KYC,
      submitKyc: (idType, docNum, frontUrl) => {
        const { currentUser, kycDocuments } = get();
        if (!currentUser) return;
        const newDoc: MockKycDoc = {
          id: `kyc-${Date.now()}`,
          user_id: currentUser.id,
          username: currentUser.username,
          id_type: idType,
          document_number: docNum,
          front_url: frontUrl,
          status: "PENDING",
          created_at: new Date().toISOString(),
        };
        set({ kycDocuments: [newDoc, ...kycDocuments] });
      },

      verifyKyc: (id, status) => {
        set((state) => ({
          kycDocuments: state.kycDocuments.map((k) => (k.id === id ? { ...k, status } : k)),
        }));
      },

      lowPowerMode: false,
      toggleLowPowerMode: () => set((state) => ({ lowPowerMode: !state.lowPowerMode })),
      activeFilter: "ALL",
      setActiveFilter: (filter) => set({ activeFilter: filter }),
    }),
    {
      name: "ludo-arena-store-v1",
      partialize: (state) => ({
        currentUser: state.currentUser,
        lowPowerMode: state.lowPowerMode,
      }),
    }
  )
);
