import Image from "next/image";

import { cn } from "@brasamar/ui";

export interface ImageSlotProps {
  src: string | null;
  alt: string;
  /** Texto do estado vazio, enquanto a foto real não foi enviada. */
  caption: string;
  sizes: string;
  priority?: boolean;
  className?: string;
}

/**
 * Ocupa 100% do container (que define proporção e border-radius).
 *
 * Sem `src`, reproduz o estado vazio do `<image-slot>` do Claude Design —
 * moldura tracejada, ícone e legenda — para o layout ficar idêntico ao mockup
 * enquanto as fotos não chegam.
 */
export function ImageSlot({
  src,
  alt,
  caption,
  sizes,
  priority = false,
  className,
}: ImageSlotProps) {
  if (src) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className={cn("object-cover", className)}
      />
    );
  }

  return (
    <div
      className={cn(
        "absolute inset-0 grid place-items-center bg-creme/[0.04] text-creme",
        className,
      )}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[inherit] border-[1.5px] border-dashed border-current opacity-35"
      />
      <span className="flex flex-col items-center gap-1.5 px-6 text-center">
        <PlaceholderIcon />
        <span className="text-[13px] font-medium leading-[1.3] opacity-75">
          {caption}
        </span>
      </span>
    </div>
  );
}

function PlaceholderIcon() {
  return (
    <svg
      aria-hidden
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className="opacity-45"
    >
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <circle cx="8.5" cy="9.5" r="1.5" />
      <path d="m4 17 5-5 4 4 3-2 4 3" />
    </svg>
  );
}
