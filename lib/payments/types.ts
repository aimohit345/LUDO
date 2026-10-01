export interface CreateOrderParams {
  userId: string;
  amount: number;
  currency?: string;
  receipt?: string;
  metadata?: Record<string, any>;
}

export interface OrderResult {
  orderId: string;
  amount: number;
  currency: string;
  provider: "razorpay" | "paytm" | "mock";
  keyId?: string;
  raw?: any;
}

export interface VerifyPaymentParams {
  orderId: string;
  paymentId: string;
  signature: string;
}

export interface WebhookResult {
  success: boolean;
  orderId?: string;
  paymentId?: string;
  amount?: number;
  userId?: string;
  eventType: string;
  rawPayload: any;
}

export interface CreatePayoutParams {
  userId: string;
  amount: number;
  payoutMethod: {
    type: "UPI" | "BANK";
    upiId?: string;
    accountNumber?: string;
    ifscCode?: string;
    name?: string;
  };
  referenceId: string;
}

export interface PayoutResult {
  payoutId: string;
  status: "PENDING" | "PROCESSING" | "PAID" | "REJECTED";
  provider: string;
  fee?: number;
}

export interface PaymentProvider {
  name: "razorpay" | "paytm" | "mock";
  createOrder(params: CreateOrderParams): Promise<OrderResult>;
  verifyPayment(params: VerifyPaymentParams): Promise<boolean>;
  handleWebhook(rawBody: string, signature: string): Promise<WebhookResult>;
  createPayout(params: CreatePayoutParams): Promise<PayoutResult>;
  getPayoutStatus(payoutId: string): Promise<string>;
}
