import globals from "globals";
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypeScript from "eslint-config-next/typescript";

import { baseConfig } from "./base.mjs";

/**
 * Config ESLint para apps Next.js (App Router).
 *
 * @type {import("eslint").Linter.Config[]}
 */
export const nextConfig = [
  ...baseConfig,
  ...nextCoreWebVitals,
  ...nextTypeScript,
  {
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
  },
];

export default nextConfig;
