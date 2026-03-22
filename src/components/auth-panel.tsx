"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { LogOut, Mail, ShieldCheck } from "lucide-react";

import { useAuth } from "@/components/auth-provider";

export function AuthPanel() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { configured, loading, supabase, user, usage } = useAuth();

  const returnTo = searchParams.get("returnTo");
  const [email, setEmail] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user && returnTo) {
      router.replace(returnTo);
    }
  }, [returnTo, router, user]);

  const handleSendOtp = async () => {
    if (!supabase || !email.trim()) {
      return;
    }

    setSubmitting(true);
    setStatus(null);

    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
    });

    setSubmitting(false);

    if (error) {
      setStatus(error.message);
      return;
    }

    setOtpSent(true);
    setStatus("验证码已发送到邮箱，请输入邮件中的 6 位验证码完成登录。");
  };

  const handleVerifyOtp = async () => {
    if (!supabase || !email.trim() || !otpCode.trim()) {
      return;
    }

    setSubmitting(true);
    setStatus(null);

    const { error } = await supabase.auth.verifyOtp({
      email: email.trim(),
      token: otpCode.trim(),
      type: "email",
    });

    setSubmitting(false);

    if (error) {
      setStatus(error.message);
      return;
    }

    setStatus("登录成功。");
  };

  const handleSignOut = async () => {
    if (!supabase) {
      return;
    }

    await supabase.auth.signOut();
    setOtpCode("");
    setOtpSent(false);
    setStatus(null);
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
          <p className="mt-2 text-sm leading-6 text-[#475467]">
            现在已切换为邮箱验证码登录，不再要求先设置密码。
          </p>
          {usage?.phone ? <p className="mt-2 text-sm text-[#667085]">已保存手机号：{usage.phone}</p> : null}
        </div>

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

        <div className="mx-auto mt-10 max-w-xl rounded-[28px] border border-black/8 bg-[#fbfbfc] p-8 text-left">
          <div className="grid gap-4">
            <div>
              <p className="text-lg font-semibold text-[#101828]">邮箱验证码登录</p>
              <p className="mt-2 text-sm leading-7 text-[#475467]">
                输入邮箱后发送验证码。已注册用户会直接登录，首次使用的邮箱会自动完成注册。
              </p>
            </div>

            <input
              className="field"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="请输入邮箱"
            />

            <button
              type="button"
              className="brand-button w-full justify-center"
              onClick={handleSendOtp}
              disabled={submitting || !email.trim()}
            >
              <Mail className="h-4 w-4" />
              {submitting ? "发送中..." : otpSent ? "重新发送验证码" : "发送验证码"}
            </button>

            {otpSent ? (
              <>
                <input
                  className="field"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  value={otpCode}
                  onChange={(event) => setOtpCode(event.target.value.replace(/\s+/g, ""))}
                  placeholder="请输入 6 位验证码"
                />
                <button
                  type="button"
                  className="brand-button w-full justify-center"
                  onClick={handleVerifyOtp}
                  disabled={submitting || !email.trim() || !otpCode.trim()}
                >
                  <ShieldCheck className="h-4 w-4" />
                  {submitting ? "验证中..." : "验证并登录"}
                </button>
              </>
            ) : null}

            {status ? <p className="text-sm text-[#344054]">{status}</p> : null}
          </div>
        </div>
      </div>
    </section>
  );
}
