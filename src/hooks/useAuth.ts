import { useState, useEffect, useCallback } from 'react';
import {
  onAuthStateChanged,
  sendSignInLinkToEmail,
  signOut as firebaseSignOut,
  type User,
} from 'firebase/auth';
import { doc, onSnapshot, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { USE_MOCKS, MOCK_USER_PROFILE, getMockBalance, subscribeMockState } from '@/lib/mock';
import type { UserProfile } from '@/types';

const ACTION_CODE_SETTINGS = {
  url: window.location.origin + '/auth/callback',
  handleCodeInApp: true,
};

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (USE_MOCKS) {
      setUserProfile({ ...MOCK_USER_PROFILE });
      setUser({ uid: MOCK_USER_PROFILE.uid, email: MOCK_USER_PROFILE.email } as User);
      setLoading(false);

      // Subscribe to mock state changes for balance updates
      const unsub = subscribeMockState(() => {
        setUserProfile((prev) =>
          prev ? { ...prev, balance: getMockBalance() } : prev
        );
      });
      return unsub;
    }

    const unsubAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (!firebaseUser) {
        setUserProfile(null);
        setLoading(false);
        return;
      }

      const userRef = doc(db, 'users', firebaseUser.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        await setDoc(userRef, {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          balance: 1000,
          createdAt: new Date(),
        });
      }

      setLoading(false);
    });

    return () => unsubAuth();
  }, []);

  // Real-time profile listener (Firebase only)
  useEffect(() => {
    if (USE_MOCKS || !user) return;

    const userRef = doc(db, 'users', user.uid);
    const unsub = onSnapshot(userRef, (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setUserProfile({
          uid: data.uid,
          email: data.email,
          displayName: data.displayName,
          balance: data.balance,
          createdAt: data.createdAt?.toDate?.() ?? new Date(),
        } as UserProfile);
      }
    });

    return () => unsub();
  }, [user]);

  const signInWithEmail = useCallback(async (email: string) => {
    if (USE_MOCKS) return;
    await sendSignInLinkToEmail(auth, email, ACTION_CODE_SETTINGS);
    window.localStorage.setItem('emailForSignIn', email);
  }, []);

  const signOut = useCallback(async () => {
    if (USE_MOCKS) return;
    await firebaseSignOut(auth);
    setUser(null);
    setUserProfile(null);
  }, []);

  return { user, userProfile, loading, signInWithEmail, signOut };
}
