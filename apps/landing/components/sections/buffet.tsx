import { Eyebrow, Text } from "@brasamar/ui";

import { ImageSlot } from "@/components/shared/image-slot";
import { Rich } from "@/components/shared/rich";
import { getSettings } from "@/lib/data";
import { whatsappLink } from "@/lib/site";

const buffetBackground =
  "radial-gradient(80% 120% at 50% 0%, rgba(226,87,31,.20) 0%, rgba(8,9,11,0) 60%)";

export async function Buffet() {
  const settings = await getSettings();
  const zap = whatsappLink(settings.phone);

  return (
    <section
      id="buffet"
      style={{ backgroundImage: buffetBackground }}
      className="scroll-mt-20 overflow-hidden bg-carvao-950 px-6 py-20 lg:px-12 lg:py-[104px]"
    >
      <div className="grid items-center gap-14 lg:grid-cols-2">
        <div>
          <Eyebrow tone="brasa" className="mb-[18px] text-[11.5px]">
            {settings.buffetEyebrow}
          </Eyebrow>

          <h2 className="font-display text-[clamp(3.25rem,7vw,6.5rem)] font-bold leading-[0.9] tracking-[0.02em] text-brasa-500">
            BUFFET
          </h2>

          <p className="mt-3.5 inline-block -skew-x-8 bg-mar-600 px-[18px] py-2 text-[15px] font-semibold uppercase leading-none tracking-[0.22em] text-creme">
            {settings.buffetBadge}
          </p>

          <Text className="mt-8 max-w-[440px] text-[17px] leading-[1.65] text-creme/72">
            <Rich text={settings.buffetText} />
          </Text>

          <ul className="mt-[30px] flex flex-wrap gap-2.5">
            {settings.buffetOccasions.map((occasion) => (
              <li
                key={occasion.label}
                className="rounded-full border border-creme/20 px-3.5 py-2 text-[12.5px] tracking-[0.06em] text-creme/72"
              >
                {occasion.label}
              </li>
            ))}
          </ul>

          <a
            href={zap}
            className="mt-9 inline-flex items-center gap-3.5 rounded-lg bg-brasa-500 px-7 py-[18px] text-carvao-1000 transition-colors hover:bg-brasa-400 hover:text-carvao-1000"
          >
            <span
              aria-hidden
              className="grid size-[34px] shrink-0 place-items-center rounded-full bg-carvao-1000 text-[13px] font-bold text-brasa-500"
            >
              Zap
            </span>
            <span className="flex flex-col gap-[3px] leading-none">
              <strong className="text-[15px] font-bold uppercase tracking-[0.2em]">
                Fale conosco
              </strong>
              <span className="text-[11.5px] uppercase tracking-[0.14em] opacity-75">
                Orçamento sem compromisso
              </span>
            </span>
          </a>
        </div>

        <div className="relative h-[min(560px,66vh)] min-h-[320px] overflow-hidden rounded-frame border border-creme/15">
          <ImageSlot
            src={settings.buffetImageUrl}
            alt={settings.buffetImageAlt}
            caption="Foto do buffet montado (mesa completa)"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>
      </div>

      <div className="mt-[72px] border-t border-brasa-500/35 pt-10">
        {settings.buffetFeaturesIntro ? (
          <p className="mb-9 text-center text-[13px] uppercase tracking-[0.26em] text-creme/60">
            <Rich text={settings.buffetFeaturesIntro} />
          </p>
        ) : null}

        <ul className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-5">
          {settings.buffetFeatures.map((feature) => (
            <li
              key={feature.numeral}
              className="flex flex-col items-center gap-3.5 rounded-panel border border-creme/10 bg-creme/[0.03] px-4 py-[26px] text-center"
            >
              <span
                aria-hidden
                className="grid size-[46px] place-items-center rounded-full border-[1.5px] border-brasa-500 font-display text-[15px] font-semibold text-brasa-400"
              >
                {feature.numeral}
              </span>
              <span className="text-xs uppercase leading-[1.5] tracking-[0.16em] text-creme/78">
                {feature.title}
              </span>
            </li>
          ))}
        </ul>

        {settings.buffetClosing ? (
          <p className="mx-auto mt-11 max-w-[640px] text-center text-2xl italic leading-[1.4] text-creme/80">
            <Rich
              text={settings.buffetClosing}
              accentClassName="font-display not-italic text-brasa-500"
            />
          </p>
        ) : null}
      </div>
    </section>
  );
}
