import { test, expect } from '@playwright/test';

test('should show landing page and login form', async ({ page }) => {
  await page.goto('/en');
  await expect(page.locator('h1')).toContainText('Secure Sprint');
  await expect(page.locator('button', { name: 'Send Magic Link' })).toBeVisible();
});

test('should toggle language', async ({ page }) => {
  await page.goto('/en');
  await page.click('button:has-text("EN")');
  await expect(page.url()).toContain('/pl');
  await expect(page.locator('button', { name: 'Wyślij Magic Link' })).toBeVisible();
});
