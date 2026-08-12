import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";

import { cn } from "../lib/cn";

export type ButtonVariant = "primary" | "outline" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-brasa-500 text-carvao-1000 hover:bg-brasa-400",
  outline:
    "border border-creme/28 text-creme hover:border-mar-400 hover:text-mar-400",
  ghost: "text-creme/70 hover:text-creme",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "rounded-full px-[18px] py-2.5 text-[12.5px] tracking-[0.1em]",
  md: "rounded-md px-[30px] py-4 text-[13px] tracking-[0.18em]",
  lg: "rounded-lg px-7 py-[18px] text-[15px] tracking-[0.2em]",
};

const baseClasses =
  "inline-flex items-center justify-center gap-2 font-semibold uppercase leading-none transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brasa-400 disabled:pointer-events-none disabled:opacity-50";

/** Classes do botão, para quando um elemento próprio precisa do mesmo visual. */
export function buttonClasses(
  variant: ButtonVariant = "primary",
  size: ButtonSize = "md",
  className?: string,
): string {
  return cn(baseClasses, variantClasses[variant], sizeClasses[size], className);
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={buttonClasses(variant, size, className)}
      {...props}
    />
  );
}

export interface ButtonLinkProps
  extends AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

/** Mesma aparência do Button para âncoras — a landing usa links, não botões. */
export function ButtonLink({
  variant = "primary",
  size = "md",
  className,
  ...props
}: ButtonLinkProps) {
  return (
    <a className={buttonClasses(variant, size, className)} {...props} />
  );
}
