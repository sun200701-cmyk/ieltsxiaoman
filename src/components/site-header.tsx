"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, User, X } from "lucide-react";
import { useState } from "react";

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
    href: "/regular-english",
    label: "口语素养",
    active: (pathname) => pathname.startsWith("/regular-english"),
  },
  {
    href: "/speaking-practice",
    label: "\u96c5\u601d\u53e3\u8bed",
    active: (pathname) =>
      pathname.startsWith("/speaking-practice") ||
      pathname.startsWith("/practice") ||
      pathname.startsWith("/question-bank") ||
      pathname.startsWith("/mock"),
  },
  {
    href: "/me/pricing",
    label: "AI\u53e3\u8bed\u5b9a\u4ef7",
    active: (pathname) => pathname.startsWith("/me/pricing"),
  },
];

function getLinkClass(active: boolean) {
  return [
    "inline-flex min-h-12 items-center justify-center rounded-full border px-5 py-2.5 text-sm font-medium whitespace-nowrap transition-all duration-300 ease-out",
    active
      ? "translate-y-[-1px] border-black/12 bg-[#f1eadf] text-[#101828] shadow-[0_10px_24px_rgba(16,24,40,0.08)]"
      : "border-transparent bg-transparent text-[#4f463d] hover:translate-y-[-1px] hover:border-black/8 hover:bg-[#fffaf2] hover:text-[#101828]",
  ].join(" ");
}

export function SiteHeader() {
  const pathname = usePathname();
  const { user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  if (pathname === "/me" && !user) {
    return null;
  }

  const isMeActive = pathname === "/me";

  return (
    <header className="sticky top-0 z-40 border-b border-black/8 bg-[rgba(251,248,241,0.9)] backdrop-blur">
      <div className="mx-auto flex w-full max-w-[1480px] items-center px-4 py-4 sm:px-6 lg:px-10">
        <Link href="/" className="text-[2rem] font-semibold tracking-[-0.05em] text-[#101828]">
          {"\u96c5\u5c0f\u6ee1"}
        </Link>

        <nav className="ml-auto hidden items-center gap-2 md:flex md:gap-4">
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

        <button
          type="button"
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((current) => !current)}
          className="ml-auto inline-flex h-12 w-12 items-center justify-center rounded-full border border-black/8 bg-[#fffdf8] text-[#101828] transition-all duration-300 ease-out hover:scale-[1.02] hover:bg-white md:hidden"
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <div
        aria-hidden={!menuOpen}
        className={`grid overflow-hidden bg-[rgba(251,248,241,0.96)] px-4 transition-all duration-300 ease-out md:hidden ${
          menuOpen
            ? "grid-rows-[1fr] border-t border-black/8 py-4 opacity-100"
            : "pointer-events-none grid-rows-[0fr] border-t border-transparent py-0 opacity-0"
        }`}
      >
        <div className="min-h-0">
          <nav className="mx-auto grid w-full max-w-[1480px] gap-2">
            {navItems.map((item) => {
              const active = item.active(pathname);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  aria-current={active ? "page" : undefined}
                  className={getLinkClass(active)}
                >
                  <span>{item.label}</span>
                </Link>
              );
            })}

            <Link
              href="/me"
              onClick={() => setMenuOpen(false)}
              aria-current={isMeActive ? "page" : undefined}
              className={`${getLinkClass(isMeActive)} gap-2`}
            >
              <User className="h-4 w-4 shrink-0" />
              <span>{"\u6211\u7684"}</span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
