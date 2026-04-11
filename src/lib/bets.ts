import { collection, doc, runTransaction } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Bet, BetOutcome, StakeAmount } from "@/types";

export async function placeBet(
  userId: string,
  flightId: string,
  outcome: BetOutcome,
  amount: StakeAmount,
) {
  return runTransaction(db, async (transaction) => {
    const userRef = doc(db, "users", userId);
    const userSnap = await transaction.get(userRef);

    if (!userSnap.exists()) {
      throw new Error("User not found");
    }

    const balance = userSnap.data().balance;
    if (balance < amount) {
      throw new Error("Insufficient balance");
    }

    // Deduct balance
    transaction.update(userRef, { balance: balance - amount });

    // Create bet document
    const betRef = doc(collection(db, "bets"));
    transaction.set(betRef, {
      userId,
      flight_id: flightId,
      outcome,
      amount,
      settled: false,
      payout: 0,
    });

    return betRef.id;
  });
}

export async function cancelBet(
  bet: Pick<Bet, "id" | "amount" | "settled">,
  userId: string,
) {
  if (bet.settled) {
    throw new Error("Settled bets cannot be cancelled");
  }

  return runTransaction(db, async (transaction) => {
    const userRef = doc(db, "users", userId);
    const userSnap = await transaction.get(userRef);

    if (!userSnap.exists()) {
      throw new Error("User not found");
    }

    const balance = userSnap.data().balance;

    // Refund balance
    transaction.update(userRef, { balance: balance + bet.amount });

    // Delete bet
    const betRef = doc(db, "bets", bet.id);
    transaction.delete(betRef);
  });
}

export function canPlaceBet(scheduledDeparture: string): boolean {
  const depTime = new Date(scheduledDeparture).getTime();
  const now = Date.now();
  const threeHoursMs = 3 * 60 * 60 * 1000;

  // Bets can be placed any time as long as departure is more than 3 hours away
  return depTime - now > threeHoursMs;
}
