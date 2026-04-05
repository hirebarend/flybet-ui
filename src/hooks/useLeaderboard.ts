import { useState, useEffect } from 'react';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { USE_MOCKS, getMockLeaderboard, subscribeMockState } from '@/lib/mock';
import type { UserProfile } from '@/types';

export function useLeaderboard() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (USE_MOCKS) {
      setUsers(getMockLeaderboard());
      setLoading(false);
      const unsub = subscribeMockState(() => {
        setUsers(getMockLeaderboard());
      });
      return unsub;
    }

    const q = query(
      collection(db, 'users'),
      orderBy('balance', 'desc'),
      limit(50)
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => {
        const d = doc.data();
        return {
          uid: d.uid,
          email: d.email,
          displayName: d.displayName,
          balance: d.balance,
          createdAt: d.createdAt?.toDate?.() ?? new Date(),
        } as UserProfile;
      });
      setUsers(data);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  return { users, loading };
}
