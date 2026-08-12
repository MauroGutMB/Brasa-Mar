import { ButtonLink } from "@brasamar/ui";

import { Kicker, LogoMark, Wordmark } from "@/components/shared/logo";
import { MobileNav } from "@/components/shared/mobile-nav";
import { navItems } from "@/lib/nav";
import { contact, whatsappLink } from "@/lib/site";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-creme/10 bg-carvao-950/85 backdrop-blur-[14px]">
      <div className="flex items-center justify-between gap-6 px-6 py-4 lg:px-12">
        <a href="#topo" className="flex items-center gap-3">
          <LogoMark />
          {/* Abaixo de sm o wordmark quebraria em duas linhas e empurraria o
              CTA do telefone para fora da tela. */}
          <span className="hidden leading-none sm:block">
            <Wordmark className="block whitespace-nowrap text-[15px]" />
            <Kicker className="mt-1 text-[8.5px]" />
          </span>
        </a>

        <nav className="flex items-center gap-4 md:gap-[22px]">
          <ul className="hidden items-center gap-[22px] md:flex">
            {navItems.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="text-[12.5px] uppercase tracking-[0.16em] text-creme/70 transition-colors hover:text-creme"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>

          <ButtonLink
            href={whatsappLink}
            size="sm"
            className="whitespace-nowrap normal-case"
          >
            <span
              aria-hidden
              className="size-[7px] rounded-full bg-carvao-1000 opacity-55"
            />
            {contact.phone}
          </ButtonLink>

          <MobileNav items={navItems} />
        </nav>
      </div>
    </header>
  );
}
