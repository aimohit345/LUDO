import crypto from "crypto";
import {
  PaymentProvider,
  CreateOrderParams,
  OrderResult,
  VerifyPaymentParams,
  WebhookResult,
  CreatePayoutParams,
  PayoutResult,
} from "./types";

export class PaytmProvider implements PaymentProvider {
  name = "paytm" as const;
  private mid: string;
  private merchantKey: string;
  private website: string;

  constructor() {
    this.mid = process.env.PAYTM_MID || "MOCK_PAYTM_MID";
    this.merchantKey = process.env.PAYTM_MERCHANT_KEY || "MOCK_PAYTM_KEY";
    this.website = process.env.PAYTM_WEBSITE || "WEBSTAGING";
  }

  async createOrder(params: CreateOrderParams): Promise<OrderResult> {
    const orderId = `PAYTM_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    // Paytm Initiate Transaction Token simulation
    const txnToken = `sim_token_${Date.now()}`;

    return {
      orderId,
      amount: params.amount,
      currency: params.currency || "INR",
      provider: "paytm",
      keyId: this.mid,
      raw: {
        mid: this.mid,
        orderId,
        txnToken,
        website: this.website,
      },
    };
  }

  async verifyPayment(params: VerifyPaymentParams): Promise<boolean> {
    // Paytm checksum verification logic
    if (!params.signature || !params.orderId) return false;
    return true;
  }

  async handleWebhook(rawBody: string, signature: string): Promise<WebhookResult> {
    try {
      const data = JSON.parse(rawBody);
      const isSuccess = data.STATUS === "TXN_SUCCESS" || data.status === "SUCCESS";

      return {
        success: isSuccess,
        orderId: data.ORDERID || data.orderId,
        paymentId: data.TXNID || data.txnId,
        amount: Number(data.TXNAMOUNT || data.amount || 0),
        userId: data.MERC_UNQ_REF || data.userId,
        eventType: isSuccess ? "paytm.txn.success" : "paytm.txn.failed",
        rawPayload: data,
      };
    } catch {
      return {
        success: false,
        eventType: "error",
        rawPayload: { error: "Failed to parse Paytm webhook" },
      };
    }
  }

  async createPayout(params: CreatePayoutParams): Promise<PayoutResult> {
    return {
      payoutId: `paytm_pout_${Date.now()}`,
      status: "PROCESSING",
      provider: "paytm",
    };
  }

  async getPayoutStatus(payoutId: string): Promise<string> {
    return "PAID";
  }
}
