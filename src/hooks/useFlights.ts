import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Flight } from '@/types';

/** Convert a Firestore Timestamp (or any value with a toDate method) to an ISO string. */
function toISOString(value: unknown): string {
  if (value != null && typeof (value as { toDate?: unknown }).toDate === 'function') {
    return ((value as { toDate: () => Date }).toDate()).toISOString();
  }
  return value as string;
}

/** Normalise Firestore Timestamp fields on a raw flight document to ISO strings. */
export function normaliseFlight(raw: Record<string, unknown>): Omit<Flight, 'id'> {
  const d = raw as Record<string, Record<string, unknown>>;
  return {
    ...raw,
    departure: {
      ...(d.departure as Flight['departure']),
      scheduled: toISOString(d.departure?.scheduled),
      actual: d.departure?.actual ? toISOString(d.departure.actual) : null,
    },
    arrival: {
      ...(d.arrival as Flight['arrival']),
      scheduled: toISOString(d.arrival?.scheduled),
      actual: d.arrival?.actual ? toISOString(d.arrival.actual) : null,
    },
  } as Omit<Flight, 'id'>;
}

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
        ...normaliseFlight(doc.data()),
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
