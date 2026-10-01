-- ============================================================================
-- LudoArena Database Migration 002: Functions, Stored Procedures & Triggers
-- ============================================================================

-- Function to handle new user registration from Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  v_username TEXT;
  v_ref_code TEXT;
  v_referred_by UUID := NULL;
  v_signup_ref TEXT;
BEGIN
  -- Extract username or generate from email
  v_username := COALESCE(
    NEW.raw_user_meta_data->>'username',
    SPLIT_PART(NEW.email, '@', 1) || '_' || SUBSTRING(gen_random_uuid()::text, 1, 4)
  );
  
  -- Generate unique referral code (first 4 letters of username + 4 hex chars)
  v_ref_code := UPPER(SUBSTRING(REGEXP_REPLACE(v_username, '[^a-zA-Z0-9]', '', 'g'), 1, 4)) || 
                UPPER(SUBSTRING(gen_random_uuid()::text, 1, 4));

  -- Check if signup has referral code
  v_signup_ref := NEW.raw_user_meta_data->>'referral_code';
  IF v_signup_ref IS NOT NULL AND v_signup_ref <> '' THEN
    SELECT id INTO v_referred_by FROM public.profiles WHERE referral_code = v_signup_ref LIMIT 1;
  END IF;

  -- 1. Create Profile
  INSERT INTO public.profiles (
    id,
    username,
    email,
    phone,
    avatar_url,
    in_game_username,
    referral_code,
    referred_by
  ) VALUES (
    NEW.id,
    v_username,
    NEW.email,
    NEW.phone,
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', '/avatars/default.png'),
    NEW.raw_user_meta_data->>'in_game_username',
    v_ref_code,
    v_referred_by
  );

  -- 2. Create Default Role (PLAYER)
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'PLAYER');

  -- 3. Create Wallet with starter coins
  INSERT INTO public.wallets (
    user_id,
    deposit_balance,
    winnings_balance,
    bonus_balance,
    coins_balance,
    currency
  ) VALUES (
    NEW.id,
    0.00,
    0.00,
    15.00, -- starter signup bonus
    100.00, -- 100 starter coins
    'INR'
  );

  -- 4. Initial Wallet Bonus Transaction
  INSERT INTO public.wallet_transactions (
    wallet_id,
    user_id,
    type,
    amount,
    balance_bucket,
    description
  ) VALUES (
    (SELECT id FROM public.wallets WHERE user_id = NEW.id),
    NEW.id,
    'REFERRAL_BONUS',
    15.00,
    'bonus',
    'Welcome Signup Bonus'
  );

  -- 5. Record Referral Tracking if referred
  IF v_referred_by IS NOT NULL THEN
    INSERT INTO public.referrals (
      referrer_id,
      referee_id,
      referral_code,
      status
    ) VALUES (
      v_referred_by,
      NEW.id,
      v_signup_ref,
      'PENDING'
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();


-- ============================================================================
-- Atomic Join Tournament
-- ============================================================================
CREATE OR REPLACE FUNCTION public.join_tournament(
  p_user_id UUID,
  p_tournament_id UUID
)
RETURNS JSONB AS $$
DECLARE
  v_tourney RECORD;
  v_profile RECORD;
  v_wallet RECORD;
  v_entry_fee NUMERIC;
  v_bonus_to_use NUMERIC := 0.00;
  v_deposit_to_use NUMERIC := 0.00;
  v_winnings_to_use NUMERIC := 0.00;
  v_coins_to_use NUMERIC := 0.00;
  v_participant_id UUID;
  v_is_coins_mode BOOLEAN := FALSE;
BEGIN
  -- 1. Check user profile & ban status
  SELECT * INTO v_profile FROM public.profiles WHERE id = p_user_id;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'User profile not found');
  END IF;
  IF v_profile.is_banned THEN
    RETURN jsonb_build_object('success', false, 'error', 'Account is suspended or banned');
  END IF;

  -- 2. Lock tournament row for update (prevents race conditions)
  SELECT * INTO v_tourney FROM public.tournaments WHERE id = p_tournament_id FOR UPDATE;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Tournament not found');
  END IF;

  -- Status check
  IF v_tourney.status NOT IN ('REGISTRATION_OPEN', 'UPCOMING') THEN
    RETURN jsonb_build_object('success', false, 'error', 'Registration is not open for this tournament');
  END IF;

  -- Timing check
  IF NOW() >= v_tourney.registration_close_time THEN
    RETURN jsonb_build_object('success', false, 'error', 'Registration deadline has passed');
  END IF;

  -- Capacity check
  IF v_tourney.current_players >= v_tourney.max_players THEN
    RETURN jsonb_build_object('success', false, 'error', 'Tournament is already full');
  END IF;

  -- Duplicate participant check
  IF EXISTS (SELECT 1 FROM public.tournament_participants WHERE tournament_id = p_tournament_id AND user_id = p_user_id) THEN
    RETURN jsonb_build_object('success', false, 'error', 'You have already joined this tournament');
  END IF;

  v_entry_fee := v_tourney.entry_fee;

  -- Lock wallet row
  SELECT * INTO v_wallet FROM public.wallets WHERE user_id = p_user_id FOR UPDATE;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Wallet not found');
  END IF;

  -- If entry fee > 0, deduct from wallet
  IF v_entry_fee > 0 THEN
    -- Check if tournament is coin-based or cash
    IF v_tourney.tournament_type = 'FREE' THEN
      v_entry_fee := 0;
    END IF;

    IF v_entry_fee > 0 THEN
      -- In real cash mode: bonus (up to 20% or available) -> deposit -> winnings
      IF (v_wallet.deposit_balance + v_wallet.winnings_balance + v_wallet.bonus_balance) < v_entry_fee THEN
        RETURN jsonb_build_object('success', false, 'error', 'Insufficient wallet balance to join');
      END IF;

      -- Calculate bucket deductions
      v_bonus_to_use := LEAST(v_wallet.bonus_balance, v_entry_fee * 0.20); -- Max 20% from bonus
      IF (v_entry_fee - v_bonus_to_use) > 0 THEN
        v_deposit_to_use := LEAST(v_wallet.deposit_balance, v_entry_fee - v_bonus_to_use);
      END IF;
      v_winnings_to_use := v_entry_fee - v_bonus_to_use - v_deposit_to_use;

      -- Execute wallet balance deductions
      UPDATE public.wallets
      SET 
        bonus_balance = bonus_balance - v_bonus_to_use,
        deposit_balance = deposit_balance - v_deposit_to_use,
        winnings_balance = winnings_balance - v_winnings_to_use,
        updated_at = NOW()
      WHERE id = v_wallet.id;

      -- Record Ledger Transactions & Escrow
      IF v_bonus_to_use > 0 THEN
        INSERT INTO public.wallet_transactions (wallet_id, user_id, type, amount, balance_bucket, reference_id, reference_type, description)
        VALUES (v_wallet.id, p_user_id, 'ENTRY_FEE', -v_bonus_to_use, 'bonus', p_tournament_id::text, 'tournament', 'Entry fee (Bonus): ' || v_tourney.title);
        
        INSERT INTO public.escrow_holds (tournament_id, user_id, amount, balance_bucket, status)
        VALUES (p_tournament_id, p_user_id, v_bonus_to_use, 'bonus', 'HELD');
      END IF;

      IF v_deposit_to_use > 0 THEN
        INSERT INTO public.wallet_transactions (wallet_id, user_id, type, amount, balance_bucket, reference_id, reference_type, description)
        VALUES (v_wallet.id, p_user_id, 'ENTRY_FEE', -v_deposit_to_use, 'deposit', p_tournament_id::text, 'tournament', 'Entry fee (Deposit): ' || v_tourney.title);
        
        INSERT INTO public.escrow_holds (tournament_id, user_id, amount, balance_bucket, status)
        VALUES (p_tournament_id, p_user_id, v_deposit_to_use, 'deposit', 'HELD');
      END IF;

      IF v_winnings_to_use > 0 THEN
        INSERT INTO public.wallet_transactions (wallet_id, user_id, type, amount, balance_bucket, reference_id, reference_type, description)
        VALUES (v_wallet.id, p_user_id, 'ENTRY_FEE', -v_winnings_to_use, 'winnings', p_tournament_id::text, 'tournament', 'Entry fee (Winnings): ' || v_tourney.title);
        
        INSERT INTO public.escrow_holds (tournament_id, user_id, amount, balance_bucket, status)
        VALUES (p_tournament_id, p_user_id, v_winnings_to_use, 'winnings', 'HELD');
      END IF;
    END IF;
  END IF;

  -- Insert Participant
  INSERT INTO public.tournament_participants (
    tournament_id,
    user_id,
    in_game_name,
    status
  ) VALUES (
    p_tournament_id,
    p_user_id,
    COALESCE(v_profile.in_game_username, v_profile.username),
    'REGISTERED'
  ) RETURNING id INTO v_participant_id;

  -- Increment current players
  UPDATE public.tournaments
  SET 
    current_players = current_players + 1,
    status = CASE WHEN current_players + 1 >= max_players THEN 'FULL'::tournament_status ELSE status END,
    updated_at = NOW()
  WHERE id = p_tournament_id;

  -- Add Notification
  INSERT INTO public.notifications (user_id, title, message, type, action_url)
  VALUES (
    p_user_id,
    'Joined Tournament: ' || v_tourney.title,
    'You have secured your spot. Room code will be available before the match starts.',
    'TOURNAMENT',
    '/match/' || p_tournament_id
  );

  RETURN jsonb_build_object(
    'success', true,
    'participant_id', v_participant_id,
    'tournament_id', p_tournament_id,
    'current_players', v_tourney.current_players + 1
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- ============================================================================
-- Atomic Leave Tournament & Refund
-- ============================================================================
CREATE OR REPLACE FUNCTION public.leave_tournament(
  p_user_id UUID,
  p_tournament_id UUID
)
RETURNS JSONB AS $$
DECLARE
  v_tourney RECORD;
  v_escrow RECORD;
  v_wallet RECORD;
BEGIN
  -- Lock tournament
  SELECT * INTO v_tourney FROM public.tournaments WHERE id = p_tournament_id FOR UPDATE;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Tournament not found');
  END IF;

  IF NOW() >= v_tourney.registration_close_time THEN
    RETURN jsonb_build_object('success', false, 'error', 'Cannot leave after registration has closed');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.tournament_participants WHERE tournament_id = p_tournament_id AND user_id = p_user_id) THEN
    RETURN jsonb_build_object('success', false, 'error', 'You are not a participant in this tournament');
  END IF;

  -- Fetch user wallet
  SELECT * INTO v_wallet FROM public.wallets WHERE user_id = p_user_id FOR UPDATE;

  -- Process refunds from escrow
  FOR v_escrow IN 
    SELECT * FROM public.escrow_holds 
    WHERE tournament_id = p_tournament_id AND user_id = p_user_id AND status = 'HELD'
  LOOP
    -- Refund to appropriate balance bucket
    IF v_escrow.balance_bucket = 'bonus' THEN
      UPDATE public.wallets SET bonus_balance = bonus_balance + v_escrow.amount WHERE id = v_wallet.id;
    ELSIF v_escrow.balance_bucket = 'deposit' THEN
      UPDATE public.wallets SET deposit_balance = deposit_balance + v_escrow.amount WHERE id = v_wallet.id;
    ELSIF v_escrow.balance_bucket = 'winnings' THEN
      UPDATE public.wallets SET winnings_balance = winnings_balance + v_escrow.amount WHERE id = v_wallet.id;
    END IF;

    -- Record transaction
    INSERT INTO public.wallet_transactions (
      wallet_id, user_id, type, amount, balance_bucket, reference_id, reference_type, description
    ) VALUES (
      v_wallet.id, p_user_id, 'REFUND', v_escrow.amount, v_escrow.balance_bucket, p_tournament_id::text, 'tournament',
      'Refund for leaving tournament: ' || v_tourney.title
    );

    -- Mark escrow refunded
    UPDATE public.escrow_holds SET status = 'REFUNDED', updated_at = NOW() WHERE id = v_escrow.id;
  END LOOP;

  -- Remove participant
  DELETE FROM public.tournament_participants WHERE tournament_id = p_tournament_id AND user_id = p_user_id;

  -- Decrement player count and update status
  UPDATE public.tournaments
  SET 
    current_players = GREATEST(0, current_players - 1),
    status = CASE WHEN status = 'FULL' THEN 'REGISTRATION_OPEN'::tournament_status ELSE status END,
    updated_at = NOW()
  WHERE id = p_tournament_id;

  RETURN jsonb_build_object('success', true, 'message', 'Left tournament and refunded');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- ============================================================================
-- Atomic Distribute Prizes (Idempotent)
-- ============================================================================
CREATE OR REPLACE FUNCTION public.distribute_prizes(
  p_tournament_id UUID
)
RETURNS JSONB AS $$
DECLARE
  v_tourney RECORD;
  v_dist JSONB;
  v_result RECORD;
  v_rank_key TEXT;
  v_percent NUMERIC;
  v_prize_amount NUMERIC;
  v_platform_fee NUMERIC;
  v_payout_amount NUMERIC;
  v_wallet_id UUID;
  v_total_distributed NUMERIC := 0.00;
BEGIN
  -- Lock tournament
  SELECT * INTO v_tourney FROM public.tournaments WHERE id = p_tournament_id FOR UPDATE;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Tournament not found');
  END IF;

  -- Idempotency check: Cannot distribute if already completed
  IF v_tourney.status = 'COMPLETED' THEN
    RETURN jsonb_build_object('success', false, 'error', 'Prizes have already been distributed');
  END IF;

  v_dist := v_tourney.prize_distribution;

  -- Loop through approved match results ordered by claimed/verified rank
  FOR v_result IN 
    SELECT * FROM public.match_results 
    WHERE tournament_id = p_tournament_id AND status = 'APPROVED'
    ORDER BY claimed_rank ASC
  LOOP
    v_rank_key := CASE 
      WHEN v_result.claimed_rank = 1 THEN '1st'
      WHEN v_result.claimed_rank = 2 THEN '2nd'
      WHEN v_result.claimed_rank = 3 THEN '3rd'
      ELSE v_result.claimed_rank || 'th'
    END;

    -- Check if rank has a prize allocation
    IF v_dist ? v_rank_key THEN
      v_percent := (v_dist->>v_rank_key)::NUMERIC;
      v_prize_amount := ROUND((v_tourney.prize_pool * v_percent / 100.0), 2);
      
      -- Deduct platform commission (e.g., 10%)
      v_platform_fee := ROUND((v_prize_amount * 0.10), 2);
      v_payout_amount := v_prize_amount - v_platform_fee;

      IF v_payout_amount > 0 THEN
        -- Get Winner's Wallet
        SELECT id INTO v_wallet_id FROM public.wallets WHERE user_id = v_result.user_id;

        -- Credit Winnings Balance
        UPDATE public.wallets
        SET 
          winnings_balance = winnings_balance + v_payout_amount,
          updated_at = NOW()
        WHERE id = v_wallet_id;

        -- Record Prize Transaction
        INSERT INTO public.wallet_transactions (
          wallet_id, user_id, type, amount, balance_bucket, reference_id, reference_type, description
        ) VALUES (
          v_wallet_id, v_result.user_id, 'PRIZE', v_payout_amount, 'winnings', p_tournament_id::text, 'tournament',
          'Prize for ' || v_rank_key || ' place in: ' || v_tourney.title
        );

        -- Record Platform Fee Transaction for book-keeping
        INSERT INTO public.wallet_transactions (
          wallet_id, user_id, type, amount, balance_bucket, reference_id, reference_type, description
        ) VALUES (
          v_wallet_id, v_result.user_id, 'FEE', -v_platform_fee, 'winnings', p_tournament_id::text, 'tournament',
          'Platform Commission (10%) for: ' || v_tourney.title
        );

        -- Update participant record
        UPDATE public.tournament_participants
        SET 
          final_rank = v_result.claimed_rank,
          prize_awarded = v_payout_amount,
          status = 'SUBMITTED'
        WHERE tournament_id = p_tournament_id AND user_id = v_result.user_id;

        -- Update profile wins & XP
        UPDATE public.profiles
        SET 
          wins = wins + (CASE WHEN v_result.claimed_rank = 1 THEN 1 ELSE 0 END),
          losses = losses + (CASE WHEN v_result.claimed_rank > 1 THEN 1 ELSE 0 END),
          xp = xp + (CASE WHEN v_result.claimed_rank = 1 THEN 100 ELSE 30 END),
          level = 1 + (xp + (CASE WHEN v_result.claimed_rank = 1 THEN 100 ELSE 30 END)) / 500,
          updated_at = NOW()
        WHERE id = v_result.user_id;

        -- Winner Notification
        INSERT INTO public.notifications (user_id, title, message, type, action_url)
        VALUES (
          v_result.user_id,
          'Prize Credited: ' || v_tourney.title,
          'Congratulations! You won ' || v_payout_amount || ' INR. Winnings credited to your wallet.',
          'WALLET',
          '/wallet'
        );

        v_total_distributed := v_total_distributed + v_payout_amount;
      END IF;
    END IF;
  END LOOP;

  -- Release escrow holds
  UPDATE public.escrow_holds
  SET status = 'RELEASED', updated_at = NOW()
  WHERE tournament_id = p_tournament_id AND status = 'HELD';

  -- Mark tournament completed
  UPDATE public.tournaments
  SET status = 'COMPLETED', updated_at = NOW()
  WHERE id = p_tournament_id;

  RETURN jsonb_build_object(
    'success', true,
    'total_distributed', v_total_distributed,
    'tournament_id', p_tournament_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- ============================================================================
-- Atomic Credit Deposit
-- ============================================================================
CREATE OR REPLACE FUNCTION public.credit_deposit(
  p_user_id UUID,
  p_amount NUMERIC,
  p_order_id TEXT,
  p_provider TEXT,
  p_payment_id TEXT DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
  v_wallet_id UUID;
  v_existing_tx UUID;
BEGIN
  -- Idempotency check via reference_id
  SELECT id INTO v_existing_tx FROM public.wallet_transactions 
  WHERE reference_id = p_order_id AND type = 'DEPOSIT' LIMIT 1;

  IF v_existing_tx IS NOT NULL THEN
    RETURN jsonb_build_object('success', true, 'message', 'Deposit already credited');
  END IF;

  -- Lock wallet
  SELECT id INTO v_wallet_id FROM public.wallets WHERE user_id = p_user_id FOR UPDATE;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Wallet not found');
  END IF;

  -- Credit deposit balance
  UPDATE public.wallets
  SET deposit_balance = deposit_balance + p_amount, updated_at = NOW()
  WHERE id = v_wallet_id;

  -- Insert ledger entry
  INSERT INTO public.wallet_transactions (
    wallet_id, user_id, type, amount, balance_bucket, reference_id, reference_type, description, metadata
  ) VALUES (
    v_wallet_id, p_user_id, 'DEPOSIT', p_amount, 'deposit', p_order_id, 'order',
    'Deposit via ' || p_provider,
    jsonb_build_object('provider', p_provider, 'payment_id', p_payment_id)
  );

  -- Update payment order status if exists
  UPDATE public.payment_orders
  SET 
    status = 'PAID', 
    payment_id = COALESCE(p_payment_id, payment_id),
    updated_at = NOW()
  WHERE order_id = p_order_id;

  -- Notify user
  INSERT INTO public.notifications (user_id, title, message, type, action_url)
  VALUES (
    p_user_id,
    'Deposit Successful',
    'Your deposit of ' || p_amount || ' INR has been credited to your wallet.',
    'WALLET',
    '/wallet'
  );

  RETURN jsonb_build_object('success', true, 'amount', p_amount);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- ============================================================================
-- Atomic Request Withdrawal
-- ============================================================================
CREATE OR REPLACE FUNCTION public.request_withdrawal(
  p_user_id UUID,
  p_amount NUMERIC,
  p_payout_method_id UUID
)
RETURNS JSONB AS $$
DECLARE
  v_wallet RECORD;
  v_payout_id UUID;
BEGIN
  -- Lock wallet
  SELECT * INTO v_wallet FROM public.wallets WHERE user_id = p_user_id FOR UPDATE;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Wallet not found');
  END IF;

  -- Check withdrawable winnings balance
  IF v_wallet.winnings_balance < p_amount THEN
    RETURN jsonb_build_object('success', false, 'error', 'Insufficient withdrawable winnings balance');
  END IF;

  -- Deduct from winnings_balance (held in pending status)
  UPDATE public.wallets
  SET winnings_balance = winnings_balance - p_amount, updated_at = NOW()
  WHERE id = v_wallet.id;

  -- Create payout request
  INSERT INTO public.payout_requests (
    user_id, amount, payout_method_id, status
  ) VALUES (
    p_user_id, p_amount, p_payout_method_id, 'PENDING'
  ) RETURNING id INTO v_payout_id;

  -- Record transaction ledger entry
  INSERT INTO public.wallet_transactions (
    wallet_id, user_id, type, amount, balance_bucket, reference_id, reference_type, description, status
  ) VALUES (
    v_wallet.id, p_user_id, 'WITHDRAWAL', -p_amount, 'winnings', v_payout_id::text, 'payout_request',
    'Withdrawal Request (Pending Admin Verification)', 'PENDING'
  );

  -- Notify user
  INSERT INTO public.notifications (user_id, title, message, type, action_url)
  VALUES (
    p_user_id,
    'Withdrawal Request Received',
    'Your withdrawal request of ' || p_amount || ' INR is being reviewed by finance.',
    'WALLET',
    '/wallet'
  );

  RETURN jsonb_build_object('success', true, 'payout_request_id', v_payout_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- ============================================================================
-- Atomic Resolve Withdrawal (Approve / Reject)
-- ============================================================================
CREATE OR REPLACE FUNCTION public.resolve_withdrawal(
  p_request_id UUID,
  p_status TEXT, -- 'PAID' or 'REJECTED'
  p_reason TEXT DEFAULT NULL,
  p_admin_id UUID DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
  v_payout RECORD;
  v_wallet RECORD;
BEGIN
  -- Lock payout request
  SELECT * INTO v_payout FROM public.payout_requests WHERE id = p_request_id FOR UPDATE;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Payout request not found');
  END IF;

  IF v_payout.status NOT IN ('PENDING', 'APPROVED', 'PROCESSING') THEN
    RETURN jsonb_build_object('success', false, 'error', 'Payout request is already resolved');
  END IF;

  SELECT * INTO v_wallet FROM public.wallets WHERE user_id = v_payout.user_id FOR UPDATE;

  IF p_status = 'PAID' THEN
    UPDATE public.payout_requests
    SET status = 'PAID', admin_notes = p_reason, updated_at = NOW()
    WHERE id = p_request_id;

    UPDATE public.wallet_transactions
    SET status = 'COMPLETED', description = 'Withdrawal Processed & Paid'
    WHERE reference_id = p_request_id::text AND type = 'WITHDRAWAL';

    INSERT INTO public.notifications (user_id, title, message, type, action_url)
    VALUES (
      v_payout.user_id,
      'Withdrawal Completed',
      'Your withdrawal of ' || v_payout.amount || ' INR has been successfully processed to your account.',
      'WALLET',
      '/wallet'
    );
  ELSIF p_status = 'REJECTED' THEN
    -- Refund amount back to winnings balance
    UPDATE public.wallets
    SET winnings_balance = winnings_balance + v_payout.amount, updated_at = NOW()
    WHERE id = v_wallet.id;

    UPDATE public.payout_requests
    SET status = 'REJECTED', rejection_reason = p_reason, updated_at = NOW()
    WHERE id = p_request_id;

    -- Record reversal ledger
    INSERT INTO public.wallet_transactions (
      wallet_id, user_id, type, amount, balance_bucket, reference_id, reference_type, description
    ) VALUES (
      v_wallet.id, v_payout.user_id, 'WITHDRAWAL_REVERSAL', v_payout.amount, 'winnings', p_request_id::text, 'payout_request',
      'Withdrawal Rejected: ' || COALESCE(p_reason, 'Failed verification')
    );

    INSERT INTO public.notifications (user_id, title, message, type, action_url)
    VALUES (
      v_payout.user_id,
      'Withdrawal Rejected',
      'Your withdrawal request of ' || v_payout.amount || ' INR was rejected: ' || COALESCE(p_reason, 'Verification failed') || '. Funds have been refunded to your wallet.',
      'WALLET',
      '/wallet'
    );
  END IF;

  RETURN jsonb_build_object('success', true, 'status', p_status);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- ============================================================================
-- Atomic Cancel Tournament & Refund All
-- ============================================================================
CREATE OR REPLACE FUNCTION public.cancel_tournament_and_refund(
  p_tournament_id UUID,
  p_reason TEXT DEFAULT 'Minimum players requirement not reached'
)
RETURNS JSONB AS $$
DECLARE
  v_tourney RECORD;
  v_part RECORD;
  v_escrow RECORD;
  v_wallet_id UUID;
BEGIN
  SELECT * INTO v_tourney FROM public.tournaments WHERE id = p_tournament_id FOR UPDATE;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Tournament not found');
  END IF;

  IF v_tourney.status IN ('COMPLETED', 'CANCELLED') THEN
    RETURN jsonb_build_object('success', false, 'error', 'Tournament is already finished or cancelled');
  END IF;

  -- Refund each escrow hold
  FOR v_escrow IN 
    SELECT * FROM public.escrow_holds WHERE tournament_id = p_tournament_id AND status = 'HELD'
  LOOP
    SELECT id INTO v_wallet_id FROM public.wallets WHERE user_id = v_escrow.user_id;

    IF v_escrow.balance_bucket = 'bonus' THEN
      UPDATE public.wallets SET bonus_balance = bonus_balance + v_escrow.amount WHERE id = v_wallet_id;
    ELSIF v_escrow.balance_bucket = 'deposit' THEN
      UPDATE public.wallets SET deposit_balance = deposit_balance + v_escrow.amount WHERE id = v_wallet_id;
    ELSIF v_escrow.balance_bucket = 'winnings' THEN
      UPDATE public.wallets SET winnings_balance = winnings_balance + v_escrow.amount WHERE id = v_wallet_id;
    END IF;

    INSERT INTO public.wallet_transactions (
      wallet_id, user_id, type, amount, balance_bucket, reference_id, reference_type, description
    ) VALUES (
      v_wallet_id, v_escrow.user_id, 'REFUND', v_escrow.amount, v_escrow.balance_bucket, p_tournament_id::text, 'tournament',
      'Tournament Cancelled Refund: ' || v_tourney.title
    );

    UPDATE public.escrow_holds SET status = 'REFUNDED', updated_at = NOW() WHERE id = v_escrow.id;

    INSERT INTO public.notifications (user_id, title, message, type, action_url)
    VALUES (
      v_escrow.user_id,
      'Tournament Cancelled',
      'Tournament "' || v_tourney.title || '" was cancelled: ' || p_reason || '. Full entry fee has been refunded.',
      'TOURNAMENT',
      '/tournaments'
    );
  END LOOP;

  -- Mark tournament cancelled
  UPDATE public.tournaments
  SET status = 'CANCELLED', updated_at = NOW()
  WHERE id = p_tournament_id;

  RETURN jsonb_build_object('success', true, 'tournament_id', p_tournament_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
