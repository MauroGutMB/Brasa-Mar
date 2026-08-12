import { Card, Heading, Text } from "@brasamar/ui";

import { ImageSlot } from "@/components/shared/image-slot";
import {
  dishTagLabels,
  formatPrice,
  siteConfig,
  type Dish,
  type DishTag,
} from "@/lib/site";

const tagClasses: Record<DishTag, string> = {
  carnes: "bg-brasa-500/20 text-brasa-400",
  mar: "bg-mar-500/20 text-mar-300",
  "para-dividir": "bg-creme/10 text-creme/70",
};

export function DishCard({ dish, caption }: { dish: Dish; caption: string }) {
  return (
    <Card className="flex flex-col transition-colors hover:border-brasa-500/50">
      <div className="relative h-[230px]">
        <ImageSlot
          src={dish.imageUrl}
          alt={dish.imageAlt}
          caption={caption}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </div>

      <div className="flex flex-1 flex-col gap-2.5 px-6 pb-[26px] pt-[22px]">
        <div className="flex items-baseline justify-between gap-3.5">
          <Heading level={3}>{dish.name}</Heading>
          {siteConfig.showPrices ? (
            <span className="whitespace-nowrap text-base font-semibold text-brasa-500">
              {formatPrice(dish.priceCents)}
            </span>
          ) : null}
        </div>

        <Text muted className="text-[14.5px] leading-[1.55]">
          {dish.description}
        </Text>

        <span
          className={`mt-auto self-start rounded px-2.5 py-[5px] text-[10px] uppercase tracking-[0.24em] ${tagClasses[dish.tag]}`}
        >
          {dishTagLabels[dish.tag]}
        </span>
      </div>
    </Card>
  );
}
