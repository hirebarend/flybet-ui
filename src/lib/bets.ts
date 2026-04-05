import { collection, doc, runTransaction } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { BetOutcome, StakeAmount } from '@/types';

export async function placeBet(
  userId: string,
  flightId: string,
  outcome: BetOutcome,
  amount: StakeAmount
) {
  return runTransaction(db, async (transaction) => {
    const userRef = doc(db, 'users', userId);
    const userSnap = await transaction.get(userRef);

    if (!userSnap.exists()) {
      throw new Error('User not found');
    }

    const balance = userSnap.data().balance;
    if (balance < amount) {
      throw new Error('Insufficient balance');
    }

    // Deduct balance
    transaction.update(userRef, { balance: balance - amount });

    // Create bet document
    const betRef = doc(collection(db, 'bets'));
    transaction.set(betRef, {
      userId,
      flightId,
      outcome,
      amount,
      placedAt: new Date(),
    });

    return betRef.id;
  });
}

export async function cancelBet(betId: string, userId: string, amount: number) {
  return runTransaction(db, async (transaction) => {
    const userRef = doc(db, 'users', userId);
    const userSnap = await transaction.get(userRef);

    if (!userSnap.exists()) {
      throw new Error('User not found');
    }

    const balance = userSnap.data().balance;

    // Refund balance
    transaction.update(userRef, { balance: balance + amount });

    // Delete bet
    const betRef = doc(db, 'bets', betId);
    transaction.delete(betRef);
  });
}

export function canPlaceBet(scheduledDeparture: string): boolean {
  const depTime = new Date(scheduledDeparture).getTime();
  const now = Date.now();
  const sixHoursMs = 6 * 60 * 60 * 1000;
  
  // Bets can be placed any time as long as departure is more than 6 hours away
  return (depTime - now) > sixHoursMs;
}
