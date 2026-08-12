import { cn } from "@brasamar/ui";

/** Selo circular "B&M" do header. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        // inline-flex, e não grid: em grid cada trecho de texto vira um item
        // e a marca quebra em três linhas dentro do círculo.
        "inline-flex size-[38px] shrink-0 items-center justify-center rounded-full border-[1.5px] border-brasa-500 font-display text-[13px] font-bold leading-none text-creme",
        className,
      )}
    >
      B<span className="text-brasa-500">&amp;</span>M
    </span>
  );
}

export interface WordmarkProps {
  className?: string;
  /** "MAR" em azul, como no header e no rodapé. */
  tinted?: boolean;
}

export function Wordmark({ className, tinted = true }: WordmarkProps) {
  return (
    <span
      className={cn(
        "font-display font-bold leading-none tracking-[0.14em] text-creme",
        className,
      )}
    >
      BRASA <span className="text-brasa-500">&amp;</span>{" "}
      <span className={tinted ? "text-mar-400" : undefined}>MAR</span>
    </span>
  );
}

export interface KickerProps {
  /** Vem de site_settings.kicker — quem renderiza já leu as configurações. */
  kicker: string;
  className?: string;
}

export function Kicker({ kicker, className }: KickerProps) {
  return (
    <span
      className={cn(
        "block uppercase tracking-[0.34em] text-creme/45",
        className,
      )}
    >
      {kicker}
    </span>
  );
}
