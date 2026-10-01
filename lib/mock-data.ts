import { TournamentMode, TournamentStatus, TournamentType, UserRoleType } from "@/supabase/types";

export interface MockUser {
  id: string;
  username: string;
  email: string;
  phone: string;
  avatar_url: string;
  in_game_username: string;
  level: number;
  xp: number;
  wins: number;
  losses: number;
  strikes: number;
  is_banned: boolean;
  role: UserRoleType;
  referral_code: string;
  wallet: {
    deposit_balance: number;
    winnings_balance: number;
    bonus_balance: number;
    coins_balance: number;
  };
}

export interface MockTournament {
  id: string;
  title: string;
  description: string;
  mode: TournamentMode;
  tournament_type: TournamentType;
  entry_fee: number;
  prize_pool: number;
  prize_distribution: Record<string, number>;
  max_players: number;
  min_players: number;
  current_players: number;
  start_time: string;
  registration_close_time: string;
  rules_text: string;
  status: TournamentStatus;
  live_stream_url?: string;
  room_code?: string;
  participants: Array<{
    user_id: string;
    username: string;
    avatar_url: string;
    status: string;
    joined_at: string;
    claimed_rank?: number;
    screenshot_url?: string;
  }>;
}

export interface MockTransaction {
  id: string;
  user_id: string;
  type: string;
  amount: number;
  balance_bucket: string;
  description: string;
  created_at: string;
  status: string;
}

export interface MockTicket {
  id: string;
  ticket_number: number;
  user_id: string;
  username: string;
  subject: string;
  category: string;
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  status: "OPEN" | "IN_PROGRESS" | "WAITING_USER" | "RESOLVED" | "CLOSED";
  created_at: string;
  messages: Array<{
    id: string;
    sender_type: "USER" | "ADMIN" | "AI";
    sender_name: string;
    message: string;
    created_at: string;
  }>;
}

export interface MockPayoutRequest {
  id: string;
  user_id: string;
  username: string;
  amount: number;
  payout_method: {
    type: "UPI" | "BANK";
    details: string;
  };
  status: "PENDING" | "APPROVED" | "PROCESSING" | "PAID" | "REJECTED";
  created_at: string;
}

export interface MockKycDoc {
  id: string;
  user_id: string;
  username: string;
  id_type: "PAN" | "AADHAAR" | "BANK_PROOF";
  document_number: string;
  front_url: string;
  status: "PENDING" | "VERIFIED" | "REJECTED";
  created_at: string;
}

// Global Demo State
export const INITIAL_USERS: MockUser[] = [
  {
    id: "00000000-0000-0000-0000-000000000001",
    username: "superadmin",
    email: "admin@ludoarena.gg",
    phone: "+919876543210",
    avatar_url: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=150",
    in_game_username: "AdminMaster",
    level: 50,
    xp: 15400,
    wins: 340,
    losses: 42,
    strikes: 0,
    is_banned: false,
    role: "SUPER_ADMIN",
    referral_code: "ADMIN001",
    wallet: {
      deposit_balance: 5000,
      winnings_balance: 24500,
      bonus_balance: 1000,
      coins_balance: 50000,
    },
  },
  {
    id: "00000000-0000-0000-0000-000000000002",
    username: "NeonStriker",
    email: "player1@ludoarena.gg",
    phone: "+919876500001",
    avatar_url: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150",
    in_game_username: "Neon_007",
    level: 14,
    xp: 4200,
    wins: 58,
    losses: 14,
    strikes: 0,
    is_banned: false,
    role: "PLAYER",
    referral_code: "NEON4821",
    wallet: {
      deposit_balance: 350,
      winnings_balance: 1850,
      bonus_balance: 40,
      coins_balance: 1500,
    },
  },
  {
    id: "00000000-0000-0000-0000-000000000003",
    username: "CyberDice",
    email: "player2@ludoarena.gg",
    phone: "+919876500002",
    avatar_url: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150",
    in_game_username: "CyberRoll",
    level: 16,
    xp: 4900,
    wins: 72,
    losses: 22,
    strikes: 0,
    is_banned: false,
    role: "PLAYER",
    referral_code: "CYBR9912",
    wallet: {
      deposit_balance: 200,
      winnings_balance: 3100,
      bonus_balance: 30,
      coins_balance: 2800,
    },
  },
  {
    id: "00000000-0000-0000-0000-000000000004",
    username: "LudoQueen",
    email: "queen@ludoarena.gg",
    phone: "+919876500008",
    avatar_url: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
    in_game_username: "QueenBee",
    level: 22,
    xp: 7900,
    wins: 118,
    losses: 39,
    strikes: 0,
    is_banned: false,
    role: "PLAYER",
    referral_code: "QUEN9988",
    wallet: {
      deposit_balance: 1200,
      winnings_balance: 9400,
      bonus_balance: 250,
      coins_balance: 9200,
    },
  },
];

const now = Date.now();

export const INITIAL_TOURNAMENTS: MockTournament[] = [
  {
    id: "t-1",
    title: "Neon Clash 1v1 Battle",
    description: "High intensity 1v1 speed ludo showdown. Quick match format.",
    mode: "1v1",
    tournament_type: "PAID",
    entry_fee: 50,
    prize_pool: 90,
    prize_distribution: { "1st": 100 },
    max_players: 2,
    min_players: 2,
    current_players: 2,
    start_time: new Date(now - 4 * 60 * 1000).toISOString(),
    registration_close_time: new Date(now - 5 * 60 * 1000).toISOString(),
    rules_text: "Standard 2-token fast match. Winner must take screenshot of victory screen showing score and timestamp.",
    status: "LIVE",
    room_code: "83921045",
    participants: [
      {
        user_id: "00000000-0000-0000-0000-000000000002",
        username: "NeonStriker",
        avatar_url: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150",
        status: "PLAYING",
        joined_at: new Date(now - 30 * 60 * 1000).toISOString(),
      },
      {
        user_id: "00000000-0000-0000-0000-000000000003",
        username: "CyberDice",
        avatar_url: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150",
        status: "PLAYING",
        joined_at: new Date(now - 28 * 60 * 1000).toISOString(),
      },
    ],
  },
  {
    id: "t-2",
    title: "Cyberpunk 4-Player Arena",
    description: "Battle royale ludo match for 4 players. Top 2 share the prize pool!",
    mode: "4_PLAYER",
    tournament_type: "PAID",
    entry_fee: 100,
    prize_pool: 360,
    prize_distribution: { "1st": 70, "2nd": 30 },
    max_players: 4,
    min_players: 4,
    current_players: 4,
    start_time: new Date(now + 4 * 60 * 1000).toISOString(),
    registration_close_time: new Date(now + 1 * 60 * 1000).toISOString(),
    rules_text: "Classic 4-player rules. 1st place takes 70%, 2nd place takes 30%. Room code is available now.",
    status: "ROOM_SHARED",
    room_code: "55291480",
    participants: [
      {
        user_id: "00000000-0000-0000-0000-000000000002",
        username: "NeonStriker",
        avatar_url: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150",
        status: "REGISTERED",
        joined_at: new Date(now - 10 * 60 * 1000).toISOString(),
      },
      {
        user_id: "00000000-0000-0000-0000-000000000003",
        username: "CyberDice",
        avatar_url: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150",
        status: "REGISTERED",
        joined_at: new Date(now - 9 * 60 * 1000).toISOString(),
      },
      {
        user_id: "00000000-0000-0000-0000-000000000004",
        username: "LudoQueen",
        avatar_url: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
        status: "REGISTERED",
        joined_at: new Date(now - 8 * 60 * 1000).toISOString(),
      },
      {
        user_id: "00000000-0000-0000-0000-000000000001",
        username: "superadmin",
        avatar_url: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=150",
        status: "REGISTERED",
        joined_at: new Date(now - 7 * 60 * 1000).toISOString(),
      },
    ],
  },
  {
    id: "t-3",
    title: "Daily Free Roll Ludo Master",
    description: "Zero entry fee daily tournament with free coin rewards for top winners.",
    mode: "QUICK",
    tournament_type: "FREE",
    entry_fee: 0,
    prize_pool: 250,
    prize_distribution: { "1st": 60, "2nd": 40 },
    max_players: 4,
    min_players: 2,
    current_players: 2,
    start_time: new Date(now + 25 * 60 * 1000).toISOString(),
    registration_close_time: new Date(now + 20 * 60 * 1000).toISOString(),
    rules_text: "Free to play. No entry fee required. Winner gets coins and XP.",
    status: "REGISTRATION_OPEN",
    participants: [
      {
        user_id: "00000000-0000-0000-0000-000000000003",
        username: "CyberDice",
        avatar_url: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150",
        status: "REGISTERED",
        joined_at: new Date(now - 5 * 60 * 1000).toISOString(),
      },
      {
        user_id: "00000000-0000-0000-0000-000000000004",
        username: "LudoQueen",
        avatar_url: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
        status: "REGISTERED",
        joined_at: new Date(now - 3 * 60 * 1000).toISOString(),
      },
    ],
  },
  {
    id: "t-4",
    title: "Electric 1v1 High Roller",
    description: "Competitive 1v1 for seasoned players. Massive prize payout.",
    mode: "1v1",
    tournament_type: "PAID",
    entry_fee: 250,
    prize_pool: 450,
    prize_distribution: { "1st": 100 },
    max_players: 2,
    min_players: 2,
    current_players: 1,
    start_time: new Date(now + 45 * 60 * 1000).toISOString(),
    registration_close_time: new Date(now + 40 * 60 * 1000).toISOString(),
    rules_text: "Winner takes all. Room code revealed 10 minutes before kickoff.",
    status: "REGISTRATION_OPEN",
    participants: [
      {
        user_id: "00000000-0000-0000-0000-000000000002",
        username: "NeonStriker",
        avatar_url: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150",
        status: "REGISTERED",
        joined_at: new Date(now - 12 * 60 * 1000).toISOString(),
      },
    ],
  },
  {
    id: "t-5",
    title: "Midnight Blitz 2-Player",
    description: "Fast-paced 2-player quick mode.",
    mode: "2_PLAYER",
    tournament_type: "PAID",
    entry_fee: 30,
    prize_pool: 54,
    prize_distribution: { "1st": 100 },
    max_players: 2,
    min_players: 2,
    current_players: 0,
    start_time: new Date(now + 2 * 3600 * 1000).toISOString(),
    registration_close_time: new Date(now + 1.9 * 3600 * 1000).toISOString(),
    rules_text: "Quick match. Time limit 15 minutes.",
    status: "REGISTRATION_OPEN",
    participants: [],
  },
  {
    id: "t-6",
    title: "Apex 4-Player Grand Tournament",
    description: "Sold out premier tournament. Starting soon.",
    mode: "4_PLAYER",
    tournament_type: "PAID",
    entry_fee: 500,
    prize_pool: 1800,
    prize_distribution: { "1st": 65, "2nd": 35 },
    max_players: 4,
    min_players: 4,
    current_players: 4,
    start_time: new Date(now + 15 * 60 * 1000).toISOString(),
    registration_close_time: new Date(now + 12 * 60 * 1000).toISOString(),
    rules_text: "Standard tournament rules. Admin supervised.",
    status: "FULL",
    participants: [
      { user_id: "00000000-0000-0000-0000-000000000002", username: "NeonStriker", avatar_url: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150", status: "REGISTERED", joined_at: new Date(now - 15 * 60 * 1000).toISOString() },
      { user_id: "00000000-0000-0000-0000-000000000003", username: "CyberDice", avatar_url: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150", status: "REGISTERED", joined_at: new Date(now - 14 * 60 * 1000).toISOString() },
      { user_id: "00000000-0000-0000-0000-000000000004", username: "LudoQueen", avatar_url: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150", status: "REGISTERED", joined_at: new Date(now - 13 * 60 * 1000).toISOString() },
      { user_id: "00000000-0000-0000-0000-000000000001", username: "superadmin", avatar_url: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=150", status: "REGISTERED", joined_at: new Date(now - 10 * 60 * 1000).toISOString() },
    ],
  },
  {
    id: "t-7",
    title: "Weekend Mega Cup #42",
    description: "Sponsored weekend tournament with huge prize pool.",
    mode: "CLASSIC",
    tournament_type: "SPONSORED",
    entry_fee: 20,
    prize_pool: 2000,
    prize_distribution: { "1st": 50, "2nd": 30, "3rd": 20 },
    max_players: 8,
    min_players: 4,
    current_players: 2,
    start_time: new Date(now + 24 * 3600 * 1000).toISOString(),
    registration_close_time: new Date(now + 23 * 3600 * 1000).toISOString(),
    rules_text: "Multi-round elimination bracket. Official rules apply.",
    status: "UPCOMING",
    participants: [],
  },
  {
    id: "t-8",
    title: "Pro League Season 1 Qualifier",
    description: "Qualify for the LudoArena Championship finals.",
    mode: "1v1",
    tournament_type: "PAID",
    entry_fee: 100,
    prize_pool: 500,
    prize_distribution: { "1st": 70, "2nd": 30 },
    max_players: 8,
    min_players: 4,
    current_players: 1,
    start_time: new Date(now + 72 * 3600 * 1000).toISOString(),
    registration_close_time: new Date(now + 71 * 3600 * 1000).toISOString(),
    rules_text: "Must be level 5 or higher to qualify.",
    status: "UPCOMING",
    participants: [],
  },
  {
    id: "t-9",
    title: "Titan 1v1 Showdown",
    description: "Match concluded. Screenshots submitted for admin verification.",
    mode: "1v1",
    tournament_type: "PAID",
    entry_fee: 100,
    prize_pool: 180,
    prize_distribution: { "1st": 100 },
    max_players: 2,
    min_players: 2,
    current_players: 2,
    start_time: new Date(now - 35 * 60 * 1000).toISOString(),
    registration_close_time: new Date(now - 40 * 60 * 1000).toISOString(),
    rules_text: "Screenshots under review by admin.",
    status: "RESULT_PENDING",
    room_code: "19482039",
    participants: [
      {
        user_id: "00000000-0000-0000-0000-000000000002",
        username: "NeonStriker",
        avatar_url: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150",
        status: "SUBMITTED",
        joined_at: new Date(now - 50 * 60 * 1000).toISOString(),
        claimed_rank: 1,
        screenshot_url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800",
      },
      {
        user_id: "00000000-0000-0000-0000-000000000003",
        username: "CyberDice",
        avatar_url: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150",
        status: "SUBMITTED",
        joined_at: new Date(now - 48 * 60 * 1000).toISOString(),
        claimed_rank: 2,
        screenshot_url: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800",
      },
    ],
  },
  {
    id: "t-10",
    title: "Vanguard 1v1 Series #10",
    description: "Completed tournament. NeonStriker won 1st place.",
    mode: "1v1",
    tournament_type: "PAID",
    entry_fee: 50,
    prize_pool: 90,
    prize_distribution: { "1st": 100 },
    max_players: 2,
    min_players: 2,
    current_players: 2,
    start_time: new Date(now - 2 * 3600 * 1000).toISOString(),
    registration_close_time: new Date(now - 2.2 * 3600 * 1000).toISOString(),
    rules_text: "Completed successfully. Winner credited.",
    status: "COMPLETED",
    room_code: "90281472",
    participants: [
      {
        user_id: "00000000-0000-0000-0000-000000000002",
        username: "NeonStriker",
        avatar_url: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150",
        status: "SUBMITTED",
        joined_at: new Date(now - 140 * 60 * 1000).toISOString(),
        claimed_rank: 1,
      },
      {
        user_id: "00000000-0000-0000-0000-000000000004",
        username: "LudoQueen",
        avatar_url: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
        status: "SUBMITTED",
        joined_at: new Date(now - 138 * 60 * 1000).toISOString(),
        claimed_rank: 2,
      },
    ],
  },
  {
    id: "t-11",
    title: "Cyber Classic 4-Player Championship",
    description: "Completed tournament. LudoQueen claimed victory.",
    mode: "4_PLAYER",
    tournament_type: "PAID",
    entry_fee: 200,
    prize_pool: 720,
    prize_distribution: { "1st": 70, "2nd": 30 },
    max_players: 4,
    min_players: 4,
    current_players: 4,
    start_time: new Date(now - 6 * 3600 * 1000).toISOString(),
    registration_close_time: new Date(now - 6.2 * 3600 * 1000).toISOString(),
    rules_text: "Completed and paid out.",
    status: "COMPLETED",
    room_code: "77221144",
    participants: [],
  },
  {
    id: "t-12",
    title: "Early Bird Quick Duel",
    description: "Cancelled due to insufficient players. All funds refunded.",
    mode: "1v1",
    tournament_type: "PAID",
    entry_fee: 50,
    prize_pool: 90,
    prize_distribution: { "1st": 100 },
    max_players: 2,
    min_players: 2,
    current_players: 1,
    start_time: new Date(now - 24 * 3600 * 1000).toISOString(),
    registration_close_time: new Date(now - 25 * 3600 * 1000).toISOString(),
    rules_text: "Minimum players not reached.",
    status: "CANCELLED",
    participants: [],
  },
];

export const INITIAL_TRANSACTIONS: MockTransaction[] = [
  {
    id: "tx-1",
    user_id: "00000000-0000-0000-0000-000000000002",
    type: "PRIZE",
    amount: 90,
    balance_bucket: "winnings",
    description: "Prize for 1st place in Vanguard 1v1 Series #10",
    created_at: new Date(now - 90 * 60 * 1000).toISOString(),
    status: "COMPLETED",
  },
  {
    id: "tx-2",
    user_id: "00000000-0000-0000-0000-000000000002",
    type: "ENTRY_FEE",
    amount: -50,
    balance_bucket: "deposit",
    description: "Entry fee: Neon Clash 1v1 Battle",
    created_at: new Date(now - 30 * 60 * 1000).toISOString(),
    status: "COMPLETED",
  },
  {
    id: "tx-3",
    user_id: "00000000-0000-0000-0000-000000000002",
    type: "DEPOSIT",
    amount: 200,
    balance_bucket: "deposit",
    description: "Deposit via UPI (Mock Gateway)",
    created_at: new Date(now - 3 * 3600 * 1000).toISOString(),
    status: "COMPLETED",
  },
  {
    id: "tx-4",
    user_id: "00000000-0000-0000-0000-000000000002",
    type: "REFERRAL_BONUS",
    amount: 25,
    balance_bucket: "bonus",
    description: "Referral Bonus (Friend first deposit)",
    created_at: new Date(now - 24 * 3600 * 1000).toISOString(),
    status: "COMPLETED",
  },
];

export const INITIAL_TICKETS: MockTicket[] = [
  {
    id: "tick-1",
    ticket_number: 1001,
    user_id: "00000000-0000-0000-0000-000000000002",
    username: "NeonStriker",
    subject: "UPI Deposit verification delayed",
    category: "Payment",
    priority: "HIGH",
    status: "IN_PROGRESS",
    created_at: new Date(now - 4 * 3600 * 1000).toISOString(),
    messages: [
      {
        id: "msg-1",
        sender_type: "USER",
        sender_name: "NeonStriker",
        message: "Hi, I paid 100 INR via UPI but my wallet balance hasn't updated yet. Transaction ID is UPI-998822.",
        created_at: new Date(now - 4 * 3600 * 1000).toISOString(),
      },
      {
        id: "msg-2",
        sender_type: "ADMIN",
        sender_name: "Support Admin",
        message: "Hello NeonStriker! We verified the bank webhook and your deposit has now been manually approved.",
        created_at: new Date(now - 2 * 3600 * 1000).toISOString(),
      },
    ],
  },
  {
    id: "tick-2",
    ticket_number: 1002,
    user_id: "00000000-0000-0000-0000-000000000003",
    username: "CyberDice",
    subject: "Opponent left room before game start",
    category: "Tournament",
    priority: "MEDIUM",
    status: "OPEN",
    created_at: new Date(now - 1 * 3600 * 1000).toISOString(),
    messages: [
      {
        id: "msg-3",
        sender_type: "USER",
        sender_name: "CyberDice",
        message: "Player did not join external Ludo room after countdown finished.",
        created_at: new Date(now - 1 * 3600 * 1000).toISOString(),
      },
    ],
  },
];

export const INITIAL_WITHDRAWALS: MockPayoutRequest[] = [
  {
    id: "w-1",
    user_id: "00000000-0000-0000-0000-000000000004",
    username: "LudoQueen",
    amount: 1500,
    payout_method: {
      type: "UPI",
      details: "queen@oksbi",
    },
    status: "PENDING",
    created_at: new Date(now - 30 * 60 * 1000).toISOString(),
  },
  {
    id: "w-2",
    user_id: "00000000-0000-0000-0000-000000000002",
    username: "NeonStriker",
    amount: 500,
    payout_method: {
      type: "UPI",
      details: "neonstriker@upi",
    },
    status: "PAID",
    created_at: new Date(now - 24 * 3600 * 1000).toISOString(),
  },
];

export const INITIAL_KYC: MockKycDoc[] = [
  {
    id: "kyc-1",
    user_id: "00000000-0000-0000-0000-000000000002",
    username: "NeonStriker",
    id_type: "PAN",
    document_number: "ABCDE1234F",
    front_url: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600",
    status: "VERIFIED",
    created_at: new Date(now - 48 * 3600 * 1000).toISOString(),
  },
  {
    id: "kyc-2",
    user_id: "00000000-0000-0000-0000-000000000004",
    username: "LudoQueen",
    id_type: "PAN",
    document_number: "FGHIJ5678K",
    front_url: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600",
    status: "PENDING",
    created_at: new Date(now - 2 * 3600 * 1000).toISOString(),
  },
];
