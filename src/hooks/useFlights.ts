import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { USE_MOCKS, MOCK_FLIGHTS } from '@/lib/mock';
import type { Flight } from '@/types';

export function useFlights() {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (USE_MOCKS) {
      setFlights(MOCK_FLIGHTS);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'flights'),
      orderBy('scheduledDeparture', 'asc')
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Flight[];
      
      // Filter to flights within the next 24 hours
      const now = new Date();
      const in24h = new Date(now.getTime() + 24 * 60 * 60 * 1000);
      const filtered = data.filter((f) => {
        const dep = new Date(f.scheduledDeparture);
        return dep >= now && dep <= in24h;
      });
      
      setFlights(filtered.length > 0 ? filtered : data);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  return { flights, loading };
}
