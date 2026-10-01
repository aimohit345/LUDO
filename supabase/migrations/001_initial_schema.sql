-- ============================================================================
-- LudoArena Database Schema Migration 001: Initial Schema
-- ============================================================================

-- Enable pgcrypto for UUIDs & hashing
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Enums
CREATE TYPE user_role_type AS ENUM ('SUPER_ADMIN', 'ADMIN', 'FINANCE', 'SUPPORT', 'PLAYER');
CREATE TYPE tournament_mode AS ENUM ('1v1', '2_PLAYER', '4_PLAYER', 'QUICK', 'CLASSIC');
CREATE TYPE tournament_type AS ENUM ('FREE', 'PAID', 'SPONSORED');
CREATE TYPE tournament_status AS ENUM (
  'DRAFT', 'UPCOMING', 'REGISTRATION_OPEN', 'FULL', 
  'ROOM_SHARED', 'LIVE', 'RESULT_PENDING', 'COMPLETED', 'CANCELLED'
);
CREATE TYPE participant_status AS ENUM ('REGISTERED', 'PLAYING', 'SUBMITTED', 'FORFEIT', 'DISQUALIFIED');
CREATE TYPE transaction_type AS ENUM (
  'DEPOSIT', 'ENTRY_FEE', 'REFUND', 'PRIZE', 'REFERRAL_BONUS', 
  'WITHDRAWAL', 'WITHDRAWAL_REVERSAL', 'ADMIN_ADJUSTMENT', 'FEE'
);
CREATE TYPE balance_bucket_type AS ENUM ('deposit', 'winnings', 'bonus', 'coins');
CREATE TYPE payment_status AS ENUM ('CREATED', 'PAID', 'FAILED', 'EXPIRED');
CREATE TYPE payout_status AS ENUM ('PENDING', 'APPROVED', 'PROCESSING', 'PAID', 'REJECTED');
CREATE TYPE kyc_status AS ENUM ('PENDING', 'VERIFIED', 'REJECTED');
CREATE TYPE ticket_status AS ENUM ('OPEN', 'IN_PROGRESS', 'WAITING_USER', 'RESOLVED', 'CLOSED');
CREATE TYPE ticket_priority AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT');

-- 1. Profiles
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT UNIQUE,
  avatar_url TEXT DEFAULT '/avatars/default.png',
  in_game_username TEXT,
  level INT NOT NULL DEFAULT 1,
  xp INT NOT NULL DEFAULT 0,
  wins INT NOT NULL DEFAULT 0,
  losses INT NOT NULL DEFAULT 0,
  strikes INT NOT NULL DEFAULT 0,
  is_banned BOOLEAN NOT NULL DEFAULT FALSE,
  ban_reason TEXT,
  referral_code TEXT UNIQUE NOT NULL,
  referred_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_profiles_username ON profiles(username);
CREATE INDEX IF NOT EXISTS idx_profiles_referral_code ON profiles(referral_code);

-- 2. User Roles (RBAC)
CREATE TABLE IF NOT EXISTS user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role user_role_type NOT NULL DEFAULT 'PLAYER',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, role)
);
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON user_roles(user_id);

-- 3. Wallets
CREATE TABLE IF NOT EXISTS wallets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  deposit_balance NUMERIC(12,2) NOT NULL DEFAULT 0.00 CHECK (deposit_balance >= 0),
  winnings_balance NUMERIC(12,2) NOT NULL DEFAULT 0.00 CHECK (winnings_balance >= 0),
  bonus_balance NUMERIC(12,2) NOT NULL DEFAULT 0.00 CHECK (bonus_balance >= 0),
  coins_balance NUMERIC(12,2) NOT NULL DEFAULT 100.00 CHECK (coins_balance >= 0),
  currency TEXT NOT NULL DEFAULT 'INR',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_wallets_user_id ON wallets(user_id);

-- 4. Wallet Transactions (Append-Only Double Entry Ledger)
CREATE TABLE IF NOT EXISTS wallet_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_id UUID NOT NULL REFERENCES wallets(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type transaction_type NOT NULL,
  amount NUMERIC(12,2) NOT NULL,
  balance_bucket balance_bucket_type NOT NULL,
  reference_id TEXT,
  reference_type TEXT,
  description TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'COMPLETED',
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_wallet_tx_user_id ON wallet_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_wallet_tx_wallet_id ON wallet_transactions(wallet_id);

-- 5. Escrow Holds (Holds tournament entry fees until match distribution or refund)
CREATE TABLE IF NOT EXISTS escrow_holds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tournament_id UUID NOT NULL,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  amount NUMERIC(12,2) NOT NULL CHECK (amount > 0),
  balance_bucket balance_bucket_type NOT NULL,
  status TEXT NOT NULL DEFAULT 'HELD' CHECK (status IN ('HELD', 'RELEASED', 'REFUNDED')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Payment Orders (Deposits)
CREATE TABLE IF NOT EXISTS payment_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  order_id TEXT UNIQUE NOT NULL,
  payment_id TEXT UNIQUE,
  provider TEXT NOT NULL DEFAULT 'mock',
  amount NUMERIC(12,2) NOT NULL CHECK (amount > 0),
  currency TEXT NOT NULL DEFAULT 'INR',
  status payment_status NOT NULL DEFAULT 'CREATED',
  metadata JSONB DEFAULT '{}'::jsonb,
  idempotency_key TEXT UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. Payment Webhook Events (Raw audit log for webhook idempotency)
CREATE TABLE IF NOT EXISTS payment_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider TEXT NOT NULL,
  event_name TEXT NOT NULL,
  raw_payload JSONB NOT NULL,
  processed BOOLEAN NOT NULL DEFAULT FALSE,
  idempotency_key TEXT UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. Payout Methods
CREATE TABLE IF NOT EXISTS payout_methods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  method_type TEXT NOT NULL CHECK (method_type IN ('UPI', 'BANK')),
  upi_id TEXT,
  account_number TEXT,
  ifsc_code TEXT,
  account_holder_name TEXT,
  is_default BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. Payout Requests (Withdrawals)
CREATE TABLE IF NOT EXISTS payout_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  amount NUMERIC(12,2) NOT NULL CHECK (amount > 0),
  payout_method_id UUID REFERENCES payout_methods(id),
  status payout_status NOT NULL DEFAULT 'PENDING',
  rejection_reason TEXT,
  provider_payout_id TEXT,
  admin_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. KYC Documents
CREATE TABLE IF NOT EXISTS kyc_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  id_type TEXT NOT NULL CHECK (id_type IN ('PAN', 'AADHAAR', 'BANK_PROOF')),
  document_number TEXT NOT NULL,
  front_url TEXT NOT NULL,
  back_url TEXT,
  status kyc_status NOT NULL DEFAULT 'PENDING',
  rejection_reason TEXT,
  verified_by UUID REFERENCES profiles(id),
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 11. Tournaments
CREATE TABLE IF NOT EXISTS tournaments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  mode tournament_mode NOT NULL DEFAULT '1v1',
  tournament_type tournament_type NOT NULL DEFAULT 'FREE',
  entry_fee NUMERIC(12,2) NOT NULL DEFAULT 0.00 CHECK (entry_fee >= 0),
  prize_pool NUMERIC(12,2) NOT NULL DEFAULT 0.00 CHECK (prize_pool >= 0),
  prize_distribution JSONB NOT NULL DEFAULT '{"1st": 100}'::jsonb,
  max_players INT NOT NULL DEFAULT 2,
  min_players INT NOT NULL DEFAULT 2,
  current_players INT NOT NULL DEFAULT 0,
  start_time TIMESTAMPTZ NOT NULL,
  registration_close_time TIMESTAMPTZ NOT NULL,
  rules_text TEXT NOT NULL DEFAULT 'Standard Ludo rules. Room host creates room and shares room code. Winner takes screenshot of winning screen.',
  status tournament_status NOT NULL DEFAULT 'REGISTRATION_OPEN',
  live_stream_url TEXT,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_tournaments_status ON tournaments(status);
CREATE INDEX IF NOT EXISTS idx_tournaments_start_time ON tournaments(start_time);

-- 12. Tournament Participants
CREATE TABLE IF NOT EXISTS tournament_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tournament_id UUID NOT NULL REFERENCES tournaments(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  in_game_name TEXT,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  status participant_status NOT NULL DEFAULT 'REGISTERED',
  final_rank INT,
  prize_awarded NUMERIC(12,2) DEFAULT 0.00,
  UNIQUE(tournament_id, user_id)
);
CREATE INDEX IF NOT EXISTS idx_tournament_participants_t_id ON tournament_participants(tournament_id);

-- 13. Tournament Rooms (Encrypted room code with restricted reveal)
CREATE TABLE IF NOT EXISTS tournament_rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tournament_id UUID UNIQUE NOT NULL REFERENCES tournaments(id) ON DELETE CASCADE,
  room_code TEXT NOT NULL,
  host_name TEXT DEFAULT 'LudoHost',
  app_deep_link TEXT,
  is_revealed BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 14. Match Results
CREATE TABLE IF NOT EXISTS match_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tournament_id UUID NOT NULL REFERENCES tournaments(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  claimed_rank INT NOT NULL DEFAULT 1,
  status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED', 'DISPUTED')),
  notes TEXT,
  verified_by UUID REFERENCES profiles(id),
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(tournament_id, user_id)
);

-- 15. Result Screenshots
CREATE TABLE IF NOT EXISTS result_screenshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  result_id UUID NOT NULL REFERENCES match_results(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  tournament_id UUID NOT NULL REFERENCES tournaments(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  image_hash TEXT NOT NULL, -- SHA-256 for exact match
  perceptual_hash TEXT,    -- pHash for visual similarity match
  file_size INT NOT NULL,
  exif_stripped BOOLEAN NOT NULL DEFAULT TRUE,
  version INT NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_result_screenshots_hash ON result_screenshots(image_hash);

-- 16. Disputes
CREATE TABLE IF NOT EXISTS disputes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tournament_id UUID NOT NULL REFERENCES tournaments(id) ON DELETE CASCADE,
  reported_by UUID NOT NULL REFERENCES profiles(id),
  description TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'UNDER_REVIEW', 'RESOLVED')),
  resolution_notes TEXT,
  resolved_by UUID REFERENCES profiles(id),
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 17. Referrals
CREATE TABLE IF NOT EXISTS referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  referee_id UUID UNIQUE NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  referral_code TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'QUALIFIED', 'FLAGGED', 'VOIDED')),
  qualifying_action TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  qualified_at TIMESTAMPTZ
);

-- 18. Referral Rewards
CREATE TABLE IF NOT EXISTS referral_rewards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referral_id UUID NOT NULL REFERENCES referrals(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  reward_amount NUMERIC(12,2) NOT NULL,
  reward_type TEXT NOT NULL CHECK (reward_type IN ('REFERRER', 'REFEREE')),
  status TEXT NOT NULL DEFAULT 'CREDITED' CHECK (status IN ('PENDING', 'CREDITED', 'VOIDED')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 19. Notifications
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'SYSTEM',
  read BOOLEAN NOT NULL DEFAULT FALSE,
  action_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);

-- 20. Support Tickets
CREATE TABLE IF NOT EXISTS support_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_number SERIAL UNIQUE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Payment', 'Withdrawal', 'Tournament', 'Result Dispute', 'Account', 'Other')),
  priority ticket_priority NOT NULL DEFAULT 'MEDIUM',
  status ticket_status NOT NULL DEFAULT 'OPEN',
  assigned_to UUID REFERENCES profiles(id),
  related_tournament_id UUID REFERENCES tournaments(id),
  related_transaction_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 21. Ticket Messages
CREATE TABLE IF NOT EXISTS ticket_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID NOT NULL REFERENCES support_tickets(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES profiles(id),
  sender_type TEXT NOT NULL CHECK (sender_type IN ('USER', 'ADMIN', 'AI')),
  message TEXT NOT NULL,
  is_internal_note BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 22. Ticket Attachments
CREATE TABLE IF NOT EXISTS ticket_attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_message_id UUID NOT NULL REFERENCES ticket_messages(id) ON DELETE CASCADE,
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size INT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 23. Strikes & Penalties
CREATE TABLE IF NOT EXISTS strikes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  issued_by UUID REFERENCES profiles(id),
  strike_count INT NOT NULL DEFAULT 1,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 24. Device / IP Logs (Anti-fraud)
CREATE TABLE IF NOT EXISTS device_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  ip_address TEXT NOT NULL,
  user_agent TEXT,
  device_fingerprint TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 25. Immutable Audit Logs
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID REFERENCES profiles(id),
  action TEXT NOT NULL,
  target_entity TEXT NOT NULL,
  target_id TEXT NOT NULL,
  old_values JSONB,
  new_values JSONB,
  ip_address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);

-- 26. App Settings
CREATE TABLE IF NOT EXISTS app_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 27. Leaderboard View
CREATE OR REPLACE VIEW leaderboard AS
SELECT 
  p.id AS user_id,
  p.username,
  p.avatar_url,
  p.wins,
  p.losses,
  p.level,
  p.xp,
  COALESCE(SUM(CASE WHEN t.type = 'PRIZE' THEN t.amount ELSE 0 END), 0) AS total_earnings,
  CASE WHEN (p.wins + p.losses) > 0 
       THEN ROUND((p.wins::numeric / (p.wins + p.losses)::numeric) * 100, 1) 
       ELSE 0 
  END AS win_rate
FROM profiles p
LEFT JOIN wallet_transactions t ON p.id = t.user_id AND t.type = 'PRIZE'
WHERE p.is_banned = FALSE
GROUP BY p.id, p.username, p.avatar_url, p.wins, p.losses, p.level, p.xp
ORDER BY total_earnings DESC, p.wins DESC;
