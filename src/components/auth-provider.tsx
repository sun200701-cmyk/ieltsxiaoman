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
import type { AccountUsage, RegularEnglishUsage } from "@/lib/types";

type AuthContextValue = {
  configured: boolean;
  supabase: SupabaseClient | null;
  session: Session | null;
  user: User | null;
  accessToken: string | null;
  usage: AccountUsage | null;
  regularEnglishUsage: RegularEnglishUsage | null;
  loading: boolean;
  refreshUsage: () => Promise<void>;
  refreshRegularEnglishUsage: () => Promise<void>;
  completeProfileSetupLocally: () => void;
  clearAuthStateLocally: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function isInvalidRefreshTokenError(error: unknown) {
  if (!(error instanceof Error)) {
    return false;
  }

  const message = error.message.toLowerCase();
  return message.includes("invalid refresh token") || message.includes("refresh token not found");
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const configured = isSupabaseEnabled();
  const supabase = configured ? getSupabaseBrowserClient() : null;
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [usage, setUsage] = useState<AccountUsage | null>(null);
  const [regularEnglishUsage, setRegularEnglishUsage] = useState<RegularEnglishUsage | null>(null);
  const [loading, setLoading] = useState(configured);

  const accessToken = session?.access_token ?? null;

  const loadUsage = useCallback(
    async (path: string) => {
      if (!configured || !accessToken) {
        return null;
      }

      const response = await fetch(path, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        cache: "no-store",
      });

      if (!response.ok) {
        return null;
      }

      return response.json();
    },
    [accessToken, configured],
  );

  const refreshUsage = useCallback(async () => {
    const nextUsage = (await loadUsage("/api/account/usage")) as AccountUsage | null;
    if (!nextUsage) {
      setUsage(null);
      return;
    }

    setUsage(nextUsage);
  }, [loadUsage]);

  const refreshRegularEnglishUsage = useCallback(async () => {
    const nextUsage = (await loadUsage("/api/account/regular-english-usage")) as RegularEnglishUsage | null;
    if (!nextUsage) {
      setRegularEnglishUsage(null);
      return;
    }

    setRegularEnglishUsage(nextUsage);
  }, [loadUsage]);

  const completeProfileSetupLocally = useCallback(() => {
    setUsage((current) =>
      current
        ? {
            ...current,
            passwordSet: true,
            requiresProfileSetup: false,
          }
        : current,
    );
  }, []);

  const clearAuthStateLocally = useCallback(() => {
    setSession(null);
    setUser(null);
    setUsage(null);
    setRegularEnglishUsage(null);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!supabase) {
      return;
    }

    let isMounted = true;
    const clearInvalidSession = async () => {
      try {
        await supabase.auth.signOut({ scope: "local" });
      } catch {
        // Ignore local cleanup errors and continue with a logged-out state.
      }

      if (!isMounted) {
        return;
      }

      setSession(null);
      setUser(null);
      setUsage(null);
      setRegularEnglishUsage(null);
      setLoading(false);
    };

    void supabase.auth.getSession()
      .then(async ({ data, error }) => {
        if (error && isInvalidRefreshTokenError(error)) {
          await clearInvalidSession();
          return;
        }

        if (!isMounted) {
          return;
        }
        setSession(data.session);
        setUser(data.session?.user ?? null);
        if (data.session?.access_token) {
          void Promise.all([
            fetch("/api/account/usage", {
              headers: {
                Authorization: `Bearer ${data.session.access_token}`,
              },
              cache: "no-store",
            }),
            fetch("/api/account/regular-english-usage", {
              headers: {
                Authorization: `Bearer ${data.session.access_token}`,
              },
              cache: "no-store",
            }),
          ])
            .then(async ([usageResponse, regularEnglishUsageResponse]) => {
              if (!isMounted) {
                return;
              }

              if (usageResponse.ok) {
                const nextUsage = (await usageResponse.json()) as AccountUsage;
                setUsage(nextUsage);
              }

              if (regularEnglishUsageResponse.ok) {
                const nextRegularEnglishUsage = (await regularEnglishUsageResponse.json()) as RegularEnglishUsage;
                setRegularEnglishUsage(nextRegularEnglishUsage);
              }
            })
            .catch(() => undefined);
        }
        setLoading(false);
      })
      .catch(async (error) => {
        if (isInvalidRefreshTokenError(error)) {
          await clearInvalidSession();
          return;
        }

        if (!isMounted) {
          return;
        }

        setLoading(false);
      });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, nextSession) => {
      if (!nextSession) {
        const {
          data: { session: recoveredSession },
          error,
        } = await supabase.auth.getSession();

        if (error && isInvalidRefreshTokenError(error)) {
          await clearInvalidSession();
          return;
        }

        nextSession = recoveredSession;
      }

      setSession(nextSession);
      setUser(nextSession?.user ?? null);
      if (!nextSession) {
        setUsage(null);
        setRegularEnglishUsage(null);
      } else {
        void Promise.all([
          fetch("/api/account/usage", {
            headers: {
              Authorization: `Bearer ${nextSession.access_token}`,
            },
            cache: "no-store",
          }),
          fetch("/api/account/regular-english-usage", {
            headers: {
              Authorization: `Bearer ${nextSession.access_token}`,
            },
            cache: "no-store",
          }),
        ])
          .then(async ([usageResponse, regularEnglishUsageResponse]) => {
            if (usageResponse.ok) {
              const nextUsage = (await usageResponse.json()) as AccountUsage;
              setUsage(nextUsage);
            } else {
              setUsage(null);
            }

            if (regularEnglishUsageResponse.ok) {
              const nextRegularEnglishUsage = (await regularEnglishUsageResponse.json()) as RegularEnglishUsage;
              setRegularEnglishUsage(nextRegularEnglishUsage);
            } else {
              setRegularEnglishUsage(null);
            }
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
      regularEnglishUsage,
      loading,
      refreshUsage,
      refreshRegularEnglishUsage,
      completeProfileSetupLocally,
      clearAuthStateLocally,
    }),
    [
      accessToken,
      clearAuthStateLocally,
      completeProfileSetupLocally,
      configured,
      loading,
      refreshRegularEnglishUsage,
      refreshUsage,
      regularEnglishUsage,
      session,
      supabase,
      usage,
      user,
    ],
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
