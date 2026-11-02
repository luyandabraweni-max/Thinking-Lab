// The installed app must keep working with no connection: load once, go offline, reload.
import { test, expect } from "@playwright/test";

test("works offline after the first visit", async ({ page, context }) => {
  await page.goto("/index.html");
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.reload(); // the service worker now controls the page
  await expect.poll(() => page.evaluate(() => !!navigator.serviceWorker.controller)).toBe(true);

  await context.setOffline(true);
  await page.reload();
  await expect(page.getByRole("heading", { name: "Start a try-out session" })).toBeVisible();

  // A game and a lesson still open offline
  await page.evaluate(`window.__SKIP_BATTERY__ = true; gamePaint({})`);
  await expect(page.locator("#main")).toContainText("Paint Pots");
  await page.evaluate(`learnHome()`);
  await expect(page.getByRole("heading", { name: "Choose a lesson" })).toBeVisible();
});
