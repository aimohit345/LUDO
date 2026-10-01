import { PaymentProvider } from "./types";
import { RazorpayProvider } from "./razorpay";
import { PaytmProvider } from "./paytm";
import { MockPaymentProvider } from "./mock";
import { APP_CONFIG } from "@/config/app.config";

let cachedProvider: PaymentProvider | null = null;

export function getPaymentProvider(override?: "razorpay" | "paytm" | "mock"): PaymentProvider {
  const selected = override || APP_CONFIG.features.activePaymentProvider;

  if (APP_CONFIG.features.mockPayments || selected === "mock") {
    return new MockPaymentProvider();
  }

  if (selected === "paytm") {
    return new PaytmProvider();
  }

  return new RazorpayProvider();
}
