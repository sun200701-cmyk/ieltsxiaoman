"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User } from "lucide-react";

import { useAuth } from "@/components/auth-provider";

type NavItem = {
  href: string;
  label: string;
  active: (pathname: string) => boolean;
};

const navItems: NavItem[] = [
  {
    href: "/",
    label: "\u9996\u9875",
    active: (pathname) => pathname === "/",
  },
  {
    href: "/speaking-practice",
    label: "\u53e3\u8bed\u7ec3\u4e60",
    active: (pathname) =>
      pathname.startsWith("/speaking-practice") ||
      pathname.startsWith("/practice") ||
      pathname.startsWith("/question-bank") ||
      pathname.startsWith("/mock"),
  },
  {
    href: "/courses",
    label: "\u5f55\u64ad\u8bfe",
    active: (pathname) => pathname.startsWith("/courses"),
  },
  {
    href: "/me/pricing",
    label: "AI\u53e3\u8bed\u5b9a\u4ef7",
    active: (pathname) => pathname.startsWith("/me/pricing"),
  },
];

function getLinkClass(active: boolean) {
  return [
    "inline-flex min-h-12 items-center justify-center rounded-full border px-5 py-2.5 text-sm font-medium transition whitespace-nowrap",
    active
      ? "border-black/12 bg-[#f1eadf] text-[#101828] shadow-[0_10px_24px_rgba(16,24,40,0.08)]"
      : "border-transparent bg-transparent text-[#4f463d] hover:border-black/8 hover:bg-[#fffaf2] hover:text-[#101828]",
  ].join(" ");
}

export function SiteHeader() {
  const pathname = usePathname();
  const { user } = useAuth();

  if (pathname === "/me" && !user) {
    return null;
  }

  const isMeActive = pathname === "/me";

  return (
    <header className="sticky top-0 z-40 border-b border-black/8 bg-[rgba(251,248,241,0.9)] backdrop-blur">
      <div className="mx-auto flex w-full max-w-[1480px] items-center px-6 py-4 lg:px-10">
        <Link href="/" className="text-[2rem] font-semibold tracking-[-0.05em] text-[#101828]">
          {"\u96c5\u5c0f\u6ee1"}
        </Link>

        <nav className="ml-auto flex items-center gap-2 md:gap-4">
          {navItems.map((item) => {
            const active = item.active(pathname);

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={getLinkClass(active)}
              >
                <span>{item.label}</span>
              </Link>
            );
          })}

          <Link
            href="/me"
            aria-current={isMeActive ? "page" : undefined}
            className={`${getLinkClass(isMeActive)} gap-2`}
          >
            <User className="h-4 w-4 shrink-0" />
            <span>{"\u6211\u7684"}</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
