// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";

import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import eslintConfigPrettier from "eslint-config-prettier";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
      eslintConfigPrettier,
    ],
    languageOptions: {
      globals: globals.browser,
    },
  },
  {
    // Vercel 함수·미들웨어는 Node 런타임에서 돈다. process 등 Node 전역이 필요하고,
    // 컴포넌트가 아니라 export default handler 라 react-refresh 규칙은 무의미하다.
    // flat config는 매치되는 블록의 규칙을 merge하므로, 위 블록에서 켜진
    // react-refresh 규칙을 여기서 명시적으로 꺼야 한다.
    files: ["api/**/*.{ts,tsx}", "middleware.ts"],
    extends: [js.configs.recommended, tseslint.configs.recommended, eslintConfigPrettier],
    languageOptions: {
      globals: globals.node,
    },
    rules: {
      "react-refresh/only-export-components": "off",
    },
  },
  ...storybook.configs["flat/recommended"],
]);
