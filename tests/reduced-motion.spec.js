import { test, expect } from '@playwright/test';

test('should respect prefers-reduced-motion settings', async ({ browser }) => {
  const context = await browser.newContext({
    colorScheme: 'light',
    reducedMotion: 'reduce',
  });
  const page = await context.newPage();

  await page.goto('https://www.ilry.fi/en/');

  await page.waitForTimeout(1000);

  const snapshot = await page.accessibility.snapshot({ interestingOnly: true });
  console.log('Accessibility Tree Snapshot (no text):', snapshot);

  const menuBtn = await page.getByRole('button', { name: 'Menu' });
  expect(menuBtn).toBeVisible();

  const unionLink = await page.getByRole('link', { name: /union of professional engineers/i });
  expect(unionLink).toBeTruthy();  

  const searchButton = await page.getByRole('button').nth(4);
  expect(searchButton).toBeTruthy();

  const hasMotion = await page.$('[class*="motion"]');
  expect(hasMotion).toBeNull();

  await context.close();
});
