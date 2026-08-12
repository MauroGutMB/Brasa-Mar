/**
 * Fronteira de Suspense do painel.
 *
 * Com `cacheComponents`, uma rota que lê dados de request time (a sessão, no
 * caso) precisa de uma fronteira para o shell poder ser servido antes. Este
 * arquivo é essa fronteira — sem ele, o build acusa rota bloqueante.
 */
export default function AdminLoading() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-carvao-950">
      <p className="text-[13px] uppercase tracking-[0.24em] text-creme/40">
        Carregando…
      </p>
    </div>
  );
}
