"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { LockKeyhole, LogOut, Mail, Phone } from "lucide-react";

import { useAuth } from "@/components/auth-provider";

type AuthMode = "login" | "register";

export function AuthPanel() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { configured, loading, refreshUsage, supabase, user, usage } = useAuth();

  const returnTo = searchParams.get("returnTo");
  const [mode, setMode] = useState<AuthMode>("login");
  const [magicEmail, setMagicEmail] = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [phone, setPhone] = useState(usage?.phone ?? "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const magicRedirectUrl = useMemo(() => {
    if (typeof window === "undefined") {
      return "";
    }

    const url = new URL("/me", window.location.origin);
    if (returnTo) {
      url.searchParams.set("returnTo", returnTo);
    }
    return url.toString();
  }, [returnTo]);

  useEffect(() => {
    if (user && !usage?.requiresProfileSetup && returnTo) {
      router.replace(returnTo);
    }
  }, [returnTo, router, usage?.requiresProfileSetup, user]);

  const handleMagicLink = async () => {
    if (!supabase || !magicEmail) {
      return;
    }

    setSubmitting(true);
    setStatus(null);

    const { error } = await supabase.auth.signInWithOtp({
      email: magicEmail,
      options: {
        emailRedirectTo: magicRedirectUrl || window.location.origin,
      },
    });

    setSubmitting(false);
    setStatus(error ? error.message : "注册链接已发送，请前往邮箱完成验证。");
  };

  const handlePasswordLogin = async () => {
    if (!supabase || !loginEmail || !loginPassword) {
      return;
    }

    setSubmitting(true);
    setStatus(null);

    const { error } = await supabase.auth.signInWithPassword({
      email: loginEmail,
      password: loginPassword,
    });

    setSubmitting(false);
    setStatus(error ? error.message : "登录成功。");
  };

  const handleFinishSetup = async () => {
    if (!supabase || !user) {
      return;
    }

    if (!phone.trim()) {
      setStatus("请先填写手机号。");
      return;
    }

    if (!password || password.length < 6) {
      setStatus("密码至少需要 6 位。");
      return;
    }

    if (password !== confirmPassword) {
      setStatus("两次输入的密码不一致。");
      return;
    }

    setSubmitting(true);
    setStatus(null);

    const { error: passwordError } = await supabase.auth.updateUser({ password });
    if (passwordError) {
      setSubmitting(false);
      setStatus(passwordError.message);
      return;
    }

    const { error: profileError } = await supabase
      .from("profiles")
      .update({
        phone: phone.trim(),
        password_set: true,
      })
      .eq("id", user.id);

    setSubmitting(false);

    if (profileError) {
      setStatus(profileError.message);
      return;
    }

    await refreshUsage();
    setPassword("");
    setConfirmPassword("");
    setStatus("资料补全成功，后续可以直接使用邮箱和密码登录。");
  };

  const handleSignOut = async () => {
    if (!supabase) {
      return;
    }

    await supabase.auth.signOut();
  };

  if (!configured) {
    return (
      <section className="grid gap-4 rounded-[32px] border border-black/8 bg-white p-8 shadow-[0_24px_70px_rgba(16,24,40,0.08)]">
        <h2 className="text-2xl font-semibold text-[#101828]">登录功能暂未开启</h2>
        <p className="text-sm leading-7 text-[#475467]">
          当前还没有配置 Supabase 环境变量，所以注册、登录和会员功能暂时不可用。
        </p>
      </section>
    );
  }

  if (loading) {
    return <p className="text-sm text-[#667085]">正在检查登录状态...</p>;
  }

  if (user) {
    return (
      <section className="grid gap-5">
        <div className="rounded-[28px] border border-black/8 bg-white p-6">
          <p className="text-sm text-[#667085]">当前登录账号</p>
          <p className="mt-2 text-lg font-medium text-[#101828]">{user.email}</p>
        </div>

        {usage?.requiresProfileSetup ? (
          <div className="grid gap-4 rounded-[28px] border border-[#8d7557]/18 bg-[#f8f3ea] p-6">
            <div>
              <h3 className="text-xl font-semibold text-[#101828]">完成注册</h3>
              <p className="mt-2 text-sm leading-7 text-[#475467]">
                这是你第一次通过邮箱链接进入，请先填写手机号并设置密码。完成后就可以直接使用邮箱和密码登录。
              </p>
            </div>

            <input
              className="field"
              type="tel"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder="请输入手机号"
            />
            <input
              className="field"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="请设置密码（至少 6 位）"
            />
            <input
              className="field"
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              placeholder="请再次输入密码"
            />
            <button
              type="button"
              className="brand-button w-full justify-center"
              onClick={handleFinishSetup}
              disabled={submitting}
            >
              <Phone className="h-4 w-4" />
              {submitting ? "保存中..." : "完成注册"}
            </button>
          </div>
        ) : null}

        {status ? <p className="text-sm text-[#344054]">{status}</p> : null}

        <button type="button" className="small-button w-full" onClick={handleSignOut}>
          <LogOut className="h-4 w-4" />
          退出登录
        </button>
      </section>
    );
  }

  return (
    <section className="flex min-h-screen items-center justify-center px-4 py-10 sm:px-6">
      <div className="w-full max-w-3xl rounded-[40px] border border-black/8 bg-white px-8 py-12 text-center shadow-[0_30px_90px_rgba(16,24,40,0.1)] sm:px-12">
        <p className="text-4xl font-semibold tracking-[-0.06em] text-[#101828] sm:text-5xl">雅小满</p>
        <p className="mt-4 text-lg text-[#475467] sm:text-xl">你的雅思学习 AI 助手</p>

        <div className="mt-10 flex justify-center gap-4">
          <button
            type="button"
            onClick={() => setMode("register")}
            className={`rounded-full px-8 py-3 text-base font-medium transition ${
              mode === "register"
                ? "bg-[#101828] text-white"
                : "border border-black/8 bg-[#fffdf8] text-[#101828] hover:bg-[#f3eee5]"
            }`}
          >
            注册
          </button>
          <button
            type="button"
            onClick={() => setMode("login")}
            className={`rounded-full px-8 py-3 text-base font-medium transition ${
              mode === "login"
                ? "bg-[#101828] text-white"
                : "border border-black/8 bg-[#fffdf8] text-[#101828] hover:bg-[#f3eee5]"
            }`}
          >
            登录
          </button>
        </div>

        <div className="mx-auto mt-10 max-w-xl rounded-[28px] border border-black/8 bg-[#fbfbfc] p-8 text-left">
          {mode === "register" ? (
            <div className="grid gap-4">
              <div>
                <p className="text-lg font-semibold text-[#101828]">注册</p>
                <p className="mt-2 text-sm leading-7 text-[#475467]">
                  第一次注册通过邮箱链接完成。验证后请继续设置手机号和密码。
                </p>
              </div>

              <input
                className="field"
                type="email"
                value={magicEmail}
                onChange={(event) => setMagicEmail(event.target.value)}
                placeholder="请输入邮箱"
              />
              <button
                type="button"
                className="brand-button w-full justify-center"
                onClick={handleMagicLink}
                disabled={submitting || !magicEmail}
              >
                <Mail className="h-4 w-4" />
                {submitting ? "发送中..." : "发送链接"}
              </button>
              <button type="button" className="text-sm text-[#8d7557]" onClick={() => setMode("login")}>
                已经有账号了，去登录
              </button>
            </div>
          ) : (
            <div className="grid gap-4">
              <div>
                <p className="text-lg font-semibold text-[#101828]">登录</p>
                <p className="mt-2 text-sm leading-7 text-[#475467]">
                  已完成手机号和密码设置的用户，可以直接使用邮箱和密码登录。
                </p>
              </div>

              <input
                className="field"
                type="email"
                value={loginEmail}
                onChange={(event) => setLoginEmail(event.target.value)}
                placeholder="请输入邮箱"
              />
              <input
                className="field"
                type="password"
                value={loginPassword}
                onChange={(event) => setLoginPassword(event.target.value)}
                placeholder="请输入密码"
              />
              <button
                type="button"
                className="brand-button w-full justify-center"
                onClick={handlePasswordLogin}
                disabled={submitting || !loginEmail || !loginPassword}
              >
                <LockKeyhole className="h-4 w-4" />
                {submitting ? "登录中..." : "登录"}
              </button>

              <div className="flex flex-col gap-2 text-sm">
                <button type="button" className="text-left text-[#8d7557]" onClick={() => setMode("register")}>
                  还没有账号，去注册
                </button>
                <button
                  type="button"
                  className="text-left text-[#8d7557]"
                  onClick={() => {
                    setMode("register");
                    setStatus("如果你还没有设置密码，请使用邮箱链接继续完成注册。");
                  }}
                >
                  还没设置密码？用邮箱链接继续
                </button>
              </div>
            </div>
          )}

          {status ? <p className="mt-4 text-sm text-[#344054]">{status}</p> : null}
        </div>
      </div>
    </section>
  );
}
