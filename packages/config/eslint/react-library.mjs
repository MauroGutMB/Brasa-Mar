import globals from "globals";
import pluginReact from "eslint-plugin-react";
import pluginReactHooks from "eslint-plugin-react-hooks";

import { baseConfig } from "./base.mjs";

/**
 * Config ESLint para bibliotecas React sem framework (ex.: @brasamar/ui).
 *
 * @type {import("eslint").Linter.Config[]}
 */
export const reactLibraryConfig = [
  ...baseConfig,
  pluginReact.configs.flat.recommended,
  pluginReact.configs.flat["jsx-runtime"],
  {
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
    settings: {
      react: { version: "detect" },
    },
    plugins: {
      "react-hooks": pluginReactHooks,
    },
    rules: {
      ...pluginReactHooks.configs.recommended.rules,
    },
  },
];

export default reactLibraryConfig;
