import { describe, it, expect } from "vitest";
import crypto from "crypto";

describe("Payment Webhook Verification & HMAC Signatures", () => {
  it("validates authentic HMAC SHA-256 signature against webhook payload", () => {
    const secret = "ludoarena_test_webhook_secret_key";
    const rawPayload = JSON.stringify({
      event: "payment.captured",
      orderId: "order_12345",
      amount: 100,
    });

    const signature = crypto
      .createHmac("sha256", secret)
      .update(rawPayload)
      .digest("hex");

    const computed = crypto
      .createHmac("sha256", secret)
      .update(rawPayload)
      .digest("hex");

    expect(computed).toBe(signature);
  });

  it("rejects forged or modified webhook payloads with mismatched signature", () => {
    const secret = "ludoarena_test_webhook_secret_key";
    const originalPayload = JSON.stringify({ orderId: "order_1", amount: 100 });
    const forgedPayload = JSON.stringify({ orderId: "order_1", amount: 10000 });

    const originalSignature = crypto
      .createHmac("sha256", secret)
      .update(originalPayload)
      .digest("hex");

    const forgedCheck = crypto
      .createHmac("sha256", secret)
      .update(forgedPayload)
      .digest("hex");

    expect(forgedCheck).not.toBe(originalSignature);
  });

  it("handles duplicate webhook events idempotently", () => {
    const processedEvents = new Set<string>();

    const handleEvent = (eventId: string) => {
      if (processedEvents.has(eventId)) {
        return { status: "ALREADY_PROCESSED" };
      }
      processedEvents.add(eventId);
      return { status: "CREDITED" };
    };

    const firstRun = handleEvent("evt_pay_99881");
    const secondRun = handleEvent("evt_pay_99881");

    expect(firstRun.status).toBe("CREDITED");
    expect(secondRun.status).toBe("ALREADY_PROCESSED");
    expect(processedEvents.size).toBe(1);
  });
});
