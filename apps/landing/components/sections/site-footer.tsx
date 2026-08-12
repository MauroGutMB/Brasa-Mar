import { Kicker, Wordmark } from "@/components/shared/logo";
import { address, contact, siteConfig, whatsappLink } from "@/lib/site";

export function SiteFooter() {
  // TODO(fase 2): conferir se `cacheComponents` reclama do Date em escopo
  // prerenderizado; se reclamar, fixar o ano.
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-creme/10 bg-carvao-950 px-6 pb-11 pt-14 lg:px-12 lg:pt-[60px]">
      <div className="flex flex-wrap items-center justify-between gap-7">
        <div className="leading-none">
          <Wordmark className="block text-xl" />
          <Kicker className="mt-2 text-[9.5px]" />
        </div>

        <nav className="flex flex-wrap gap-5 text-[13.5px] text-creme/60 sm:gap-[34px]">
          <a href={whatsappLink} className="text-inherit hover:text-brasa-500">
            WhatsApp {contact.phone}
          </a>
          <a href="#pratos" className="text-inherit hover:text-brasa-500">
            Menu
          </a>
          <a href="#buffet" className="text-inherit hover:text-brasa-500">
            Buffet para eventos
          </a>
        </nav>
      </div>

      <p className="mt-[34px] border-t border-creme/10 pt-[22px] text-xs text-creme/35">
        © {year} {siteConfig.name} · {address.city}, {address.state}
      </p>
    </footer>
  );
}
