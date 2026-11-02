import { defineConfig } from "@playwright/test";

// Same two sizes as the earlier automated test runs: a 375 px phone in dark mode and a 1024 px laptop in light mode.
// Locally the tests use the installed Microsoft Edge; CI installs Playwright's Chromium.
const channel = process.env.CI ? undefined : (process.env.PW_CHANNEL || "msedge");

export default defineConfig({
  testDir: "tests/e2e",
  fullyParallel: true,
  reporter: process.env.CI ? [["github"], ["list"]] : "list",
  use: { baseURL: "http://localhost:4173", channel },
  webServer: { command: "node tests/e2e/serve.js", url: "http://localhost:4173/index.html", reuseExistingServer: !process.env.CI },
  projects: [
    { name: "phone-dark", use: { viewport: { width: 375, height: 740 }, colorScheme: "dark", hasTouch: true } },
    { name: "laptop-light", use: { viewport: { width: 1024, height: 768 }, colorScheme: "light" } }
  ]
});
