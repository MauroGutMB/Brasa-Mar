import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // O pacote de UI é publicado como código-fonte TS/TSX dentro do monorepo,
  // então o Next precisa transpilá-lo.
  transpilePackages: ["@brasamar/ui"],
  // A landing é estática (SSG): sem `dynamic`/`revalidate`, todas as rotas
  // são pré-renderizadas em build time.
  poweredByHeader: false,
};

export default nextConfig;
