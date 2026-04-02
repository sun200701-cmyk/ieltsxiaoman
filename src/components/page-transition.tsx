"use client";

import { usePathname } from "next/navigation";

type PageTransitionProps = {
  children: React.ReactNode;
};

export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();

  return (
    <div className="page-shell">
      <div key={pathname} className="page-transition-stage">
        <div className="page-transition-veil" />
        <div className="page-transition">
          {children}
        </div>
      </div>
    </div>
  );
}
