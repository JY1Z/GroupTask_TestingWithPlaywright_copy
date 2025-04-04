import { test, expect } from '@playwright/test';

test('all links in main menu respond with status 200', async ({ page }) => {
  await page.goto('https://www.ilry.fi/en/', { timeout: 15000 });

  const menu = page.locator('nav[aria-label="Main menu"] a');
  const count = await menu.count();

  const snapshot = await page.accessibility.snapshot({ interestingOnly: true });
  console.log('Accessibility snapshot (no text):', snapshot);

  expect(count).toBeGreaterThan(0);

  for (let i = 0; i < count; i++) {
    const href = await menu.nth(i).getAttribute('href');
    if (href && href.startsWith('http')) {
      const response = await page.request.get(href);
      expect(response.status(), `Link ${href} did not return 200`).toBe(200);
    }
  }
});
