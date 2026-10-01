import { NextResponse } from "next/server";
import { z } from "zod";
import { getPaymentProvider } from "@/lib/payments";
import { APP_CONFIG } from "@/config/app.config";

const OrderSchema = z.object({
  amount: z.number().min(APP_CONFIG.features.minDeposit).max(APP_CONFIG.features.maxDeposit),
  userId: z.string().min(1),
  provider: z.enum(["razorpay", "paytm", "mock"]).optional(),
});

export async function POST(request: Request) {
  try {
    if (APP_CONFIG.features.killSwitchDeposits) {
      return NextResponse.json(
        { error: "Deposits are temporarily suspended for scheduled maintenance." },
        { status: 503 }
      );
    }

    const body = await request.json();
    const validated = OrderSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: "Invalid payment amount or user ID", details: validated.error.format() },
        { status: 400 }
      );
    }

    const { amount, userId, provider: providerOverride } = validated.data;
    const provider = getPaymentProvider(providerOverride);

    const order = await provider.createOrder({
      userId,
      amount,
      currency: "INR",
      receipt: `rcpt_${userId.slice(0, 6)}_${Date.now()}`,
      metadata: { userId },
    });

    return NextResponse.json({
      success: true,
      order,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to create payment order" },
      { status: 500 }
    );
  }
}
