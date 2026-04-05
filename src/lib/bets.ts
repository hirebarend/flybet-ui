import { collection, doc, runTransaction } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { USE_MOCKS, mockPlaceBet, mockCancelBet } from '@/lib/mock';
import type { BetOutcome, StakeAmount } from '@/types';

export async function placeBet(
  userId: string,
  flightId: string,
  outcome: BetOutcome,
  amount: StakeAmount
) {
  if (USE_MOCKS) {
    return mockPlaceBet(flightId, outcome, amount);
  }

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
  if (USE_MOCKS) {
    mockCancelBet(betId);
    return;
  }

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
  // const depTime = new Date(scheduledDeparture).getTime();
  // const now = Date.now();
  // const sixHoursMs = 6 * 60 * 60 * 1000;
  
  // // Can only bet within 6 hours before departure and before departure
  // return depTime > now && (depTime - now) <= sixHoursMs;

  return true;
}
