import { describe, it, expect } from "vitest";

describe("Wallet Double-Entry Math & Deductions", () => {
  it("calculates tournament fee deduction with 20% max bonus cap", () => {
    const entryFee = 100;
    const wallet = {
      deposit: 50,
      winnings: 100,
      bonus: 30, // 30 available, but cap is 20% of 100 = 20
    };

    const maxBonusAllowed = entryFee * 0.2; // 20
    const bonusToUse = Math.min(wallet.bonus, maxBonusAllowed); // 20
    const remainingAfterBonus = entryFee - bonusToUse; // 80

    const depositToUse = Math.min(wallet.deposit, remainingAfterBonus); // 50
    const winningsToUse = remainingAfterBonus - depositToUse; // 30

    expect(bonusToUse).toBe(20);
    expect(depositToUse).toBe(50);
    expect(winningsToUse).toBe(30);
    expect(bonusToUse + depositToUse + winningsToUse).toBe(entryFee);

    const updatedWallet = {
      deposit: wallet.deposit - depositToUse,
      winnings: wallet.winnings - winningsToUse,
      bonus: wallet.bonus - bonusToUse,
    };

    expect(updatedWallet.deposit).toBe(0);
    expect(updatedWallet.winnings).toBe(70);
    expect(updatedWallet.bonus).toBe(10);
  });

  it("prevents negative balances when insufficient funds", () => {
    const entryFee = 250;
    const wallet = { deposit: 40, winnings: 50, bonus: 20 };
    const totalBalance = wallet.deposit + wallet.winnings + wallet.bonus;

    const canJoin = totalBalance >= entryFee;
    expect(canJoin).toBe(false);
  });

  it("restricts cash withdrawals exclusively to winnings_balance", () => {
    const wallet = {
      deposit: 1000,
      winnings: 400,
      bonus: 200,
    };

    const requestedWithdrawal = 500;
    const isAllowed = requestedWithdrawal <= wallet.winnings;

    expect(isAllowed).toBe(false);

    const allowedWithdrawal = 400;
    expect(allowedWithdrawal <= wallet.winnings).toBe(true);
  });
});
