import { ButtonLink, Heading, Text } from "@brasamar/ui";

import { ImageSlot } from "@/components/shared/image-slot";
import { heroImages, hoursSummary, whatsappLink } from "@/lib/site";

const heroBackground =
  "radial-gradient(120% 90% at 12% 8%, rgba(226,87,31,.22) 0%, rgba(8,9,11,0) 55%), radial-gradient(90% 80% at 92% 88%, rgba(62,126,166,.24) 0%, rgba(8,9,11,0) 60%)";

export function Hero() {
  return (
    <section
      id="topo"
      style={{ backgroundImage: heroBackground }}
      className="grid min-h-[88vh] items-center gap-14 bg-carvao-950 px-6 pb-20 pt-16 lg:grid-cols-[1.05fr_0.95fr] lg:px-12 lg:pb-24 lg:pt-[88px]"
    >
      <div className="max-w-[620px]">
        <p className="mb-7 inline-flex items-center gap-2.5 rounded-full border border-brasa-500/45 px-3.5 py-[7px] text-[11px] uppercase tracking-[0.26em] text-brasa-400">
          <span aria-hidden className="size-1.5 rounded-full bg-brasa-500" />
          Churrasco &amp; frutos do mar
        </p>

        <Heading level={1}>
          Do fogo
          <br />
          ao <span className="text-brasa-500">sal</span> do{" "}
          <span className="text-mar-400">mar</span>
        </Heading>

        <Text className="mt-7 max-w-[470px] text-[17.5px] leading-[1.65]">
          Carnes na brasa no ponto certo, frutos do mar frescos e
          acompanhamentos que fazem a refeição virar memória. Almoço, jantar e
          buffet para eventos.
        </Text>

        <div className="mt-9 flex flex-wrap gap-3.5">
          <ButtonLink href="#pratos">Ver o menu</ButtonLink>
          <ButtonLink href={whatsappLink} variant="outline">
            Pedir pelo WhatsApp
          </ButtonLink>
        </div>

        <dl className="mt-14 flex gap-10 border-t border-creme/12 pt-7">
          <div>
            <dt className="font-display text-[26px] font-semibold text-creme">
              {hoursSummary.range}
            </dt>
            <dd className="mt-1.5 text-[11.5px] uppercase tracking-[0.2em] text-creme/45">
              {hoursSummary.days}
            </dd>
          </div>
          <div>
            <dt className="font-display text-[26px] font-semibold text-creme">
              Buffet
            </dt>
            <dd className="mt-1.5 text-[11.5px] uppercase tracking-[0.2em] text-creme/45">
              Para eventos
            </dd>
          </div>
        </dl>
      </div>

      <div className="relative h-[min(620px,72vh)] min-h-[340px]">
        <div className="absolute inset-0 overflow-hidden rounded-frame border border-creme/15">
          <ImageSlot
            src={heroImages.main.url}
            alt={heroImages.main.alt}
            caption="Foto principal — churrasco na brasa (paisagem)"
            sizes="(max-width: 1024px) 100vw, 45vw"
            priority
          />
        </div>

        <div className="absolute bottom-6 left-4 size-[150px] overflow-hidden rounded-xl border border-creme/20 shadow-float sm:size-[210px] lg:bottom-11 lg:-left-[34px]">
          <ImageSlot
            src={heroImages.secondary.url}
            alt={heroImages.secondary.alt}
            caption="Foto secundária — frutos do mar"
            sizes="210px"
          />
        </div>
      </div>
    </section>
  );
}
