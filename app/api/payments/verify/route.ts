import { NextResponse } from "next/server";
import { z } from "zod";
import { getPaymentProvider } from "@/lib/payments";

const VerifySchema = z.object({
  orderId: z.string().min(1),
  paymentId: z.string().min(1),
  signature: z.string().min(1),
  userId: z.string().min(1),
  amount: z.number().positive(),
  provider: z.enum(["razorpay", "paytm", "mock"]).optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = VerifySchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: "Invalid payment verification parameters" },
        { status: 400 }
      );
    }

    const { orderId, paymentId, signature, userId, amount, provider: providerName } = validated.data;
    const provider = getPaymentProvider(providerName);

    const isValid = await provider.verifyPayment({
      orderId,
      paymentId,
      signature,
    });

    if (!isValid) {
      return NextResponse.json(
        { error: "Payment signature verification failed" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Payment successfully verified and wallet credited.",
      orderId,
      paymentId,
      amount,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Payment verification failed" },
      { status: 500 }
    );
  }
}
