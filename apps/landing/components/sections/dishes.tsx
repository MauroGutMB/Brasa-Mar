import { Eyebrow, Heading, Text } from "@brasamar/ui";

import { DishCard } from "@/components/sections/dish-card";
import { dishes } from "@/lib/site";

/** Legenda do placeholder enquanto a foto do prato não foi enviada. */
const placeholderCaptions: Record<string, string> = {
  "picanha-na-brasa": "Foto — picanha fatiada",
  "camarao-ao-alho": "Foto — camarão ao alho",
  "costela-no-bafo": "Foto — costela",
  "peixe-na-telha": "Foto — peixe na telha",
  "mixto-brasa-e-mar": "Foto — tábua mista",
  "moqueca-da-casa": "Foto — moqueca",
};

export function Dishes() {
  return (
    <section
      id="pratos"
      className="scroll-mt-20 border-t border-creme/10 bg-carvao-900 px-6 py-20 lg:px-12 lg:py-[104px]"
    >
      <div className="mb-12 flex flex-wrap items-end justify-between gap-8">
        <div>
          <Eyebrow className="mb-3.5">O menu</Eyebrow>
          <Heading level={2}>Pratos da casa</Heading>
        </div>
        <Text muted className="max-w-[360px] text-[15.5px] leading-[1.6]">
          Porções servem de 1 a 2 pessoas. Peça no balcão ou pelo WhatsApp para
          retirada.
        </Text>
      </div>

      <div className="grid gap-[26px] sm:grid-cols-2 lg:grid-cols-3">
        {dishes.map((dish) => (
          <DishCard
            key={dish.slug}
            dish={dish}
            caption={placeholderCaptions[dish.slug] ?? "Foto do prato"}
          />
        ))}
      </div>
    </section>
  );
}
