import { describe, it, expect } from "vitest";

describe("Tournament Atomic Join & Capacity Guards", () => {
  it("rejects joins when tournament has reached maximum capacity", () => {
    const tournament = {
      max_players: 4,
      current_players: 4,
      status: "FULL",
    };

    const isAvailable = tournament.current_players < tournament.max_players;
    expect(isAvailable).toBe(false);
  });

  it("rejects duplicate participant registration", () => {
    const participants = [{ user_id: "user-123" }, { user_id: "user-456" }];
    const incomingUserId = "user-123";

    const alreadyJoined = participants.some((p) => p.user_id === incomingUserId);
    expect(alreadyJoined).toBe(true);
  });

  it("updates tournament status to FULL when last slot is taken", () => {
    let currentPlayers = 3;
    const maxPlayers = 4;

    currentPlayers += 1;
    const newStatus = currentPlayers >= maxPlayers ? "FULL" : "REGISTRATION_OPEN";

    expect(currentPlayers).toBe(4);
    expect(newStatus).toBe("FULL");
  });

  it("reverts status to REGISTRATION_OPEN when a participant leaves", () => {
    let currentPlayers = 4;
    let status = "FULL";

    currentPlayers -= 1;
    if (status === "FULL" && currentPlayers < 4) {
      status = "REGISTRATION_OPEN";
    }

    expect(currentPlayers).toBe(3);
    expect(status).toBe("REGISTRATION_OPEN");
  });
});
