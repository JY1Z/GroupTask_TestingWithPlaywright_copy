import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
    await page.goto('https://www.ilry.fi/en/');
});

test('main-menu-visual-regression', async ({ page }) => {
  await page.getByRole('button', { name: 'Allow all cookies' }).click();
  await page.getByRole('button', { name: 'Menu' }).click();
  
  const menu = page.getByRole('navigation', { name: 'Main menu' });
  await expect(menu).toHaveScreenshot();
});