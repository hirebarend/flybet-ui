import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { canPlaceBet } from '@/lib/bets';
import type { Flight } from '@/types';

export function useFlights() {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, 'flights'),
      orderBy('departure.scheduled', 'asc')
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Flight[];

      const now = Date.now();
      const sixHoursMs = 6 * 60 * 60 * 1000;

      // Split flights into open (betting available) and closed (within 6h of departure or up to 6h after)
      const open: Flight[] = [];
      const closed: Flight[] = [];

      for (const f of data) {
        const depTime = new Date(f.departure.scheduled).getTime();

        // Exclude flights more than 6 hours past departure
        if (depTime < now - sixHoursMs) continue;

        if (canPlaceBet(f.departure.scheduled)) {
          open.push(f);
        } else {
          closed.push(f);
        }
      }

      // Both groups are already sorted by departure.scheduled asc from the query
      setFlights([...open, ...closed]);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  return { flights, loading };
}
