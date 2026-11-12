import { defineConfig } from "vitest/config";

// Tests for the React platform: each app and package is its own project. The live site's tests use vitest.config.js.
export default defineConfig({
  test: {
    projects: [
      { test: { name: "packages", include: ["packages/*/src/**/*.test.ts"], environment: "node" } },
      { test: { name: "database", include: ["supabase/tests/**/*.test.ts"], environment: "node", testTimeout: 60000, hookTimeout: 60000 } },
      { extends: "apps/app/vite.config.ts", test: { name: "app", root: "apps/app", include: ["src/**/*.test.{ts,tsx}"], environment: "jsdom", setupFiles: ["src/test-setup.ts"] } }
    ]
  }
});
