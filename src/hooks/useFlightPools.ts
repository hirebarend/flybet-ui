import { useState, useEffect } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface FlightPool {
  totalPool: number;
  stakerCount: number;
}

export function useFlightPools() {
  const [pools, setPools] = useState<Map<string, FlightPool>>(new Map());

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'bets'), (snapshot) => {
      const map = new Map<string, { total: number; users: Set<string> }>();

      for (const doc of snapshot.docs) {
        const data = doc.data();
        const flightId = data.flightId as string;
        const amount = (data.amount as number) ?? 0;
        const userId = data.userId as string;

        let entry = map.get(flightId);
        if (!entry) {
          entry = { total: 0, users: new Set() };
          map.set(flightId, entry);
        }
        entry.total += amount;
        entry.users.add(userId);
      }

      const result = new Map<string, FlightPool>();
      for (const [flightId, entry] of map) {
        result.set(flightId, {
          totalPool: entry.total,
          stakerCount: entry.users.size,
        });
      }
      setPools(result);
    });

    return () => unsub();
  }, []);

  return pools;
}
