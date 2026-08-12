import type { HTMLAttributes } from "react";

import { cn } from "../lib/cn";

export type HeadingLevel = 1 | 2 | 3;

/** Escalas fluidas vindas do mockup — clamp(min, preferido, max). */
const headingClasses: Record<HeadingLevel, string> = {
  1: "text-[clamp(2.5rem,6.4vw,5.75rem)] leading-[0.98] tracking-[0.01em]",
  2: "text-[clamp(2.125rem,4vw,3.5rem)] leading-[1.05]",
  3: "text-[1.3125rem] font-semibold leading-[1.2]",
};

export interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  level?: HeadingLevel;
}

export function Heading({ level = 2, className, ...props }: HeadingProps) {
  const Tag = `h${level}` as const;

  return (
    <Tag
      className={cn(
        "font-display text-balance text-creme",
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
        muted ? "text-creme/55" : "text-creme/70",
        className,
      )}
      {...props}
    />
  );
}

export type EyebrowTone = "mar" | "brasa";

export interface EyebrowProps extends HTMLAttributes<HTMLParagraphElement> {
  tone?: EyebrowTone;
}

const eyebrowTones: Record<EyebrowTone, string> = {
  mar: "text-mar-400",
  brasa: "text-brasa-400",
};

export function Eyebrow({ tone = "mar", className, ...props }: EyebrowProps) {
  return (
    <p
      className={cn(
        "text-[11px] uppercase tracking-[0.3em]",
        eyebrowTones[tone],
        className,
      )}
      {...props}
    />
  );
}
