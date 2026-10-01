-- ============================================================================
-- LudoArena Database Migration 004: Seed Data
-- ============================================================================

-- 1. Demo Admin User (UUID: 00000000-0000-0000-0000-000000000001)
INSERT INTO public.profiles (
  id, username, email, phone, avatar_url, in_game_username, level, xp, wins, losses, referral_code
) VALUES (
  '00000000-0000-0000-0000-000000000001',
  'superadmin',
  'admin@ludoarena.gg',
  '+919876543210',
  'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=150',
  'LudoKing_Admin',
  50, 15000, 320, 45,
  'ADMIN001'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.user_roles (user_id, role)
VALUES 
  ('00000000-0000-0000-0000-000000000001', 'SUPER_ADMIN'),
  ('00000000-0000-0000-0000-000000000001', 'ADMIN'),
  ('00000000-0000-0000-0000-000000000001', 'FINANCE')
ON CONFLICT DO NOTHING;

INSERT INTO public.wallets (user_id, deposit_balance, winnings_balance, bonus_balance, coins_balance)
VALUES ('00000000-0000-0000-0000-000000000001', 5000.00, 25000.00, 1000.00, 50000.00)
ON CONFLICT (user_id) DO NOTHING;

-- 2. 10 Demo Players
INSERT INTO public.profiles (id, username, email, phone, avatar_url, in_game_username, level, xp, wins, losses, referral_code)
VALUES
  ('00000000-0000-0000-0000-000000000002', 'NeonStriker', 'player1@ludoarena.gg', '+919876500001', 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150', 'Neon_007', 12, 3400, 48, 12, 'NEON4821'),
  ('00000000-0000-0000-0000-000000000003', 'CyberDice', 'player2@ludoarena.gg', '+919876500002', 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150', 'CyberRoll', 15, 4200, 65, 20, 'CYBR9912'),
  ('00000000-0000-0000-0000-000000000004', 'VortexKing', 'player3@ludoarena.gg', '+919876500003', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150', 'VortexPro', 9, 2100, 29, 14, 'VRTX3344'),
  ('00000000-0000-0000-0000-000000000005', 'AuraMaster', 'player4@ludoarena.gg', '+919876500004', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', 'Aura_X', 7, 1800, 22, 10, 'AURA1122'),
  ('00000000-0000-0000-0000-000000000006', 'ShadowPawn', 'player5@ludoarena.gg', '+919876500005', 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=150', 'ShadowLudo', 18, 5900, 89, 31, 'SHDW7788'),
  ('00000000-0000-0000-0000-000000000007', 'TitanRoller', 'player6@ludoarena.gg', '+919876500006', 'https://images.unsplash.com/photo-1628157582853-a796fa650a6a?w=150', 'Titan66', 11, 2900, 38, 17, 'TTAN5566'),
  ('00000000-0000-0000-0000-000000000008', 'PixelKnight', 'player7@ludoarena.gg', '+919876500007', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', 'PxKnight', 6, 1200, 15, 9, 'PIXL4433'),
  ('00000000-0000-0000-0000-000000000009', 'LudoQueen', 'player8@ludoarena.gg', '+919876500008', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150', 'QueenBee', 21, 7400, 112, 38, 'QUEN9988'),
  ('00000000-0000-0000-0000-000000000010', 'BlazeToken', 'player9@ludoarena.gg', '+919876500009', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', 'BlazeR', 8, 1950, 24, 15, 'BLAZ2211'),
  ('00000000-0000-0000-0000-000000000011', 'EchoChamber', 'player10@ludoarena.gg', '+919876500010', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150', 'Echo_Ludo', 14, 3800, 52, 23, 'ECHO8877')
ON CONFLICT (id) DO NOTHING;

-- Wallets for players
INSERT INTO public.wallets (user_id, deposit_balance, winnings_balance, bonus_balance, coins_balance)
VALUES
  ('00000000-0000-0000-0000-000000000002', 200.00, 1450.00, 50.00, 1200.00),
  ('00000000-0000-0000-0000-000000000003', 150.00, 2800.00, 20.00, 2500.00),
  ('00000000-0000-0000-0000-000000000004', 50.00, 620.00, 10.00, 450.00),
  ('00000000-0000-0000-0000-000000000005', 100.00, 300.00, 40.00, 800.00),
  ('00000000-0000-0000-0000-000000000006', 500.00, 4200.00, 100.00, 4800.00),
  ('00000000-0000-0000-0000-000000000007', 30.00, 850.00, 15.00, 920.00),
  ('00000000-0000-0000-0000-000000000008', 0.00, 180.00, 25.00, 310.00),
  ('00000000-0000-0000-0000-000000000009', 800.00, 8900.00, 200.00, 8500.00),
  ('00000000-0000-0000-0000-000000000010', 40.00, 410.00, 30.00, 560.00),
  ('00000000-0000-0000-0000-000000000011', 120.00, 1950.00, 45.00, 1750.00)
ON CONFLICT (user_id) DO NOTHING;

-- 3. 12 Tournaments across All Statuses
INSERT INTO public.tournaments (
  id, title, description, mode, tournament_type, entry_fee, prize_pool, prize_distribution,
  max_players, min_players, current_players, start_time, registration_close_time, status, rules_text
) VALUES
  -- 1. LIVE
  (
    '10000000-0000-0000-0000-000000000001',
    'Neon Clash 1v1 Battle',
    'High intensity 1v1 speed ludo showdown. Quick match format.',
    '1v1', 'PAID', 50.00, 90.00, '{"1st": 100}',
    2, 2, 2, NOW() - INTERVAL '5 minutes', NOW() - INTERVAL '6 minutes', 'LIVE',
    'Standard 2-token fast match. Winner must take screenshot of victory screen showing score and timestamp.'
  ),
  -- 2. ROOM_SHARED (Room code visible now!)
  (
    '10000000-0000-0000-0000-000000000002',
    'Cyber Cyberpunk 4-Player Arena',
    'Battle royale ludo match for 4 players. Top 2 share the prize pool!',
    '4_PLAYER', 'PAID', 100.00, 360.00, '{"1st": 70, "2nd": 30}',
    4, 4, 4, NOW() + INTERVAL '4 minutes', NOW() + INTERVAL '1 minute', 'ROOM_SHARED',
    'Classic 4-player rules. 1st place takes 70%, 2nd place takes 30%.'
  ),
  -- 3. REGISTRATION_OPEN (Starting in 25 min)
  (
    '10000000-0000-0000-0000-000000000003',
    'Daily Free Roll Ludo Master',
    'Zero entry fee daily tournament with free coin rewards for top winners.',
    'QUICK', 'FREE', 0.00, 250.00, '{"1st": 60, "2nd": 40}',
    4, 2, 3, NOW() + INTERVAL '25 minutes', NOW() + INTERVAL '20 minutes', 'REGISTRATION_OPEN',
    'Free to play. No entry fee required. Winner gets coins.'
  ),
  -- 4. REGISTRATION_OPEN (Starting in 45 min)
  (
    '10000000-0000-0000-0000-000000000004',
    'Electric 1v1 High Roller',
    'Competitive 1v1 for seasoned players. Massive prize payout.',
    '1v1', 'PAID', 250.00, 450.00, '{"1st": 100}',
    2, 2, 1, NOW() + INTERVAL '45 minutes', NOW() + INTERVAL '40 minutes', 'REGISTRATION_OPEN',
    'Winner takes all. Room code revealed 10 minutes before kickoff.'
  ),
  -- 5. REGISTRATION_OPEN (Starting in 2 hours)
  (
    '10000000-0000-0000-0000-000000000005',
    'Midnight Blitz 2-Player',
    'Fast-paced 2-player quick mode.',
    '2_PLAYER', 'PAID', 30.00, 54.00, '{"1st": 100}',
    2, 2, 0, NOW() + INTERVAL '2 hours', NOW() + INTERVAL '115 minutes', 'REGISTRATION_OPEN',
    'Quick match. Time limit 15 minutes.'
  ),
  -- 6. FULL (Registration max reached)
  (
    '10000000-0000-0000-0000-000000000006',
    'Apex 4-Player Grand Tournament',
    'Sold out premier tournament. Starting soon.',
    '4_PLAYER', 'PAID', 500.00, 1800.00, '{"1st": 65, "2nd": 35}',
    4, 4, 4, NOW() + INTERVAL '15 minutes', NOW() + INTERVAL '12 minutes', 'FULL',
    'Standard tournament rules. Admin supervised.'
  ),
  -- 7. UPCOMING (Starting tomorrow)
  (
    '10000000-0000-0000-0000-000000000007',
    'Weekend Mega Cup #42',
    'Sponsored weekend tournament with huge prize pool.',
    'CLASSIC', 'SPONSORED', 20.00, 2000.00, '{"1st": 50, "2nd": 30, "3rd": 20}',
    8, 4, 2, NOW() + INTERVAL '1 day', NOW() + INTERVAL '23 hours', 'UPCOMING',
    'Multi-round elimination bracket. Official rules apply.'
  ),
  -- 8. UPCOMING (Next week)
  (
    '10000000-0000-0000-0000-000000000008',
    'Pro League Season 1 Qualifier',
    'Qualify for the LudoArena Championship finals.',
    '1v1', 'PAID', 100.00, 500.00, '{"1st": 70, "2nd": 30}',
    8, 4, 1, NOW() + INTERVAL '3 days', NOW() + INTERVAL '71 hours', 'UPCOMING',
    'Must be level 5 or higher to qualify.'
  ),
  -- 9. RESULT_PENDING (Awaiting admin approval)
  (
    '10000000-0000-0000-0000-000000000009',
    'Titan 1v1 Showdown',
    'Match concluded. Screenshots submitted for admin verification.',
    '1v1', 'PAID', 100.00, 180.00, '{"1st": 100}',
    2, 2, 2, NOW() - INTERVAL '25 minutes', NOW() - INTERVAL '30 minutes', 'RESULT_PENDING',
    'Screenshots under review by admin.'
  ),
  -- 10. COMPLETED (Prize awarded)
  (
    '10000000-0000-0000-0000-000000000010',
    'Vanguard 1v1 Series #10',
    'Completed tournament. NeonStriker won 1st place.',
    '1v1', 'PAID', 50.00, 90.00, '{"1st": 100}',
    2, 2, 2, NOW() - INTERVAL '2 hours', NOW() - INTERVAL '130 minutes', 'COMPLETED',
    'Completed successfully. Winner credited.'
  ),
  -- 11. COMPLETED (Prize awarded)
  (
    '10000000-0000-0000-0000-000000000011',
    'Cyber Classic 4-Player Championship',
    'Completed tournament. LudoQueen claimed victory.',
    '4_PLAYER', 'PAID', 200.00, 720.00, '{"1st": 70, "2nd": 30}',
    4, 4, 4, NOW() - INTERVAL '5 hours', NOW() - INTERVAL '310 minutes', 'COMPLETED',
    'Completed and paid out.'
  ),
  -- 12. CANCELLED
  (
    '10000000-0000-0000-0000-000000000012',
    'Early Bird Quick Duel',
    'Cancelled due to insufficient players. All funds refunded.',
    '1v1', 'PAID', 50.00, 90.00, '{"1st": 100}',
    2, 2, 1, NOW() - INTERVAL '1 day', NOW() - INTERVAL '25 hours', 'CANCELLED',
    'Minimum players not reached.'
  )
ON CONFLICT (id) DO NOTHING;

-- Rooms for active / past tournaments
INSERT INTO public.tournament_rooms (tournament_id, room_code, host_name, app_deep_link, is_revealed)
VALUES
  ('10000000-0000-0000-0000-000000000001', '83921045', 'ArenaHost_1', 'ludoapp://room/83921045', TRUE),
  ('10000000-0000-0000-0000-000000000002', '55291480', 'ArenaHost_2', 'ludoapp://room/55291480', TRUE),
  ('10000000-0000-0000-0000-000000000009', '19482039', 'ArenaHost_3', 'ludoapp://room/19482039', TRUE),
  ('10000000-0000-0000-0000-000000000010', '90281472', 'ArenaHost_4', 'ludoapp://room/90281472', TRUE)
ON CONFLICT (tournament_id) DO NOTHING;

-- Participants for LIVE tournament
INSERT INTO public.tournament_participants (tournament_id, user_id, in_game_name, status)
VALUES
  ('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 'Neon_007', 'PLAYING'),
  ('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000003', 'CyberRoll', 'PLAYING')
ON CONFLICT DO NOTHING;

-- Participants for RESULT_PENDING tournament
INSERT INTO public.tournament_participants (tournament_id, user_id, in_game_name, status)
VALUES
  ('10000000-0000-0000-0000-000000000009', '00000000-0000-0000-0000-000000000006', 'ShadowLudo', 'SUBMITTED'),
  ('10000000-0000-0000-0000-000000000009', '00000000-0000-0000-0000-000000000007', 'Titan66', 'SUBMITTED')
ON CONFLICT DO NOTHING;

-- Match results and uploaded screenshots for RESULT_PENDING tournament
INSERT INTO public.match_results (id, tournament_id, user_id, claimed_rank, status, notes)
VALUES
  ('20000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000009', '00000000-0000-0000-0000-000000000006', 1, 'PENDING', 'Clean 4-token home victory!'),
  ('20000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000009', '00000000-0000-0000-0000-000000000007', 2, 'PENDING', 'Gg well played, placed second')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.result_screenshots (result_id, user_id, tournament_id, image_url, image_hash, perceptual_hash, file_size)
VALUES
  ('20000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000006', '10000000-0000-0000-0000-000000000009', 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800', 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', 'f0f0f0f00f0f0f0f', 245000),
  ('20000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000007', '10000000-0000-0000-0000-000000000009', 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800', 'ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb', 'e1e1e1e11e1e1e1e', 312000)
ON CONFLICT (id) DO NOTHING;

-- Sample support tickets
INSERT INTO public.support_tickets (id, ticket_number, user_id, subject, category, priority, status)
VALUES
  ('30000000-0000-0000-0000-000000000001', 1001, '00000000-0000-0000-0000-000000000004', 'UPI Deposit verification delayed', 'Payment', 'HIGH', 'IN_PROGRESS'),
  ('30000000-0000-0000-0000-000000000002', 1002, '00000000-0000-0000-0000-000000000005', 'Opponent disconnected during 1v1', 'Tournament', 'MEDIUM', 'OPEN')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.ticket_messages (ticket_id, sender_id, sender_type, message)
VALUES
  ('30000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000004', 'USER', 'Hi, I paid 100 INR via UPI but balance is not showing.'),
  ('30000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'ADMIN', 'Hello! We checked the gateway, the transaction is marked as pending by your bank. Checking with Razorpay.'),
  ('30000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000005', 'USER', 'My opponent left right before the last turn.')
ON CONFLICT (id) DO NOTHING;
