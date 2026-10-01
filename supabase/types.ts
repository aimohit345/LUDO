export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRoleType = "SUPER_ADMIN" | "ADMIN" | "FINANCE" | "SUPPORT" | "PLAYER";
export type TournamentMode = "1v1" | "2_PLAYER" | "4_PLAYER" | "QUICK" | "CLASSIC";
export type TournamentType = "FREE" | "PAID" | "SPONSORED";
export type TournamentStatus =
  | "DRAFT"
  | "UPCOMING"
  | "REGISTRATION_OPEN"
  | "FULL"
  | "ROOM_SHARED"
  | "LIVE"
  | "RESULT_PENDING"
  | "COMPLETED"
  | "CANCELLED";
export type ParticipantStatus = "REGISTERED" | "PLAYING" | "SUBMITTED" | "FORFEIT" | "DISQUALIFIED";
export type TransactionType =
  | "DEPOSIT"
  | "ENTRY_FEE"
  | "REFUND"
  | "PRIZE"
  | "REFERRAL_BONUS"
  | "WITHDRAWAL"
  | "WITHDRAWAL_REVERSAL"
  | "ADMIN_ADJUSTMENT"
  | "FEE";
export type BalanceBucketType = "deposit" | "winnings" | "bonus" | "coins";
export type PaymentStatus = "CREATED" | "PAID" | "FAILED" | "EXPIRED";
export type PayoutStatus = "PENDING" | "APPROVED" | "PROCESSING" | "PAID" | "REJECTED";
export type KycStatus = "PENDING" | "VERIFIED" | "REJECTED";
export type TicketStatus = "OPEN" | "IN_PROGRESS" | "WAITING_USER" | "RESOLVED" | "CLOSED";
export type TicketPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string;
          email: string;
          phone: string | null;
          avatar_url: string;
          in_game_username: string | null;
          level: number;
          xp: number;
          wins: number;
          losses: number;
          strikes: number;
          is_banned: boolean;
          ban_reason: string | null;
          referral_code: string;
          referred_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["profiles"]["Row"]> & {
          id: string;
          username: string;
          email: string;
          referral_code: string;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Row"]>;
      };
      user_roles: {
        Row: {
          id: string;
          user_id: string;
          role: UserRoleType;
          created_at: string;
        };
        Insert: {
          user_id: string;
          role: UserRoleType;
        };
        Update: Partial<Database["public"]["Tables"]["user_roles"]["Row"]>;
      };
      wallets: {
        Row: {
          id: string;
          user_id: string;
          deposit_balance: number;
          winnings_balance: number;
          bonus_balance: number;
          coins_balance: number;
          currency: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["wallets"]["Row"]> & {
          user_id: string;
        };
        Update: Partial<Database["public"]["Tables"]["wallets"]["Row"]>;
      };
      wallet_transactions: {
        Row: {
          id: string;
          wallet_id: string;
          user_id: string;
          type: TransactionType;
          amount: number;
          balance_bucket: BalanceBucketType;
          reference_id: string | null;
          reference_type: string | null;
          description: string;
          status: string;
          metadata: Json | null;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["wallet_transactions"]["Row"]> & {
          wallet_id: string;
          user_id: string;
          type: TransactionType;
          amount: number;
          balance_bucket: BalanceBucketType;
          description: string;
        };
        Update: Partial<Database["public"]["Tables"]["wallet_transactions"]["Row"]>;
      };
      tournaments: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          mode: TournamentMode;
          tournament_type: TournamentType;
          entry_fee: number;
          prize_pool: number;
          prize_distribution: Json;
          max_players: number;
          min_players: number;
          current_players: number;
          start_time: string;
          registration_close_time: string;
          rules_text: string;
          status: TournamentStatus;
          live_stream_url: string | null;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["tournaments"]["Row"]> & {
          title: string;
          start_time: string;
          registration_close_time: string;
        };
        Update: Partial<Database["public"]["Tables"]["tournaments"]["Row"]>;
      };
      tournament_participants: {
        Row: {
          id: string;
          tournament_id: string;
          user_id: string;
          in_game_name: string | null;
          joined_at: string;
          status: ParticipantStatus;
          final_rank: number | null;
          prize_awarded: number;
        };
        Insert: Partial<Database["public"]["Tables"]["tournament_participants"]["Row"]> & {
          tournament_id: string;
          user_id: string;
        };
        Update: Partial<Database["public"]["Tables"]["tournament_participants"]["Row"]>;
      };
      tournament_rooms: {
        Row: {
          id: string;
          tournament_id: string;
          room_code: string;
          host_name: string | null;
          app_deep_link: string | null;
          is_revealed: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["tournament_rooms"]["Row"]> & {
          tournament_id: string;
          room_code: string;
        };
        Update: Partial<Database["public"]["Tables"]["tournament_rooms"]["Row"]>;
      };
      match_results: {
        Row: {
          id: string;
          tournament_id: string;
          user_id: string;
          claimed_rank: number;
          status: string;
          notes: string | null;
          verified_by: string | null;
          verified_at: string | null;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["match_results"]["Row"]> & {
          tournament_id: string;
          user_id: string;
        };
        Update: Partial<Database["public"]["Tables"]["match_results"]["Row"]>;
      };
      result_screenshots: {
        Row: {
          id: string;
          result_id: string;
          user_id: string;
          tournament_id: string;
          image_url: string;
          image_hash: string;
          perceptual_hash: string | null;
          file_size: number;
          exif_stripped: boolean;
          version: number;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["result_screenshots"]["Row"]> & {
          result_id: string;
          user_id: string;
          tournament_id: string;
          image_url: string;
          image_hash: string;
          file_size: number;
        };
        Update: Partial<Database["public"]["Tables"]["result_screenshots"]["Row"]>;
      };
      payout_requests: {
        Row: {
          id: string;
          user_id: string;
          amount: number;
          payout_method_id: string | null;
          status: PayoutStatus;
          rejection_reason: string | null;
          provider_payout_id: string | null;
          admin_notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["payout_requests"]["Row"]> & {
          user_id: string;
          amount: number;
        };
        Update: Partial<Database["public"]["Tables"]["payout_requests"]["Row"]>;
      };
      payout_methods: {
        Row: {
          id: string;
          user_id: string;
          method_type: "UPI" | "BANK";
          upi_id: string | null;
          account_number: string | null;
          ifsc_code: string | null;
          account_holder_name: string | null;
          is_default: boolean;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["payout_methods"]["Row"]> & {
          user_id: string;
          method_type: "UPI" | "BANK";
        };
        Update: Partial<Database["public"]["Tables"]["payout_methods"]["Row"]>;
      };
      kyc_documents: {
        Row: {
          id: string;
          user_id: string;
          id_type: "PAN" | "AADHAAR" | "BANK_PROOF";
          document_number: string;
          front_url: string;
          back_url: string | null;
          status: KycStatus;
          rejection_reason: string | null;
          verified_by: string | null;
          verified_at: string | null;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["kyc_documents"]["Row"]> & {
          user_id: string;
          id_type: "PAN" | "AADHAAR" | "BANK_PROOF";
          document_number: string;
          front_url: string;
        };
        Update: Partial<Database["public"]["Tables"]["kyc_documents"]["Row"]>;
      };
      support_tickets: {
        Row: {
          id: string;
          ticket_number: number;
          user_id: string;
          subject: string;
          category: string;
          priority: TicketPriority;
          status: TicketStatus;
          assigned_to: string | null;
          related_tournament_id: string | null;
          related_transaction_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["support_tickets"]["Row"]> & {
          user_id: string;
          subject: string;
          category: string;
        };
        Update: Partial<Database["public"]["Tables"]["support_tickets"]["Row"]>;
      };
      ticket_messages: {
        Row: {
          id: string;
          ticket_id: string;
          sender_id: string | null;
          sender_type: "USER" | "ADMIN" | "AI";
          message: string;
          is_internal_note: boolean;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["ticket_messages"]["Row"]> & {
          ticket_id: string;
          message: string;
          sender_type: "USER" | "ADMIN" | "AI";
        };
        Update: Partial<Database["public"]["Tables"]["ticket_messages"]["Row"]>;
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          message: string;
          type: string;
          read: boolean;
          action_url: string | null;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["notifications"]["Row"]> & {
          user_id: string;
          title: string;
          message: string;
        };
        Update: Partial<Database["public"]["Tables"]["notifications"]["Row"]>;
      };
      audit_logs: {
        Row: {
          id: string;
          actor_id: string | null;
          action: string;
          target_entity: string;
          target_id: string;
          old_values: Json | null;
          new_values: Json | null;
          ip_address: string | null;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["audit_logs"]["Row"]> & {
          action: string;
          target_entity: string;
          target_id: string;
        };
        Update: Partial<Database["public"]["Tables"]["audit_logs"]["Row"]>;
      };
    };
    Views: {
      leaderboard: {
        Row: {
          user_id: string;
          username: string;
          avatar_url: string;
          wins: number;
          losses: number;
          level: number;
          xp: number;
          total_earnings: number;
          win_rate: number;
        };
      };
    };
    Functions: {
      join_tournament: {
        Args: { p_user_id: string; p_tournament_id: string };
        Returns: Json;
      };
      leave_tournament: {
        Args: { p_user_id: string; p_tournament_id: string };
        Returns: Json;
      };
      distribute_prizes: {
        Args: { p_tournament_id: string };
        Returns: Json;
      };
      credit_deposit: {
        Args: {
          p_user_id: string;
          p_amount: number;
          p_order_id: string;
          p_provider: string;
          p_payment_id?: string;
        };
        Returns: Json;
      };
      request_withdrawal: {
        Args: {
          p_user_id: string;
          p_amount: number;
          p_payout_method_id: string;
        };
        Returns: Json;
      };
      resolve_withdrawal: {
        Args: {
          p_request_id: string;
          p_status: string;
          p_reason?: string;
          p_admin_id?: string;
        };
        Returns: Json;
      };
      cancel_tournament_and_refund: {
        Args: { p_tournament_id: string; p_reason?: string };
        Returns: Json;
      };
    };
  };
}
