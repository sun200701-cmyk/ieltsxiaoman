"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Session, SupabaseClient, User } from "@supabase/supabase-js";

import { getSupabaseBrowserClient, isSupabaseEnabled } from "@/lib/supabase/client";
import type { AccountUsage } from "@/lib/types";

type AuthContextValue = {
  configured: boolean;
  supabase: SupabaseClient | null;
  session: Session | null;
  user: User | null;
  accessToken: string | null;
  usage: AccountUsage | null;
  loading: boolean;
  refreshUsage: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const configured = isSupabaseEnabled();
  const supabase = configured ? getSupabaseBrowserClient() : null;
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [usage, setUsage] = useState<AccountUsage | null>(null);
  const [loading, setLoading] = useState(configured);

  const accessToken = session?.access_token ?? null;

  const refreshUsage = useCallback(async () => {
    if (!configured || !accessToken) {
      return;
    }

    const response = await fetch("/api/account/usage", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      setUsage(null);
      return;
    }

    const nextUsage = (await response.json()) as AccountUsage;
    setUsage(nextUsage);
  }, [accessToken, configured]);

  useEffect(() => {
    if (!supabase) {
      return;
    }

    let isMounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!isMounted) {
        return;
      }
      setSession(data.session);
      setUser(data.session?.user ?? null);
      if (data.session?.access_token) {
        void fetch("/api/account/usage", {
          headers: {
            Authorization: `Bearer ${data.session.access_token}`,
          },
          cache: "no-store",
        })
          .then(async (response) => {
            if (!response.ok || !isMounted) {
              return;
            }

            const nextUsage = (await response.json()) as AccountUsage;
            setUsage(nextUsage);
          })
          .catch(() => undefined);
      }
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setUser(nextSession?.user ?? null);
      if (!nextSession) {
        setUsage(null);
      } else {
        void fetch("/api/account/usage", {
          headers: {
            Authorization: `Bearer ${nextSession.access_token}`,
          },
          cache: "no-store",
        })
          .then(async (response) => {
            if (!response.ok) {
              return;
            }

            const nextUsage = (await response.json()) as AccountUsage;
            setUsage(nextUsage);
          })
          .catch(() => undefined);
      }
      setLoading(false);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  const value = useMemo(
    () => ({
      configured,
      supabase,
      session,
      user,
      accessToken,
      usage,
      loading,
      refreshUsage,
    }),
    [accessToken, configured, loading, refreshUsage, session, supabase, usage, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
