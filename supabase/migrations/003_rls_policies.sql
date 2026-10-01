-- ============================================================================
-- LudoArena Database Migration 003: Row Level Security (RLS) Policies
-- ============================================================================

-- Helper function to check user role
CREATE OR REPLACE FUNCTION public.has_role(p_user_id UUID, p_role user_role_type)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = p_user_id AND (role = p_role OR role = 'SUPER_ADMIN')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_staff(p_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = p_user_id AND role IN ('SUPER_ADMIN', 'ADMIN', 'FINANCE', 'SUPPORT')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallet_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.escrow_holds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payout_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payout_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kyc_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tournaments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tournament_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tournament_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.match_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.result_screenshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.disputes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referral_rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ticket_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ticket_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.strikes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.device_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

-- 1. Profiles
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile non-sensitive fields" ON public.profiles
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- 2. User Roles
CREATE POLICY "Users can read own role" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id OR public.is_staff(auth.uid()));

-- 3. Wallets
CREATE POLICY "Users can read own wallet" ON public.wallets
  FOR SELECT USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'FINANCE'));

-- 4. Wallet Transactions
CREATE POLICY "Users can view own transactions" ON public.wallet_transactions
  FOR SELECT USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'FINANCE'));

-- 5. Escrow Holds
CREATE POLICY "Staff can view escrow holds" ON public.escrow_holds
  FOR SELECT USING (public.is_staff(auth.uid()) OR auth.uid() = user_id);

-- 6. Payment Orders
CREATE POLICY "Users can view own payment orders" ON public.payment_orders
  FOR SELECT USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'FINANCE'));

-- 7. Payout Methods
CREATE POLICY "Users manage own payout methods" ON public.payout_methods
  FOR ALL USING (auth.uid() = user_id);

-- 8. Payout Requests
CREATE POLICY "Users can view own payout requests" ON public.payout_requests
  FOR SELECT USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'FINANCE'));

CREATE POLICY "Staff can update payout requests" ON public.payout_requests
  FOR UPDATE USING (public.has_role(auth.uid(), 'FINANCE'));

-- 9. KYC Documents
CREATE POLICY "Users can view and upload own KYC" ON public.kyc_documents
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Staff can view and update all KYC" ON public.kyc_documents
  FOR ALL USING (public.is_staff(auth.uid()));

-- 10. Tournaments
CREATE POLICY "Tournaments are viewable by everyone" ON public.tournaments
  FOR SELECT USING (status <> 'DRAFT' OR public.is_staff(auth.uid()));

CREATE POLICY "Staff can manage tournaments" ON public.tournaments
  FOR ALL USING (public.has_role(auth.uid(), 'ADMIN'));

-- 11. Tournament Participants
CREATE POLICY "Participants viewable by everyone" ON public.tournament_participants
  FOR SELECT USING (true);

-- 12. Tournament Rooms (Strict Security & Time-gated Reveal)
CREATE POLICY "Room code visibility policy" ON public.tournament_rooms
  FOR SELECT USING (
    public.is_staff(auth.uid())
    OR (
      EXISTS (
        SELECT 1 FROM public.tournament_participants tp
        JOIN public.tournaments t ON t.id = tp.tournament_id
        WHERE tp.tournament_id = tournament_rooms.tournament_id 
          AND tp.user_id = auth.uid()
          AND NOW() >= (t.start_time - INTERVAL '10 minutes')
      )
    )
  );

CREATE POLICY "Staff can manage rooms" ON public.tournament_rooms
  FOR ALL USING (public.has_role(auth.uid(), 'ADMIN'));

-- 13. Match Results & Screenshots
CREATE POLICY "Match results viewable by participants and staff" ON public.match_results
  FOR SELECT USING (
    auth.uid() = user_id 
    OR public.is_staff(auth.uid()) 
    OR EXISTS (SELECT 1 FROM public.tournament_participants WHERE tournament_id = match_results.tournament_id AND user_id = auth.uid())
  );

CREATE POLICY "Participants can submit match results" ON public.match_results
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Staff can update match results" ON public.match_results
  FOR UPDATE USING (public.is_staff(auth.uid()));

CREATE POLICY "Screenshots viewable by staff or submitter" ON public.result_screenshots
  FOR SELECT USING (auth.uid() = user_id OR public.is_staff(auth.uid()));

CREATE POLICY "Participants can insert screenshots" ON public.result_screenshots
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 14. Notifications
CREATE POLICY "Users can manage own notifications" ON public.notifications
  FOR ALL USING (auth.uid() = user_id);

-- 15. Support Tickets & Messages
CREATE POLICY "Users can view and create own tickets" ON public.support_tickets
  FOR ALL USING (auth.uid() = user_id OR public.is_staff(auth.uid()));

CREATE POLICY "Users can view ticket messages except internal notes" ON public.ticket_messages
  FOR SELECT USING (
    (EXISTS (SELECT 1 FROM public.support_tickets WHERE id = ticket_messages.ticket_id AND user_id = auth.uid()) AND is_internal_note = FALSE)
    OR public.is_staff(auth.uid())
  );

CREATE POLICY "Users and staff can insert ticket messages" ON public.ticket_messages
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.support_tickets WHERE id = ticket_messages.ticket_id AND (user_id = auth.uid() OR public.is_staff(auth.uid())))
  );

-- 16. Audit Logs
CREATE POLICY "Staff can view audit logs" ON public.audit_logs
  FOR SELECT USING (public.has_role(auth.uid(), 'ADMIN'));

-- 17. App Settings
CREATE POLICY "Anyone can read app settings" ON public.app_settings
  FOR SELECT USING (true);

CREATE POLICY "Only super admin can modify app settings" ON public.app_settings
  FOR ALL USING (public.has_role(auth.uid(), 'SUPER_ADMIN'));
