import { Kicker, Wordmark } from "@/components/shared/logo";
import { getCurrentYear, getSettings } from "@/lib/data";
import { whatsappLink } from "@/lib/site";

export async function SiteFooter() {
  const [settings, year] = await Promise.all([getSettings(), getCurrentYear()]);

  return (
    <footer className="border-t border-creme/10 bg-carvao-950 px-6 pb-11 pt-14 lg:px-12 lg:pt-[60px]">
      <div className="flex flex-wrap items-center justify-between gap-7">
        <div className="leading-none">
          <Wordmark className="block text-xl" />
          <Kicker kicker={settings.kicker} className="mt-2 text-[9.5px]" />
        </div>

        <nav className="flex flex-wrap gap-5 text-[13.5px] text-creme/60 sm:gap-[34px]">
          <a
            href={whatsappLink(settings.phone)}
            className="text-inherit hover:text-brasa-500"
          >
            WhatsApp {settings.phone}
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
        © {year} {settings.name} · {settings.city}, {settings.state}
      </p>
    </footer>
  );
}
