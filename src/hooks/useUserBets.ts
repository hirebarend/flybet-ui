import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { USE_MOCKS, getMockBets, subscribeMockState } from '@/lib/mock';
import type { Bet } from '@/types';

export function useUserBets(userId: string | undefined, flightId: string | undefined) {
  const [bets, setBets] = useState<Bet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId || !flightId) {
      setBets([]);
      setLoading(false);
      return;
    }

    if (USE_MOCKS) {
      setBets(getMockBets(flightId));
      setLoading(false);
      const unsub = subscribeMockState(() => {
        setBets(getMockBets(flightId));
      });
      return unsub;
    }

    const q = query(
      collection(db, 'bets'),
      where('userId', '==', userId),
      where('flightId', '==', flightId)
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        placedAt: doc.data().placedAt?.toDate?.() ?? new Date(),
      })) as Bet[];
      setBets(data);
      setLoading(false);
    });

    return () => unsub();
  }, [userId, flightId]);

  return { bets, loading };
}
