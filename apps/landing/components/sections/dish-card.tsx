import type { DishWithCategory } from "@brasamar/db";
import { Card, Heading, Text } from "@brasamar/ui";

import { ImageSlot } from "@/components/shared/image-slot";
import { categoryBadgeStyle, dishCaption, formatPrice } from "@/lib/site";

export interface DishCardProps {
  dish: DishWithCategory;
  /** Vem de site_settings.showPrices — o admin liga e desliga o cardápio todo. */
  showPrice: boolean;
}

export function DishCard({ dish, showPrice }: DishCardProps) {
  return (
    <Card className="flex flex-col transition-colors hover:border-brasa-500/50">
      <div className="relative h-[230px]">
        <ImageSlot
          src={dish.imageUrl}
          alt={dish.imageAlt}
          caption={dishCaption(dish.name)}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </div>

      <div className="flex flex-1 flex-col gap-2.5 px-6 pb-[26px] pt-[22px]">
        <div className="flex items-baseline justify-between gap-3.5">
          <Heading level={3}>{dish.name}</Heading>
          {showPrice ? (
            <span className="whitespace-nowrap text-base font-semibold text-brasa-500">
              {formatPrice(dish.priceCents)}
            </span>
          ) : null}
        </div>

        <Text muted className="text-[14.5px] leading-[1.55]">
          {dish.description}
        </Text>

        <span
          style={categoryBadgeStyle(dish.category.color)}
          className="mt-auto self-start rounded px-2.5 py-[5px] text-[10px] uppercase tracking-[0.24em]"
        >
          {dish.category.name}
        </span>
      </div>
    </Card>
  );
}
