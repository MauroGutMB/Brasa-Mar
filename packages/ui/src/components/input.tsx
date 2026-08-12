import type {
  InputHTMLAttributes,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";

import { cn } from "../lib/cn";

/** Visual único dos controles de formulário, no tema escuro da marca. */
export const controlClasses =
  "w-full rounded-md border border-creme/15 bg-carvao-950 px-3.5 py-2.5 text-[15px] text-creme placeholder:text-creme/30 transition-colors focus:border-brasa-500 focus:outline-none aria-[invalid=true]:border-brasa-500/70 disabled:opacity-50";

export type InputProps = InputHTMLAttributes<HTMLInputElement>;

export function Input({ className, ...props }: InputProps) {
  return <input className={cn(controlClasses, className)} {...props} />;
}

export type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

export function Textarea({ className, rows = 4, ...props }: TextareaProps) {
  return (
    <textarea
      rows={rows}
      className={cn(controlClasses, "resize-y leading-relaxed", className)}
      {...props}
    />
  );
}

export type SelectProps = SelectHTMLAttributes<HTMLSelectElement>;

export function Select({ className, ...props }: SelectProps) {
  return (
    <select
      className={cn(controlClasses, "appearance-none pr-8", className)}
      {...props}
    />
  );
}
