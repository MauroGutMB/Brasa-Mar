import type { HTMLAttributes } from "react";

import { cn } from "../lib/cn";

export type HeadingLevel = 1 | 2 | 3 | 4;

const headingClasses: Record<HeadingLevel, string> = {
  1: "text-4xl sm:text-5xl lg:text-6xl",
  2: "text-3xl sm:text-4xl",
  3: "text-2xl sm:text-3xl",
  4: "text-xl sm:text-2xl",
};

export interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  level?: HeadingLevel;
}

export function Heading({
  level = 2,
  className,
  ...props
}: HeadingProps) {
  const Tag = `h${level}` as const;

  return (
    <Tag
      className={cn(
        "font-display text-balance text-mar-900",
        headingClasses[level],
        className,
      )}
      {...props}
    />
  );
}

export type TextProps = HTMLAttributes<HTMLParagraphElement> & {
  muted?: boolean;
};

export function Text({ muted = false, className, ...props }: TextProps) {
  return (
    <p
      className={cn(
        "text-pretty leading-relaxed",
        muted ? "text-carvao-500" : "text-carvao-800",
        className,
      )}
      {...props}
    />
  );
}

export type EyebrowProps = HTMLAttributes<HTMLSpanElement>;

export function Eyebrow({ className, ...props }: EyebrowProps) {
  return (
    <span
      className={cn(
        "text-xs font-semibold uppercase tracking-[0.2em] text-brasa-600",
        className,
      )}
      {...props}
    />
  );
}
