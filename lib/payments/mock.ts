import { PaymentProvider, CreateOrderParams, OrderResult, VerifyPaymentParams, WebhookResult, CreatePayoutParams, PayoutResult } from "./types";

export class MockPaymentProvider implements PaymentProvider {
  name = "mock" as const;

  async createOrder(params: CreateOrderParams): Promise<OrderResult> {
    const orderId = `mock_order_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    return {
      orderId,
      amount: params.amount,
      currency: params.currency || "INR",
      provider: "mock",
      keyId: "mock_key_id",
      raw: { status: "created", simulated: true },
    };
  }

  async verifyPayment(params: VerifyPaymentParams): Promise<boolean> {
    // In mock mode, any non-empty payment ID and valid signature is verified
    return !!params.paymentId && !!params.orderId;
  }

  async handleWebhook(rawBody: string, signature: string): Promise<WebhookResult> {
    try {
      const data = JSON.parse(rawBody);
      return {
        success: true,
        orderId: data.orderId || `order_${Date.now()}`,
        paymentId: data.paymentId || `pay_${Date.now()}`,
        amount: data.amount || 100,
        userId: data.userId,
        eventType: "payment.captured",
        rawPayload: data,
      };
    } catch {
      return {
        success: false,
        eventType: "error",
        rawPayload: { error: "Invalid json payload" },
      };
    }
  }

  async createPayout(params: CreatePayoutParams): Promise<PayoutResult> {
    const payoutId = `mock_pout_${Date.now()}`;
    return {
      payoutId,
      status: "PAID",
      provider: "mock",
      fee: 0,
    };
  }

  async getPayoutStatus(payoutId: string): Promise<string> {
    return "PAID";
  }
}
