import Link from "next/link";
import type { ReactNode } from "react";

export function VoltarPara({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className="mb-5 inline-flex items-center gap-2 text-[13px] text-creme/45 transition-colors hover:text-creme"
    >
      <span aria-hidden>←</span>
      {children}
    </Link>
  );
}
