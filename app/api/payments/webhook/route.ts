import { NextResponse } from "next/server";
import { getPaymentProvider } from "@/lib/payments";

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get("x-razorpay-signature") || request.headers.get("x-paytm-signature") || "";

    const providerName = request.headers.get("x-razorpay-signature")
      ? "razorpay"
      : request.headers.get("x-paytm-signature")
      ? "paytm"
      : "mock";

    const provider = getPaymentProvider(providerName);
    const result = await provider.handleWebhook(rawBody, signature);

    if (!result.success) {
      return NextResponse.json(
        { error: "Webhook signature validation failed", event: result.eventType },
        { status: 400 }
      );
    }

    return NextResponse.json({
      received: true,
      event: result.eventType,
      orderId: result.orderId,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Webhook processing error" },
      { status: 500 }
    );
  }
}
