import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Crown, Sparkles, Zap } from "lucide-react";

const plans = [
  {
    title: "Free",
    subtitle: "适合先体验题库模考",
    originalPrice: null,
    salePrice: "¥0",
    detail: "注册即送 5 次",
    buttonLabel: "免费体验",
    accent: "bg-white",
    icon: Zap,
    features: [
      "5 次 AI 题库模考分析机会",
      "支持按题库逐题或选题练习",
      "可查看单题评分、分析与参考答案",
      "全真模考仅可体验答题，无法生成正式报告",
    ],
  },
  {
    title: "Pro",
    subtitle: "适合高频刷题和稳定训练",
    originalPrice: "原价 ¥299",
    salePrice: "限时 ¥99",
    detail: "30 天 / 300 次",
    buttonLabel: "联系客服开通",
    accent: "bg-white",
    icon: Crown,
    features: [
      "30 天有效，包含 300 次 AI 次数",
      "支持题库模考与全真模考正式报告",
      "次数用完后可继续购买加量包",
      "适合日常稳步备考",
    ],
  },
  {
    title: "Ultra",
    subtitle: "适合冲刺期密集训练",
    originalPrice: "原价 ¥899",
    salePrice: "限时 ¥199",
    detail: "30 天 / 1000 次",
    buttonLabel: "联系客服开通",
    accent: "bg-white ring-2 ring-[#101828]/10",
    icon: Sparkles,
    features: [
      "30 天有效，包含 1000 次 AI 次数",
      "支持题库模考与全真模考正式报告",
      "适合高强度连续练习",
      "同样支持继续购买加量包",
    ],
  },
  {
    title: "加量包",
    subtitle: "仅对 Pro / Ultra 用户开放",
    originalPrice: "原价 ¥279",
    salePrice: "限时 ¥79",
    detail: "30 天 / 200 次",
    buttonLabel: "联系客服开通",
    accent: "bg-white",
    icon: Zap,
    features: [
      "仅限已开通 Pro / Ultra 的用户购买",
      "每个加量包独立 30 天有效",
      "多个加量包按购买顺序依次扣减",
      "先扣会员主额度，再扣加量包额度",
    ],
  },
];

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-[#f7f4ec] px-6 py-8 lg:px-10">
      <div className="mx-auto flex w-full max-w-[1480px] flex-col gap-10">
        <div className="flex items-center justify-between">
          <Link
            href="/me"
            className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-medium text-[#101828] transition hover:bg-[#f8fafc]"
          >
            <ArrowLeft className="h-4 w-4" />
            返回我的
          </Link>
        </div>

        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#8d7557]">AI Speaking Pricing</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-[-0.05em] text-[#101828] sm:text-5xl">
            选择适合你的 AI 口语套餐
          </h1>
          <p className="mx-auto mt-4 max-w-3xl text-base leading-8 text-[#5b5349]">
            Free 用户可先体验 5 次题库模考分析。正式备考可开通 Pro 或 Ultra；次数不够时，再购买独立加量包。
          </p>
        </div>

        <section className="grid gap-6 xl:grid-cols-4">
          {plans.map((plan) => {
            const Icon = plan.icon;

            return (
              <article
                key={plan.title}
                className={`overflow-hidden rounded-[30px] border border-black/10 ${plan.accent} shadow-[0_18px_40px_rgba(16,24,40,0.06)]`}
              >
                <div className="grid gap-5 p-8">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-black/8 bg-[#f8fafc]">
                    <Icon className="h-5 w-5 text-[#101828]" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-semibold tracking-[-0.04em] text-[#101828]">{plan.title}</h2>
                    <p className="mt-2 text-base text-[#5b5349]">{plan.subtitle}</p>
                  </div>
                  <div className="grid gap-2">
                    {plan.originalPrice ? (
                      <p className="text-sm text-[#98a2b3] line-through">{plan.originalPrice}</p>
                    ) : (
                      <p className="text-sm text-[#98a2b3]">永久免费体验</p>
                    )}
                    <div className="flex items-end justify-between gap-4">
                      <span className="text-4xl font-semibold tracking-[-0.05em] text-[#101828]">{plan.salePrice}</span>
                      <span className="pb-1 text-base text-[#6f675c]">{plan.detail}</span>
                    </div>
                  </div>
                  <a href="#contact" className="brand-button mt-1 min-h-14 w-full justify-center">
                    {plan.buttonLabel}
                  </a>
                </div>

                <div className="border-t border-black/8 bg-white/70 px-8 py-6">
                  <ul className="grid gap-3 text-sm leading-7 text-[#344054]">
                    {plan.features.map((feature) => (
                      <li key={feature}>✓ {feature}</li>
                    ))}
                  </ul>
                </div>
              </article>
            );
          })}
        </section>

        <section
          id="contact"
          className="grid gap-8 rounded-[32px] border border-black/10 bg-white px-6 py-8 shadow-[0_18px_40px_rgba(16,24,40,0.06)] lg:grid-cols-[1.1fr_420px] lg:px-8"
        >
          <div className="grid gap-4">
            <h2 className="text-3xl font-semibold tracking-[-0.04em] text-[#101828]">联系客服开通</h2>
            <p className="text-base leading-8 text-[#5b5349]">
              扫码添加雅小满客服微信，备注你要购买的套餐：Pro、Ultra 或加量包。付款完成后，会在后台手动为你的账号开通对应次数。
            </p>
            <div className="grid gap-3 rounded-[24px] bg-[#f7f9fc] p-5 text-sm leading-7 text-[#344054]">
              <p>Pro：原价 ¥299，限时 ¥99 / 30 天 / 300 次</p>
              <p>Ultra：原价 ¥899，限时 ¥199 / 30 天 / 1000 次</p>
              <p>加量包：原价 ¥279，限时 ¥79 / 30 天 / 200 次，仅限 Pro / Ultra 用户购买</p>
              <p>扣减顺序：先扣会员主额度，再按购买顺序扣独立加量包。</p>
            </div>
          </div>

          <div className="overflow-hidden rounded-[28px] border border-black/8 bg-white">
            <Image
              src="/017f45c7ede9f67f46953fbc79fb9e53.png"
              alt="雅小满客服微信二维码"
              width={720}
              height={1080}
              className="h-auto w-full"
              priority
            />
          </div>
        </section>
      </div>
    </main>
  );
}
