import { Eyebrow, Heading, Text } from "@brasamar/ui";

import { DishCard } from "@/components/sections/dish-card";
import { getDishes, getSettings } from "@/lib/data";

export async function Dishes() {
  const [dishes, settings] = await Promise.all([getDishes(), getSettings()]);

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
        {settings.dishesNote ? (
          <Text muted className="max-w-[360px] text-[15.5px] leading-[1.6]">
            {settings.dishesNote}
          </Text>
        ) : null}
      </div>

      <div className="grid gap-[26px] sm:grid-cols-2 lg:grid-cols-3">
        {dishes.map((dish) => (
          <DishCard key={dish.id} dish={dish} showPrice={settings.showPrices} />
        ))}
      </div>
    </section>
  );
}
