"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { AuthCard } from "@/components/auth-card";
import { useAuth } from "@/components/auth-provider";

export function AuthPanel() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, usage } = useAuth();

  const returnTo = searchParams.get("returnTo");

  useEffect(() => {
    if (user && !usage?.requiresProfileSetup && returnTo) {
      router.replace(returnTo);
    }
  }, [returnTo, router, usage?.requiresProfileSetup, user]);

  return (
    <section className="w-full max-w-3xl">
      <AuthCard />
    </section>
  );
}
