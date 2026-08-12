"use client";

import { useState } from "react";

import type { NavItem } from "@/lib/nav";

/**
 * Único componente de cliente da landing: abre os links de navegação em telas
 * estreitas, onde a nav completa do mockup não cabe.
 */
export function MobileNav({ items }: { items: NavItem[] }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="menu-mobile"
        aria-label={open ? "Fechar menu" : "Abrir menu"}
        onClick={() => setOpen((value) => !value)}
        className="grid size-10 place-items-center rounded-md border border-creme/20 text-creme transition-colors hover:border-brasa-500"
      >
        <span aria-hidden className="flex flex-col gap-[5px]">
          <span className="block h-px w-4 bg-current" />
          <span className="block h-px w-4 bg-current" />
          <span className="block h-px w-4 bg-current" />
        </span>
      </button>

      {open ? (
        <div
          id="menu-mobile"
          className="absolute inset-x-0 top-full border-b border-creme/10 bg-carvao-950"
        >
          <ul className="flex flex-col px-6 py-2">
            {items.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block py-3 text-[12.5px] uppercase tracking-[0.16em] text-creme/70 transition-colors hover:text-creme"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
