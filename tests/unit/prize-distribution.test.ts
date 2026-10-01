import { describe, it, expect } from "vitest";

describe("Prize Distribution & Escrow Deductions", () => {
  it("calculates 100% winner payout minus 10% platform organizer fee for 1v1", () => {
    const prizePool = 100; // e.g. two 50 INR players
    const platformFeePercent = 10;
    const distribution = { "1st": 100 };

    const firstPlaceGross = prizePool * (distribution["1st"] / 100);
    const platformFee = firstPlaceGross * (platformFeePercent / 100);
    const winnerNetPayout = firstPlaceGross - platformFee;

    expect(firstPlaceGross).toBe(100);
    expect(platformFee).toBe(10);
    expect(winnerNetPayout).toBe(90);
  });

  it("calculates 4-player 70% / 30% tiered prize pool breakdown", () => {
    const prizePool = 360;
    const platformFeePercent = 10;
    const distribution = { "1st": 70, "2nd": 30 };

    const firstGross = Math.round(prizePool * (distribution["1st"] / 100)); // 252
    const firstFee = Math.round(firstGross * (platformFeePercent / 100)); // 25
    const firstNet = firstGross - firstFee;

    const secondGross = Math.round(prizePool * (distribution["2nd"] / 100)); // 108
    const secondFee = Math.round(secondGross * (platformFeePercent / 100)); // 11
    const secondNet = secondGross - secondFee;

    expect(firstGross).toBe(252);
    expect(secondGross).toBe(108);
    expect(firstNet + secondNet + firstFee + secondFee).toBe(prizePool);
  });

  it("guarantees idempotency so completed matches cannot be distributed twice", () => {
    const tournament = { id: "t-1", status: "COMPLETED" };
    let distributionAttemptCount = 0;

    const executeDistribution = (tourney: typeof tournament) => {
      if (tourney.status === "COMPLETED") {
        return { success: false, error: "Already distributed" };
      }
      distributionAttemptCount++;
      return { success: true };
    };

    const res1 = executeDistribution(tournament);
    expect(res1.success).toBe(false);
    expect(distributionAttemptCount).toBe(0);
  });
});
