export type MoneyMode = "coins" | "real";

export interface AppConfig {
  brand: {
    name: string;
    tagline: string;
    description: string;
    supportEmail: string;
    socials: {
      telegram?: string;
      whatsapp?: string;
      discord?: string;
      twitter?: string;
    };
  };
  features: {
    moneyMode: MoneyMode;
    requireKycForWithdrawal: boolean;
    minWithdrawal: number;
    maxWithdrawal: number;
    minDeposit: number;
    maxDeposit: number;
    platformFeePercent: number;
    referralBonusReferrer: number;
    referralBonusReferee: number;
    minAge: number;
    blockedRegions: string[];
    roomCodeRevealMinutesBeforeStart: number;
    mockPayments: boolean;
    activePaymentProvider: "razorpay" | "paytm" | "mock";
    supportAiEnabled: boolean;
    maintenanceMode: boolean;
    killSwitchDeposits: boolean;
    killSwitchWithdrawals: boolean;
    killSwitchJoins: boolean;
  };
}

export const APP_CONFIG: AppConfig = {
  brand: {
    name: process.env.NEXT_PUBLIC_BRAND_NAME || "LudoArena",
    tagline: "Compete. Roll. Conquer & Win.",
    description: "The premier competitive 3D esports tournament platform for room-code Ludo matches.",
    supportEmail: process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "support@ludoarena.gg",
    socials: {
      telegram: "https://t.me/ludoarenagg",
      whatsapp: "https://chat.whatsapp.com/ludoarenagg",
      discord: "https://discord.gg/ludoarenagg",
      twitter: "https://x.com/ludoarenagg",
    },
  },
  features: {
    moneyMode: (process.env.NEXT_PUBLIC_MONEY_MODE as MoneyMode) || "coins",
    requireKycForWithdrawal: process.env.NEXT_PUBLIC_REQUIRE_KYC_FOR_WITHDRAWAL === "true" || true,
    minWithdrawal: Number(process.env.NEXT_PUBLIC_MIN_WITHDRAWAL || 100),
    maxWithdrawal: Number(process.env.NEXT_PUBLIC_MAX_WITHDRAWAL || 10000),
    minDeposit: Number(process.env.NEXT_PUBLIC_MIN_DEPOSIT || 20),
    maxDeposit: Number(process.env.NEXT_PUBLIC_MAX_DEPOSIT || 25000),
    platformFeePercent: Number(process.env.NEXT_PUBLIC_PLATFORM_FEE_PERCENT || 10),
    referralBonusReferrer: Number(process.env.NEXT_PUBLIC_REFERRAL_BONUS_REFERRER || 25),
    referralBonusReferee: Number(process.env.NEXT_PUBLIC_REFERRAL_BONUS_REFEREE || 15),
    minAge: Number(process.env.NEXT_PUBLIC_MIN_AGE || 18),
    // States where real money gaming is restricted in India
    blockedRegions: (process.env.NEXT_PUBLIC_BLOCKED_REGIONS || "AS,OD,TS,NL,AP,SK").split(","),
    roomCodeRevealMinutesBeforeStart: Number(process.env.NEXT_PUBLIC_ROOM_CODE_REVEAL_MINS || 10),
    mockPayments: process.env.MOCK_PAYMENTS === "true" || process.env.NEXT_PUBLIC_MOCK_PAYMENTS === "true" || true,
    activePaymentProvider: (process.env.PAYMENT_PROVIDER as "razorpay" | "paytm" | "mock") || "mock",
    supportAiEnabled: process.env.SUPPORT_AI_ENABLED !== "false",
    maintenanceMode: process.env.NEXT_PUBLIC_MAINTENANCE_MODE === "true",
    killSwitchDeposits: process.env.KILL_SWITCH_DEPOSITS === "true",
    killSwitchWithdrawals: process.env.KILL_SWITCH_WITHDRAWALS === "true",
    killSwitchJoins: process.env.KILL_SWITCH_JOINS === "true",
  },
};
