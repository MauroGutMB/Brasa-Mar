import { Eyebrow, Heading } from "@brasamar/ui";

import { Wordmark } from "@/components/shared/logo";
import { getHours, getSettings } from "@/lib/data";
import {
  addressLine,
  cityLine,
  groupHours,
  mapEmbedUrl,
  whatsappLink,
} from "@/lib/site";

/** Deixa o mapa claro do OpenStreetMap coerente com o tema escuro. */
const mapFilter =
  "grayscale(.55) invert(.9) hue-rotate(175deg) brightness(.92) contrast(.95)";

export async function Location() {
  const [settings, hours] = await Promise.all([getSettings(), getHours()]);
  const grupos = groupHours(hours);
  const cidade = cityLine(settings);

  return (
    <section
      id="local"
      className="scroll-mt-20 grid border-t border-creme/10 bg-carvao-900 lg:grid-cols-[0.85fr_1.15fr]"
    >
      <div className="px-6 py-16 lg:px-12 lg:py-[88px]">
        <Eyebrow className="mb-3.5">Onde estamos</Eyebrow>
        <Heading level={2} className="mb-[30px] text-[clamp(2rem,3.6vw,3.125rem)]">
          Venha comer com a gente
        </Heading>

        <div className="flex max-w-[380px] flex-col gap-[26px]">
          <div>
            <h3 className="mb-[7px] text-[10.5px] uppercase tracking-[0.24em] text-creme/40">
              Endereço
            </h3>
            <address className="text-[16.5px] not-italic leading-[1.55] text-creme">
              {addressLine(settings)}
              <br />
              {cidade}
            </address>
          </div>

          <div>
            <h3 className="mb-[7px] text-[10.5px] uppercase tracking-[0.24em] text-creme/40">
              Contato
            </h3>
            <a
              href={whatsappLink(settings.phone)}
              className="text-[26px] font-semibold text-brasa-500 transition-colors hover:text-brasa-400"
            >
              {settings.phone}
            </a>
            <p className="mt-1.5 text-sm text-creme/55">WhatsApp e ligações</p>
          </div>

          <div>
            <h3 className="mb-[7px] text-[10.5px] uppercase tracking-[0.24em] text-creme/40">
              Horários
            </h3>
            <dl className="flex flex-col gap-1.5 text-[15px] text-creme/75">
              {grupos.map((group) => (
                <div key={group.days} className="flex justify-between gap-5">
                  <dt>{group.days}</dt>
                  <dd className={group.closed ? "text-creme/40" : "text-creme"}>
                    {group.hours}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      <div className="relative min-h-[320px] border-creme/10 lg:min-h-[520px] lg:border-l">
        <iframe
          title={`Mapa — como chegar no ${cidade}`}
          src={mapEmbedUrl(settings)}
          loading="lazy"
          style={{ filter: mapFilter }}
          className="absolute inset-0 size-full border-0"
        />
        {settings.locationNote ? (
          <div className="absolute bottom-7 left-6 rounded-panel border border-creme/16 bg-carvao-950/90 px-[22px] py-[18px] backdrop-blur-[6px] lg:left-7">
            <Wordmark tinted={false} className="text-[15px] tracking-[0.1em]" />
            <p className="mt-1.5 text-[13px] text-creme/60">
              {settings.locationNote}
            </p>
          </div>
        ) : null}
      </div>
    </section>
  );
}
