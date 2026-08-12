"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@brasamar/ui";

const itens = [
  { href: "/admin", label: "Início" },
  { href: "/admin/pratos", label: "Pratos" },
  { href: "/admin/identidade", label: "Identidade e SEO" },
  { href: "/admin/buffet", label: "Buffet" },
  { href: "/admin/contato", label: "Contato" },
  { href: "/admin/local", label: "Local e horários" },
  { href: "/admin/usuarios", label: "Usuários" },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav>
      <ul className="flex flex-wrap gap-1 lg:flex-col">
        {itens.map((item) => {
          // "/admin" só casa exato, senão fica ativo em todas as telas.
          const ativo =
            item.href === "/admin"
              ? pathname === item.href
              : pathname.startsWith(item.href);

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={ativo ? "page" : undefined}
                className={cn(
                  "block rounded-md px-3 py-2 text-[14px] transition-colors",
                  ativo
                    ? "bg-brasa-500/12 text-brasa-400"
                    : "text-creme/60 hover:bg-creme/5 hover:text-creme",
                )}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
