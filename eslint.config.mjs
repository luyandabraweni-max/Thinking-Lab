import js from "@eslint/js";
import reactHooks from "eslint-plugin-react-hooks";
import tseslint from "typescript-eslint";

// Lint for the React platform (apps/ and packages/). The live site at the repo root is checked by CI's own steps.
export default tseslint.config(
  { ignores: ["**/dist/**", "**/node_modules/**", "js/**", "clips/**", "modules/**", "vendor/**", "tests/**", "native/**", "sw.js", "clips.js", "*.config.js"] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  { files: ["apps/**/*.{ts,tsx}", "packages/**/*.{ts,tsx}"], plugins: { "react-hooks": reactHooks },
    rules: { ...reactHooks.configs.recommended.rules, "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }] } }
);
