import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Bet } from '@/types';

export function useUserBets(userId: string | undefined, flightId: string | undefined) {
  const [state, setState] = useState<{ key: string | null; bets: Bet[] }>({
    key: null,
    bets: [],
  });
  const requestKey = userId && flightId ? `${userId}:${flightId}` : null;

  useEffect(() => {
    if (!userId || !flightId || !requestKey) {
      return;
    }

    const q = query(
      collection(db, 'bets'),
      where('userId', '==', userId),
      where('flight_id', '==', flightId)
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        settled: Boolean(doc.data().settled),
        payout: (doc.data().payout as number | undefined) ?? 0,
      })) as Bet[];
      setState({ key: requestKey, bets: data });
    });

    return () => unsub();
  }, [flightId, requestKey, userId]);

  const loading = requestKey !== null && state.key !== requestKey;

  return {
    bets: requestKey && state.key === requestKey ? state.bets : [],
    loading: requestKey ? loading : false,
  };
}
