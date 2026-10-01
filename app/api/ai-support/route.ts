import { NextResponse } from "next/server";
import { APP_CONFIG } from "@/config/app.config";

const STRICT_SYSTEM_PROMPT = `
You are the official AI Support Assistant for ${APP_CONFIG.brand.name}, a 3D esports tournament platform for room-code Ludo matches.
STRICT POLICIES:
1. Explain how tournaments work: players join, get a room code 10 mins before kickoff, play in the external app, and upload victory screenshots.
2. Explain wallet rules: Deposit balance is used for tournament entry fees; Winnings balance is withdrawable (min ₹${APP_CONFIG.features.minWithdrawal}); Bonus balance covers up to 20% of entry fee.
3. CRITICAL: You must NEVER promise refunds, credit wallets, change match outcomes, or alter account balances. Always refer players to open a human support ticket for disputed matches or refunds.
4. Keep answers concise, helpful, polite, and within 3 sentences.
`;

export async function POST(request: Request) {
  try {
    const { message } = await request.json();
    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const lower = message.toLowerCase();

    // Fast simulated intelligent response grounded in platform knowledge
    let reply = "";

    if (lower.includes("room code") || lower.includes("code") || lower.includes("where")) {
      reply = `Your match room code is revealed on your match room page exactly ${APP_CONFIG.features.roomCodeRevealMinutesBeforeStart} minutes before kickoff. Copy it and paste into the external game app lobby.`;
    } else if (lower.includes("refund") || lower.includes("cancel")) {
      reply = `If a tournament is cancelled due to insufficient players, full entry fees are automatically refunded to your wallet. For match disputes, our staff manually reviews screenshots—please create a support ticket.`;
    } else if (lower.includes("withdraw") || lower.includes("payout") || lower.includes("bank")) {
      reply = `You can withdraw funds from your Winnings Balance to your UPI ID or Bank account. Minimum withdrawal is ₹${APP_CONFIG.features.minWithdrawal}. Ensure your KYC is verified.`;
    } else if (lower.includes("kyc") || lower.includes("pan") || lower.includes("verify")) {
      reply = `KYC verification requires a PAN card or Aadhaar upload on the KYC page. Verification is typically completed within 15–30 minutes by our compliance team.`;
    } else if (lower.includes("screenshot") || lower.includes("upload") || lower.includes("win")) {
      reply = `Once your match concludes, take a screenshot of the victory screen showing final ranks and upload it on your match room page. Admins verify screenshots side-by-side before releasing prizes.`;
    } else {
      reply = `I am here to help with tournament rules, room codes, and wallet information! Would you like me to connect you with our human support desk by opening a ticket?`;
    }

    return NextResponse.json({
      reply,
      sender: "AI",
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "AI support service unavailable" },
      { status: 500 }
    );
  }
}
