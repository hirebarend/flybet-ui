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
  const d = raw as Record<string, Record<string, unknown> | string | boolean>;
  const departure = (d.departure ?? {}) as Record<string, unknown>;
  const arrival = (d.arrival ?? {}) as Record<string, unknown>;
  const airline = (d.airline ?? {}) as Record<string, unknown>;
  const aircraft = (d.aircraft ?? {}) as Record<string, unknown>;

  return {
    flight: (d.flight as string) ?? '',
    airline: {
      iata: (airline.iata as string) ?? '',
    },
    departure: {
      airport: {
        code: ((departure.airport as Record<string, unknown> | undefined)?.code as string) ?? '',
      },
      scheduled: toISOString(departure.scheduled),
      actual: departure.actual ? toISOString(departure.actual) : null,
    },
    arrival: {
      airport: {
        code: ((arrival.airport as Record<string, unknown> | undefined)?.code as string) ?? '',
      },
      scheduled: toISOString(arrival.scheduled),
      actual: arrival.actual ? toISOString(arrival.actual) : null,
    },
    aircraft: {
      model: (aircraft.model as string | null | undefined) ?? null,
    },
    cancelled: Boolean(d.cancelled),
  };
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

      const now = Date.now();
      const sixHoursMs = 6 * 60 * 60 * 1000;

      setFlights(
        data.filter((flight) => {
          const depTime = new Date(flight.departure.scheduled).getTime();
          return depTime >= now - sixHoursMs;
        })
      );
      setLoading(false);
    });

    return () => unsub();
  }, []);

  return { flights, loading };
}
