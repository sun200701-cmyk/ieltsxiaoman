"use client";

import Image from "next/image";
import Link from "next/link";
import { Crown, MessageCircleMore } from "lucide-react";

import { useAuth } from "@/components/auth-provider";

function formatDate(date: string | null) {
  if (!date) {
    return null;
  }

  return new Date(date).toLocaleDateString("zh-CN");
}

export function MembershipPanel() {
  const { usage } = useAuth();
  const activePackPreview = usage?.addonPacks.find((pack) => pack.isActive) ?? null;

  const currentPlanLabel = usage?.hasActiveMembership
    ? usage.membershipPlan === "ultra"
      ? "Ultra 会员有效中"
      : "Pro 会员有效中"
    : "当前未开通会员";

  return (
    <section className="grid gap-4">
      <div className="flex flex-col gap-4 border-b border-black/8 pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-[-0.03em] text-[#101828]">会员</h2>
          <p className="mt-2 text-sm text-[#475467]">
            Free 用户可体验 5 次题库模考分析。Pro、Ultra 和加量包均为 30 天有效，适合不同强度的备考节奏。
          </p>
        </div>
        <Link href="/me/pricing" className="ghost-button">
          查看定价
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="grid gap-4 rounded-[24px] border border-black/8 bg-white p-4 sm:rounded-[28px] sm:p-6">
          <div className="inline-flex w-fit items-center gap-2 rounded-full bg-[#efe6d7] px-3 py-2 text-sm font-medium text-[#8d7557]">
            <Crown className="h-4 w-4" />
            {currentPlanLabel}
          </div>

          <div className="grid gap-3 text-sm leading-7 text-[#344054]">
            <p>Free：5 次题库模考分析机会，不支持生成全真模考报告。</p>
            <p>
              Pro：<span className="line-through text-[#98a2b3]">原价 299</span>
              <span className="ml-2 font-semibold text-[#101828]">限时优惠 99</span> / 30 天 / 300 次
            </p>
            <p>
              Ultra：<span className="line-through text-[#98a2b3]">原价 899</span>
              <span className="ml-2 font-semibold text-[#101828]">限时优惠 199</span> / 30 天 / 1000 次
            </p>
            <p>
              加量包：<span className="line-through text-[#98a2b3]">原价 279</span>
              <span className="ml-2 font-semibold text-[#101828]">限时优惠 79</span> / 30 天 / 200 次
            </p>
          </div>

          <div className="grid gap-3 rounded-[20px] bg-[#f7f9fc] p-5 text-sm text-[#475467]">
            <p>
              免费剩余次数：
              <span className="ml-2 font-semibold text-[#101828]">{usage?.freeTrialsRemaining ?? 0}</span>
            </p>
            <p>
              会员主额度剩余：
              <span className="ml-2 font-semibold text-[#101828]">{usage?.membershipQuotaRemaining ?? 0}</span>
            </p>
            <p>
              可用加量包次数：
              <span className="ml-2 font-semibold text-[#101828]">{usage?.activeAddonCreditsRemaining ?? 0}</span>
            </p>
            <p>
              当前状态：
              <span className="ml-2 font-semibold text-[#101828]">
                {usage?.hasActiveMembership ? (usage.membershipPlan === "ultra" ? "Ultra" : "Pro") : "Free"}
              </span>
            </p>
            {usage?.membershipExpiresAt ? (
              <p>
                会员到期时间：
                <span className="ml-2 font-semibold text-[#101828]">{formatDate(usage.membershipExpiresAt)}</span>
              </p>
            ) : null}
            {activePackPreview ? (
              <p>
                最近一个可用加量包到期：
                <span className="ml-2 font-semibold text-[#101828]">{formatDate(activePackPreview.expiresAt)}</span>
              </p>
            ) : null}
          </div>

          <div className="rounded-[20px] border border-[#8d7557]/15 bg-[#fffaf1] p-5 text-sm leading-7 text-[#5b5349]">
            <p className="font-medium text-[#101828]">消耗次数规则</p>
            <div className="mt-3 grid gap-2">
              <p>1. 全真模考：按你在整套模考里实际回答的题目数量扣次数。</p>
              <p>2. 题库模考：每进行一次单题分析，消耗 1 次次数。</p>
            </div>
          </div>
        </div>

        <div className="grid gap-4 rounded-[24px] border border-black/8 bg-[#fafafa] p-4 sm:rounded-[28px] sm:p-6">
          <div className="inline-flex items-center gap-2 text-sm font-medium text-[#101828]">
            <MessageCircleMore className="h-4 w-4" />
            客服微信
          </div>
          <div className="overflow-hidden rounded-[24px] border border-black/8 bg-white">
            <Image
              src="/017f45c7ede9f67f46953fbc79fb9e53.png"
              alt="雅小满客服微信二维码"
              width={720}
              height={1080}
              className="h-auto w-full"
              priority
            />
          </div>
          <p className="text-sm leading-7 text-[#475467]">
            扫码联系客服，备注你要开通的套餐或加量包。付款后会在后台手动为你开通。
          </p>
        </div>
      </div>
    </section>
  );
}
