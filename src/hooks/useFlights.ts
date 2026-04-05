import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
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
      
      const now = new Date();
      const in24h = new Date(now.getTime() + 24 * 60 * 60 * 1000);
      const filtered = data.filter((f) => {
        const dep = new Date(f.departure.scheduled);
        return dep >= now && dep <= in24h;
      });
      
      setFlights(filtered.length > 0 ? filtered : data);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  return { flights, loading };
}
