"use client";

import { useEffect, useState } from "react";
import { KeyRound, LogOut, Mail, ShieldCheck } from "lucide-react";

import { useAuth } from "@/components/auth-provider";

type AuthMode = "login" | "register";

type AuthCardProps = {
  initialMode?: AuthMode;
  onSuccess?: () => void;
};

export function AuthCard({ initialMode = "login", onSuccess }: AuthCardProps) {
  const { configured, loading, refreshUsage, supabase, user, usage } = useAuth();

  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerOtp, setRegisterOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  useEffect(() => {
    if (user && !usage?.requiresProfileSetup) {
      onSuccess?.();
    }
  }, [onSuccess, usage?.requiresProfileSetup, user]);

  const handleSendOtp = async () => {
    if (!supabase || !registerEmail.trim()) {
      return;
    }

    setSubmitting(true);
    setStatus(null);

    const { error } = await supabase.auth.signInWithOtp({
      email: registerEmail.trim(),
    });

    setSubmitting(false);

    if (error) {
      setStatus(error.message);
      return;
    }

    setOtpSent(true);
    setStatus("验证码已发送到邮箱，请输入邮件中的 8 位验证码完成验证。");
  };

  const handleVerifyOtp = async () => {
    if (!supabase || !registerEmail.trim() || !registerOtp.trim()) {
      return;
    }

    setSubmitting(true);
    setStatus(null);

    const { error } = await supabase.auth.verifyOtp({
      email: registerEmail.trim(),
      token: registerOtp.trim(),
      type: "email",
    });

    setSubmitting(false);

    if (error) {
      setStatus(error.message);
      return;
    }

    setStatus("邮箱验证成功，请继续设置登录密码。");
  };

  const handlePasswordLogin = async () => {
    if (!supabase || !loginEmail.trim() || !loginPassword) {
      return;
    }

    setSubmitting(true);
    setStatus(null);

    const { error } = await supabase.auth.signInWithPassword({
      email: loginEmail.trim(),
      password: loginPassword,
    });

    setSubmitting(false);
    setStatus(error ? error.message : "登录成功。");
  };

  const handleFinishSetup = async () => {
    if (!supabase || !user) {
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
    setStatus("注册完成，后续可以直接使用邮箱和密码登录。");
  };

  const handleSignOut = async () => {
    if (!supabase) {
      return;
    }

    await supabase.auth.signOut();
    setRegisterOtp("");
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
      <section className="grid w-full gap-5">
        <div className="rounded-[28px] border border-black/8 bg-white p-6">
          <p className="text-sm text-[#667085]">当前登录账号</p>
          <p className="mt-2 text-lg font-medium text-[#101828]">{user.email}</p>
        </div>

        {usage?.requiresProfileSetup ? (
          <div className="grid gap-4 rounded-[28px] border border-[#8d7557]/18 bg-[#f8f3ea] p-6">
            <div>
              <h3 className="text-xl font-semibold text-[#101828]">设置登录密码</h3>
              <p className="mt-2 text-sm leading-7 text-[#475467]">
                邮箱已经验证成功，请先设置密码。设置完成后，后续就可以直接使用邮箱和密码登录。
              </p>
            </div>

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
              <KeyRound className="h-4 w-4" />
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
    <section className="w-full rounded-[32px] border border-black/8 bg-white p-7 shadow-[0_24px_70px_rgba(16,24,40,0.08)] sm:p-8">
      <div className="flex justify-center gap-3">
        <button
          type="button"
          onClick={() => {
            setMode("register");
            setStatus(null);
          }}
          className={`rounded-full px-6 py-3 text-sm font-medium transition ${
            mode === "register"
              ? "bg-[#101828] text-white"
              : "border border-black/8 bg-[#fffdf8] text-[#101828] hover:bg-[#f3eee5]"
          }`}
        >
          注册
        </button>
        <button
          type="button"
          onClick={() => {
            setMode("login");
            setStatus(null);
          }}
          className={`rounded-full px-6 py-3 text-sm font-medium transition ${
            mode === "login"
              ? "bg-[#101828] text-white"
              : "border border-black/8 bg-[#fffdf8] text-[#101828] hover:bg-[#f3eee5]"
          }`}
        >
          登录
        </button>
      </div>

      <div className="mt-6 rounded-[28px] border border-black/8 bg-[#fbfbfc] p-6 text-left">
        {mode === "register" ? (
          <div className="grid gap-4">
            <div>
              <p className="text-lg font-semibold text-[#101828]">邮箱验证码注册</p>
              <p className="mt-2 text-sm leading-7 text-[#475467]">
                先通过邮箱验证码完成验证，再设置密码。验证码邮件里是 8 位验证码，不是登录链接。
              </p>
            </div>

            <input
              className="field"
              type="email"
              value={registerEmail}
              onChange={(event) => setRegisterEmail(event.target.value)}
              placeholder="请输入邮箱"
            />

            <button
              type="button"
              className="brand-button w-full justify-center"
              onClick={handleSendOtp}
              disabled={submitting || !registerEmail.trim()}
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
                  value={registerOtp}
                  onChange={(event) => setRegisterOtp(event.target.value.replace(/\s+/g, ""))}
                  placeholder="请输入 8 位验证码"
                />
                <button
                  type="button"
                  className="brand-button w-full justify-center"
                  onClick={handleVerifyOtp}
                  disabled={submitting || !registerEmail.trim() || !registerOtp.trim()}
                >
                  <ShieldCheck className="h-4 w-4" />
                  {submitting ? "验证中..." : "验证邮箱"}
                </button>
              </>
            ) : null}

            <button
              type="button"
              className="text-sm text-[#8d7557]"
              onClick={() => {
                setMode("login");
                setStatus(null);
              }}
            >
              已经有账号了，去登录
            </button>
          </div>
        ) : (
          <div className="grid gap-4">
            <div>
              <p className="text-lg font-semibold text-[#101828]">邮箱密码登录</p>
              <p className="mt-2 text-sm leading-7 text-[#475467]">
                完成注册并设置密码后，后续直接使用邮箱和密码登录，不需要重复发送验证码。
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
              disabled={submitting || !loginEmail.trim() || !loginPassword}
            >
              <KeyRound className="h-4 w-4" />
              {submitting ? "登录中..." : "登录"}
            </button>

            <button
              type="button"
              className="text-left text-sm text-[#8d7557]"
              onClick={() => {
                setMode("register");
                setStatus("如果你还没有注册，请先使用邮箱验证码完成注册。");
              }}
            >
              还没有账号？先去注册
            </button>
          </div>
        )}

        {status ? <p className="mt-4 text-sm text-[#344054]">{status}</p> : null}
      </div>
    </section>
  );
}
