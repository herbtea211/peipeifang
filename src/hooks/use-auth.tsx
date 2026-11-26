import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

import type { MockSession } from '@/types/auth';

const sessionKey = 'peipeifang.mock-session';

const AuthContext = createContext<{
  initializing: boolean;
  session: MockSession | null;
  verificationEmail: string | null;
  setVerificationEmail: (email: string | null) => void;
  signIn: (session: MockSession) => Promise<void>;
  signOut: () => Promise<void>;
} | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [initializing, setInitializing] = useState(true);
  const [session, setSession] = useState<MockSession | null>(null);
  const [verificationEmail, setVerificationEmail] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    async function restore() {
      try {
        const stored = await AsyncStorage.getItem(sessionKey);
        const restored = stored ? JSON.parse(stored) : null;
        const user = restored?.user;
        if (active && typeof user?.id === 'string' &&
          (user.provider === 'apple' || user.provider === 'google' ||
            (user.provider === 'email' && typeof user.email === 'string'))) {
          setSession(restored);
        }
      } catch {
        // Unreadable mock state starts signed out.
      } finally {
        if (active) setInitializing(false);
      }
    }

    void restore();
    return () => { active = false; };
  }, []);

  async function signIn(nextSession: MockSession) {
    await AsyncStorage.setItem(sessionKey, JSON.stringify(nextSession));
    setSession(nextSession);
    setVerificationEmail(null);
  }

  async function signOut() {
    await AsyncStorage.removeItem(sessionKey);
    setSession(null);
    setVerificationEmail(null);
  }

  return <AuthContext.Provider value={{ initializing, session, verificationEmail, setVerificationEmail, signIn, signOut }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const auth = useContext(AuthContext);
  if (!auth) throw new Error('AuthProvider is required.');
  return auth;
}
