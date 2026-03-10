import { test, expect } from '@playwright/test';

test('unauthenticated user should be redirected from dashboard', async ({ page }) => {
  await page.goto('/en/dashboard/boards/some-id');
  await expect(page.url()).toContain('/en');
});
